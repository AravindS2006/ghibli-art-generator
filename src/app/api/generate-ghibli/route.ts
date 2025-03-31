import { NextResponse } from 'next/server'
import { HfInference } from '@huggingface/inference'

if (!process.env.HUGGINGFACE_API_KEY) {
  throw new Error('Missing HUGGINGFACE_API_KEY environment variable')
}

const client = new HfInference(process.env.HUGGINGFACE_API_KEY)

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json()

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    console.log('Generating image with prompt:', prompt)
    console.log('Using API key:', process.env.HUGGINGFACE_API_KEY?.slice(0, 5) + '...')

    // Test the API key first
    try {
      await client.textToImage({
        model: 'alvarobartt/ghibli-characters-flux-lora',
        inputs: 'test',
        parameters: {
          num_inference_steps: 1,
        },
      })
    } catch (error: any) {
      console.error('API Key validation failed:', error)
      if (error.message?.includes('401') || error.message?.includes('403')) {
        return NextResponse.json(
          { error: 'Invalid or expired API key. Please check your Hugging Face API key.' },
          { status: 401 }
        )
      }
      throw error
    }

    const image = await client.textToImage({
      model: 'alvarobartt/ghibli-characters-flux-lora',
      inputs: prompt,
      parameters: {
        num_inference_steps: parseInt(process.env.NEXT_PUBLIC_NUM_INFERENCE_STEPS || '30'),
        guidance_scale: 7.5,
      },
    })

    // Convert the Blob to base64
    const arrayBuffer = await image.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString('base64')
    const dataUrl = `data:image/png;base64,${base64}`

    return NextResponse.json({ image: dataUrl })
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