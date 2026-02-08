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
  // Note: SDK-first attempt removed due to package export/typing differences.
  // We will use the router fetch fallback below.

  // Fallback: use router fetch endpoints
  const encodedModel = encodeURIComponent(model)
  const candidateEndpoints = [
    { url: `https://router.huggingface.co/api/text-to-image`, bodyIsModelField: true },
    { url: `https://router.huggingface.co/models/${encodedModel}`, bodyIsModelField: false },
  ]

  // If the repo/user provides a custom inference endpoint (e.g. a composed HF Inference Endpoint
  // that applies the LoRA adapter to a base model), try it first. This is useful because
  // LoRA adapters are not callable directly via the router; a composed endpoint is required.
  const customEndpoint = process.env.CUSTOM_INFERENCE_ENDPOINT || process.env.HF_CUSTOM_INFERENCE_ENDPOINT
  const customApiKey = process.env.CUSTOM_INFERENCE_API_KEY || process.env.HF_CUSTOM_INFERENCE_API_KEY

  // Helper: parse response from custom endpoint into a data URL
  async function parseImageResponse(res: Response) {
    const ct = (res.headers.get('content-type') || '').toLowerCase()
    if (ct.includes('application/json')) {
      const json = await res.json()
      if (json.image) {
        if (typeof json.image === 'string' && json.image.startsWith('data:')) return json.image
        if (typeof json.image === 'string') return `data:image/png;base64,${json.image}`
      }
      if (json.output_url) {
        const out = await fetch(json.output_url)
        const ab = await out.arrayBuffer()
        return `data:image/png;base64,${Buffer.from(ab).toString('base64')}`
      }
      throw new Error('JSON response did not contain image or output_url')
    }

    if (ct.startsWith('image/')) {
      const ab = await res.arrayBuffer()
      return `data:${ct};base64,${Buffer.from(ab).toString('base64')}`
    }

    const ab = await res.arrayBuffer()
    if (ab && ab.byteLength > 0) return `data:image/png;base64,${Buffer.from(ab).toString('base64')}`

    throw new Error('Empty or unsupported response from custom inference endpoint')
  }

  async function callCustomInferenceEndpoint(endpoint: string, apiKey: string | undefined, promptText: string, params: Record<string, any>) {
    const payload = { inputs: promptText, parameters: { ...params, use_cache: true } }
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
      body: JSON.stringify(payload),
    })

    // queued response
    if (res.status === 202) {
      const pollUrl = res.headers.get('location') || res.headers.get('Location')
      if (!pollUrl) throw new Error('Queued response received but no Location header to poll')
      for (let i = 0; i < 30; i++) {
        await new Promise((r) => setTimeout(r, 1500))
        const pollRes = await fetch(pollUrl, { headers: { ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}) } })
        if (pollRes.status === 200) return await parseImageResponse(pollRes)
        if (pollRes.status >= 400 && pollRes.status !== 202) {
          const txt = await pollRes.text().catch(() => '')
          throw new Error(`Polling failed: ${pollRes.status} ${txt}`)
        }
      }
      throw new Error('Timed out waiting for queued inference result')
    }

    if (!res.ok) {
      const txt = await res.text().catch(() => '')
      throw new Error(`Custom inference failed: ${res.status} ${txt}`)
    }

    return await parseImageResponse(res)
  }

  if (customEndpoint) {
    try {
      const dataUrl = await callCustomInferenceEndpoint(customEndpoint, customApiKey, prompt, parameters)
      if (dataUrl) return dataUrl
    } catch (e: any) {
      console.warn('Custom inference endpoint failed:', e?.message || e)
    }
    // If custom endpoint fails, continue to router fallbacks below
  }

  let lastError: any = null

  for (const ep of candidateEndpoints) {
    try {
      const bodyPayload: any = ep.bodyIsModelField
        ? { model, inputs: prompt, parameters: { ...parameters, use_cache: true } }
        : { inputs: prompt, parameters: { ...parameters, use_cache: true }, options: { wait_for_model: true } }

      const res = await fetch(ep.url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(bodyPayload),
      })

      if (!res.ok) {
        let details: any = undefined
        try { details = await res.text() } catch {}
        const err: any = new Error(`HF request failed (${res.status}) ${details ? '- ' + details : ''}`)
        err.status = res.status
        err.response = { data: details, endpoint: ep.url }
        if (res.status === 404) {
          err.hint = `Model not found or inaccessible at ${ep.url}. Ensure the model ID is correct and the model is available for inference (LoRA adapters may not be callable directly).`
        }
        throw err
      }

      const contentType = res.headers.get('content-type') || ''
      if (contentType.includes('application/json')) {
        const data = await res.json()
        if (data.image) {
          const img = data.image
          if (typeof img === 'string' && img.startsWith('data:')) return img
          const base64 = typeof img === 'string' ? img : Buffer.from(img).toString('base64')
          return `data:image/png;base64,${base64}`
        }
        if (data && data.error) {
          const err: any = new Error(data.error || JSON.stringify(data))
          err.response = { data }
          throw err
        }
      }

      const arrayBuffer = await res.arrayBuffer()
      if (arrayBuffer.byteLength === 0) {
        throw new Error('Empty response from image generation API')
      }
      const base64 = Buffer.from(arrayBuffer).toString('base64')
      return `data:image/png;base64,${base64}`
    } catch (err: any) {
      lastError = err
      console.warn(`HF endpoint ${ep.url} failed:`, err?.message || err)
      continue
    }
  }

  console.error('All HF endpoints failed:', lastError)
  throw lastError
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
