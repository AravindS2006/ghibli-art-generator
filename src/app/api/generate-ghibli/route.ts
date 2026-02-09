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
  try {
    console.log(`Calling HF SDK for model: ${model}`)
    const res = await client.textToImage({
      model,
      inputs: prompt,
      parameters: parameters,
    })

    if (!res) throw new Error('No response from HF SDK')

    // @ts-ignore - The SDK returns a Blob for textToImage
    const blob = res as Blob
    const arrayBuffer = await blob.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64 = buffer.toString('base64')
    return `data:${blob.type};base64,${base64}`

  } catch (error: any) {
    console.error('HF SDK Error:', error)

    // Enrich error object for better frontend handling
    if (error.message?.includes('404')) {
      error.status = 404
      error.hint = 'Model not found. It might be gated or the ID is incorrect.'
    } else if (error.message?.includes('429')) {
      error.status = 429
    }

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

    // Generate the Ghibli-style image using FLUX.1-schnell (faster, reliable)
    try {
      // Enhance prompt for Ghibli style since we are using a base model
      const stylePrompt = "Studio Ghibli style, anime art style, vibrant colors, detailed background, Hayao Miyazaki style, " + finalPrompt
      console.log('Generating image with prompt:', stylePrompt)

      const dataUrl = await generateImageViaHF(
        "black-forest-labs/FLUX.1-schnell",
        stylePrompt,
        {
          num_inference_steps: 4, // Schnell is optimized for few steps
          guidance_scale: 0.0, // Schnell usually doesn't need guidance or uses 0 (or ignored)
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

      // If HF returned 404, give actionable guidance (common with LoRA adapters)
      if (error.status === 404) {
        const isLikelyLoRA = /lora|lo_ra|-LoRA/i.test("strangerzonehf/Flux-Ghibli-Art-LoRA")
        const hint = error.hint || (isLikelyLoRA
          ? 'The requested model looks like a LoRA adapter which is not a standalone inference model. LoRA adapters cannot be called directly via the HF router. Use a base text-to-image model or deploy a custom endpoint that composes the adapter with a base model.'
          : 'Model not found at Hugging Face router endpoint. Verify the model ID and that it is available for hosted inference.')

        // If this looks like a LoRA adapter, attempt a public fallback model (if available)
        if (isLikelyLoRA) {
          const fallbackModel = process.env.NEXT_PUBLIC_FALLBACK_MODEL || 'stabilityai/stable-diffusion-2'
          console.log(`Original model appears to be a LoRA adapter. Attempting fallback model: ${fallbackModel}`)
          try {
            const fallbackDataUrl = await generateImageViaHF(
              fallbackModel,
              finalPrompt,
              {
                num_inference_steps: parseInt(process.env.NEXT_PUBLIC_NUM_INFERENCE_STEPS || '20'),
                guidance_scale: 7.5,
              }
            )

            return NextResponse.json({
              image: fallbackDataUrl,
              description: finalPrompt,
              warning: `Requested model unavailable; used fallback model ${fallbackModel}`,
            })
          } catch (fallbackError: any) {
            console.error('Fallback model also failed:', fallbackError?.message || fallbackError)
            // Fall through to return the original 404 response with hints
          }
        }

        return NextResponse.json(
          {
            error: 'Model not found',
            details: error.message || 'Model not found',
            hint,
            endpoint: error.response?.endpoint || null,
            raw: error.response?.data || null,
            warning: imageDescriptionWarning,
          },
          { status: 404 }
        )
      }

      // For other errors, return error details
      return NextResponse.json(
        {
          error: 'Failed to generate image',
          details: error.message || 'An unknown error occurred during image generation',
          warning: imageDescriptionWarning,
          raw: error.response?.data || null,
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
