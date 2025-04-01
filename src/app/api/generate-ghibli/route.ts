import { NextResponse } from 'next/server'
import { HfInference } from '@huggingface/inference'

if (!process.env.HUGGINGFACE_API_KEY) {
  throw new Error('Missing HUGGINGFACE_API_KEY environment variable')
}

const client = new HfInference(process.env.HUGGINGFACE_API_KEY)

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
    console.log('Using API key:', process.env.HUGGINGFACE_API_KEY?.slice(0, 5) + '...')

    let finalPrompt = prompt

    // If image is provided, get its description using image-to-text model
    if (imageUrl) {
      try {
        const imageDescription = await client.chatCompletion({
          provider: "nebius",
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
          max_tokens: 500,
        })

        console.log('Image description:', imageDescription.choices[0].message)
        
        // Combine the image description with the prompt if provided
        finalPrompt = prompt 
          ? `${prompt} ${imageDescription.choices[0].message.content}`
          : imageDescription.choices[0].message.content
      } catch (error: any) {
        console.error('Error getting image description:', error)
        // If image description fails, continue with original prompt
      }
    }

    // Generate the Ghibli-style image
    const image = await client.textToImage({
      model: 'alvarobartt/ghibli-characters-flux-lora',
      inputs: finalPrompt,
      parameters: {
        num_inference_steps: parseInt(process.env.NEXT_PUBLIC_NUM_INFERENCE_STEPS || '30'),
        guidance_scale: 7.5,
      },
    })

    // Convert the Blob to base64
    const arrayBuffer = await image.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString('base64')
    const dataUrl = `data:image/png;base64,${base64}`

    return NextResponse.json({ 
      image: dataUrl,
      description: finalPrompt 
    })
  } catch (error: any) {
    console.error('Detailed error:', {
      name: error?.name || 'Unknown',
      message: error?.message || 'An unknown error occurred',
      stack: error?.stack,
      cause: error?.cause,
      response: error?.response?.data
    })

    // Handle specific error cases
    if (error.message?.includes('404')) {
      return NextResponse.json(
        { error: 'Model not found. Please check the model name.' },
        { status: 404 }
      )
    }
    if (error.message?.includes('429')) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      )
    }

    return NextResponse.json(
      { error: `Failed to generate image: ${error?.message || 'An unknown error occurred'}` },
      { status: 500 }
    )
  }
} 