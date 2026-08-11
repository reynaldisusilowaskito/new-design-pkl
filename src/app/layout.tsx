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
  const preferenceScript = `(function(){try{var t=localStorage.getItem('surabaya-theme');if(t!=='dark'&&t!=='light')t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t;var l=localStorage.getItem('surabaya-language')==='en'?'en':'id';document.documentElement.lang=l}catch(e){}})()`
  return (
    <html lang="id" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: preferenceScript }} /></head>
      <body><ExperienceProvider>{children}</ExperienceProvider></body>
    </html>
  )
}
