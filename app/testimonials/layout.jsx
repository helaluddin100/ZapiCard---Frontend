import { generateMetadata as generateMeta } from '../metadata'

export const metadata = generateMeta({
  title: 'Testimonials',
  description: 'Read what our customers say about Zapy Card. Real testimonials from doctors, patients, and professionals using our smart digital cards and health card solutions.',
  keywords: ['testimonials', 'reviews', 'customer reviews', 'user testimonials', 'feedback', 'zapy card reviews'],
  canonical: '/testimonials',
})

export default function TestimonialsLayout({ children }) {
  return children
}

