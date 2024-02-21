import Image from 'next/image'
import { greatVibes } from '../../../fonts'
import { useTranslation } from '../../../i18n'
import { Breadcrumbs } from '../../components/breadcrumbs'
import { Contacts } from '../../components/contacts'
import { Footer } from '../../components/footer'

export default async function Oksana({ params: { lng } }: { params: { lng: string } }) {
  const { t } = await useTranslation(lng, 'oksana')

  return (
    <>
      <header className="header">
        <div className="header__container">
          <h1 className={`header__title header__title--home ${greatVibes.variable}`}>{t('oksana-donets')}</h1>
        </div>
      </header>
      <main className="project">
        <Breadcrumbs currentPage={t('oksana-donets')} lng={lng} />
        <Image
          className="project__image"
          src={"/images/folk/avatar-oksana-donets.jpeg"}
          alt="Oksana Donets"
          width={640}
          height={640}
          priority
        />
        <p className="project__quote">
          {t('quote-oksana')}
        </p>
        <Contacts
          lng={lng}
          nameSlug={t('oksana-donets')}
          instagram={"https://www.instagram.com/oksanadonets.no/"} 
          linkedin={"https://www.linkedin.com/in/oksana-donets/"}
          isHome
        />
      </main>
      <Footer />
    </>
  )
}
