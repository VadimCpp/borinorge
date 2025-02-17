"use client"
import { useState, useEffect } from 'react'
import { 
  NORSK_RESOURCE_LEVELS, 
  NORSK_RESOURCE_LANGUAGES, 
  NORSK_RESOURCE_PLATFORMS 
} from '../constants'
import { Cross1Icon, GlobeIcon, MobileIcon, VideoIcon, GearIcon } from '@radix-ui/react-icons'

interface FilterState {
  levels: string[];
  languages: string[];
  platforms: string[];
}

export type FilterLocales = {
  show_filter_instructions: string
}

interface FilterProps {
  onChange: (filter: FilterState) => void
  locales: FilterLocales
}

// Mapping for platform icons
const platformIcons: Record<string, JSX.Element> = {
  website: <GlobeIcon className="inline h-4 w-4" />,
  app: <MobileIcon className="inline h-4 w-4" />,
  youtube: <VideoIcon className="inline h-4 w-4" />,
}

const Filter = ({ onChange, locales }: FilterProps) => {
  const [selectedLevels, setSelectedLevels] = useState<string[]>([])
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)

  // Toggle selection for a given filter value
  const toggleSelection = (
    value: string,
    selectedArray: string[],
    setSelected: (arr: string[]) => void
  ) => {
    if (selectedArray.includes(value)) {
      setSelected(selectedArray.filter(item => item !== value))
    } else {
      setSelected([...selectedArray, value])
    }
  }

  const resetFilters = () => {
    setSelectedLevels([])
    setSelectedLanguages([])
    setSelectedPlatforms([])
  }

  useEffect(() => {
    onChange({
      levels: selectedLevels,
      languages: selectedLanguages,
      platforms: selectedPlatforms,
    })
  }, [selectedLevels, selectedLanguages, selectedPlatforms, onChange])

  return (
    <div className={`transition-all duration-300 flex mx-4 ${showFilters ? 'h-42 sm:h-34 md:h-34 lg:h-28' : 'h-22 sm:h-16'}`}>
      {/* Left Column: Filter buttons or instructional text */}
      <div className="flex-1 flex items-start h-full">
        {showFilters ? (
          <div className="flex flex-wrap items-center gap-2">
            {NORSK_RESOURCE_LEVELS.map((level) => (
              <button
                key={level}
                className={
                  selectedLevels.includes(level)
                    ? "filter-button filter-button--active text-gray-900"
                    : "filter-button text-gray-900"
                }
                onClick={() => toggleSelection(level, selectedLevels, setSelectedLevels)}
              >
                {level}
              </button>
            ))}
            {NORSK_RESOURCE_LANGUAGES.map((lang) => (
              <button
                key={lang}
                className={
                  selectedLanguages.includes(lang)
                    ? "filter-button filter-button--active text-gray-900"
                    : "filter-button text-gray-900"
                }
                onClick={() => toggleSelection(lang, selectedLanguages, setSelectedLanguages)}
              >
                {lang.toUpperCase()}
              </button>
            ))}
            {NORSK_RESOURCE_PLATFORMS.map((platform) => (
              <button
                key={platform}
                className={
                  selectedPlatforms.includes(platform)
                    ? "filter-button filter-button--active text-gray-900"
                    : "filter-button text-gray-900"
                }
                onClick={() => toggleSelection(platform, selectedPlatforms, setSelectedPlatforms)}
                aria-label={platform.charAt(0).toUpperCase() + platform.slice(1)}
              >
                {platformIcons[platform] || (platform.charAt(0).toUpperCase() + platform.slice(1))}
              </button>
            ))}
          </div>
        ) : (
          <div className="text-gray-900 font-light pt-2 pl-2">
            {locales.show_filter_instructions}
          </div>
        )}
      </div>
      {/* Right Column: Always visible controls */}
      <div className="flex flex-col items-end gap-2">
        <button
          className="filter-button filter-button--reset text-gray-900"
          onClick={() => setShowFilters(!showFilters)}
        >
          <GearIcon className="inline h-4 w-4" />
        </button>
        {(selectedLevels.length > 0 ||
          selectedLanguages.length > 0 ||
          selectedPlatforms.length > 0) &&
          showFilters && (
          <button
            className="filter-button filter-button--reset text-gray-900"
            onClick={resetFilters}
          >
            <Cross1Icon className="inline h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}

export default Filter
