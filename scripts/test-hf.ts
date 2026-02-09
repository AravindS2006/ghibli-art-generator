
import { HfInference } from '@huggingface/inference'
import * as fs from 'fs'
import * as path from 'path'

// Manually read .env.local
const envPath = path.resolve(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8')
    envConfig.split('\n').forEach(line => {
        const [key, value] = line.split('=')
        if (key && value) {
            process.env[key.trim()] = value.trim()
        }
    })
}

if (!process.env.HUGGINGFACE_API_KEY) {
    console.error('Error: HUGGINGFACE_API_KEY not found in .env.local')
    process.exit(1)
}

const client = new HfInference(process.env.HUGGINGFACE_API_KEY)


const LOG_FILE = 'model-test.log'

function log(message: string) {
    console.log(message)
    fs.appendFileSync(LOG_FILE, message + '\n')
}

// Helper to test if a model works with HfInference
async function testModel(modelId: string, type: 'vision' | 'image') {
    log(`\n--- Testing ${type} Model: ${modelId} ---`)

    try {
        if (type === 'vision') {
            const imageUrl = "https://huggingface.co/datasets/huggingface/documentation-images/resolve/main/transformers/tasks/cat.jpg"
            const response = await client.chatCompletion({
                model: modelId,
                messages: [
                    {
                        role: "user",
                        content: [
                            { type: "text", text: "Describe this image." },
                            { type: "image_url", image_url: { url: imageUrl } }
                        ]
                    }
                ],
                max_tokens: 100
            })
            log(`Success! Response: ${response.choices[0].message.content}`)
        } else {
            // Image generation
            const response = await client.textToImage({
                model: modelId,
                inputs: "A magical forest studio ghibli style",
                parameters: { num_inference_steps: 4 } // Low steps for speed test
            })

            // response is a Blob
            if (response) {
                const blob = response as unknown as Blob
                log(`Success! Received Blob of size: ${blob.size} type: ${blob.type}`)
            } else {
                log(`Failed: No response received`)
            }
        }
        return true
    } catch (error: any) {
        log(`Failed: ${error.message}`)
        // log full error for debugging
        // fs.appendFileSync(LOG_FILE, JSON.stringify(error, null, 2) + '\n')
        return false
    }
}

async function main() {
    fs.writeFileSync(LOG_FILE, '') // Clear log

    // Vision Models
    await testModel("google/gemma-3-27b-it", 'vision')
    await testModel("Qwen/Qwen2-VL-7B-Instruct", 'vision')

    // Image Models (already confirmed Flux Schnell works, stripped for speed)
    // await testModel("black-forest-labs/FLUX.1-schnell", 'image')
}

main()
