import Image from 'next/image'
import { greatVibes } from '../../../fonts'
import { useTranslation } from '../../../i18n'
import { Breadcrumbs } from '../../components/breadcrumbs'
import { Contacts } from '../../components/contacts'
import { Footer } from '../../components/footer'

export default async function Olena({ params: { lng } }: { params: { lng: string } }) {
  const { t } = await useTranslation(lng, 'olena')

  return (
    <>
      <header className="header">
        <div className="header__container">
          <h1 className={`header__title header__title--home ${greatVibes.variable}`}>{t('olena-varlamova')}</h1>
        </div>
      </header>
      <main className="project">
        <Breadcrumbs currentPage={t('olena-varlamova')} lng={lng} />
        <Image
          className="project__image"
          src={"/images/folk/avatar-olena-varlamova.jpeg"}
          alt="Olena Varlamova"
          width={640}
          height={640}
          priority
        />
        <p className="project__quote">
          {t('quote-olena')}
        </p>
        <Contacts
          lng={lng}
          nameSlug={t('olena-varlamova')}
          instagram={"https://www.instagram.com/olena_varlamova/"} 
          linkedin={"https://www.linkedin.com/in/olenavarlamova/"}
          isHome
        />
      </main>
      <Footer />
    </>
  )
}
