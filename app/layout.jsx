import './globals.css'
import { Inter, Poppins } from 'next/font/google'
import ConditionalLayout from '@/components/ConditionalLayout'
import AuthProviderWrapper from '@/lib/auth-wrapper'
import { ThemeProvider } from '@/lib/theme'
import { ToastProvider } from '@/lib/toast'
import Toast from '@/components/Toast'
import ToastHelper from '@/components/ToastHelper'

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
    <html lang="en" className={`${inter.variable} ${poppins.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const savedTheme = localStorage.getItem('theme');
                  const theme = savedTheme || 'system';
                  
                  if (theme === 'system') {
                    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    if (systemPrefersDark) {
                      document.documentElement.classList.add('dark');
                    } else {
                      document.documentElement.classList.remove('dark');
                    }
                  } else if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
        <ThemeProvider>
          <AuthProviderWrapper>
            <ToastProvider>
              <ToastHelper />
              <ConditionalLayout>
                {children}
              </ConditionalLayout>
              <Toast />
            </ToastProvider>
          </AuthProviderWrapper>
        </ThemeProvider>
      </body>
    </html>
  )
}

