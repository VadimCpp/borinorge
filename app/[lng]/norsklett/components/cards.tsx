"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"

type CardItem = {
  slug: string
  title: string
  description: string
  author: string
  link: string
}

interface CardsProps {
  items: CardItem[]
  labels: Record<string, string>
}

export default function Cards({ items, labels }: CardsProps) {
  const pathname = usePathname()

  // `resourceParam` = e.g. "my-resource" if URL is `?resource=my-resource`
  const getLastWordAfterSlash = (path: string) => {
    const parts = path.split('/')
    return parts[parts.length - 1]
  }

  const resourceParam = getLastWordAfterSlash(pathname)

  // Keep track of which slug was "clicked" first to handle double-click logic
  const [clickedSlug, setClickedSlug] = useState<string | null>(null)

  /**
   * If `?resource=XYZ` is present on page load (or changes),
   * smoothly scroll to that `<section id="XYZ">`.
   */
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

      // Highlight the selection, e.g. add a CSS class
      document.querySelectorAll(".card--highlighted").forEach((highlightedEl) => {
        highlightedEl.classList.remove("card--highlighted")
      })
      el.classList.add("card--highlighted")
    }
  }, [resourceParam])

  /**
   * Handle the link click behavior:
   *  - On first click, just set `?resource=slug` and highlight
   *  - On second click, do the normal navigation
   */
  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    slug: string
  ) => {
    // If user is cmd-clicking or middle-clicking, let the default behavior happen:
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return
    }

    if (clickedSlug !== slug) {
      e.preventDefault()

      // Update the current URL to include "?resource=slug" without rerendering.
      // Use the history API to change the URL without causing a page reload.
      if (resourceParam === "norsklett") {
        window.history.pushState({}, '', `${pathname}/${slug}`)
      } else {
        // Replace the current URL with the new slug without rerendering the page
        const newUrl = pathname.replace(/\/[^/]*$/, `/${slug}`)
        window.history.pushState({}, '', newUrl)
      }

      setClickedSlug(slug)
    }
    // Otherwise, it is the second click => let the normal link navigation occur.
  }

  return (
    <div>
      {items.map((item) => {
        const sectionId = item.slug // we'll scroll to <section id={sectionId}>
        return (
          <section id={sectionId} key={sectionId} className="card">
            <Link href={item.link} onClick={(e) => handleClick(e, sectionId)}>
              <h3 className="card__title py-4 flex items-center gap-2">
                {item.title}
                {/* optional icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                  />
                </svg>
              </h3>
              <hr className="mt-2 mb-4" />
              <p className="project__paragraph pb-2 mb-0 font-thin">
                {item.description}
              </p>
              <p className="project__paragraph pt-1 mt-0">
                <span className="font-thin">{labels["created-by"]}:</span>
                <span className="font-bold"> {item.author}</span>
              </p>
            </Link>
          </section>
        )
      })}
    </div>
  )
}
