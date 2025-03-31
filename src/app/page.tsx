'use client'

import Hero from '@/components/Hero'
import { motion } from 'framer-motion'
import { Card, CardBody, Image } from '@nextui-org/react'

export default function Home() {
  const features = [
    {
      title: 'AI-Powered Generation',
      description: 'Create stunning Ghibli-style artwork using advanced AI technology.',
      icon: '✨',
    },
    {
      title: 'Multiple Styles',
      description: 'Choose from various Ghibli-inspired styles and themes.',
      icon: '🎨',
    },
    {
      title: 'High Resolution',
      description: 'Generate high-quality images suitable for printing and sharing.',
      icon: '🖼️',
    },
    {
      title: 'Easy to Use',
      description: 'Simple interface for creating beautiful artwork in seconds.',
      icon: '🚀',
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <section className="py-20 bg-black/50 backdrop-blur-lg">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Why Choose Our{' '}
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                Ghibli Art Generator
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Experience the magic of Studio Ghibli's art style with our advanced AI technology.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-white/5 backdrop-blur-lg border border-white/10">
                  <CardBody className="text-center p-6">
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              How It{' '}
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                Works
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Create your Ghibli-style artwork in three simple steps.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Enter Your Prompt',
                description: 'Describe the scene or character you want to create.',
              },
              {
                step: '2',
                title: 'Choose Style',
                description: 'Select your preferred Ghibli-inspired style.',
              },
              {
                step: '3',
                title: 'Generate Art',
                description: 'Watch as AI transforms your imagination into reality.',
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  {item.step}
                </div>
                <Card className="bg-white/5 backdrop-blur-lg border border-white/10">
                  <CardBody className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                    <p className="text-gray-400">{item.description}</p>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black/50 backdrop-blur-lg">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Create Your{' '}
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                Ghibli Masterpiece
              </span>
              ?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of artists who are already creating stunning Ghibli-style artwork.
            </p>
            <a
              href="/generate"
              className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Start Creating Now
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
