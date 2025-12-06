import { generateMetadata as generateMeta } from '../metadata'

export const metadata = generateMeta({
  title: 'Terms and Conditions',
  description: 'Zapy Card Terms and Conditions - Read our terms of service governing the use of our digital business cards and health card services in compliance with Bangladeshi law.',
  keywords: ['terms and conditions', 'terms of service', 'user agreement', 'legal terms', 'service terms'],
  canonical: '/terms-of-service',
})

export default function TermsOfServiceLayout({ children }) {
  return children
}

