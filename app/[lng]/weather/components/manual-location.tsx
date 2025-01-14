"use client"

import React, { useState, useEffect } from "react"
import { type WeatherLocales } from "./weather.types"

type Suggestion = {
  city: string
  fylke: string
  kommune: string
  lat: number | null
  lng: number | null
}

type ManualLocationProps = {
  onLocationSelected: (lat: number, lng: number, city: string) => void
  locales: WeatherLocales
}

export const ManualLocation: React.FC<ManualLocationProps> = ({
  onLocationSelected,
  locales
}) => {
  const [inputValue, setInputValue] = useState("")
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // We'll manually implement a simple "typingTimeout" for 300 ms debounce
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // If user clears the input, empty out the list & error
    if (!inputValue || inputValue.length < 4) {
      setSuggestions([])
      setError(null)
      return
    }

    // Debounce: clear prior timeout if new keystroke arrives
    if (typingTimeout) {
      clearTimeout(typingTimeout)
    }

    // Wait 300 ms before triggering a fetch
    const timeoutId = setTimeout(() => {
      fetchSuggestions(inputValue)
    }, 300)

    setTypingTimeout(timeoutId)

    // Cleanup if input changes again
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue])

  const fetchSuggestions = async (query: string) => {
    try {
      // Call your Next.js API route
      const res = await fetch(`/api/geonorge/stedsnavn?q=${encodeURIComponent(query)}`)
      
      if (!res.ok) {
        throw new Error(`Error: ${res.statusText}`)
      }

      const data: Suggestion[] = await res.json()
      setSuggestions(data)
      setIsDropdownOpen(true)
      setError(null)
    } catch (err) {
      console.error(err)
      setSuggestions([])
      setIsDropdownOpen(false)
      setError(locales.manual_location_error)
    }
  }

  const handleSuggestionClick = (suggestion: Suggestion) => {
    if (suggestion.lat !== null && suggestion.lng !== null) {
      onLocationSelected(suggestion.lat, suggestion.lng, suggestion.city)
    }
    setInputValue(`${suggestion.city}, ${suggestion.fylke}`)
    setIsDropdownOpen(false)
  }

  return (
    <div className="flex flex-col items-center justify-center pt-8 px-6 max-w-md mx-auto">
      {/* Label and Text Input */}
      <div className="w-full">
        <label htmlFor="address-input" className="pl-2 pb-2 block">
          {locales.enter_norwegian_address}:
        </label>

        <input
          id="address-input"
          type="text"
          className="border border-gray-300 rounded px-3 py-2 w-72 focus:outline-none "
          placeholder="e.g. Storgata 10, Oslo"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value)
            setIsDropdownOpen(true)
          }}
        />
      </div>
        {/* Error Text */}
        {error && <p className="text-red-600 pt-2 px-2">{error}</p>}


      {/* Suggestions Dropdown */}
      {isDropdownOpen && suggestions.length > 0 && (
        <ul className="mt-2 border border-gray-300 rounded w-72 bg-white shadow-lg max-h-64 overflow-auto">
          {suggestions.map((sug, index) => (
            <li
              key={`${sug.city}-${index}`}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSuggestionClick(sug)}
            >
              {sug.city}
              {sug.fylke ? `, ${sug.fylke}` : ""}
              {sug.kommune ? `, ${sug.kommune}` : ""}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
