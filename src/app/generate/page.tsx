'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button, Input, Card, CardBody, Image } from '@nextui-org/react'
import { useDropzone } from 'react-dropzone'
import { create } from 'zustand'

// Store for managing application state
interface AppState {
  prompt: string
  uploadedImage: string | null
  generatedImage: string | null
  isLoading: boolean
  error: string | null
  setPrompt: (prompt: string) => void
  setUploadedImage: (image: string | null) => void
  setGeneratedImage: (image: string | null) => void
  setIsLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

const useStore = create<AppState>((set) => ({
  prompt: '',
  uploadedImage: null,
  generatedImage: null,
  isLoading: false,
  error: null,
  setPrompt: (prompt) => set({ prompt }),
  setUploadedImage: (image) => set({ uploadedImage: image }),
  setGeneratedImage: (image) => set({ generatedImage: image }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}))

export default function GeneratePage() {
  const {
    prompt,
    uploadedImage,
    generatedImage,
    isLoading,
    error,
    setPrompt,
    setUploadedImage,
    setGeneratedImage,
    setIsLoading,
    setError,
  } = useStore()

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = () => {
          setUploadedImage(reader.result as string)
        }
        reader.readAsDataURL(file)
      }
    }
  })

  const handleGenerate = async () => {
    if (!prompt && !uploadedImage) {
      setError('Please enter a prompt or upload an image')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/generate-ghibli', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt,
          imageUrl: uploadedImage // Send the base64 image directly
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate image')
      }

      const data = await response.json()
      setGeneratedImage(data.image)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Create Your{' '}
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              Ghibli Masterpiece
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Transform your imagination into stunning Studio Ghibli-style artwork using AI.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <Card className="bg-white/5 backdrop-blur-lg border border-white/10">
            <CardBody className="space-y-6 p-8">
              <Input
                label="Describe your Ghibli-style scene"
                placeholder="A girl sitting under a large tree reading a book, summer day"
                value={prompt}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPrompt(e.target.value)}
                className="w-full"
                classNames={{
                  label: "text-white",
                  input: "text-white",
                  inputWrapper: "bg-white/5 border-white/10 hover:bg-white/10",
                }}
              />

              {/* Image Upload */}
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                  ${isDragActive ? 'border-purple-500 bg-purple-500/10' : 'border-white/20 hover:border-purple-500'}`}
              >
                <input {...getInputProps()} />
                {uploadedImage ? (
                  <div className="relative">
                    <Image
                      src={uploadedImage}
                      alt="Uploaded preview"
                      className="max-h-48 mx-auto rounded-lg"
                    />
                    <Button
                      color="danger"
                      variant="flat"
                      className="absolute top-2 right-2"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation()
                        setUploadedImage(null)
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-gray-400">
                      {isDragActive
                        ? 'Drop the image here'
                        : 'Drag & drop an image here, or click to select'}
                    </p>
                    <p className="text-sm text-yellow-500">
                      ⚠️ Reference image feature is currently under testing so it may not work as expected. use at your own risk.
                    </p>
                  </div>
                )}
              </div>

              {/* Generate Button */}
              <Button
                color="primary"
                size="lg"
                className="w-full"
                onClick={handleGenerate}
                isLoading={isLoading}
                disabled={isLoading || !prompt}
              >
                Create Ghibli Magic ✨
              </Button>

              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 text-center"
                >
                  {error}
                </motion.div>
              )}
            </CardBody>
          </Card>

          {/* Results Section */}
          {(uploadedImage || generatedImage) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="mt-8 bg-white/5 backdrop-blur-lg border border-white/10">
                <CardBody className="p-8">
                  <h2 className="text-2xl font-semibold mb-6 text-white">Your Creation</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {uploadedImage && (
                      <div>
                        <h3 className="text-lg font-medium mb-4 text-white">Original Image</h3>
                        <Image
                          src={uploadedImage}
                          alt="Original"
                          className="rounded-lg"
                        />
                      </div>
                    )}
                    {generatedImage && (
                      <div>
                        <h3 className="text-lg font-medium mb-4 text-white">Ghibli Style</h3>
                        <Image
                          src={generatedImage}
                          alt="Generated"
                          className="rounded-lg"
                        />
                        <Button
                          color="primary"
                          variant="flat"
                          className="mt-4 w-full"
                          onClick={() => {
                            const link = document.createElement('a')
                            link.href = generatedImage
                            link.download = 'ghibli-art.png'
                            link.click()
                          }}
                        >
                          Download Image
                        </Button>
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
} 