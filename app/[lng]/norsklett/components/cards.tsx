"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { GlobeIcon, MobileIcon, VideoIcon, PaperPlaneIcon } from '@radix-ui/react-icons'
import { NorskResource } from "../types"

interface FilterState {
  levels: string[]
  languages: string[]
  platforms: string[]
}

type CardItem = NorskResource

interface CardsLocales {
  created_by: string
}

interface CardsProps {
  items: CardItem[]
  filter: FilterState
  locales: CardsLocales
}

// Map each platform to its corresponding Radix Icon
const platformIcons: Record<string, JSX.Element> = {
  website: <GlobeIcon className="inline h-4 w-4" />,
  app: <MobileIcon className="inline h-4 w-4" />,
  youtube: <VideoIcon className="inline h-4 w-4" />,
  telegram: <PaperPlaneIcon className="inline h-4 w-4" />,
}

export default function Cards({ items, filter, locales }: CardsProps) {
  const pathname = usePathname()

  // Get last part of the URL path (used to scroll to a card if needed)
  const getLastWordAfterSlash = (path: string) => {
    const parts = path.split('/')
    return parts[parts.length - 1]
  }

  const resourceParam = getLastWordAfterSlash(pathname)
  const [clickedSlug, setClickedSlug] = useState<string | null>(null)
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 100)
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  useEffect(() => {
    if (!resourceParam) return

    const el = document.getElementById(resourceParam)
    if (el) {
      const offset = 24
      const bodyRect = document.body.getBoundingClientRect().top
      const elementRect = el.getBoundingClientRect().top
      const elementPosition = elementRect - bodyRect
      const offsetPosition = elementPosition - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      })

      // Highlight the card
      document.querySelectorAll(".card--highlighted").forEach((highlightedEl) => {
        highlightedEl.classList.remove("card--highlighted")
      })
      document.querySelectorAll(".card__arrowicon--left").forEach((highlightedEl) => {
        highlightedEl.classList.remove("card__arrowicon--left")
      })
      el.classList.add("card--highlighted")
      el.querySelector(".card__arrowicon")?.classList.add("card__arrowicon--left")
    }
  }, [resourceParam])

  /**
   * Handle click: On first click, update URL (without navigating) and highlight.
   * On second click, let the normal link navigation occur.
   */
  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    slug: string
  ) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return
    }

    if (clickedSlug !== slug) {
      e.preventDefault()
      if (resourceParam === "norsklett") {
        window.history.pushState({}, '', `${pathname}/${slug}`)
      } else {
        const newUrl = pathname.replace(/\/[^/]*$/, `/${slug}`)
        window.history.pushState({}, '', newUrl)
      }
      setClickedSlug(slug)
    }
  }

  /**
   * Scroll to top, remove highlights, deselect slug, and
   * remove last path segment from the URL.
   */
  const handleScrollTopAndDeselect = () => {
    // Remove highlight from any card
    document.querySelectorAll(".card--highlighted").forEach((el) => {
      el.classList.remove("card--highlighted")
    })
    document.querySelectorAll(".card__arrowicon--left").forEach((el) => {
      el.classList.remove("card__arrowicon--left")
    })
    setClickedSlug(null)

    // Remove the last path segment from the URL if there is one
    // e.g., if pathname is "/somepage/someslug", go back to "/somepage"
    const newUrl = pathname.replace(/\/[^/]*$/, "")
    // Only pushState if there's actually a change
    if (newUrl !== pathname) {
      window.history.pushState({}, '', newUrl)
    }

    // Scroll to top smoothly
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <div>
      {items.map((item) => {
        const sectionId = item.slug
        return (
          <section id={sectionId} key={sectionId} className="card">
            <Link href={item.link} onClick={(e) => handleClick(e, sectionId)}>
              <h3 className="card__title py-4 flex items-center gap-2">
                <span className="block w-full">
                  {item.title}
                </span>
                <span className="card__arrowicon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                    />
                  </svg>
                </span>
              </h3>
              <p className="project__paragraph mt-0 mb-0 pb-2 pt-0 font-thin text-sm text-gray-300">
                {item.levels.map((level, index) => (
                  <span key={index}>
                    <span className={filter.levels.includes(level) ? 'text-blue-800 font-normal' : ''} >{level}</span>
                    {index < item.levels.length - 1 && ', '}
                  </span>
                ))}
                <span>,&nbsp;</span>
                {item.languages.map((lang, index) => (
                  <span key={index}>
                    <span className={filter.languages.includes(lang) ? 'text-blue-800 font-normal' : ''}>{lang.toUpperCase()}</span>
                    {index < item.languages.length - 1 && ', '}
                  </span>
                ))}
                <span>,&nbsp;</span>
                {item.platforms.map((platform, index) => (
                  <span key={index}>
                    <span className={`inline flex items-center ${filter.platforms.includes(platform) ? 'text-blue-800 font-normal' : ''}`}>
                      {platformIcons[platform]}
                    </span>
                    {index < item.platforms.length - 1 && ', '}
                  </span>
                ))}
              </p>
              <hr className="mt-0 pt-0 mb-4" />
              <p className="project__paragraph pb-2 mb-0 font-thin">
                {item.description}
              </p>
              <p className="project__paragraph pt-1 mt-0">
                <span className="font-thin">{locales.created_by}:</span>
                <span className="font-bold"> {item.author}</span>
              </p>
            </Link>
          </section>
        )
      })}

      {showButton && (
        <button
          className="scrollup-button"
          onClick={handleScrollTopAndDeselect}
          aria-label="Scroll to top and clear selection"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="scrollup-button__icon"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
            />
          </svg>
        </button>
      )}
    </div>
  )
}
