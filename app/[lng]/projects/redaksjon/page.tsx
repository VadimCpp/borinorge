import Image from 'next/image'
import Link from 'next/link'
import { greatVibes } from '../../../fonts'
import { useTranslation } from '../../../i18n'
import { Breadcrumbs } from '../../components/breadcrumbs'
import { Footer } from '../../components/footer'

export default async function Redaksjon({ params: { lng } }: { params: { lng: string } }) {
  const { t } = await useTranslation(lng)

  return (
    <>
      <header className="header">
        <div className="header__container">
          <h1 className={`header__title header__title--home ${greatVibes.variable}`}>{t('redaksjon.title')}</h1>
        </div>
      </header>
      <main className="project">
        <Breadcrumbs currentPage={t('redaksjon.title')} lng={lng} path={"projects/redaksjon"} />
        <p className="project__paragraph">{t('redaksjon.description')}</p>
        <p className="project__paragraph">{t('redaksjon.fra-teacher')}</p>
        <p className="project__quote">{t('redaksjon.quote-teacher')}</p>
        <Image
          className="project__image"
          src={"/images/redaksjon/project_1_4.jpeg"}
          alt="Project 1-4"
          width={1200}
          height={742}
          priority
        />
        <Image
          className="project__image"
          src={"/images/redaksjon/project_5_7.jpeg"}
          alt="Project 5-7"
          width={1200}
          height={900}
          priority
        />
        <p className="project__paragraph">{t('redaksjon.campus-reklame')}</p>
        <div className='card mx-8 md:w-1/2 md:mx-auto'>
          <Link href="https://campus.inkrement.no/blogg/Har-du-ukrainske-elever-i-klassen">
            <div className="h-44 rounded overflow-hidden flex justify-center items-center"> 
              <Image
                className="h-full"
                src={"/images/redaksjon/gratis-30dager-illustrasjon.svg"}
                alt="Campus Matte 1-7"
                width={1200}
                height={1200}
                priority
              />
            </div>
            <hr className="mt-2 mb-1" />
            <h3 className="card__title  text-2xl py-1">
              <span className='pl-2'>Campus Matte 1-7</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 inline ml-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </h3>
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
