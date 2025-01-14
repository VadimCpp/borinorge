import Image from 'next/image'
import { greatVibes } from '../../../fonts'
import { useTranslation } from '../../../i18n'
import { Breadcrumbs } from '../../components/breadcrumbs'
import { Contacts } from '../../components/contacts'
import { Footer } from '../../components/footer'

export default async function ItKunnskap({ params: { lng } }: { params: { lng: string } }) {
  const { t } = await useTranslation(lng, 'it-kunnskap')

  return (
    <>
      <header className="header">
        <div className="header__container">
          <h1 className={`header__title header__title--home ${greatVibes.variable}`}>{t('title')}</h1>
        </div>
      </header>
      <main className="project">
        <Breadcrumbs currentPage={t('title')} lng={lng} path={"prosjects/it-kunnskap"} />
        <p className="project__paragraph p-0">{t('fra-oksana')}</p>
        <Image
          className="project__image p-0 pt-4"
          src="/images/it-kunnskap/oksana-donets.jpeg"
          alt="Oksana Donets"
          width={1400}
          height={933}
          priority
        />
        <p className="project__quote">{t('quote-oksana')}</p>
        
        <h2 className="project__subtitle pt-8">
          1. {t('video-1')}
        </h2>
        <ul className="project__list">
          <li className="project__list-item">{t('question-1-1')}</li>
          <li className="project__list-item">{t('question-1-2')}</li>
          <li className="project__list-item">{t('question-1-3')}</li>
        </ul>
        <iframe 
          width="100%"
          height="310"
          src="https://www.youtube.com/embed/LzO9Qe7A4DI?si=V6TpxYc4_uldZ2-h"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen>  
        </iframe>
      
        <h2 className="project__subtitle pt-8">
          2. {t('video-2')}
        </h2>
        <ul className="project__list">
          <li className="project__list-item">{t('question-2-1')}</li>
          <li className="project__list-item">{t('question-2-2')}</li>
          <li className="project__list-item">{t('question-2-3')}</li>
        </ul>
        <iframe 
          width="100%"
          height="310"
          src="https://www.youtube.com/embed/i0J6cc2XwNI?si=6Opiz_aHpETx8VHo"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen>  
        </iframe>

        <h2 className="project__subtitle pt-8">
          3. {t('video-3')}
        </h2>
        <ul className="project__list">
          <li className="project__list-item">{t('question-3-1')}</li>
          <li className="project__list-item">{t('question-3-2')}</li>
          <li className="project__list-item">{t('question-3-3')}</li>
        </ul>
        <iframe 
          width="100%"
          height="310"
          src="https://www.youtube.com/embed/mIasbVp9Klg?si=KAJji1Y3WKwI0MNd"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen>  
        </iframe>

        <h2 className="project__subtitle pt-8">
          4. {t('video-4')}
        </h2>
        <ul className="project__list">
          <li className="project__list-item">{t('question-4-1')}</li>
          <li className="project__list-item">{t('question-4-2')}</li>
          <li className="project__list-item">{t('question-4-3')}</li>
        </ul>
        <iframe 
          width="100%"
          height="310"
          src="https://www.youtube.com/embed/TDvadQ6nqCQ?si=WMjRF71-GrnsRfIz"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen>  
        </iframe>
        <h2 className="project__subtitle pt-8">{t('contact-us')}</h2>
        <Contacts
          lng={lng}
          nameSlug={'oksana-donets'}
          instagram={"https://www.instagram.com/oksanadonets.no/"} 
          linkedin={"https://www.linkedin.com/in/oksana-donets/"}
        />
      </main>
      <Footer />
    </>
  )
}
