import { greatVibes } from '../../../fonts'
import { useTranslation } from '../../../i18n'
import { Breadcrumbs } from '../../components/breadcrumbs'
import { Footer } from '../../components/footer'
import SignUpForm from './signup-form'
import Link from 'next/link'

export default async function SignUp({ params: { lng } }: { params: { lng: string } }) {
  const { t } = await useTranslation(lng, 'signup')

  return (
    <>
      <header className="header">
        <div className="header__container">
          <h1 className={`header__title header__title--home ${greatVibes.variable}`}>{t('title')}</h1>
        </div>
      </header>
      <main className="project">
        <Breadcrumbs currentPage={t('title')} lng={lng} path={`user/signup`} />
        <SignUpForm
          lng={lng}
          labels={{
            username: t('username'),
            password: t('password'),
            submit: t('submit'),
          }}
        />
        <div className="target-action mt-4">
          <Link href={`/${lng}/user/signin`} className="target-action__link">
            {t('sign-in')}
          </Link>
        </div>
      </main>
      <Footer lng={lng} />
    </>
  )
}
