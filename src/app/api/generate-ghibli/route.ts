import { NextResponse } from 'next/server'
import { HfInference } from '@huggingface/inference'

export const runtime = 'nodejs'
export const maxDuration = 60

if (!process.env.HUGGINGFACE_API_KEY) {
  throw new Error('Missing HUGGINGFACE_API_KEY environment variable')
}

const client = new HfInference(process.env.HUGGINGFACE_API_KEY)

// Helper function to check if error is due to credit limit
const isCreditLimitError = (error: any) => {
  const errorMsg = (error.message || '').toLowerCase()
  return errorMsg.includes('monthly included credits') || 
         error.status === 429 ||
         errorMsg.includes('rate limit') ||
         errorMsg.includes('quota exceeded') ||
         errorMsg.includes('insufficient credit') ||
         errorMsg.includes('model is overloaded')
}

async function generateImageViaHF(model: string, prompt: string, parameters: Record<string, any>) {
  const endpoint = `https://router.huggingface.co/api/text-to-image`
  
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        inputs: prompt,
        parameters: {
          ...parameters,
          use_cache: true,
        },
      }),
    })

    if (!res.ok) {
      let details: any = undefined
      try {
        details = await res.json()
      } catch {
        try {
          details = await res.text()
        } catch {
          details = `HTTP ${res.status}`
        }
      }
      const err: any = new Error(typeof details === 'string' ? details : (details?.error || `HF request failed: ${res.status}`))
      err.status = res.status
      err.response = { data: details }
      throw err
    }

    const data = await res.json()
    
    // Router returns image as base64 in the response
    if (data.image) {
      // If it's already a data URL
      if (data.image.startsWith('data:')) {
        return data.image
      }
      // If it's base64, convert it
      const base64 = typeof data.image === 'string' ? data.image : Buffer.from(data.image).toString('base64')
      return `data:image/png;base64,${base64}`
    }
    
    // Fallback: try to parse as image binary
    const arrayBuffer = await res.arrayBuffer()
    if (arrayBuffer.byteLength === 0) {
      throw new Error('Empty response from image generation API')
    }
    
    const base64 = Buffer.from(arrayBuffer).toString('base64')
    const dataUrl = `data:image/png;base64,${base64}`
    return dataUrl
  } catch (error) {
    console.error('HF API Error:', error)
    throw error
  }
}

export async function POST(request: Request) {
  try {
    let body
    try {
      body = await request.json()
    } catch (e) {
      return NextResponse.json(
        { 
          error: 'Invalid request',
          details: 'Request body must be valid JSON'
        },
        { status: 400 }
      )
    }

    const { prompt, imageUrl } = body

    if (!prompt && !imageUrl) {
      return NextResponse.json(
        { error: 'Either prompt or image is required' },
        { status: 400 }
      )
    }

    console.log('Processing request with:', { prompt, hasImage: !!imageUrl })

    let finalPrompt = prompt
    let imageDescriptionWarning: string | null = null

    // If image is provided, get its description using image-to-text model
    if (imageUrl) {
      const isPublicHttpUrl = /^https?:\/\//i.test(imageUrl)

      if (!isPublicHttpUrl) {
        // On Vercel, Gemma requires a publicly accessible HTTPS URL, not data:/blob:
        imageDescriptionWarning = 'Reference image must be a public URL. Proceeding with text prompt only.'
        finalPrompt = prompt || 'A Ghibli-style scene'
      } else {
        try {
          const imageDescription = await client.chatCompletion({
            model: "google/gemma-3-27b-it",
            messages: [
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    text: "Describe this image in detail, focusing on the visual elements, composition, and mood.",
                  },
                  {
                    type: "image_url",
                    image_url: {
                      url: imageUrl,
                    },
                  },
                ],
              },
            ],
            max_tokens: 200,
          })

          console.log('Image description:', imageDescription.choices[0].message)
          
          // Combine the image description with the prompt if provided
          finalPrompt = prompt 
            ? `${prompt} ${imageDescription.choices[0].message.content}`
            : imageDescription.choices[0].message.content
        } catch (error: any) {
          console.error('Error getting image description:', {
            message: error.message,
            status: error.status,
            response: error.response?.data
          })
          
          // If image description fails due to credit limit, set warning and continue with original prompt
          if (isCreditLimitError(error)) {
            imageDescriptionWarning = 'Image description feature is currently unavailable due to API limits. Proceeding with text prompt only.'
            finalPrompt = prompt || 'A Ghibli-style scene'
          } else {
            // For other errors, continue with original prompt
            finalPrompt = prompt || 'A Ghibli-style scene'
          }
        }
      }
    }

    // Generate the Ghibli-style image (direct API call to avoid Blob fetch issues)
    try {
      console.log('Generating image with prompt:', finalPrompt)
      const dataUrl = await generateImageViaHF(
        "strangerzonehf/Flux-Ghibli-Art-LoRA",
        finalPrompt,
        {
          num_inference_steps: parseInt(process.env.NEXT_PUBLIC_NUM_INFERENCE_STEPS || '20'),
          guidance_scale: 7.5,
        }
      )

      return NextResponse.json({ 
        image: dataUrl,
        description: finalPrompt,
        warning: imageDescriptionWarning
      })
    } catch (error: any) {
      console.error('Error generating Ghibli image:', {
        message: error.message,
        status: error.status,
        response: error.response?.data,
        stack: error.stack
      })

      // If it's a credit limit error, return specific error
      if (isCreditLimitError(error)) {
        return NextResponse.json(
          { 
            error: 'API credit limit reached',
            details: 'The image generation service is currently unavailable due to API limits. Please try again later or upgrade your plan.',
            warning: imageDescriptionWarning,
            retryAfter: 3600 // Suggest retrying after 1 hour
          },
          { status: 429 }
        )
      }

      // For other errors, return error details
      return NextResponse.json(
        { 
          error: 'Failed to generate image',
          details: error.message || 'An unknown error occurred during image generation',
          warning: imageDescriptionWarning
        },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('Detailed error:', {
      name: error?.name || 'Unknown',
      message: error?.message || 'An unknown error occurred',
      stack: error?.stack,
      cause: error?.cause,
      response: error?.response?.data
    })

    return NextResponse.json(
      { 
        error: 'Failed to process request',
        details: error?.message || 'An unknown error occurred'
      },
      { status: 500 }
    )
  }
}
