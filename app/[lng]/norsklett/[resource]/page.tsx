import Link from 'next/link'
import { useTranslation } from '../../../i18n'
import { languages, verboseLanguages } from '../../../i18n/settings'
import Dropdown from '../../components/dropdown'
import Sources from './../components/sources'
import { NorskResource } from './../types'
import { NORSK_RESOURCE_NAMES, NORSK_RESOURCE_ATTRIBUTES } from './../constants'

export default async function ChatNorsklett({ params: { lng } }: { params: { lng: string } }) {
  const { t } = await useTranslation(lng)

  const resources: Array<NorskResource> = []
  NORSK_RESOURCE_NAMES
    .filter((item) => t(`norsklett.${item}.title`) != `norsklett.${item}.title`)
    .map((item) => {
      const levels = (NORSK_RESOURCE_ATTRIBUTES[item as keyof typeof NORSK_RESOURCE_ATTRIBUTES])?.levels || []
      const languages = (NORSK_RESOURCE_ATTRIBUTES[item as keyof typeof NORSK_RESOURCE_ATTRIBUTES])?.languages || []
      const platforms = (NORSK_RESOURCE_ATTRIBUTES[item as keyof typeof NORSK_RESOURCE_ATTRIBUTES])?.platforms || []

      resources.push({
        slug: item,
        title: t(`norsklett.${item}.title`),
        description: t(`norsklett.${item}.description`),
        link: t(`norsklett.${item}.link`),
        author: t(`norsklett.${item}.author`),
        levels:  [ ...levels ],
        languages: [ ...languages ],
        platforms: [ ...platforms ],
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
          locales={{
            show_filter_instructions: t("norsklett.show-filter-instructions"),
            created_by: t("norsklett.created-by")
          }}
        />
      </main>
    </>
  )
}
