'use client'

import { motion } from 'framer-motion'
import { Card, CardBody, Input, Button } from '@nextui-org/react'

export default function ContactPage() {
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
            Contact Us
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Get in touch with us
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          <Card className="bg-white/5 backdrop-blur-lg border border-white/10">
            <CardBody className="p-8">
              <form className="space-y-6">
                <Input
                  label="Name"
                  placeholder="Your name"
                  classNames={{
                    label: "text-white",
                    input: "text-white",
                    inputWrapper: "bg-white/5 border-white/10 hover:bg-white/10",
                  }}
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="your.email@example.com"
                  classNames={{
                    label: "text-white",
                    input: "text-white",
                    inputWrapper: "bg-white/5 border-white/10 hover:bg-white/10",
                  }}
                />
                <Input
                  label="Message"
                  placeholder="Your message"
                  classNames={{
                    label: "text-white",
                    input: "text-white",
                    inputWrapper: "bg-white/5 border-white/10 hover:bg-white/10",
                  }}
                />
                <Button
                  color="primary"
                  size="lg"
                  className="w-full"
                >
                  Send Message
                </Button>
              </form>

              <div className="mt-8 pt-8 border-t border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">Other Ways to Connect</h3>
                <div className="space-y-2 text-gray-300">
                  <p>Email: contact@ghibliart.com</p>
                  <p>Twitter: <a href="https://twitter.com/Aravinds2006" className="text-white hover:text-purple-400">@Aravinds2006</a></p>
                  <p>GitHub: <a href="https://github.com/Aravinds2006" className="text-white hover:text-purple-400">github.com/Aravinds2006</a></p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
} 