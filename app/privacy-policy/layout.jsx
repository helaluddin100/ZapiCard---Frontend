import { generateMetadata as generateMeta } from '../metadata'

export const metadata = generateMeta({
  title: 'Privacy Policy',
  description: 'Zapy Card Privacy Policy - Learn how we collect, use, and protect your personal and health information in compliance with Bangladeshi law.',
  keywords: ['privacy policy', 'data protection', 'privacy', 'data security', 'personal information'],
  canonical: '/privacy-policy',
})

export default function PrivacyPolicyLayout({ children }) {
  return children
}

