import Link from 'next/link'
import { useTranslation } from '../../i18n'
import { languages, verboseLanguages } from '../../i18n/settings'
import Dropdown from '../components/dropdown'
import Sources from './components/sources'
import { NorskResource } from './types'
import { NORSK_RESOURCE_NAMES } from './constants'

export default async function ChatNorsklett({ params: { lng } }: { params: { lng: string } }) {
  const { t } = await useTranslation(lng)

  const resources: Array<NorskResource> = []
  NORSK_RESOURCE_NAMES
  .filter((item) => t(`norsklett.${item}.title`) != `norsklett.${item}.title`)
  .map((item) => {
      resources.push({
        slug: item,
        title: t(`norsklett.${item}.title`),
        description: t(`norsklett.${item}.description`),
        link: t(`norsklett.${item}.link`),
        author: t(`norsklett.${item}.author`)
      })
  })

  return (
    <>
      <header className="header">
        <div className="container mx-auto px-4">
          <h1 className="header__title header__title--home text-left pb-0 mb-4">{t("norsklett.norsklett")}</h1>
          <p className="font-thin text-left pt-0 mt-0 relative">{t("norsklett.description")}</p>
          <div className='mb-4 pt-4'>
            <Dropdown
              title={`${lng.toUpperCase()} ↓`}
              titleClassName="float-right"
            >
              {languages.filter((l) => lng !== l).map((l) => (
                <div key={l} className="p-2 hover:bg-gray-100">
                  <Link href={`/${l}/norsklett`} className="header__nav-link">
                    {verboseLanguages[l]}
                  </Link>
                </div>
              ))}
            </Dropdown>
          </div>
        </div>
      </header>
      <main className='pt-8'>
        <Sources
          resources={resources}
          labels={{
            "total-resources": t("norsklett.total-resources"),
            "filter-description": t("norsklett.filter-description"),
            "found-resources": t("norsklett.found-resources"),
            "out-of": t("norsklett.out-of"),
            "created-by": t("norsklett.created-by"),
            "reading": t("norsklett.reading"),
            "listening": t("norsklett.listening"),
            "writing": t("norsklett.writing"),
            "oral": t("norsklett.oral")
          }}
        />
      </main>
    </>
  )
}
