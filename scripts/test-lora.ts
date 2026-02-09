
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

const client = new HfInference(process.env.HUGGINGFACE_API_KEY)

async function testLoRA() {
    console.log('\n--- Testing LoRA Injection on Serverless API ---')
    const model = "black-forest-labs/FLUX.1-dev"
    const loraModel = "strangerzonehf/Flux-Ghibli-Art-LoRA"

    // Testing different payload structures that sometimes work on other inference systems
    // 1. Standard parameters override (unlikely)
    // 2. Specialized "lora" header or param

    try {
        console.log("Attempt 1: Sending prompt with 'lora_adapter' parameter...")
        // Note: inputs vs parameters structure depends on the model pipeline on the server
        const res = await fetch(`https://router.huggingface.co/models/${model}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                inputs: "A cute cat in a magical forest, studio ghibli style",
                parameters: {
                    // Wild guesses based on other APIs, HF usually doesn't support this on serverless
                    lora_adapter: loraModel,
                    lora_scale: 0.8,
                    additional_models: [loraModel]
                }
            })
        })

        if (res.ok) {
            console.log("Response OK! (But did it use the LoRA?)")
            // We can't easily visualize it here, but if it didn't error, it likely ignored the params.
            // If it errored regarding params, we know it's not supported.
        } else {
            console.log(`Response Failed: ${res.status}`)
            console.log(await res.text())
        }

    } catch (e: any) {
        console.error("Error:", e.message)
    }
}

testLoRA()
