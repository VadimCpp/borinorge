import { dir } from 'i18next'
import type { Metadata } from 'next'
import { metadataTranslation } from '../i18n'
import { Analytics } from '@vercel/analytics/react';
import { languages } from '../i18n/settings'
import '../globals.css'

// Dynamic metadata
export async function generateMetadata({params: {lng}}:{params: {lng: string}}) {
  const { t } = await metadataTranslation(lng)
  const title = t('meta-title')
  const description = t('meta-description')
  const metadataBase = new URL('https://www.borinorge.no')
  
  // Get current date in Norway's timezone (or just system time if timezone handling isn't critical)
  const now = new Date()

  // Extract month and day
  const month = now.getMonth() + 1 // getMonth() is zero-based, so add 1
  const day = now.getDate()

  // Determine which image to use:
  // Period for "home_ny_1200_630.jpeg": from 15 December (12/15) to 15 January (1/15)
  // We'll treat these conditions spanning year end:
  let imageUrl = "/images/preview/home_1200_630.jpeg" // default
  
  // Check if we are in the special NY period:
  // If it's December and day >= 15, or January and day <= 15
  if ((month === 12 && day >= 15) || (month === 1 && day <= 15)) {
    imageUrl = "/images/preview/home_ny_1200_630.jpeg"
  } else {
    // If it's not the NY period, but still winter:
    // Let's define winter as December (12), January (1), and February (2).
    if (month === 12 || month === 1 || month === 2) {
      imageUrl = "/images/preview/home_winter_1200_630.jpeg"
    }
  }

  const metadata: Metadata = {
    title: title,
    description: description,
    metadataBase: metadataBase,
    openGraph: {
      type: "website",
      url: "@site",
      title: title,
      description: description,
      siteName: title,
      images: [{
        url: imageUrl,
      }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@site",
      creator: "@creator", 
      images: imageUrl 
    },
  }

  return metadata
}

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }))
}

export default function RootLayout({
  children,
  params: {
    lng
  }
}: {
  children: React.ReactNode
  params: {
    lng: string
  }
}) {
  return (
    <html lang={lng} dir={dir(lng)} className="scroll-smooth">
      <head />
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}