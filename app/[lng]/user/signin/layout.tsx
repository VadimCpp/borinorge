import type { Metadata } from 'next'
import { metadataTranslation } from '../../../i18n'

export async function generateMetadata({ params: { lng } }: { params: { lng: string } }): Promise<Metadata> {
  const { t } = await metadataTranslation(lng, 'signin')
  const title = t('meta-title')
  const description = t('meta-description')
  const metadataBase = new URL('https://www.borinorge.no')

  const metadata: Metadata = {
    title,
    description,
    metadataBase,
    openGraph: {
      type: 'website',
      url: '@site',
      title,
      description,
      siteName: title,
    },
    twitter: {
      card: 'summary',
      site: '@site',
      creator: '@creator',
    },
  }

  return metadata
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
