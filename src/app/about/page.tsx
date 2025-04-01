'use client'

import { motion } from 'framer-motion'
import { Card, CardBody } from '@nextui-org/react'

export default function AboutPage() {
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
            About Us
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Bringing Studio Ghibli's magical art style to everyone
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <Card className="bg-white/5 backdrop-blur-lg border border-white/10 mb-8">
            <CardBody className="p-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Our Story</h2>
              <p className="text-gray-300 mb-4">
                Ghibli Art Generator was born from a deep appreciation for Studio Ghibli's unique artistic style and a passion for making creative tools accessible to everyone. We believe that everyone should have the ability to create beautiful artwork inspired by the magical worlds of Studio Ghibli.
              </p>
              <p className="text-gray-300">
                Using cutting-edge AI technology, we've developed a tool that captures the essence of Ghibli's artistic style while making it easy and fun to use. Whether you're an artist, a fan, or just someone who loves beautiful artwork, our generator is here to help you bring your imagination to life.
              </p>
            </CardBody>
          </Card>

          <Card className="bg-white/5 backdrop-blur-lg border border-white/10 mb-8">
            <CardBody className="p-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Our Mission</h2>
              <p className="text-gray-300">
                Our mission is to democratize art creation by making it easy for anyone to generate beautiful Ghibli-style artwork. We believe that technology should enhance human creativity, not replace it, and our tool is designed to be a bridge between imagination and creation.
              </p>
            </CardBody>
          </Card>

          <Card className="bg-white/5 backdrop-blur-lg border border-white/10">
            <CardBody className="p-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Technology</h2>
              <p className="text-gray-300 mb-4">
                We use state-of-the-art AI models to generate artwork that captures the essence of Studio Ghibli's style. Our technology stack includes:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Advanced image generation models</li>
                <li>Image-to-text understanding</li>
                <li>Modern web technologies</li>
                <li>User-friendly interface design</li>
              </ul>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
} 