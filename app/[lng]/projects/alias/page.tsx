import Image from 'next/image'
import { greatVibes } from '../../../fonts'
import { useTranslation } from '../../../i18n'
import { Breadcrumbs } from '../../components/breadcrumbs'
import { Contacts } from '../../components/contacts'
import { Footer } from '../../components/footer'

export default async function Alias({ params: { lng } }: { params: { lng: string } }) {
  const { t } = await useTranslation(lng, 'alias')

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
        <Image
          className="project__image"
          src={"/images/alias/alias_oksana.jpeg"}
          alt="Oksana Donets"
          width={1200}
          height={800}
          priority
        />
        <p className="project__quote">
          {t('quote')}
        </p>

        <div className="photogrid">
          <Image
            className="photogrid__image"
            src={"/images/alias/alias_oksana_olena.jpeg"}
            alt="Oksana Donets"
            width={2560}
            height={1637}
            priority
          />
          <Image
            className="photogrid__image"
            src={"/images/alias/alias_iryna.jpeg"}
            alt="Iryna Nepotenko"
            width={959}
            height={1280}
            priority
          />
        </div>
        
        <h2 className="project__subtitle">{t('contact-us')}</h2>
        <Contacts
          lng={lng}
          nameSlug={'oksana-donets'}
          instagram={"https://www.instagram.com/oksanadonets.no/"} 
          linkedin={"https://www.linkedin.com/in/oksana-donets/"}
        />
        <Contacts
          lng={lng}
          nameSlug={'olena-varlamova'}
          instagram={"https://www.instagram.com/olena_varlamova/"} 
          linkedin={"https://www.linkedin.com/in/olenavarlamova/"}
        />
      </main>
      <Footer />
    </>
  )
}
