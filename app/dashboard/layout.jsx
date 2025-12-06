import { generateMetadata as generateMeta } from '../metadata'

export const metadata = generateMeta({
  title: 'Dashboard',
  description: 'Manage your Zapy Card dashboard. Create and edit digital business cards, health cards, view analytics, manage appointments, and track orders.',
  keywords: ['dashboard', 'my account', 'manage cards', 'card management', 'analytics', 'appointments'],
  canonical: '/dashboard',
})

export default function DashboardLayout({ children }) {
  return children
}

