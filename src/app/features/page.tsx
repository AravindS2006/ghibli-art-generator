'use client'

import { motion } from 'framer-motion'
import { Card, CardBody } from '@nextui-org/react'

export default function FeaturesPage() {
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
            Features
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover what makes our Ghibli Art Generator special
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="bg-white/5 backdrop-blur-lg border border-white/10">
            <CardBody className="p-6">
              <h3 className="text-xl font-semibold text-white mb-2">Text-to-Art Generation</h3>
              <p className="text-gray-300">
                Transform your text descriptions into beautiful Studio Ghibli-style artwork using advanced AI technology.
              </p>
            </CardBody>
          </Card>

          <Card className="bg-white/5 backdrop-blur-lg border border-white/10">
            <CardBody className="p-6">
              <h3 className="text-xl font-semibold text-white mb-2">Image Reference</h3>
              <p className="text-gray-300">
                Upload reference images to guide the generation process and create more accurate representations.
              </p>
            </CardBody>
          </Card>

          <Card className="bg-white/5 backdrop-blur-lg border border-white/10">
            <CardBody className="p-6">
              <h3 className="text-xl font-semibold text-white mb-2">High-Quality Output</h3>
              <p className="text-gray-300">
                Generate high-resolution images that capture the essence of Studio Ghibli's artistic style.
              </p>
            </CardBody>
          </Card>

          <Card className="bg-white/5 backdrop-blur-lg border border-white/10">
            <CardBody className="p-6">
              <h3 className="text-xl font-semibold text-white mb-2">Easy Download</h3>
              <p className="text-gray-300">
                Download your generated artwork in high quality for personal or professional use.
              </p>
            </CardBody>
          </Card>

          <Card className="bg-white/5 backdrop-blur-lg border border-white/10">
            <CardBody className="p-6">
              <h3 className="text-xl font-semibold text-white mb-2">User-Friendly Interface</h3>
              <p className="text-gray-300">
                Intuitive design with drag-and-drop functionality and real-time previews.
              </p>
            </CardBody>
          </Card>

          <Card className="bg-white/5 backdrop-blur-lg border border-white/10">
            <CardBody className="p-6">
              <h3 className="text-xl font-semibold text-white mb-2">Powered by Advanced AI</h3>
              <p className="text-gray-300">
                Utilizing state-of-the-art AI models to ensure the highest quality Ghibli-style artwork.
              </p>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
} 