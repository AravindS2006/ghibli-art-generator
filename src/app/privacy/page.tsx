'use client'

import { motion } from 'framer-motion'
import { Card, CardBody } from '@nextui-org/react'

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            How we handle your data
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <Card className="bg-white/5 backdrop-blur-lg border border-white/10 mb-8">
            <CardBody className="p-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Data Collection</h2>
              <p className="text-gray-300 mb-4">
                We collect minimal data necessary to provide our service. This includes:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                <li>Images you upload for generation</li>
                <li>Text prompts you provide</li>
                <li>Generated images (temporarily stored)</li>
              </ul>
              <p className="text-gray-300">
                We do not store your personal information or use your data for any purpose other than providing our service.
              </p>
            </CardBody>
          </Card>

          <Card className="bg-white/5 backdrop-blur-lg border border-white/10 mb-8">
            <CardBody className="p-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Data Usage</h2>
              <p className="text-gray-300 mb-4">
                Your data is used solely for:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Generating Ghibli-style artwork from your prompts</li>
                <li>Processing uploaded images for reference</li>
                <li>Improving our service quality</li>
              </ul>
            </CardBody>
          </Card>

          <Card className="bg-white/5 backdrop-blur-lg border border-white/10">
            <CardBody className="p-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Data Protection</h2>
              <p className="text-gray-300">
                We implement appropriate security measures to protect your data. All data transmission is encrypted, and we regularly review our security practices to ensure the safety of your information.
              </p>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
} 