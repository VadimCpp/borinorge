import Image from 'next/image'
import { greatVibes } from '../../../fonts'
import { useTranslation } from '../../../i18n'
import { Breadcrumbs } from '../../components/breadcrumbs'
import { Contacts } from '../../components/contacts'
import { Footer } from '../../components/footer'

export default async function Vadym({ params: { lng } }: { params: { lng: string } }) {
  const { t } = await useTranslation(lng, 'vadym')

  return (
    <>
      <header className="header">
        <div className="header__container">
          <h1 className={`header__title header__title--home ${greatVibes.variable}`}>{t('vadym-kaninskyi')}</h1>
        </div>
      </header>
      <main className="project">
        <Breadcrumbs currentPage={t('vadym-kaninskyi')} lng={lng} />
        <Image
          className="project__image"
          src={"/images/folk/avatar-vadym-kaninskyi.jpeg"}
          alt="Vadym Kaninskyi"
          width={640}
          height={640}
          priority
        />
        <p className="project__quote">
          {t('quote-vadym')}
        </p>
        <Contacts
          lng={lng}
          nameSlug={t('vadym-kaninskyi')}
          instagram={"https://www.instagram.com/vadym_kaninskyi/"} 
          linkedin={"https://www.linkedin.com/in/vadym-kaninskyi/"}
          isHome
        />
      </main>
      <Footer />
    </>
  )
}
