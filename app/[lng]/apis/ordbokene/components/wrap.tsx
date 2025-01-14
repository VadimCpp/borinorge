"use client"

import { useState, useEffect } from "react"
import Exchanges from './test'

interface RatesProps {
  label: string
  requestDescription: string
  testLabel: string
  randomLabel: string
  unexpectedError: string
  placeholder1: string
  placeholder2: string
  authorInfo: string
  contactUs: string
}

export default function Rates(props: RatesProps) {
  const {
    label,
    requestDescription,
    testLabel,
    randomLabel,
    unexpectedError,
    placeholder1,
    placeholder2,
    authorInfo,
    contactUs
  } = props
  const [ isExchangeRatesRequested, setIsExchangeRatesRequested ] = useState(false)
  const [ isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    if (isExchangeRatesRequested) {
      const f = async () => {
        try {
          setIsSuccess(true)
        }
        catch(error) {
          setIsSuccess(false)
        }
      } 

      f()
    }
  }, [isExchangeRatesRequested, unexpectedError])

  // animation on the table
  const [shouldRender, setShouldRender] = useState(false);
  useEffect(() => {
    if (isSuccess) {
      setShouldRender(true);
    }
  }, [isSuccess]);

  return (
    <>
      { !isSuccess && (
          <div className="target-action">
            <button className="target-action__link" onClick={() => setIsExchangeRatesRequested(true)}>
              {label}
            </button>
          </div>
        )
      }
      { isSuccess && 
        (
          <>
            <Exchanges
              description={requestDescription}
              exchangeLabel={testLabel}
              randomLabel={randomLabel}
              placeholder1={placeholder1}
              placeholder2={placeholder2}
              authorInfo={authorInfo}
              contactUs={contactUs}
            />
          </>
        )
      }
    </>
  )
}
