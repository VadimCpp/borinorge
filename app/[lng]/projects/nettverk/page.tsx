import Image from 'next/image'
import Link from 'next/link'
import { greatVibes } from '../../../fonts'
import { useTranslation } from '../../../i18n'
import { Breadcrumbs } from '../../components/breadcrumbs'
import { Footer } from '../../components/footer'

export default async function Nettverk({ params: { lng } }: { params: { lng: string } }) {
  const { t } = await useTranslation(lng)

  return (
    <>
      <header className="header">
        <div className="header__container">
          <h1 className={`header__title header__title--home ${greatVibes.variable}`}>Nettverk</h1>
        </div>
      </header>
      <main className="project">
        <Breadcrumbs currentPage="Nettverk" lng={lng} path="projects/nettverk" />
        <p className="project__paragraph">{t('nettverk.intro')}</p>
        <p className="project__paragraph">{t('nettverk.rules')}</p>
        <ul className="project__list">
          <li className="project__list-item">{t('nettverk.rule1')}</li>
          <li className="project__list-item">{t('nettverk.rule2')}</li>
          <li className="project__list-item">{t('nettverk.rule3')}</li>
          <li className="project__list-item">{t('nettverk.rule4')}</li>
        </ul>

        <div className="projects__grid">
          <div className='break-inside-avoid'>
            <section className='card'>
              <Link href="https://t.me/oslouk">
                <div className="h-44 rounded overflow-hidden flex justify-center items-center"> 
                  <Image
                    className="w-full"
                    src={"/images/nettverk/oslo.jpeg"}
                    alt="Nettverk i Oslo"
                    width={1200}
                    height={1200}
                    priority
                  />
                </div>
                <hr className="mt-4 mb-2" />
                <h3 className="card__title py-2">
                  <span className='pl-2'>{t('nettverk.chat_oslo')}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 inline ml-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </h3>
              </Link>
            </section>
          </div>

          <div className='break-inside-avoid'>
            <section className='card'>
              <Link href="https://t.me/bergenvolonterchat">
                <div className="h-44 rounded overflow-hidden flex justify-center items-center"> 
                  <Image
                    className="w-full"
                    src={"/images/nettverk/bergen.jpeg"}
                    alt="Nettverk i Bergen"
                    width={1200}
                    height={1200}
                    priority
                  />
                </div>
                <hr className="mt-4 mb-2" />
                <h3 className="card__title py-2">
                  <span className='pl-2'>{t('nettverk.chat_bergen')}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 inline ml-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </h3>
              </Link>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
