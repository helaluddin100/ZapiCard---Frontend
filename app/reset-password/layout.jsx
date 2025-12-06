import { generateMetadata as generateMeta } from '../metadata'

export const metadata = generateMeta({
  title: 'Reset Password',
  description: 'Set a new password for your Zapy Card account. Enter your new password to complete the reset process.',
  keywords: ['reset password', 'new password', 'password change', 'account security'],
  canonical: '/reset-password',
})

export default function ResetPasswordLayout({ children }) {
  return children
}

