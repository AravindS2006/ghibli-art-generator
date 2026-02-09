'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    product: [
      { name: 'Features', href: '/features' },
      { name: 'Gallery', href: '/gallery' },
      { name: 'Pricing', href: '/pricing' },
    ],
    company: [
      { name: 'About', href: '/about' },
      { name: 'Blog', href: '/blog' },
      { name: 'Careers', href: '/careers' },
      { name: 'Contact', href: '/contact' },
    ],
    legal: [
      { name: 'Privacy', href: '/privacy' },
      { name: 'Terms', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
    ],
  }

  const socialLinks = [
    { name: 'Twitter', href: 'https://twitter.com/Aravinds2006', icon: '𝕏' },
    { name: 'GitHub', href: 'https://github.com/Aravinds2006', icon: 'Github' },
    { name: 'Instagram', href: 'https://instagram.com/nova__trades', icon: 'Instagram' },
  ]

  return (
    <footer className="bg-black/50 backdrop-blur-lg border-t border-white/10">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent"
            >
              Ghibli Art
            </motion.div>
            <p className="text-gray-400">
              Transform your imagination into Studio Ghibli-style artwork using AI.
            </p>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="space-y-4">
              <h3 className="text-white font-semibold capitalize">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Social Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Connect</h3>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <span className="sr-only">{social.name}</span>
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Credits */}
        <div className="mt-12 pt-8 border-t border-white/10 text-center">
          <p className="text-gray-400">
            © {currentYear} Ghibli Art Generator. All rights reserved.
          </p>
          <p className="text-gray-400 mt-2">
            Inspired by Studio Ghibli's magical artwork. Designed by{' '}
            <span className="text-white font-semibold">Aravindselvan</span>
          </p>
          <p className="text-gray-400 mt-2">
            Powered by{' '}
            <a
              href="https://huggingface.co/black-forest-labs/FLUX.1-schnell"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-purple-400 transition-colors"
            >
              FLUX.1 [schnell]
            </a>{' '}
            by Black Forest Labs and{' '}
            <a
              href="https://huggingface.co/google/gemma-3-27b-it"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-purple-400 transition-colors"
            >
              Google Gemma 3
            </a>{' '}
            by Google DeepMind
          </p>
        </div>
      </div>
    </footer>
  )
} 