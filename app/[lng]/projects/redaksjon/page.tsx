import Image from 'next/image'
import Link from 'next/link'
import { greatVibes } from '../../../fonts'
import { useTranslation } from '../../../i18n'
import { Breadcrumbs } from '../../components/breadcrumbs'
import { Footer } from '../../components/footer'

export default async function Redaksjon({ params: { lng } }: { params: { lng: string } }) {
  const { t } = await useTranslation(lng, 'redaksjon')

  return (
    <>
      <header className="header">
        <div className="header__container">
          <h1 className={`header__title header__title--home ${greatVibes.variable}`}>{t('title')}</h1>
        </div>
      </header>
      <main className="project">
        <Breadcrumbs currentPage={t('title')} lng={lng} />
        <p className="project__paragraph">{t('description')}</p>
        <p className="project__paragraph">{t('fra-teacher')}</p>
        <p className="project__quote">{t('quote-teacher')}</p>
        <Image
          className="project__image"
          src={"/images/redaksjon/project_1_4.jpeg"}
          alt="Project 1-4"
          width={1200}
          height={742}
          priority
        />
        <Image
          className="project__image"
          src={"/images/redaksjon/project_5_7.jpeg"}
          alt="Project 5-7"
          width={1200}
          height={900}
          priority
        />
        <p className="project__paragraph">{t('campus-reklame')}</p>
        <div className="target-action">
          <Link href="https://campus.inkrement.no/blogg/Har-du-ukrainske-elever-i-klassen" className="target-action__link">
            Campus.inkrement.no
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
