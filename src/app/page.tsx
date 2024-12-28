"use client"
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { ChevronRight, MessageCircle, Shield, Image, Users, Smartphone, Palette } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import ThreeJSAnimation from '@/components/ui/threejsanimation'

export default function LandingPage() {
  return (
    <div className="font-sans min-h-screen flex flex-col bg-slate-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <MessageCircle className="h-8 w-8 text-indigo-500" />
            <span className="text-2xl font-bold text-indigo-700">Connectify</span>
          </Link>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Button asChild variant="ghost" className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50">
                  <Link href="/login">Login</Link>
                </Button>
              </li>
              <li>
                <Button asChild className="bg-indigo-500 text-white hover:bg-indigo-600">
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl tracking-tight mb-6">
                Connect Instantly, Chat Seamlessly
              </h1>
              <p className="mt-6 text-xl text-indigo-100 mb-10">
                Experience the future of communication with our intuitive and powerful chat platform. Stay connected anytime, anywhere.
              </p>
              <Button asChild size="lg" className="bg-white text-indigo-600 hover:bg-indigo-100">
                <Link href="/signup" className="inline-flex items-center">
                  Get Started
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="md:w-1/2">
             <ThreeJSAnimation/>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-indigo-800 text-center mb-12">
              Why Choose Connectify?
            </h2>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: MessageCircle, title: "Real-time Messaging", description: "Instant message delivery for fluid conversations" },
                { icon: Shield, title: "End-to-End Encryption", description: "Your conversations are secure and private" },
                { icon: Image, title: "Rich Media Sharing", description: "Easily share photos, videos, and files" },
                { icon: Users, title: "Group Chats", description: "Create and manage group conversations effortlessly" },
                { icon: Smartphone, title: "Cross-Platform Sync", description: "Seamless experience across all your devices" },
                { icon: Palette, title: "Customizable Interface", description: "Personalize your chat environment" },
              ].map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="bg-indigo-100 rounded-full p-2">
                        <feature.icon className="h-6 w-6 text-indigo-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-indigo-800">{feature.title}</h3>
                    </div>
                    <p className="text-slate-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-indigo-100 text-indigo-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-8">Join Our Community</h2>
            <p className="text-xl mb-10 text-indigo-700">Connect with millions of users who trust Connectify for their communication needs.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" className="bg-indigo-500 text-white hover:bg-indigo-600">
                <Link href="/signup">Sign Up Now</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-white text-indigo-600 hover:bg-indigo-50">
                <Link href="/features">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-indigo-800 text-center mb-12">
              What Our Users Say
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {[
                { name: "Alex Johnson", role: "Freelancer", quote: "Connectify has revolutionized how I communicate with my clients. It's fast, secure, and incredibly user-friendly." },
                { name: "Sarah Lee", role: "Student", quote: "As a student, Connectify helps me stay connected with my study groups. The group chat feature is a game-changer!" },
                { name: "Michael Chen", role: "Business Owner", quote: "The cross-platform sync is fantastic. I can seamlessly switch between my devices without missing a beat." },
              ].map((testimonial, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <p className="text-slate-600 mb-4">"{testimonial.quote}"</p>
                    <div className="flex items-center">
                      <div className="bg-indigo-100 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                        <span className="text-indigo-600 font-semibold">{testimonial.name[0]}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-indigo-800">{testimonial.name}</p>
                        <p className="text-slate-500">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-indigo-900 text-indigo-100">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { title: "Product", links: ["Features", "Pricing", "FAQ"] },
              { title: "Company", links: ["About", "Careers", "Contact"] },
              { title: "Legal", links: ["Privacy", "Terms"] },
              { title: "Connect", links: ["Twitter", "Facebook", "Instagram"] },
            ].map((section, index) => (
              <div key={index}>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-indigo-300">{section.title}</h3>
                <ul className="mt-4 space-y-4">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-indigo-200 hover:text-white transition-colors duration-200">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-8 border-t border-indigo-700 pt-8 md:flex md:items-center md:justify-between">
            <div className="flex space-x-6 md:order-2">
              {['Facebook', 'Instagram', 'Twitter'].map((social) => (
                <a key={social} href="#" className="text-indigo-300 hover:text-indigo-100">
                  <span className="sr-only">{social}</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
              ))}
            </div>
            <p className="mt-8 text-base text-indigo-200 md:mt-0 md:order-1">
              &copy; {new Date().getFullYear()} Connectify, Inc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

