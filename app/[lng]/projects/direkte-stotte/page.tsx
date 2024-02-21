import Image from 'next/image'
import { greatVibes } from '../../../fonts'
import { useTranslation } from '../../../i18n'
import { Breadcrumbs } from '../../components/breadcrumbs'
import { Footer } from '../../components/footer'

export default async function DirekteStotte({ params: { lng } }: { params: { lng: string } }) {
  const { t } = await useTranslation(lng, 'direkte-stotte')

  return (
    <>
      <header className="header">
        <div className="header__container">
          <h1 className={`header__title header__title--home ${greatVibes.variable}`}>{t('title')}</h1>
        </div>
      </header>
      <main className="project">
        <Breadcrumbs currentPage={t('title')} lng={lng} />
        <p className="project__paragraph">{t('fra-vadym')}</p>
        <Image
          className="project__image"
          src={"/images/direkte-stotte/vadym-kaninskyi.jpeg"}
          alt="Vadym Kaninskyi"
          width={2158}
          height={2158}
          priority
        />
        <p className="project__quote">{t('quote-vadym')}</p>

        <p className="project__paragraph">{t('fra-olena')}</p>
        <Image
          className="project__image"
          src={"/images/direkte-stotte/family-olena.jpeg"}
          alt="Olena Varlamova"
          width={1024}
          height={1024}
          priority
        />
        <p className="project__quote">{t('quote-olena')}</p>

        <h2 className="project__subtitle">{t('summary-title')}</h2>
        <p className="project__paragraph">{t('summary-text')}</p>

        <h2 className="project__subtitle">{t('statistics-title')}</h2>
        <p className="project__paragraph">{t('statistics-text')}</p>

        <Image
          className="project__image"
          src={`/images/direkte-stotte/direkte-statistikk-${lng}.png`}
          alt="Statistics"
          width={1024}
          height={768}
          priority
        />

        <p className="project__paragraph">{t('volunteers-involved')}</p>
        <p className="project__paragraph">{t('volunteers-list')}</p>
        <p className="project__paragraph">{t('project-complete')}</p>
      </main>
      <Footer />
    </>
  )
}
