'use client'

import { motion } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars, Float, Text3D } from '@react-three/drei'
import { Button } from '@nextui-org/react'
import Link from 'next/link'

function FloatingText() {
  return (
    <Float
      speed={1.5}
      rotationIntensity={0.5}
      floatIntensity={0.5}
    >
      <Text3D
        font="/fonts/helvetiker_regular.typeface.json"
        size={0.5}
        height={0.2}
        curveSegments={12}
      >
        Ghibli Art
        <meshStandardMaterial
          color="#818CF8"
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.8}
        />
      </Text3D>
    </Float>
  )
}

function BackgroundScene() {
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <OrbitControls enableZoom={false} enablePan={false} />
      <FloatingText />
    </Canvas>
  )
}

export default function Hero() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0 -z-10">
        <BackgroundScene />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white">
            Transform Your Imagination into{' '}
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              Ghibli Art
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
            Create stunning Studio Ghibli-style artwork using AI. Bring your stories to life with magical landscapes and enchanting characters.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              as={Link}
              href="/generate"
              color="primary"
              size="lg"
              className="text-lg px-8 py-6"
            >
              Start Creating
            </Button>
            <Button
              as={Link}
              href="/gallery"
              variant="bordered"
              size="lg"
              className="text-lg px-8 py-6 border-white/20 text-white hover:bg-white/10"
            >
              View Gallery
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
            {[
              { number: '10K+', label: 'Images Generated' },
              { number: '98%', label: 'User Satisfaction' },
              { number: '24/7', label: 'AI Processing' },
              { number: '100+', label: 'Art Styles' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-lg rounded-lg p-6"
              >
                <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center">
          <motion.div
            animate={{
              y: [0, 20, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "loop",
            }}
            className="w-1 h-3 bg-white rounded-full mt-2"
          />
        </div>
      </motion.div>
    </div>
  )
} 