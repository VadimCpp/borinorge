import { greatVibes } from '../../../fonts'
import { useTranslation } from '../../../i18n'
import { Breadcrumbs } from '../../components/breadcrumbs'
import { Footer } from '../../components/footer'

export default async function Samfunnskunnskap({ params: { lng } }: { params: { lng: string } }) {
  const { t } = await useTranslation(lng)

  return (
    <>
      <header className="header">
        <div className="header__container">
          <h1 className={`header__title header__title--home ${greatVibes.variable}`}>{t('project-samfunnskunnskap')}</h1>
        </div>
      </header>
      <main className="project">
        <Breadcrumbs currentPage={t('project-samfunnskunnskap')} lng={lng} path="projects/samfunnskunnskap" />
        <p className="project__paragraph">{t('samfunnskunnskap.intro')}</p>
        <p className="project__paragraph">{t('samfunnskunnskap.intro-details')}</p>
        <p className="project__paragraph">{t('samfunnskunnskap.curriculum-title')}</p>
        <ul className="project__list">
          <li>{t('samfunnskunnskap.curriculum-history')}</li>
          <li>{t('samfunnskunnskap.curriculum-family')}</li>
          <li>{t('samfunnskunnskap.curriculum-education')}</li>
        </ul>
        <p className="project__paragraph">{t('samfunnskunnskap.statistics-participants')}</p>
        <p className="project__paragraph">{t('samfunnskunnskap.statistics-exam-results')}</p>
      </main>
      <Footer />
    </>
  )
} 