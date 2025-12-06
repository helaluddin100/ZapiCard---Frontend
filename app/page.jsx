import { generateMetadata as generateMeta } from './metadata'
import HomePageContent from './HomePageContent'

export const metadata = generateMeta({
  title: 'Home - Smart Health Card & Digital Visiting Cards | NFC & QR Technology',
  description: 'Revolutionary smart cards for business and healthcare. Create digital visiting cards with appointment booking, and smart health cards with AI prescription reading for patients and pregnant women. NFC & QR instant access.',
  keywords: [
    'smart health card',
    'digital business card',
    'NFC visiting card',
    'QR code business card',
    'AI prescription reading',
    'pregnancy health card',
    'appointment booking card',
  ],
  canonical: '/',
})

export default function Home() {
  return <HomePageContent />
}
