import Link from 'next/link';

interface BreadcrumbsProps {
  currentPage: string;
  lng: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ currentPage, lng }) => {
  return (
    <nav aria-label="breadcrumbs" className="body-font pb-4">
      <ol className="flex leading-none divide-x divide-indigo-400">
        <li className="pr-4 text-indigo-600">
          <Link href={`/${lng}`}>
            Borinorge
          </Link>
        </li>
        <li className="px-4 text-gray-800">
          <span>{currentPage}</span>
        </li>
      </ol>
    </nav>
  );
};
