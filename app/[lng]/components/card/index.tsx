import Link from 'next/link'
import Image from 'next/image'

export interface Project {
  id: string
  title: string
  imageUrl: string
  linkUrl: string
}

interface CardProps {
  project: Project
  imageClassName?: string
}

export function Card({ project, imageClassName }: CardProps) {
  return (
    <div className="break-inside-avoid">
      <section className="card">
        <Link href={project.linkUrl}>
          <div className={`rounded overflow-hidden flex justify-center items-center `}>
            <Image
              className={`w-full mb-4 mt-2 rounded-xs ${imageClassName}`}
              src={project.imageUrl}
              alt={project.title}
              width={1200}
              height={1200}
              priority
            />
          </div>
          <hr className="mt-2 mb-1" />
          <h3 className="card__title text-2xl py-1">
            <span className="pl-2">{project.title}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6 inline ml-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </h3>
        </Link>
      </section>
    </div>
  )
}
