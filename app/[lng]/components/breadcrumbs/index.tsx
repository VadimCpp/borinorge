import Link from 'next/link'
import Dropdown from '../dropdown'
import { languages, verboseLanguages } from '../../../i18n/settings'

interface BreadcrumbsProps {
  currentPage: string
  lng: string
  path?: string
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ currentPage, path, lng }) => {
  return (
    <nav aria-label="breadcrumbs" className="body-font pb-4 flex flex-wrap relative">
      <ol className="flex pt-1 leading-none divide-x divide-indigo-400">
        <li className="pr-4 text-indigo-600">
          <Link href={`/${lng}`}>
            Borinorge
          </Link>
        </li>
        <li className="px-4 text-gray-800">
          <span className=''>{currentPage}</span>
        </li>
      </ol>

      <div className='absolute right-0 top-0'>
        <Dropdown
          title={`${lng.toUpperCase()} ↓`}
          titleClassName="float-right"
        >
          {languages.filter((l) => lng !== l).map((l) => (
            <div key={l} className="p-2 hover:bg-gray-100">
              <Link href={path ? `/${l}/${path}` : `/${l}`} className="header__nav-link">
                {verboseLanguages[l]}
              </Link>
            </div>
          ))}
        </Dropdown>
      </div>
    </nav>
  );
};
