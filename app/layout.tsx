import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Opsis Suite - Professional Warehouse Management',
  description: 'Multi-tenant SaaS platform for construction companies',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
