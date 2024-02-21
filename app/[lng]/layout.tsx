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
        url: "/images/preview/home_1200_630.jpeg",
      }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@site",
      creator: "@creator", 
      images: "/images/preview/home_1200_630.jpeg" 
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