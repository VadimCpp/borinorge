import type { Metadata } from 'next'
import { metadataTranslation } from '../../../i18n'

// Dynamic metadata
export async function generateMetadata({params: {lng}}:{params: {lng: string}}) {
  const { t } = await metadataTranslation(lng, 'norgesbank')
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
    },
    twitter: {
      card: "summary",
      site: "@site",
      creator: "@creator", 
    },
  }

  return metadata
}

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
    </>
  )
}