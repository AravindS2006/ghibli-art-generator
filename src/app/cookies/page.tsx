import { motion } from 'framer-motion'

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Cookie Policy
          </h1>
          
          <div className="space-y-6 text-gray-300">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">What Are Cookies?</h2>
              <p>
                Cookies are small text files stored on your device that help us understand how you use our website.
                We use cookies to improve your experience and provide better services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">How We Use Cookies</h2>
              <ul className="space-y-2 list-disc list-inside">
                <li>To remember your preferences and settings</li>
                <li>To analyze site usage and performance</li>
                <li>To improve user experience</li>
                <li>To enable certain features</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Managing Cookies</h2>
              <p>
                You can control cookie settings in your browser. Most browsers allow you to refuse cookies
                or alert you when cookies are being sent. However, blocking cookies may affect site functionality.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Contact Us</h2>
              <p>
                If you have questions about our cookie policy, please contact us through our contact page.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
