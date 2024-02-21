import Link from 'next/link'
import { useTranslation } from '../../../i18n'

interface ContactsProps {
  lng: string,
  nameSlug: string,
  instagram: string,
  linkedin: string,
  isHome?: boolean,
}

export async function Contacts(props: ContactsProps) {
  const { t } = await useTranslation(props.lng, 'contacts')
  

  return (
    <div className={props.isHome ? "contacts contacts--home" : "contacts"}>
      <p>{t(props.nameSlug)}:</p>
      <Link href={props.linkedin} className="contacts__link">
        LinkedIn
      </Link>
      <span>,</span>
      <Link href={props.instagram} className="contacts__link">
        Instagram
      </Link>
    </div>
  );
}
