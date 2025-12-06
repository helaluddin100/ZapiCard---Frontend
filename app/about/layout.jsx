import { generateMetadata as generateMeta } from '../metadata'

export const metadata = generateMeta({
  title: 'About Us',
  description: 'Learn about Zapy Card - Revolutionizing digital networking and healthcare with smart NFC & QR technology. Our mission, vision, and commitment to innovation.',
  keywords: ['about zapy card', 'company information', 'our story', 'team', 'mission', 'vision', 'digital networking'],
  canonical: '/about',
})

export default function AboutLayout({ children }) {
  return children
}

