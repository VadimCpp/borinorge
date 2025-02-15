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

  // `resourceParam` = e.g. "my-resource" if URL path ends with "my-resource"
  const getLastWordAfterSlash = (path: string) => {
    const parts = path.split('/')
    return parts[parts.length - 1]
  }

  const resourceParam = getLastWordAfterSlash(pathname)

  // Keep track of which slug was "clicked" first to handle double-click logic
  const [clickedSlug, setClickedSlug] = useState<string | null>(null)

  // Track whether to show the "scroll to top" button
  const [showButton, setShowButton] = useState(false)

  // Listen for scroll to decide if button should appear
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowButton(true)
      } else {
        setShowButton(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  /**
   * If `?resource=XYZ` or /XYZ is present on page load (or changes),
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
      document.querySelectorAll(".card__arrowicon--left").forEach((highlightedEl) => {
        highlightedEl.classList.remove("card__arrowicon--left")
      })
      el.classList.add("card--highlighted")
      el.querySelector(".card__arrowicon")?.classList.add("card__arrowicon--left")
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
    // If user is cmd-clicking or middle-clicking, let the default behavior happen
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return
    }

    if (clickedSlug !== slug) {
      e.preventDefault()

      // Update the current URL to include "/slug" without rerendering
      if (resourceParam === "norsklett") {
        window.history.pushState({}, '', `${pathname}/${slug}`)
      } else {
        // Replace the last segment with new slug
        const newUrl = pathname.replace(/\/[^/]*$/, `/${slug}`)
        window.history.pushState({}, '', newUrl)
      }

      setClickedSlug(slug)
    }
    // Otherwise, it is the second click => let the normal link navigation occur.
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
        const sectionId = item.slug // we'll scroll to <section id={sectionId}>
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

      {/* Fixed button at bottom-right to scroll up and deselect card.
          It only appears if the user has scrolled more than 100px. */}
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
