import { NextResponse } from 'next/server'
import { HfInference } from '@huggingface/inference'

export const runtime = 'nodejs'
export const maxDuration = 120

if (!process.env.HUGGINGFACE_API_KEY) {
  throw new Error('Missing HUGGINGFACE_API_KEY environment variable')
}

const client = new HfInference(process.env.HUGGINGFACE_API_KEY)

// Helper function to check if error is due to credit limit
const isCreditLimitError = (error: any) => {
  return error.message?.includes('monthly included credits') || 
         error.status === 429 ||
         error.message?.includes('rate limit') ||
         error.message?.includes('quota exceeded')
}

async function generateImageViaHF(model: string, prompt: string, parameters: Record<string, any>) {
  const endpoint = `https://api-inference.huggingface.co/models/${model}`
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
      'Content-Type': 'application/json',
      'Accept': 'image/png',
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: {
        ...parameters,
        // Enable cache and wait for model warmup to reduce flaky errors
        use_cache: true,
        // Some endpoints accept this top-level option as well
      },
      options: {
        wait_for_model: true,
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
      } catch {}
    }
    const err: any = new Error(typeof details === 'string' ? details : (details?.error || `HF request failed: ${res.status}`))
    err.status = res.status
    err.response = { data: details }
    throw err
  }

  const arrayBuffer = await res.arrayBuffer()
  const base64 = Buffer.from(arrayBuffer).toString('base64')
  const dataUrl = `data:image/png;base64,${base64}`
  return dataUrl
}

export async function POST(request: Request) {
  try {
    const { prompt, imageUrl } = await request.json()

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
