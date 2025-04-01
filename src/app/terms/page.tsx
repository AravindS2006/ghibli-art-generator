'use client'

import { motion } from 'framer-motion'
import { Card, CardBody } from '@nextui-org/react'

export default function TermsPage() {
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
            Terms of Service
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Please read these terms carefully
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <Card className="bg-white/5 backdrop-blur-lg border border-white/10 mb-8">
            <CardBody className="p-8">
              <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-300">
                By accessing and using Ghibli Art Generator, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our service.
              </p>
            </CardBody>
          </Card>

          <Card className="bg-white/5 backdrop-blur-lg border border-white/10 mb-8">
            <CardBody className="p-8">
              <h2 className="text-2xl font-semibold text-white mb-4">2. Use License</h2>
              <p className="text-gray-300 mb-4">
                We grant you a personal, non-exclusive, non-transferable license to use our service for personal, non-commercial purposes. This license is subject to these Terms of Service.
              </p>
              <p className="text-gray-300">
                You may not:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mt-2">
                <li>Use the service for commercial purposes without permission</li>
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose</li>
                <li>Attempt to decompile or reverse engineer any software</li>
                <li>Remove any copyright or other proprietary notations</li>
              </ul>
            </CardBody>
          </Card>

          <Card className="bg-white/5 backdrop-blur-lg border border-white/10 mb-8">
            <CardBody className="p-8">
              <h2 className="text-2xl font-semibold text-white mb-4">3. User Content</h2>
              <p className="text-gray-300">
                You retain all rights to any content you submit, post, or display on or through the service. By submitting content, you grant us a license to use, host, and store that content for the purpose of providing, developing, and improving our service.
              </p>
            </CardBody>
          </Card>

          <Card className="bg-white/5 backdrop-blur-lg border border-white/10">
            <CardBody className="p-8">
              <h2 className="text-2xl font-semibold text-white mb-4">4. Disclaimer</h2>
              <p className="text-gray-300">
                The service is provided "as is" without any warranties, either express or implied. We do not warrant that the service will be uninterrupted, error-free, or secure. We are not responsible for any damages that may result from using our service.
              </p>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
} 