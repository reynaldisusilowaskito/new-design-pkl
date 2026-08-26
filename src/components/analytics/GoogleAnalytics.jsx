'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Script from 'next/script'

const measurementId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID?.trim()
const isValidMeasurementId = /^G-[A-Z0-9]+$/i.test(measurementId || '')

export default function GoogleAnalytics() {
  const pathname = usePathname()
  const lastTrackedUrl = useRef('')

  useEffect(() => {
    if (!isValidMeasurementId || !pathname) return

    const pagePath = `${pathname}${window.location.search}`
    if (lastTrackedUrl.current === pagePath) return

    window.dataLayer = window.dataLayer || []
    window.gtag = window.gtag || function gtag() {
      window.dataLayer.push(arguments)
    }

    if (!window.__surabayaGaConfigured) {
      window.gtag('js', new Date())
      window.gtag('config', measurementId, {
        send_page_view: false,
        anonymize_ip: true,
      })
      window.__surabayaGaConfigured = true
    }

    window.gtag('event', 'page_view', {
      page_title: document.title,
      page_location: window.location.href,
      page_path: pagePath,
    })
    lastTrackedUrl.current = pagePath
  }, [pathname])

  if (!isValidMeasurementId) return null

  return (
    <Script
      id="google-analytics"
      src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      strategy="lazyOnload"
    />
  )
}
