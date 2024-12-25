'use client'

import { motion } from 'framer-motion'
import { Cog, Code, Rocket } from 'lucide-react'

export default function WorkInProgress() {
  return (
    <div className="min-h-screen bg-teal-50 flex flex-col justify-center items-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-teal-800 mb-4">
          Work in Progress
        </h1>
        <p className="text-xl md:text-2xl text-teal-600 mb-8">
          Our team is working hard to bring you something amazing!
        </p>
      </motion.div>

      <div className="flex justify-center items-center mb-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="text-teal-500"
        >
          <Cog size={80} />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl w-full">
        {[
          { icon: Code, title: "Coding", description: "Writing clean, efficient code" },
          { icon: Rocket, title: "Launching Soon", description: "Preparing for takeoff" },
          { icon: Cog, title: "Fine-tuning", description: "Perfecting every detail" }
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <div className="flex justify-center mb-4 text-teal-500">
              <item.icon size={40} />
            </div>
            <h2 className="text-xl font-semibold text-teal-700 mb-2">{item.title}</h2>
            <p className="text-teal-600">{item.description}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="mt-12 text-teal-600"
      >
        <p>Check back soon for updates!</p>
      </motion.div>
    </div>
  )
}

