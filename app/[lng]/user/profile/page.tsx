import { greatVibes } from '../../../fonts'
import { useTranslation } from '../../../i18n'
import { Breadcrumbs } from '../../components/breadcrumbs'
import { Footer } from '../../components/footer'
import SignOutButton from './signout-button'

export default async function Profile({ params: { lng } }: { params: { lng: string } }) {
  const { t } = await useTranslation(lng)

  return (
    <>
      <header className="header">
        <div className="header__container">
          <h1 className={`header__title header__title--home ${greatVibes.variable}`}>{t('user.profile.title')}</h1>
        </div>
      </header>
      <main className="project">
        <Breadcrumbs currentPage={t('user.profile.title')} lng={lng} path={`user/profile`} />
        <p className="project__paragraph">{t('coming-soon')}</p>
        <div className='target-action'>
          <SignOutButton label={t('user.profile.sign-out')} lng={lng} />
        </div>
      </main>
      <Footer />
    </>
  )
}
