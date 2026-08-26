import type { Metadata } from 'next'
import '@fontsource-variable/manrope'
import '@fontsource/poppins/400.css'
import '@fontsource/poppins/500.css'
import '@fontsource/poppins/800.css'
import '@fontsource/qwigley/400.css'
import 'maplibre-gl/dist/maplibre-gl.css'
import './globals.css'
import { ExperienceProvider } from '@/context/ExperienceContext'
import AccessibilityTools from '@/components/accessibility/AccessibilityTools'
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Pemerintah Kota Surabaya',
    template: '%s | Pemerintah Kota Surabaya',
  },
  description: 'Portal resmi Pemerintah Kota Surabaya',
  applicationName: 'Portal Pemerintah Kota Surabaya',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    siteName: 'Pemerintah Kota Surabaya',
    title: 'Pemerintah Kota Surabaya',
    description: 'Portal resmi Pemerintah Kota Surabaya',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body>
        <a className="skip-link" href="#site-content">Lewati ke konten utama</a>
        <ExperienceProvider>
          <div id="site-content" tabIndex={-1}>{children}</div>
          <AccessibilityTools />
        </ExperienceProvider>
        <GoogleAnalytics />
      </body>
    </html>
  )
}
