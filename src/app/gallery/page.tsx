'use client'

import { motion } from 'framer-motion'
import { Card, CardBody, Image } from '@nextui-org/react'

export default function GalleryPage() {
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
            Gallery
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Explore our collection of Ghibli-style artwork
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Placeholder for gallery items */}
          <Card className="bg-white/5 backdrop-blur-lg border border-white/10">
            <CardBody className="p-4">
              <div className="aspect-square relative rounded-lg overflow-hidden bg-white/5">
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  Coming Soon
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-white/5 backdrop-blur-lg border border-white/10">
            <CardBody className="p-4">
              <div className="aspect-square relative rounded-lg overflow-hidden bg-white/5">
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  Coming Soon
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-white/5 backdrop-blur-lg border border-white/10">
            <CardBody className="p-4">
              <div className="aspect-square relative rounded-lg overflow-hidden bg-white/5">
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  Coming Soon
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-white/5 backdrop-blur-lg border border-white/10">
            <CardBody className="p-4">
              <div className="aspect-square relative rounded-lg overflow-hidden bg-white/5">
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  Coming Soon
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-white/5 backdrop-blur-lg border border-white/10">
            <CardBody className="p-4">
              <div className="aspect-square relative rounded-lg overflow-hidden bg-white/5">
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  Coming Soon
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-white/5 backdrop-blur-lg border border-white/10">
            <CardBody className="p-4">
              <div className="aspect-square relative rounded-lg overflow-hidden bg-white/5">
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  Coming Soon
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
} 