import Link from 'next/link'
import { useTranslation } from '../../i18n'
import { languages, verboseLanguages } from '../../i18n/settings'
import Dropdown from '../components/dropdown'
import { Footer } from '../components/footer'
import WeatherFetcher from './components/weather-fetcher'

export default async function Weather({ params: { lng } }: { params: { lng: string } }) {
  const { t } = await useTranslation(lng)

  return (
    <>
      <header className="header">
        <div className="container mx-auto px-4">
          <h1 className="header__title header__title--home text-left pb-0 mb-4">{t("weather.title")}</h1>
          <p className="font-thin text-left pt-0 mt-0 relative">{t("weather.description")}</p>
          <div className='mb-4 pt-4 z-20 relative'>
            <Dropdown
              title={`${lng.toUpperCase()} ↓`}
              titleClassName="float-right"
            >
              {languages.filter((l) => lng !== l).map((l) => (
                <div key={l} className="p-2 hover:bg-gray-100">
                  <Link href={`/${l}/weather`} className="header__nav-link">
                    {verboseLanguages[l]}
                  </Link>
                </div>
              ))}
            </Dropdown>
          </div>
        </div>
      </header>
      <main className='min-h-96 relative bg-white'>
        <div className='bg-gradient-to-b from-blue-200 to-white w-full h-56 absolute top-0 left-0 z-0'>
          {/* Empty block */}
        </div>
        <div className='relative z-10'>
          <WeatherFetcher
            locales={{
              lang: lng,
              feels_like: t("weather.feels_like"),
              precipitation: t("weather.precipitation"),
              wind: t("weather.wind"),
              locationErrors: {
                user_denied_the_request_for_geolocation: t("weather.location_errors.user_denied_the_request_for_geolocation"),
                location_information_is_unavailable: t("weather.location_errors.location_information_is_unavailable"),
                the_request_to_get_user_location_timed_out: t("weather.location_errors.the_request_to_get_user_location_timed_out"),
                browser_location_services_disabled: t("weather.location_errors.browser_location_services_disabled"),
                browser_permissions_services_unavailable: t("weather.location_errors.browser_permissions_services_unavailable"),
                an_unknown_error_occurred: t("weather.location_errors.an_unknown_error_occurred"),
              },
              try_again: t("weather.try_again"),
              manual_or_automatically: t("weather.manual_or_automatically"),
              detect_my_location: t("weather.detect_my_location"),
              enter_location_manually: t("weather.enter_location_manually"),
              enter_norwegian_address: t("weather.enter_norwegian_address"),
              manual_location_error: t("weather.manual_location_error"),
            }}
          />
        </div>
      </main>
      <Footer yrLicence={true} lng={lng} />
    </>
  )
}
