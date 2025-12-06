import { generateMetadata as generateMeta } from '../metadata'

export const metadata = generateMeta({
  title: 'Login',
  description: 'Sign in to your Zapy Card account to manage your digital business cards and health cards. Access your dashboard, create cards, and manage appointments.',
  keywords: ['login', 'sign in', 'zapy card login', 'account access', 'dashboard login'],
  canonical: '/login',
})

export default function LoginLayout({ children }) {
  return children
}

