// Force dynamic rendering so this route is always server-rendered per request.
// Fixes iOS Safari showing 404 for dynamic card URLs (Android works because of different caching/navigation).
export const dynamic = 'force-dynamic'

export default function CardIdLayout({ children }) {
  return children
}
