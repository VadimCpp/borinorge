import { greatVibes } from '../../../fonts'
import { useTranslation } from '../../../i18n'
import { Breadcrumbs } from '../../components/breadcrumbs'
import { Card } from '../../components/card'
import { Footer } from '../../components/footer'

export default async function Nettverk({ params: { lng } }: { params: { lng: string } }) {
  const { t } = await useTranslation(lng)

  const chatCards = [
    {
      id: 'haldenuk',
      linkUrl: 'https://t.me/haldenuk',
      imageUrl: '/images/nettverk/halden.jpeg',
      title: t('nettverk.chat_halden'),
    },
    {
      id: 'oslouk',
      linkUrl: 'https://t.me/oslouk',
      imageUrl: '/images/nettverk/oslo.jpeg',
      title: t('nettverk.chat_oslo'),
    },
    {
      id: 'bergenvolonterchat',
      linkUrl: 'https://t.me/bergenvolonterchat',
      imageUrl: '/images/nettverk/bergen.jpeg',
      title: t('nettverk.chat_bergen'),
    },
  ]

  return (
    <>
      <header className="header">
        <div className="header__container">
          <h1 className={`header__title header__title--home ${greatVibes.variable}`}>Nettverk</h1>
        </div>
      </header>
      <main className="project">
        <Breadcrumbs currentPage="Nettverk" lng={lng} path="projects/nettverk" />
        <p className="project__paragraph">{t('nettverk.intro')}</p>
        <p className="project__paragraph">{t('nettverk.rules')}</p>
        <ul className="project__list">
          <li className="project__list-item">{t('nettverk.rule1')}</li>
          <li className="project__list-item">{t('nettverk.rule2')}</li>
          <li className="project__list-item">{t('nettverk.rule3')}</li>
          <li className="project__list-item">{t('nettverk.rule4')}</li>
        </ul>

        <div className="projects__grid">
          {chatCards.map((project) => (
            <Card key={project.id} project={project} imageClassName="h-44" />
          ))}
        </div>
      </main>
      <Footer />
    </>
  )
}
