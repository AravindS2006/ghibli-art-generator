'use client'

import { motion } from 'framer-motion'

export default function BlogPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Blog & Articles
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Tips, tricks, and insights about AI art generation
          </p>
          <div className="mt-12 bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg p-8 max-w-2xl mx-auto">
            <p className="text-gray-400">
              Coming soon - exciting articles and guides about creating stunning Ghibli-style artwork
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
