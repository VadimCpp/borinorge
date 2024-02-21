import type { Metadata } from 'next'
import { metadataTranslation } from '../../../i18n'

// Dynamic metadata
export async function generateMetadata({params: {lng}}:{params: {lng: string}}) {
  const { t } = await metadataTranslation(lng, 'olena')
  const title = t('olena-varlamova')
  const description = t('quote-olena')
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
        url: "/images/preview/folk/olena_varlamova_1200_630.jpeg",
      }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@site",
      creator: "@creator", 
      images: "/images/preview/folk/olena_varlamova_1200_630.jpeg" 
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