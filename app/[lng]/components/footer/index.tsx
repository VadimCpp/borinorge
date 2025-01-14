import Link from "next/link"
import { useTranslation } from '../../../i18n'

type FooterProps = {
  yrLicence?: boolean
  lng?: string
}

export const Footer = async (props: FooterProps) => {
  const { yrLicence, lng } = props 
   const { t } = await useTranslation(lng || 'en')

  return (
    <footer className="bg-gray-800 p-4 pt-8 pb-12">
      <div className="text-gray-200 max-w-md mx-auto overflow-hidden md:max-w-2xl">
        {yrLicence &&
          <>
            <p className="font-thin">
              {t('footer.weather_data')}:{" "}
              <Link
                href="https://www.met.no"
                className="border-b border-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                MET Norway
              </Link>{" "}
              (
              <Link
                href="https://www.yr.no"
                className="border-b border-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                yr.no
              </Link>
              ).
            </p>
            <p className="font-thin pb-8">
              {t('footer.icons')}: © 2015{" "}
              Yr/<Link
                href="https://www.nrk.no"
                className="border-b border-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                NRK
              </Link>{" "}
              {t('footer.under_the')} {" "}
              <Link
                href="https://creativecommons.org/licenses/by/4.0/"
                className="border-b border-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                CC BY 4.0
              </Link>
              .
            </p>
          </>
        }
        <p className="font-semibold text-center">
          2022-2025 © Vi bor i Norge
        </p>
      </div>
    </footer>
  )
}
