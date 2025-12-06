import { generateMetadata as generateMeta } from '../metadata'

export const metadata = generateMeta({
  title: 'Forgot Password',
  description: 'Reset your Zapy Card account password. Enter your email to receive a password reset link.',
  keywords: ['forgot password', 'reset password', 'password recovery', 'account recovery'],
  canonical: '/forgot-password',
})

export default function ForgotPasswordLayout({ children }) {
  return children
}

