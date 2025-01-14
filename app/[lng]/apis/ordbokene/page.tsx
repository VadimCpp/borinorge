import { metadataTranslation } from '../../../i18n'
import { Breadcrumbs } from '../../components/breadcrumbs'
import { Footer } from '../../components/footer'
import Rates from './components/wrap'

export default async function OrdbokeneApi({ params: { lng } }: { params: { lng: string } }) {
  const { t } = await metadataTranslation(lng, 'ordbokene-api')

  return (
    <>
      <header className="header">
        <div className="header__container">
          <h1 className={`header__title header__title--home text-4xl`}>{t("title")}</h1>
        </div>
      </header>
      <main className="project">
        <Breadcrumbs currentPage={t("title")} lng={lng} path={"apis/ordbokene"}/>
        <p className='project__paragraph'>{t("about-api")}</p>
        <p className='project__paragraph'>{t("about-api-2")}</p>
        <Rates
          label={t("label-test")}
          requestDescription={t('request-description')}
          testLabel={t('test-label')}
          randomLabel={t('random-label')}
          unexpectedError={t('unexpected-error')}
          placeholder1={t('placeholder1')}
          placeholder2={t('placeholder2')}
          authorInfo={t('author-info')}
          contactUs={t('contact-us')}
        />
      </main>
      <Footer />
    </>
  )
}
