import type { Metadata } from 'next'
import '@fontsource-variable/manrope'
import 'maplibre-gl/dist/maplibre-gl.css'
import './globals.css'
import { ExperienceProvider } from '@/context/ExperienceContext'

export const metadata: Metadata = {
  title: 'Pemerintah Kota Surabaya',
  description: 'Portal resmi Pemerintah Kota Surabaya',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body>
        <ExperienceProvider>{children}</ExperienceProvider>
      </body>
    </html>
  )
}
