'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black/50 backdrop-blur-lg">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <h1 className="text-6xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              404
            </span>
          </h1>
          <h2 className="text-3xl font-semibold text-white mb-4">Page Under Construction</h2>
          <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
            We're working hard to bring you something amazing. Please check back soon!
          </p>
          <Link
            href="/"
            className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Return Home
          </Link>
        </motion.div>
      </div>
    </div>
  )
} 