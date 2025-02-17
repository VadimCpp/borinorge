"use client"
import { useEffect, useCallback, useState } from 'react'
import { NorskResource } from '../types'
import Filter from './filter'
import Cards from './cards'

interface FilterState {
  levels: string[]
  languages: string[]
  platforms: string[]
}

/**
 * Compute how many attributes a resource shares with the active filter.
 * Each matched level, language, or platform increases the score.
 */
function getMatchScore(resource: NorskResource, filter: FilterState) {
  let score = 0
  // Count matching levels
  if (filter.levels.length > 0) {
    score += resource.levels.filter(level => filter.levels.includes(level)).length
  }
  // Count matching languages
  if (filter.languages.length > 0) {
    score += resource.languages.filter(lang => filter.languages.includes(lang)).length
  }
  // Count matching platforms
  if (filter.platforms.length > 0) {
    score += resource.platforms.filter(platform => filter.platforms.includes(platform)).length
  }
  return score
}

export type SourcesLocales = {
  show_filter_instructions: string
  created_by: string
}

/**
 * The Sources component receives the full list of resources and labels.
 * It holds the filter state (for levels, languages and platforms)
 * and re‑sorts the resource list descending based on the match score.
 */
interface SourcesProps {
  resources: Array<NorskResource>
  locales: SourcesLocales
}

const Sources: React.FC<SourcesProps> = ({ resources, locales }) => {
  const [filter, setFilter] = useState<FilterState>({
    levels: [],
    languages: [],
    platforms: []
  })
  const [sortedResources, setSortedResources] = useState<Array<NorskResource>>(resources)

  const onFilterChange = useCallback((newFilter: FilterState) => {
    console.log('Filter changed:', newFilter)
    setFilter(newFilter)
  }, [])

  useEffect(() => {
    // Always show all resources—but sort them by match score descending.
    const newSorted = [...resources].sort((a, b) => {
      const scoreA = getMatchScore(a, filter)
      const scoreB = getMatchScore(b, filter)
      return scoreB - scoreA
    })
    setSortedResources(newSorted)
  }, [filter, resources])

  return (
    <div className='container mx-auto px-4'>
      <Filter
        onChange={onFilterChange}
        locales={locales}
      />
      <div className='md:columns-2 lg:columns-3 gap-2 pb-40'>
        <Cards items={sortedResources} filter={filter} locales={locales} />
      </div>
    </div>
  )
}

export default Sources
