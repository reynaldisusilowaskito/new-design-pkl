import type { Metadata } from 'next'
import '@fontsource-variable/manrope'
import 'maplibre-gl/dist/maplibre-gl.css'
import './globals.css'
import { ExperienceProvider } from '@/context/ExperienceContext'
import AccessibilityTools from '@/components/accessibility/AccessibilityTools'

export const metadata: Metadata = {
  title: 'Pemerintah Kota Surabaya',
  description: 'Portal resmi Pemerintah Kota Surabaya',
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
      </body>
    </html>
  )
}
