import { generateMetadata as generateMeta } from '../metadata'

export const metadata = generateMeta({
  title: 'About Us',
  description: 'Learn about Zapi Card - the future of digital networking. Discover our mission to revolutionize business cards with smart NFC and QR technology.',
  keywords: ['about zapi card', 'digital business cards', 'our mission', 'our story'],
  canonical: '/about',
})

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">About Zapi Card</h1>
          <p className="text-xl md:text-2xl text-white/90">
            Revolutionizing the way professionals network and share information
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="prose dark:prose-invert max-w-none">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Our Mission</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              At Zapi Card, we believe in the power of seamless connections. Our mission is to transform
              traditional business cards into smart, eco-friendly digital solutions that make networking
              effortless and sustainable.
            </p>

            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Why Choose Zapi Card?</h2>
            <ul className="space-y-4 text-lg text-gray-600 dark:text-gray-400 mb-8">
              <li>✅ <strong>Eco-Friendly:</strong> Reduce paper waste with digital cards</li>
              <li>✅ <strong>Always Updated:</strong> Change your information anytime, anywhere</li>
              <li>✅ <strong>Professional:</strong> Make a lasting impression with modern technology</li>
              <li>✅ <strong>Analytics:</strong> Track who views your card and when</li>
              <li>✅ <strong>Integration:</strong> Connect with CRM systems and appointment booking</li>
            </ul>

            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Our Technology</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              We leverage cutting-edge NFC and QR code technology to deliver instant information sharing.
              With just a tap or scan, your contacts can save your information, visit your website,
              or book an appointment - all without downloading any apps.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
