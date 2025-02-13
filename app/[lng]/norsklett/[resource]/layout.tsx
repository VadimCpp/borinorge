import type { Metadata } from 'next'
import { metadataTranslation } from '../../../i18n'
import { NORSK_RESOURCE_NAMES } from './../constants'

interface MetadataProps {
  params: { lng: string, resource: string }
}

// Dynamic metadata
export async function generateMetadata(props: MetadataProps) {
  const { t } = await metadataTranslation(props.params.lng)
  const resource = props.params.resource
  const resourceName: string | undefined = NORSK_RESOURCE_NAMES.find((item) => item === resource)
  const title = resourceName
    ? t(`norsklett.${resourceName}.title`)
    : t('norsklett.norsklett')
  const description = resourceName
    ? t(`norsklett.${resourceName}.description`)
    : t('norsklett.description')
  const metadataBase = new URL('https://www.borinorge.no')

  const metadata: Metadata = {
    title,
    description,
    metadataBase,
    openGraph: {
      type: "website",
      url: "@site",
      title,
      description,
      siteName: title,
      images: [
        {
          url: "/images/preview/norsklett_1200_630.jpeg",
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      site: "@site",
      creator: "@creator",
      images: "/images/preview/norsklett_1200_630.jpeg"
    }
  }

  return metadata
}

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='bg-sky-50'>
      {children}
    </div>
  )
}
