import { generateMetadata as generateMeta } from '../metadata'

export const metadata = generateMeta({
  title: 'Contact Us',
  description: 'Get in touch with Zapy Card team. We are here to help you with your digital business card and health card needs. Email, phone, or contact form support available.',
  keywords: ['contact zapy card', 'customer support', 'help', 'get in touch', 'support', 'customer service'],
  canonical: '/contact',
})

export default function ContactLayout({ children }) {
  return children
}

