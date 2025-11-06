'use client'

import Link from 'next/link'

export default function Header() {
    return (
        <nav className="fixed top-0 w-full z-50 glass-effect">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <Link href="/" className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
                            Zapi Card
                        </Link>
                    </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/#features" className="text-gray-700 hover:text-blue-600 transition">Features</Link>
              <Link href="/#pricing" className="text-gray-700 hover:text-blue-600 transition">Pricing</Link>
              <Link href="/testimonials" className="text-gray-700 hover:text-blue-600 transition">Testimonials</Link>
              <Link href="/about" className="text-gray-700 hover:text-blue-600 transition">About</Link>
              <Link href="/contact" className="text-gray-700 hover:text-blue-600 transition">Contact</Link>
              <Link href="/login" className="text-gray-700 hover:text-blue-600 transition">Login</Link>
              <Link href="/signup" className="btn-primary">Sign Up</Link>
            </div>
                </div>
            </div>
        </nav>
    )
}

