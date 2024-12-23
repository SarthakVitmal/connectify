'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { motion } from 'framer-motion'

export default function LandingPage() {
  return (
    <div className="font-[sans] min-h-screen flex flex-col bg-gradient-to-br from-teal-50 to-cyan-100">
      <header className="bg-white bg-opacity-90 shadow-sm sticky top-0 z-10 backdrop-filter backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <span className="text-2xl font-bold text-teal-600">Connectify</span>
          </motion.div>
          <nav>
            <ul className="flex space-x-4">
              <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button onClick={() => { window.location.href = '/login'; }} variant="ghost" className="text-teal-600 hover:text-teal-700 hover:bg-teal-50">
                  Login
                </Button>
              </motion.li>
              <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button onClick={() => {window.location.href = '/signup'}} className="bg-teal-500 text-white hover:bg-teal-600">
                  Sign Up
                </Button>
              </motion.li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl tracking-tight"
            >
              Connect Instantly, Chat Seamlessly
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Experience the future of communication with our intuitive and powerful chat platform. Stay connected with friends, family, and colleagues, anytime, anywhere.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-10"
            >
              <Button size="lg" className="bg-teal-500 text-white hover:bg-teal-600">
                Get Started
              </Button>
            </motion.div>
          </div>
        </section>

        <section className="py-20 bg-white bg-opacity-60 backdrop-filter backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">
              Why Choose Connectify?
            </h2>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { title: "Real-time Messaging", description: "Instant message delivery for fluid conversations" },
                { title: "End-to-End Encryption", description: "Your conversations are secure and private" },
                { title: "Rich Media Sharing", description: "Easily share photos, videos, and files" },
                { title: "Group Chats", description: "Create and manage group conversations effortlessly" },
                { title: "Cross-Platform Sync", description: "Seamless experience across all your devices" },
                { title: "Customizable Interface", description: "Personalize your chat environment" },
              ].map((feature, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <h3 className="text-lg font-semibold text-teal-600 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-teal-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-8">Ready to get started?</h2>
            <p className="text-xl mb-10">Join millions of users who trust Connectify for their communication needs.</p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button onClick={() => {window.location.href='/signup'}} size="lg" className="bg-white text-teal-600 hover:bg-gray-100">
                Sign Up Now
              </Button>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">Product</h3>
              <ul className="mt-4 space-y-4">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">Features</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">Pricing</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">Company</h3>
              <ul className="mt-4 space-y-4">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">About</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">Careers</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">Legal</h3>
              <ul className="mt-4 space-y-4">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">Privacy</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">Terms</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">Connect</h3>
              <ul className="mt-4 space-y-4">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">Twitter</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">Facebook</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">Instagram</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-8 md:flex md:items-center md:justify-between">
            <div className="flex space-x-6 md:order-2">
              {['Facebook', 'Instagram', 'Twitter'].map((social) => (
                <a key={social} href="#" className="text-gray-400 hover:text-gray-300">
                  <span className="sr-only">{social}</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
              ))}
            </div>
            <p className="mt-8 text-base text-gray-400 md:mt-0 md:order-1">
              &copy; 2024 ChatApp, Inc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

