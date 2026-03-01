// Force dynamic rendering so this route is always server-rendered per request.
// Fixes iOS Safari showing 404 for dynamic health-card URLs (Android works because of different caching/navigation).
export const dynamic = 'force-dynamic'

export default function HealthCardSlugLayout({ children }) {
  return children
}
