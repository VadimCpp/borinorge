import type { Metadata } from 'next'
import { metadataTranslation } from '../../../i18n'

// Dynamic metadata
export async function generateMetadata() {
  const title = "Запрошуємо у казку ❤️"
  const description = "📚🇳🇴 Школа норвезької мови Karense «NoTe» та російськомовне товариство «Казка» організовують безкоштовні курси норвезької мови для членів товариства за програмою Kompetansepluss frivillighet."
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
        url: "/images/preview/norsklett/noun_1200_630.jpeg",
      }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@site",
      creator: "@creator", 
      images: "/images/preview/norsklett/noun_1200_630.jpeg" 
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