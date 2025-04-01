import { NextResponse } from 'next/server'
import { HfInference } from '@huggingface/inference'

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
    let imageDescriptionWarning = null

    // If image is provided, get its description using image-to-text model
    if (imageUrl) {
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
          max_tokens: 200, // Reduced from 500 to save credits
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

    // Generate the Ghibli-style image with optimized parameters
    try {
      console.log('Generating image with prompt:', finalPrompt)
      const image = await client.textToImage({
        model: "strangerzonehf/Flux-Ghibli-Art-LoRA",
        inputs: finalPrompt,
        parameters: {
          num_inference_steps: parseInt(process.env.NEXT_PUBLIC_NUM_INFERENCE_STEPS || '20'), // Reduced from 30 to save credits
          guidance_scale: 7.5,
        },
      })

      // Convert the Blob to base64
      const arrayBuffer = await image.arrayBuffer()
      const base64 = Buffer.from(arrayBuffer).toString('base64')
      const dataUrl = `data:image/png;base64,${base64}`

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