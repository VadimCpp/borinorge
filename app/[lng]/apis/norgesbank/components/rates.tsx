"use client"

import { useState, useEffect } from "react"
import { getCurrencyList, getExchangeRate, type CurrencyRateTowardsNok } from "./converter"
import Exchanges from './exchanges'

interface RatesProps {
  label: string
  progressLabel: string
  tableExplanation: string
  exchangeDescription: string
  examplePrompt1: string
  examplePrompt2: string
  exchangeLabel: string
  unexpectedError: string
  placeholder1: string
  placeholder2: string
  authorInfo: string
  contactUs: string
}

export default function Rates(props: RatesProps) {
  const {
    label,
    progressLabel,
    tableExplanation,
    exchangeDescription,
    examplePrompt1,
    examplePrompt2,
    exchangeLabel,
    unexpectedError,
    placeholder1,
    placeholder2,
    authorInfo,
    contactUs
  } = props
  const [ isExchangeRatesRequested, setIsExchangeRatesRequested ] = useState(false)
  const [ isSuccess, setIsSuccess] = useState(false)
  const [ content, setContent ] = useState("...")
  const [ exchangeRates, setExchangeRates ] = useState<Array<CurrencyRateTowardsNok>>([])


  useEffect(() => {
    if (isExchangeRatesRequested) {
      const f = async () => {
        try {
          let ers: Array<CurrencyRateTowardsNok> = []
          const currencyList = await getCurrencyList()
          for(let code in currencyList) {
            if (code !== "NOK") {
              setContent(`${progressLabel} ${code}`)
              const exchangeRate = await getExchangeRate(code)
              ers.push(exchangeRate)
            }
          }
          setContent("...")
          setExchangeRates(ers)
          setIsSuccess(true)
        }
        catch(error) {
          setIsSuccess(false)
          setContent(unexpectedError)
        }
      } 

      f()
    }
  }, [isExchangeRatesRequested, progressLabel, unexpectedError])

  // animation on the table
  const [shouldRender, setShouldRender] = useState(false);
  useEffect(() => {
    if (exchangeRates.length > 0 && isSuccess) {
      setShouldRender(true);
    }
  }, [exchangeRates, isSuccess]);

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
      { isExchangeRatesRequested && !isSuccess && <p className='project__paragraph'>{content}</p> }
      { exchangeRates.length > 0 && isSuccess && 
        (
          <>
            <p className={`project__paragraph transition-opacity duration-700 ease-in-out ${shouldRender ? 'opacity-100' : 'opacity-0'}`}>{tableExplanation}</p>
            <table className={`min-w-full table-auto divide-y divide-gray-200 my-4 transition-opacity duration-700 ease-in-out ${shouldRender ? 'opacity-100' : 'opacity-0'}`}>
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rate
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {exchangeRates.map((currency) => (
                  <tr key={currency.id}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{currency.id}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 max-w-32 text-ellipsis overflow-hidden">{currency.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{currency.actualRate.toFixed(5)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Exchanges
              description={exchangeDescription}
              exchangeRates={exchangeRates}
              examplePrompt1={examplePrompt1}
              examplePrompt2={examplePrompt2}
              exchangeLabel={exchangeLabel}
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
