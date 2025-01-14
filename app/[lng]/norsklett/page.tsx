import Link from 'next/link'
import { useTranslation } from '../../i18n'
import { languages, verboseLanguages } from '../../i18n/settings'
import Dropdown from '../components/dropdown'
import Sources from './components/sources'
import { NorskResource } from './types'
import { NORSK_RESOURCE_NAMES } from './constants'

export default async function ChatNorsklett({ params: { lng } }: { params: { lng: string } }) {
  const { t } = await useTranslation(lng)

  const resources: Array<NorskResource> = []
  NORSK_RESOURCE_NAMES.map((item) => {
    resources.push({
      slug: item,
      title: t(`norsklett.${item}.title`),
      description: t(`norsklett.${item}.description`),
      link: t(`norsklett.${item}.link`),
      author: t(`norsklett.${item}.author`)
    })
  })

  return (
    <>
      <header className="header">
        <div className="container mx-auto px-4">
          <h1 className="header__title header__title--home text-left pb-0 mb-4">{t("norsklett.norsklett")}</h1>
          <p className="font-thin text-left pt-0 mt-0 relative">{t("norsklett.description")}</p>
          <div className='mb-4 pt-4'>
            <Dropdown
              title={`${lng.toUpperCase()} ↓`}
              titleClassName="float-right"
            >
              {languages.filter((l) => lng !== l).map((l) => (
                <div key={l} className="p-2 hover:bg-gray-100">
                  <Link href={`/${l}/norsklett`} className="header__nav-link">
                    {verboseLanguages[l]}
                  </Link>
                </div>
              ))}
            </Dropdown>
          </div>
        </div>
      </header>
      <main className='pt-8'>
        <Sources
          resources={resources}
          labels={{
            "total-resources": t("norsklett.total-resources"),
            "filter-description": t("norsklett.filter-description"),
            "found-resources": t("norsklett.found-resources"),
            "out-of": t("norsklett.out-of"),
            "created-by": t("norsklett.created-by"),
            "reading": t("norsklett.reading"),
            "listening": t("norsklett.listening"),
            "writing": t("norsklett.writing"),
            "oral": t("norsklett.oral")
          }}
        />
      </main>

        {/* <hr className="mb-40 mt-40" /> */}

        {/* <h2 className="project__subtitle text-center pt-12">Телеграм чат</h2> */}

        {/* 
        <div className="md:grid md:grid-cols-2">
          <div className='md:hover:bg-gray-100 md:px-4 md:rounded-xl'>

            <h3 className="project__subtitle text-xl">📣 Объявления</h3>
            <p className="project__paragraph">
              В разделе «Объявления» вы найдете информацию о предстоящих мероприятиях
              и других событиях, связанных с работой группы. Разговорные кафе, конкурсы,
              встречи и другие мероприятия. Будь в курсе, чтобы ничего не пропустить!
            </p>
            <div className="target-action pt-0 mt-0 md:justify-start">
              <Link href="https://t.me/NorskLett/839" className="target-action__link">
                Norsklett — Объявления
              </Link>
            </div>
          </div>

          <div className='md:hover:bg-gray-100 md:px-4 md:rounded-xl'>
            <h3 className="project__subtitle text-xl">💬 Болталка и помощь</h3>
            <p className="project__paragraph">
              В разделе «Болталка и помощь» можно всё:
              задавать любые вопросы, обращаться за помощью, болтать по-норвежски.
            </p>
            <div className="target-action pt-0 mt-0 md:justify-start">
              <Link href="https://t.me/NorskLett/835" className="target-action__link">
                Norsklett — Болталка и помощь
              </Link>
            </div>
          </div>

          <div className='md:hover:bg-gray-100 md:px-4 md:rounded-xl'>
            <h3 className="project__subtitle text-xl">🤖 БОТ</h3>
            <p className="project__paragraph">
              Бот предназначен для ответов на вопросы по норвежскому языку.
              Бот умеет выполнять перевод, исправлять тексты и подборать слова по теме.
              Качество ответа зависит
              от точности формулировки запроса. Бот менее эффективен в
              вопросах грамматики и не понимает продолжения диалога без отсылки
              к предыдущим сообщениям. Он также не разбирается в языковых уровнях,
              но можно задать параметры текста, такие как простота, длина и
              ключевые слова.
            </p>
            <div className="target-action pt-0 mt-0 md:justify-start">
              <Link href="https://t.me/NorskLett/9016" className="target-action__link">
                Norsklett — БОТ
              </Link>
            </div>
          </div>

          <div className='md:hover:bg-gray-100 md:px-4 md:rounded-xl'>
            <h3 className="project__subtitle text-xl">🗣 Online språkkafe</h3>
            <p className="project__paragraph">
              Раздел «Online språkkafe» — это онлайн-пространство для общения на норвежском языке
              через аудиозаписи или групповые звонки, где участники могут обсуждать разные темы,
              делиться знаниями и практиковать язык. Организаторы мероприятия регулярно
              собирают людей.
            </p>
            <div className="target-action pt-0 mt-0 md:justify-start">
              <Link href="https://t.me/NorskLett/1797" className="target-action__link">
                Norsklett — Online språkkafe
              </Link>
            </div>
          </div>

          <div className='md:hover:bg-gray-100 md:px-4 md:rounded-xl'>
            <h3 className="project__subtitle text-xl">📆 Dagens ord</h3>
            <p className="project__paragraph">
              В раздел «Dagens ord» каждый день публикуется одно слово с переводом
              и пример его употребления. Приглашаем потренироваться и составить примеры
              с этим словом в комментариях! Отличная практика.
            </p>
            <div className="target-action pt-0 mt-0 md:justify-start">
              <Link href="https://t.me/NorskLett/54176" className="target-action__link">
                Norsklett — Dagens ord
              </Link>
            </div>
          </div>

          <div className='md:hover:bg-gray-100 md:px-4 md:rounded-xl'>
            <h3 className="project__subtitle text-xl">✍️ Грамматика</h3>
            <p className="project__paragraph">
              Раздел «Грамматика» предоставляет материалы по грамматике,
              организованные от простого к сложному.
              В тексте присутствуют хэштеги для различных грамматических категорий.
            </p>
            <div className="target-action pt-0 mt-0 md:justify-start">
              <Link href="https://t.me/NorskLett/25" className="target-action__link">
                Norsklett — Грамматика
              </Link>
            </div>
          </div>

          <div className='md:hover:bg-gray-100 md:px-4 md:rounded-xl'>
            <h3 className="project__subtitle text-xl">📝 Словарный запас</h3>
            <p className="project__paragraph">
              Раздел «Словарный запас» содержит списки слов по темам, которые
              помогут вам расширить словарный запас. Также раздел содержит списки слов с озвучкой.
            </p>
            <div className="target-action pt-0 mt-0 md:justify-start">
              <Link href="https://t.me/NorskLett/27" className="target-action__link">
                Norsklett — Словарный запас
              </Link>
            </div>
          </div>

          <div className='md:hover:bg-gray-100 md:px-4 md:rounded-xl'>
            <h3 className="project__subtitle text-xl">🎬 Вебинары</h3>
            <p className="project__paragraph">
              Раздел «Вебинары» содержит видео и аудио по грамматике, а также документы к вебинарам. 
            </p>
            <div className="target-action pt-0 mt-0 md:justify-start">
              <Link href="https://t.me/NorskLett/848" className="target-action__link">
                Norsklett — Вебинары
              </Link>
            </div>
          </div>

          <div className='md:hover:bg-gray-100 md:px-4 md:rounded-xl'>
            <h3 className="project__subtitle text-xl">Больше информации</h3>
            <p className="project__paragraph">
              Приглашаем вас в наш телеграм чат, где вы сможете самостоятельно
              исследовать все разделы и получить помощь от участников. До встречи 🤗
            </p>
            <div className="target-action pt-0 mt-0 md:justify-start">
              <Link href="https://t.me/NorskLett" className="target-action__link">
                Norsklett
              </Link>
            </div>
          </div>
        
        </div> */}
    </>
  )
}
