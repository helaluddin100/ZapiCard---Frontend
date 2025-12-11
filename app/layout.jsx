import './globals.css'
import { Inter, Poppins } from 'next/font/google'
import ConditionalLayout from '@/components/ConditionalLayout'
import AuthProviderWrapper from '@/lib/auth-wrapper'
import { ThemeProvider } from '@/lib/theme'
import { ToastProvider } from '@/lib/toast'
import Toast from '@/components/Toast'
import ToastHelper from '@/components/ToastHelper'
import FacebookPixel from '@/components/FacebookPixel'
import { generateMetadata as generateMeta, generateOrganizationSchema, generateWebsiteSchema } from './metadata'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap', // Optimize font loading
})

// Enhanced SEO metadata
export const metadata = generateMeta({})

export default function RootLayout({ children }) {
  const organizationSchema = generateOrganizationSchema()
  const websiteSchema = generateWebsiteSchema()

  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`} suppressHydrationWarning>
      <head>
        {/* Theme Script - Must be in head for no-flash */}
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

        {/* Structured Data - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />

        {/* Structured Data - Website */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />

        {/* Preconnect to external domains for better performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Favicon */}
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="shortcut icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
      </head>
      <body className="font-sans antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
        {/* Skip to content link for accessibility */}
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>

        <FacebookPixel />
        <ThemeProvider>
          <AuthProviderWrapper>
            <ToastProvider>
              <ToastHelper />
              <ConditionalLayout>
                <main id="main-content">
                  {children}
                </main>
              </ConditionalLayout>
              <Toast />
            </ToastProvider>
          </AuthProviderWrapper>
        </ThemeProvider>
      </body>
    </html>
  )
}

