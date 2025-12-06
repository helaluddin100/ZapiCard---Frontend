import { generateMetadata as generateMeta } from '../metadata'

export const metadata = generateMeta({
  title: 'Health Dashboard',
  description: 'Manage your health cards and medical records. Create health cards, track medical history, manage prescriptions, and access your health information securely.',
  keywords: ['health dashboard', 'health card management', 'medical records', 'health tracking', 'patient portal'],
  canonical: '/health-dashboard',
})

export default function HealthDashboardLayout({ children }) {
  return children
}

