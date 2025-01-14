import { metadataTranslation } from '../../../i18n'
import { Breadcrumbs } from '../../components/breadcrumbs'
import { Footer } from '../../components/footer'
import Rates from './components/rates'


export default async function Apis({ params: { lng } }: { params: { lng: string } }) {
  const { t } = await metadataTranslation(lng, 'norgesbank')

  return (
    <>
      <header className="header">
        <div className="header__container">
          <h1 className={`header__title header__title--home text-4xl`}>{t("title")}</h1>
        </div>
      </header>
      <main className="project">
        <Breadcrumbs currentPage={t("title")} lng={lng} path={"apis/norgesbank"} />
        <p className='project__paragraph'>{t("about-api")}</p>
        <p className="project__paragraph">{t("exchange-rates")}</p>
        <Rates
          label={t("get-exchange-rates")}
          progressLabel={t('getting-exchange-rate')}
          tableExplanation={t('table-explanation')}
          exchangeDescription={t('exchange-description')}
          examplePrompt1={t('example-link-1')}
          examplePrompt2={t('example-link-2')}
          exchangeLabel={t('exchange-label')}
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
