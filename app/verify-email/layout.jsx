import { generateMetadata as generateMeta } from '../metadata'

export const metadata = generateMeta({
  title: 'Verify Email',
  description: 'Verify your email address to complete your Zapy Card registration. Enter the 6-digit verification code sent to your email.',
  keywords: ['verify email', 'email verification', 'account verification', 'confirm email'],
  canonical: '/verify-email',
})

export default function VerifyEmailLayout({ children }) {
  return children
}

