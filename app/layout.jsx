import './globals.css'
import { Inter, Poppins } from 'next/font/google'
import ConditionalLayout from '@/components/ConditionalLayout'
import AuthProviderWrapper from '@/lib/auth-wrapper'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins'
})

export const metadata = {
  title: 'Zapi Card - Smart NFC & QR Visiting Cards',
  description: 'Create, manage, and share your smart visiting cards with QR and NFC technology. Modern digital business cards for professionals.',
  keywords: 'digital business card, NFC card, QR code, visiting card, smart card',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-sans antialiased">
        <AuthProviderWrapper>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </AuthProviderWrapper>
      </body>
    </html>
  )
}

