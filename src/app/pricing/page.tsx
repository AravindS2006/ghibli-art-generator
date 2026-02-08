import { motion } from 'framer-motion'

export default function PricingPage() {
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
            Pricing Plans
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Coming soon - flexible pricing plans for all users
          </p>
          <div className="mt-12 bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg p-8 max-w-2xl mx-auto">
            <p className="text-gray-400">
              We're working on bringing you affordable pricing plans. Stay tuned for updates!
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
