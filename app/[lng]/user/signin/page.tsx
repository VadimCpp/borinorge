import { greatVibes } from '../../../fonts'
import { useTranslation } from '../../../i18n'
import { Breadcrumbs } from '../../components/breadcrumbs'
import { Footer } from '../../components/footer'
import SignInForm from './signin-form'
import Link from 'next/link'

export default async function SignIn({ params: { lng } }: { params: { lng: string } }) {
  const { t } = await useTranslation(lng, 'signin')

  return (
    <>
      <header className="header">
        <div className="header__container">
          <h1 className={`header__title header__title--home ${greatVibes.variable}`}>{t('title')}</h1>
        </div>
      </header>
      <main className="project">
        <Breadcrumbs currentPage={t('title')} lng={lng} path={`user/signin`} />
        <SignInForm
          lng={lng}
          labels={{
            username: t('username'),
            password: t('password'),
            submit: t('submit'),
          }}
        />
        <div className="target-action mt-4">
          <Link href={`/${lng}/user/signup`} className="target-action__link">
            {t('sign-up')}
          </Link>
        </div>
      </main>
      <Footer lng={lng} />
    </>
  )
}
