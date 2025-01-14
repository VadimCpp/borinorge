"use client"
import { useState, useEffect } from 'react'
import ResetIcon from '../icons/reset'
import ReadingIcon from '../icons/reading'
import ListeningIcon from '../icons/listening'
import WritingIcon from '../icons/writing'
import SpeakingIcon from '../icons/speaking'

interface FilterProps {
  onChange: (filter: Array<string>) => void
}

const Filter = ({ onChange }: FilterProps) => {
  const [ a1, setA1 ] = useState(false)
  const [ a2, setA2 ] = useState(false)
  const [ b1, setB1 ] = useState(false)
  const [ b2, setB2 ] = useState(false)
  const [ resetAB, setResetAB ] = useState(false)

  useEffect(() => {
    if (a1 || a2 || b1 || b2) {
      setResetAB(true)
    } else if (!a1 && !a2 && !b1 && !b2) {
      setResetAB(false)
    }
  }, [a1, a2, b1, b2])

  useEffect(() => {
    if (!resetAB) {
      setA1(false)
      setA2(false)
      setB1(false)
      setB2(false)
    }
  }, [resetAB])

  const [ reading, setReading ] = useState(false)
  const [ listening, setListening ] = useState(false)
  const [ writing, setWriting ] = useState(false)
  const [ speaking, setSpeaking ] = useState(false)
  const [ resetRW, setResetRW ] = useState(false)

  useEffect(() => {
    if (reading || listening || writing || speaking) {
      setResetRW(true)
    } else if (!reading && !listening && !writing && !speaking) {
      setResetRW(false)
    }
  }, [reading, listening, writing, speaking])

  useEffect(() => {
    if (!resetRW) {
      setReading(false)
      setListening(false)
      setWriting(false)
      setSpeaking(false)
    }
  }, [resetRW])

  useEffect(() =>{
    const newFilterData: Array<string> = []
    if (a1) newFilterData.push('A1')
    if (a2) newFilterData.push('A2')
    if (b1) newFilterData.push('B1')
    if (b2) newFilterData.push('B2')
    if (reading) newFilterData.push('reading')
    if (listening) newFilterData.push('listening')
    if (writing) newFilterData.push('writing')
    if (speaking) newFilterData.push('speaking')
    
    onChange(newFilterData)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [a1, a2, b1, b2, reading, listening, writing, speaking])
  
  return (
    <div className='mx-4 px-4'>
      <div className='flex flex-wrap'>
        <div className='flex m-2 mt-4'>
          <button
            className={ a1 ? "filter-button filter-button--active mr-4" : "filter-button mr-4" }
            onClick={() => setA1(!a1)}
          >
            <span className='text-gray-900'>A1</span>
          </button>
          <button
            className={ a2 ? "filter-button filter-button--active mr-4" : "filter-button mr-4" }
            onClick={() => setA2(!a2)}
          >
            <span className='text-gray-900'>A2</span>
          </button>
          <button
            className={ b1 ? "filter-button filter-button--active mr-4" : "filter-button mr-4" }
            onClick={() => setB1(!b1)}
          >
            <span className='text-gray-900'>B1</span>
          </button>
          <button
            className={ b2 ? "filter-button filter-button--active mr-4" : "filter-button mr-4" }
            onClick={() => setB2(!b2)}
          >
            <span className='text-gray-900'>B2</span>
          </button>
          <button
            className={ resetAB ? "filter-button filter-button--reset filter-button--active" : "filter-button filter-button--reset" }
            onClick={() => setResetAB(false)}
          >
            <ResetIcon visible={resetAB} />
          </button>
        </div>
        <div className='flex m-2 mt-4'>
          <button
            className={ reading ? "filter-button filter-button--active mr-4" : "filter-button mr-4" }
            onClick={() => setReading(!reading)} 
          >
            <ReadingIcon />
          </button>
          <button
            className={ listening ? "filter-button filter-button--active mr-4" : "filter-button mr-4" }
            onClick={() => setListening(!listening)}
          >
            <ListeningIcon />
          </button>
          <button
            className={ writing ? "filter-button filter-button--active mr-4" : "filter-button mr-4" }
            onClick={() => setWriting(!writing)}
          >
            <WritingIcon />
          </button>
          <button
            className={ speaking ? "filter-button filter-button--active mr-4" : "filter-button mr-4" }
            onClick={() => setSpeaking(!speaking)}
          >
           <SpeakingIcon />
          </button>
          <button
            className={ resetRW ? "filter-button filter-button--reset filter-button--active" : "filter-button filter-button--reset" }
            onClick={() => setResetRW(false)}
          >
            <ResetIcon visible={resetRW} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Filter
