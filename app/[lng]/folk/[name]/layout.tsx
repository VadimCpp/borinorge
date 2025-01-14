import type { Metadata } from 'next'
import { metadataTranslation } from '../../../i18n'
import { FOLKS, Folk, folksMapping } from './_mappings'

type Props = {
  params: {
    name: string
    lng: string
  }
}

// Dynamic metadata
export async function generateMetadata({ params: { lng, name } }: Props) {
  const { t } = await metadataTranslation(lng)
  
  const title = t(`folk.${name}.name`)
  const description = t(`folk.${name}.quote`)
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
        url: folksMapping[name as Folk].openGraph.url
      }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@site",
      creator: "@creator", 
      images: folksMapping[name as Folk].openGraph.url
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