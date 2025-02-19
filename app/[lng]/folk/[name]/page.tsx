import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { greatVibes } from '../../../fonts'
import { useTranslation } from '../../../i18n'
import { Breadcrumbs } from '../../components/breadcrumbs'
import { Contacts } from '../../components/contacts'
import { Footer } from '../../components/footer'
import { Card } from '../../components/card'
import { FOLKS, Folk, folksMapping } from './_mappings'

type Props = {
  params: {
    name: string
    lng: string
  }
}

export default async function FolkPage({ params: { lng, name } }: Props) {
  const { t } = await useTranslation(lng)
  
  const dude = name as Folk
  const folkExists = FOLKS.includes(dude);
  if (!folkExists) {
    return notFound()
  }

  return (
    <>
      <header className="header">
        <div className="header__container">
          <h1 className={`header__title header__title--home ${greatVibes.variable}`}>{t(`folk.${name}.name`)}</h1>
        </div>
      </header>
      <main className="project">
        <Breadcrumbs currentPage={t(`folk.${name}.name`)} lng={lng} path={`folk/${name}`} />
        { dude !== 'oksana' && (
          <>
            <Image
              className="project__image"
              src={folksMapping[dude].image.src}
              alt={t(`folk.${name}.name`)}
              width={640}
              height={640}
              priority
            />
            <p className="project__quote">
              {t(`folk.${name}.quote`)}
            </p>
            <section className='mb-8'>
              {/* TODO: create 'contacts' in i18n and use it instead of 'folk.oksana.contactsTitle' */}
              <h2 className="project__subtitle">{t('folk.oksana.contactsTitle')}</h2>
              <Contacts
                lng={lng}
                nameSlug={t(`folk.${name}.name`)}
                instagram={folksMapping[dude].contacts.instagram} 
                linkedin={folksMapping[dude].contacts.linkedin}
                isHome={false}
              />
            </section>
            <section>
              <h2 className="project__subtitle">{t('projects')}</h2>
              <div className="projects__grid mt-4">
                {folksMapping[dude].projects.map(project => {
                  return {
                    id: project.id,
                    title: t(project.titleSlug),
                    imageUrl: project.imageUrl,
                    linkUrl: `/${lng}/${project.id}`,
                  }
                }).map((project) => (
                  <Card
                    key={project.id}
                    project={project}
                  />
                ))}
              </div>
            </section>
          </>
        )}
        { dude === 'oksana' && (
          <>
            <section>
              <Image
                className="project__image"
                src={folksMapping[dude].image.src}
                alt={t(`folk.${name}.name`)}
                width={640}
                height={640}
                priority
              />
              <p className="project__paragraph mt-2">
                {t('folk.oksana.introduction')}
              </p>
            </section>
            <div className="projects__grid">
              <div className='break-inside-avoid'>
                <section className='card'>
                  <Link href="https://t.me/denukrainskeavisa">
                    <div className="h-44 rounded overflow-hidden flex justify-center items-center"> 
                      <Image
                        className="w-full"
                        src={"/images/folk/ukrainian_newspaper.jpeg"}
                        alt={t('folk.oksana.ukranianNewspaper')}
                        width={1200}
                        height={1200}
                        priority
                      />
                    </div>
                    <hr className="mt-2 mb-1" />
                    <h3 className="card__title text-2xl py-1">
                      <span className='pl-2'>{t('folk.oksana.ukranianNewspaper')}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 inline ml-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg>
                    </h3>
                  </Link>
                </section>
              </div>
            </div>
            <section>
              <h2 className="project__subtitle">{t('folk.oksana.valuesTitle')}</h2> 
              <ol className="project__list">
                <li className="project__list-item">
                  {t('folk.oksana.values.objectivity')}
                </li>
                <li className="project__list-item">
                  {t('folk.oksana.values.analysis')}
                </li>
                <li className="project__list-item">
                  {t('folk.oksana.values.adaptability')}
                </li>
                <li className="project__list-item">
                  {t('folk.oksana.values.ethics')}
                </li>
              </ol>
            </section>
            <section>
              <h2 className="project__subtitle">{t('folk.oksana.experienceTitle')}</h2>
              <ol className="project__list">
                <li className="project__list-item">{t('folk.oksana.experienceItems.0')}</li>
                <li className="project__list-item">{t('folk.oksana.experienceItems.1')}</li>
                <li className="project__list-item">{t('folk.oksana.experienceItems.2')}</li>
              </ol>
            </section>
            <section className='mb-8'>
              <h2 className="project__subtitle">{t('folk.oksana.contactsTitle')}</h2>
              <Contacts
                lng={lng}
                nameSlug={t(`folk.${name}.name`)}
                instagram={folksMapping[dude].contacts.instagram} 
                linkedin={folksMapping[dude].contacts.linkedin}
                isHome={false}
              />
              <p className="project__paragraph mt-4">
                {t('folk.oksana.supportDescription')}
              </p>
              <div className="projects__grid">
                <div className='break-inside-avoid'>
                  <section className='card'>
                    <Link href="https://buy.stripe.com/14k6qL3JR30lbZe6oq">
                      <div className="h-44 rounded overflow-hidden flex justify-center items-center"> 
                        <Image
                          className="w-full"
                          src={"/images/folk/digital_coffee.jpeg"}
                          alt={t('folk.oksana.supportTitle')}
                          width={1200}
                          height={1200}
                          priority
                        />
                      </div>
                      <hr className="mt-2 mb-1" />
                      <h3 className="card__title  text-2xl py-1">
                        <span className='pl-2'>{t('folk.oksana.supportTitle')}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 inline ml-2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                        </svg>
                      </h3>
                    </Link>
                  </section>
                </div>
              </div>
            </section>
            <section>
              <h2 className="project__subtitle">{t('folk.oksana.otherProjectsTitle')}</h2>
              <div className="projects__grid mt-4">
                {[
                  {
                    id: 'projects/ordbokene',
                    title: t('project-ordbokene'),
                    imageUrl: '/images/preview/ordbokene_1200_630_v3.jpeg',
                    linkUrl: `/${lng}/projects/ordbokene`,
                  },
                  {
                    id: 'norsklett',
                    title: t('project-norsklett'),
                    imageUrl: '/images/preview/norsklett_1200_630.jpeg',
                    linkUrl: `/${lng}/norsklett`,
                  },
                  {
                    id: 'alias',
                    title: t('project-alias'),
                    imageUrl: '/images/preview/alias_1200_630.jpeg',
                    linkUrl: `/${lng}/alias`,
                  },
                ].map((project) => (
                  <Card
                    key={project.id}
                    project={project}
                  />
                ))}
              </div>
            </section>
          </>
        )}
      </main>
      <Footer />
    </>
  )
}
