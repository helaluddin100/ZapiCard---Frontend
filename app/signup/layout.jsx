import { generateMetadata as generateMeta } from '../metadata'

export const metadata = generateMeta({
  title: 'Sign Up',
  description: 'Create your free Zapy Card account and start building smart digital business cards and health cards. Join thousands of professionals using NFC & QR technology.',
  keywords: ['sign up', 'register', 'create account', 'free account', 'join zapy card', 'new account'],
  canonical: '/signup',
})

export default function SignupLayout({ children }) {
  return children
}

