import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { ChevronRight, MessageCircle, Shield, Image, Users, Smartphone, Palette } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="font-sans min-h-screen flex flex-col bg-teal-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <MessageCircle className="h-8 w-8 text-teal-500" />
            <span className="text-2xl font-bold text-teal-700">Connectify</span>
          </Link>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Button asChild variant="ghost" className="text-teal-600 hover:text-teal-800 hover:bg-teal-50">
                  <Link href="/login">Login</Link>
                </Button>
              </li>
              <li>
                <Button asChild className="bg-teal-500 text-white hover:bg-teal-600">
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-teal-100">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl tracking-tight mb-6 text-teal-900">
              Connect Instantly, Chat Seamlessly
            </h1>
            <p className="mt-6 text-xl text-teal-700 max-w-3xl mx-auto mb-10">
              Experience the future of communication with our intuitive and powerful chat platform. Stay connected with friends, family, and colleagues, anytime, anywhere.
            </p>
            <Button asChild size="lg" className="bg-teal-500 text-white hover:bg-teal-600">
              <Link href="/login" className="inline-flex items-center">
                Get Started
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-teal-800 text-center mb-12">
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
                <div key={index} className="bg-teal-50 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border border-teal-100">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="bg-teal-200 rounded-full p-2">
                      <feature.icon className="h-6 w-6 text-teal-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-teal-800">{feature.title}</h3>
                  </div>
                  <p className="text-teal-700">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-teal-200 text-teal-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-8">Ready to get started?</h2>
            <p className="text-xl mb-10 text-teal-700">Join millions of users who trust Connectify for their communication needs.</p>
            <Button asChild size="lg" className="bg-teal-500 text-white hover:bg-teal-600">
              <Link href="/signup">Sign Up Now</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-teal-800 text-teal-100">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { title: "Product", links: ["Features", "Pricing", "FAQ"] },
              { title: "Company", links: ["About", "Careers", "Contact"] },
              { title: "Legal", links: ["Privacy", "Terms"] },
              { title: "Connect", links: ["Twitter", "Facebook", "Instagram"] },
            ].map((section, index) => (
              <div key={index}>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-teal-300">{section.title}</h3>
                <ul className="mt-4 space-y-4">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-teal-200 hover:text-white transition-colors duration-200">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-8 border-t border-teal-700 pt-8 md:flex md:items-center md:justify-between">
            <div className="flex space-x-6 md:order-2">
              {['Facebook', 'Instagram', 'Twitter'].map((social) => (
                <a key={social} href="#" className="text-teal-300 hover:text-teal-100">
                  <span className="sr-only">{social}</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
              ))}
            </div>
            <p className="mt-8 text-base text-teal-200 md:mt-0 md:order-1">
              &copy; {new Date().getFullYear()} Connectify, Inc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

