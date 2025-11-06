'use client'

import Link from 'next/link'
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <h3 className="text-2xl font-bold mb-4 gradient-primary bg-clip-text text-transparent">
                            Zapi Card
                        </h3>
                        <p className="text-gray-400">
                            Smart visiting cards for the modern professional. Network smarter, not harder.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Product</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li><Link href="/#features" className="hover:text-white transition">Features</Link></li>
                            <li><Link href="/#pricing" className="hover:text-white transition">Pricing</Link></li>
                            <li><Link href="/testimonials" className="hover:text-white transition">Testimonials</Link></li>
                            <li><Link href="/nfc-order" className="hover:text-white transition">Order NFC Card</Link></li>
                        </ul>
                    </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/about" className="hover:text-white transition">About</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
              <li><Link href="/testimonials" className="hover:text-white transition">Testimonials</Link></li>
            </ul>
          </div>
                    <div>
                        <h4 className="font-semibold mb-4">Connect</h4>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-white transition"><Facebook className="w-5 h-5" /></a>
                            <a href="#" className="text-gray-400 hover:text-white transition"><Twitter className="w-5 h-5" /></a>
                            <a href="#" className="text-gray-400 hover:text-white transition"><Instagram className="w-5 h-5" /></a>
                            <a href="#" className="text-gray-400 hover:text-white transition"><Linkedin className="w-5 h-5" /></a>
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
                    <p>&copy; 2024 Zapi Card. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}

