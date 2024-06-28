import Link from 'next/link'
import { greatVibes } from '../../../fonts'
import { Footer } from '../../components/footer'
import RedirectComponent from './redirect'

export default async function Kazka() {
  return (
    <>
      <header className="header">
        <div className="header__container">
          <h1 className={`header__title ${greatVibes.variable}`}>{"Казка"}</h1>
        </div>
      </header>
      <main className="project">
        {/* <RedirectComponent url="https://forms.gle/CNyU7VUKQdnKhE318" /> */}
        <p className="project__paragraph">
          📚🇳🇴 Школа норвезької мови Karense «NoTe» та російськомовне товариство «Казка» організовують безкоштовні курси норвезької мови для членів товариства за програмою Kompetansepluss frivillighet.
        </p>
        <p className="project__paragraph">
          📅 Літня інтенсивна онлайн група з 24 червня до початку вересня. Заняття онлайн 2 рази на тиждень з 10:00 до 13:00, а в липні — 3 рази на тиждень. Викладатиме Марія з школи NoTe, яка говорить українською та російською.
        </p>
        <div className="target-action text-red">
          {/* <Link href="https://forms.gle/CNyU7VUKQdnKhE318" className="target-action__link"> */}
            Реєстрація на курс закрита
          {/* </Link> */}
        </div>
      </main>
      <Footer />
    </>
  )
}
