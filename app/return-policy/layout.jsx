import { generateMetadata as generateMeta } from '../metadata'

export const metadata = generateMeta({
  title: 'Return & Refund Policy',
  description: 'Zapy Card Return and Refund Policy - Learn about our return process for NFC and QR code cards, including design errors and functionality issues.',
  keywords: ['return policy', 'refund policy', 'return', 'refund', 'warranty', 'card return'],
  canonical: '/return-policy',
})

export default function ReturnPolicyLayout({ children }) {
  return children
}

