"use client"
import { useEffect, useCallback, useState, use } from 'react'
import { NorskResource } from '../types'
import {
  NORSK_RESOURCE_ATTRIBUTES,
  NORSK_RESOURCE_LEVELS,
  NORSK_RESOURCE_SKILLS
} from '../constants'
import ReadingIcon from '../icons/reading'
import ListeningIcon from '../icons/listening'
import WritingIcon from '../icons/writing'
import SpeakingIcon from '../icons/speaking'
import Filter from './filter'
import Cards from './cards'


/**
 * The function checks if any element of the first array 
 * is included in the second array
 * @param arr1 
 * @param arr2 
 * @returns 
 */
function includesAny(arr1: Array<string>, arr2: Array<string>) {
  // Iterate over elements of the first array
  for (let i = 0; i < arr1.length; i++) {
      // Check if the current element of the first array is included in the second array
      if (arr2.includes(arr1[i])) {
          return true;
      }
  }
  return false;
}

type NorskResourceAttributes = {
  levels: string[],
  skills: string[]
}

/**
 * The Sources component
 */
interface SourcesProps {
  resources: Array<NorskResource>
  labels: { [key: string]: string }
}

const Sources: React.FC<SourcesProps> = ({ resources, labels }) => {
  const [ filter, setFilter ] = useState<Array<string>>([])
  const [ filteredResources, setFilteredResources ] = useState<Array<NorskResource>>(resources)

  const onFilterChange = useCallback((filter: Array<string>) => {
    console.log('filter', filter.join(', '))
    setFilter(filter)
  }, [])

  useEffect(() => {
    if (filter.length === 0) {
      setFilteredResources(resources)
    } else {
      const newData: Array<NorskResource> = []
      resources.forEach((nr: NorskResource) => {
        const resource_attributes: NorskResourceAttributes | undefined =
          (NORSK_RESOURCE_ATTRIBUTES as {
            [key: string]: NorskResourceAttributes
          })[nr.slug]
        if (resource_attributes) {
          const filterLevels = filter.filter((f) => NORSK_RESOURCE_LEVELS.includes(f))
          const filterSkills = filter.filter((f) => NORSK_RESOURCE_SKILLS.includes(f))

          let levelsMatch = true
          if (filterLevels.length && !includesAny(filterLevels, resource_attributes.levels)) {
            levelsMatch = false
          }
          if (filterSkills.length && !includesAny(filterSkills, resource_attributes.skills)) {
            levelsMatch = false
          }

          if (levelsMatch) {
            newData.push(nr)
          }
        }
      })

      setFilteredResources(newData)
    }
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter])

  return (
    <div className='container mx-auto px-4'>
      <div className='mx-6 p-4'>
        <span className='font-thin'>{labels["filter-description"]}</span>
        <div className="pt-2 flex flex-wrap gap-2">
          <div className="flex items-center">
            <ReadingIcon className='w-4 h-4 text-gray-600 inline'/>
            <span className='font-thin pl-1 pr-2'>
              - {labels["reading"]}, 
            </span>
          </div>
          <div className="flex items-center">
            <ListeningIcon className='w-4 h-4 text-gray-600 inline'/>
            <span className='font-thin pl-1 pr-2'>  
              - {labels["listening"]},
            </span>
          </div>
          <div className="flex items-center">
            <WritingIcon className='w-4 h-4 text-gray-600 inline'/>
            <span className='font-thin pl-1 pr-2'>
              - {labels["writing"]},
            </span>
          </div>
          <div className="flex items-center">
            <SpeakingIcon className='w-4 h-4 text-gray-600 inline'/>
            <span className='font-thin pl-1 pr-2'>
              - {labels["oral"]}
            </span>
          </div>
        </div>
      </div>
      <Filter onChange={onFilterChange}/>
      <div className='mx-6 p-4 mb-6'>
        {filter.length === 0 && (
          <>
            <p>
              <span className='font-thin'>{labels["total-resources"]}</span>
              <span> {filteredResources.length}</span>
              <span className='font-thin'>. </span>
            </p>
          </>
        )}
        {filter.length > 0 && (
          <p>
            <span className='font-thin'>{labels["found-resources"]}</span>
            <span> {filteredResources.length}</span>
            <span className='font-thin'> {labels["out-of"]} </span>
            <span>{resources.length}</span>
            <span className='font-thin'>. </span>
          </p>
        )}
      </div>
      <div className='md:columns-2 lg:columns-3 gap-2 pb-40'>
        <Cards
          items={filteredResources}
          labels={labels}
        />
      </div>
    </div>
  )
}

export default Sources
