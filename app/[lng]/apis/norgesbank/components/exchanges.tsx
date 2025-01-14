"use client"

import Link from 'next/link'
import { useState, useCallback, useEffect } from "react"
import { type CurrencyRateTowardsNok, convert } from "./converter"

interface ExchangesProps {
  description: string
  exchangeRates: Array<CurrencyRateTowardsNok>
  examplePrompt1: string
  examplePrompt2: string
  exchangeLabel: string
  placeholder1: string
  placeholder2: string
  authorInfo: string
  contactUs: string
}

export default function Exchanges(props: ExchangesProps) {
  const {
    description,
    exchangeRates,
    examplePrompt1,
    examplePrompt2,
    exchangeLabel,
    placeholder1,
    placeholder2,
    authorInfo,
    contactUs
  } = props

  const [inputValue, setInputValue] = useState('')
  const [value, setValue] = useState('')
  const [result, setResult] = useState('')
  
  const doExchange = useCallback(() => {
    const data = convert(value, exchangeRates)
    setResult(data)
  }, [value, exchangeRates])

  useEffect(() => {
    if (value) { // This check ensures doExchange is not called with an empty value
      doExchange();
    }
  }, [value, doExchange]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    setValue(inputValue)
  }

  return exchangeRates.length ? (
    <>
      <div className="project__paragraph">
        <span>{description}</span>
        <ul>
          <li className="pb-1">
            <a
              className="underline underline-offset-4 text-blue-700 cursor-pointer"
              onClick={() => {
                setValue(examplePrompt1)
                setInputValue(examplePrompt1)
              }}
            >
              {examplePrompt1}
            </a>
          </li>
          <li className="pb-1">
            <a
              className="underline underline-offset-4 text-blue-700 cursor-pointer"
              onClick={() => {
                setValue(examplePrompt2)
                setInputValue(examplePrompt2)
              }}
            >
              {examplePrompt2}
            </a>
          </li>
        </ul>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          className="input input-bordered border-2 rounded-md border-gray-500 w-full p-2 text-gray-600"
          placeholder={placeholder1}
        />
        <button
          type="submit"
          className="target-action__link"
        >
          {exchangeLabel}
        </button>
        <textarea
          readOnly
          value={result}
          className="textarea textarea-bordered border-2 rounded-md border-gray-500 w-full p-2 text-gray-600 min-h-52"
          placeholder={placeholder2}
        />
      </form>
      <div className="project__paragraph pt-8">
        <span>{authorInfo}</span>
        <div className="target-action pt-4 pb-0 md:justify-start">
          <Link href="/folk/vadym" className="target-action__link">
            {contactUs}
          </Link>
        </div>
      </div>
    </>
  ) : null
}
