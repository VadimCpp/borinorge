import Link from 'next/link'
import { greatVibes } from '../fonts'
import { useTranslation } from '../i18n'
import { languages } from '../i18n/settings'
import { Footer } from './components/footer'
import Dropdown from './components/dropdown'
import { Card } from './components/card'
import AuthButton from './components/auth-button'

export default async function Page({ params: { lng } }: { params: { lng: string } }) {
  const { t } = await useTranslation(lng)

  const verboseLanguages: { [key: string]: string } = {
    'nb': 'Bokmål',
    'nn': 'Nynorsk',
    'en': 'English',
    'ru': 'Русский',
    'uk': 'Українська'
  }

  return (
    <>
      <header className="header header--home">
        <div className="header__container">
          <h1 className={`header__title header__title--home ${greatVibes.variable}`}>
            Vi bor i Norge
          </h1>
        </div>
        <nav className="header__nav">
          <a className="header__nav-link" href="#projects">{t('projects')}</a>
          <a className="header__nav-link" href="#about-us">{t('about-us')}</a>
          <div>
            <Dropdown
              title={`${lng.toUpperCase()} ↓`}
              titleClassName="header__nav-link"
            >
              {languages.filter((l) => lng !== l).map((l) => (
                <div key={l} className="p-2 hover:bg-gray-100">
                  <Link href={`/${l}`} className="header__nav-link ">
                    {verboseLanguages[l]}
                  </Link>
                </div>
              ))}
            </Dropdown>
          </div>
          <AuthButton lng={lng} />
        </nav>
      </header>
      <main className="project">
        <section id="welcome">
          <h2 className="project__subtitle">{t('hello')}</h2>
          <p className="project__paragraph">{t('description-part-1')}</p>
          <p className="project__paragraph">{t('description-part-2')}</p>
        </section>
        <section id="projects">
          <h2 className="project__subtitle">{t('projects')}</h2>
          <div className="projects__grid">
            {[
              {
                id: 'projects/samfunnskunnskap',
                title: t('project-samfunnskunnskap'),
                imageUrl: '/images/preview/samfunnskunnskap_1200_630.jpeg',
                linkUrl: `/${lng}/projects/samfunnskunnskap`,
              },
              {
                id: 'projects/nettverk',
                title: "Nettverk",
                imageUrl: '/images/preview/nettverk_1200_630.jpeg',
                linkUrl: `/${lng}/projects/nettverk`,
              },
              {
                id: 'norsklett',
                title: t('project-norsklett'),
                imageUrl: '/images/preview/norsklett_1200_630.jpeg',
                linkUrl: `/${lng}/norsklett`,
              },
              {
                id: 'projects/ordbokene',
                title: t('project-ordbokene'),
                imageUrl: '/images/preview/ordbokene_1200_630_v3.jpeg',
                linkUrl: `/${lng}/projects/ordbokene`,
              },
              // TODO: return IT Kunnskap project
  //            {
  //              id: 'it-kunnskap',
  //              title: t('project-it-kunnskap'),
  //              imageUrl: '/images/preview/it_kunnskap_1200_630.jpeg',
  //            },
              {
                id: 'alias',
                title: t('project-alias'),
                imageUrl: '/images/preview/alias_1200_630.jpeg',
                linkUrl: `/${lng}/projects/alias`,
              },
              {
                id: 'redaksjon',
                title: t('project-redaksjon'),
                imageUrl: '/images/preview/redaksjon_1200_630.jpeg',
                linkUrl: `/${lng}/projects/redaksjon`,
              },
              {
                id: 'direkte-stotte',
                title: t('project-direkte-stotte'),
                imageUrl: '/images/preview/direkte_stotte_1200_630.jpeg',
                linkUrl: `/${lng}/projects/direkte-stotte`,
              },
            ].map((project) => (
              <Card
                key={project.id}
                project={project}
              />
            ))}
          </div>
        </section>
        <section id="about-us">
          <h2 className="project__subtitle">{t('about-us')}</h2>
          <p className="project__paragraph">{t('about-us-description-part-1')}</p>
          <p className="project__paragraph">{t('about-us-description-part-2')}</p>
          <div className="projects__grid">
            {[
              {
                id: 'oksana',
                title: t('oksana-donets'),
                imageUrl: '/images/preview/folk/oksana_donets_1200_630.jpeg',
                linkUrl: `/${lng}/folk/oksana`,
              },
              {
                id: 'iryna',
                title: t('folk.iryna.name'),
                imageUrl: '/images/preview/folk/iryna_nepotenko_1200_630.jpeg',
                linkUrl: `/${lng}/folk/iryna`,
              },
              {
                id: 'olena',
                title: t('olena-varlamova'),
                imageUrl: '/images/preview/folk/olena_varlamova_1200_630.jpeg',
                linkUrl: `/${lng}/folk/olena`,
              },
              {
                id: 'vadym',
                title: t('vadym-kaninskyi'),
                imageUrl: '/images/preview/folk/vadym_kaninskyi_1200_630.jpeg',
                linkUrl: `/${lng}/folk/vadym`,
              }
            ].map((project) => (
              <Card
                key={project.id}
                project={project}
              />
            ))}
          </div>
        </section>
        <section>
          <h2 className="project__subtitle">{t('privacy-statement')}</h2>
          <p className="project__paragraph">{t('privacy-policy')}</p>
        </section>
      </main>

      <Footer />
    </>
  )
}
