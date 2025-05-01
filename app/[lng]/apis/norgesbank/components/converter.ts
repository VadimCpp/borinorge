import * as Currencies from "./currencies";

interface CurrencyList {
  [key: string]: string
}

interface SynonymsList {
  [key: string]: Array<string>
}

interface AmountAndCurrencies {
  amount: number,
  currencies: Array<string>
}

export function makeFullCurrencyList(list: Array<CurrencyList>, synonyms?: SynonymsList): Array<string> {
  let fullCurrencyList:Array<string> = []
  list.forEach((currencyList) => {
    Object.keys(currencyList).forEach((currency) => {
      if (!fullCurrencyList.includes(currency)) {
        fullCurrencyList.push(currency)

        if (synonyms) {
          const currencySynonyms: Array<string> = synonyms[currency]
          if (currencySynonyms) {
            //
            // NOTE!
            // If there are duplicates in the synonyms list, only the first one will be added to the list.
            // It is responsibility of the programmer to provide unique synonyms.
            //
            currencySynonyms.forEach((synonym) => {
              if (!fullCurrencyList.includes(synonym)) {
                fullCurrencyList.push(synonym)
              }
            })
          }
        }
      }
    })    
  })  

  return fullCurrencyList
}

export function parseAmountAndCurrencies(input: string, currencies: Array<string>): AmountAndCurrencies {
  let data: AmountAndCurrencies = {
    amount: 0,
    currencies: []
  }

  const amountMatch = input.match(/[+-]?\d+(\.\d+)?/g)
  if (amountMatch) {
    data.amount = parseFloat(amountMatch[0])
  }

  const lowercaseCurrencies = currencies.map((currency) => currency.toLowerCase())
  const words = input.split(/[\s,\.?!\d]+/)
  words.forEach((word) => {
    if (lowercaseCurrencies.includes(word.toLowerCase())) {
      data.currencies.push(word)
    }
  })

  return data
}

export function getCurrencyCodes(currencies: Array<string>): Array<string> {
  let currencyCodes: Array<string> = []

  const fullList = makeFullCurrencyList([Currencies.norgesBankCurrencies, Currencies.openExchangeRateCurrencies])
  
  currencies.forEach((currency: string) => {
    const code: string | undefined = fullList.find(c => c.toLowerCase() === currency.toLowerCase())
    if (code) {
      currencyCodes.push(code)
    } else {
      // Look for code in synonyms
      for (const key in Currencies.synonyms) {
        const synonyms: Array<string> = Currencies.synonyms[key as keyof typeof Currencies.synonyms] || []
        const synonymsLowerCase: Array<string> = synonyms.map((synonym) => synonym.toLowerCase())
        if (synonymsLowerCase.includes(currency.toLowerCase())) {
          currencyCodes.push(key)
          break
        }
      }
    }
  })

  return currencyCodes
}

type ServiceName = "Norges Bank" | "Open Exchange Rates";

export function getServiceName(currencyCodes: Array<string>): ServiceName | null {
  let name: ServiceName | null = null

  if (currencyCodes.length > 1) {  
    const norgesBankCodes = Object.keys(Currencies.norgesBankCurrencies)
    const openExchangeRatesCodes = Object.keys(Currencies.openExchangeRateCurrencies)

    const norgesBankIntersection = currencyCodes.filter((code) => !norgesBankCodes.includes(code))
    const openExchangeRatesIntersection = currencyCodes.filter((code) => !openExchangeRatesCodes.includes(code))

    if (norgesBankIntersection.length === 0) {
      name = "Norges Bank"
    } else if (openExchangeRatesIntersection.length === 0) {
      name = "Open Exchange Rates"
    }
  }

  return name
}

// Type of data returned by Norges Bank API in sdmx-json format
export type ExchangeRates = {
  data: {
    dataSets: Array<{
      action: string
      reportingBegin: string
      reportingEnd: string
      series: {
        [key: string]: {
          attributes: Array<number>
          observations: {
            [key: number]: Array<string>
          }
        }
      }
    }>
    structure: {
      name: string
      description: string
      dimensions: {
        series: Array<{
          id: string
          name: string
          values: Array<{
            id: string
            name: string
          }> | undefined
        }>
      }
      attributes: {
        series: Array<{
          id: string 
          name: string
          description: string
          relationship: {
            dimensions: Array<string>
          }
          values: Array<{
            id: string
            name: string
          }>
        }>
      }
    }
  }
}

// Fetches the list of currencies from Norges Bank API which have actual exchange rates
export async function getCurrencyList(): Promise<CurrencyList> {
  let currencyList: CurrencyList = {}
  const link = "https://data.norges-bank.no/api/data/EXR/B..NOK.SP?lastNObservations=1&format=sdmx-json"
  try {
    const response = await fetch(link)
    const data: ExchangeRates = await response.json()

    // Some of values are empty, so we need to check if they exist
    let values: Array<string> = []
    if (data.data.dataSets.length) {
      const dataSet0 = data.data.dataSets[0]          
      for (const k in dataSet0.series) {
        const serie = dataSet0.series[k]
        values.push(serie.observations[0]?.[0])
      }
    }

    // Get currency codes and names for only those that have exchange rates
    if (data.data.structure.dimensions.series.length) {
      const serie = data.data.structure.dimensions.series.find(s => s.id === "BASE_CUR")
      if (serie?.values?.length) {
        for (let i = 0; i < serie.values.length; i++) {
          const rate = parseFloat(values[i])
          if (!isNaN(rate)) {
            currencyList[serie.values[i].id] = serie.values[i].name
          }
        }
      }
    }
  }
  catch (error) {
    console.error(error)
    currencyList = {}
  }

  currencyList["NOK"] = "Norwegian krone"

  return currencyList
}

export type CurrencyRateTowardsNok = {
  id: string
  name: string
  rate: string
  exponent: number
  actualRate: number
}

export async function getExchangeRate(currencyCode: string): Promise<CurrencyRateTowardsNok> {
  let currencyRate: CurrencyRateTowardsNok = {
    id: "",
    name: "",
    rate: "",
    exponent: 0,
    actualRate: 0
  }
  const link = `https://data.norges-bank.no/api/data/EXR/B.${currencyCode}.NOK.SP?lastNObservations=1&format=sdmx-json`
  try {
    const response = await fetch(link)
    const data: ExchangeRates = await response.json()

    // Get the rate
    let rate: string = ""
    if (data.data.dataSets.length) {
      const dataSet0 = data.data.dataSets[0]  
      for (const k in dataSet0.series) {
        const serie = dataSet0.series[k]
        rate = serie.observations[0]?.[0]
      }
    }

    // Get currency code
    let id: string = ""
    let name: string = ""
    if (data.data.structure.dimensions.series.length) {
      const serie = data.data.structure.dimensions.series.find(s => s.id === "BASE_CUR")
      if (serie?.values?.length) {
        const value = serie.values[0]
        if (value.id === currencyCode) {
          id = value.id
          name = value.name
        }
      }
    }

    // Get multiplier
    let exponent: number = 0
    const multiplier = data.data.structure.attributes.series.find(s => s.id === "UNIT_MULT")
    if (multiplier?.values?.length) {
      exponent = parseInt(multiplier.values[0].id)
      if (isNaN(exponent)) {
        exponent = 0
      }
    }
    
    let actualRate: number = parseFloat(rate) / Math.pow(10, exponent)
    if (isNaN(actualRate)) {
      actualRate = 0
    }

    if (id && name && rate && actualRate) {
      currencyRate = { id, name, rate, exponent, actualRate }
    }
  }
  catch (error) {
    console.error(error)
    currencyRate = {
      id: "",
      name: "",
      rate: "",
      exponent: 0,
      actualRate: 0
    }
  }

  return currencyRate
}

// Rounds currency
export function roundCurrency(amount: number): number {
  if (amount < 1) {
    const strAmount = amount.toString().split('')
    let newAmount = ''
    let firstNonZero: boolean = false
    let totalNonZero: number = 0
    for (let i = 0; i < strAmount.length; i++) {
      const ch = strAmount[i]
      if (firstNonZero) {
        if (totalNonZero < 3) {
          newAmount = `${newAmount}${ch}`
          totalNonZero++
        } else {
          break
        }
      } else {
        if (['0', '.'].includes(ch)) {
          newAmount = `${newAmount}${ch}`
        } else {
          firstNonZero = true
          totalNonZero++
          newAmount = `${newAmount}${ch}`
        }
      }
    }
    return parseFloat(newAmount);
  } else if (amount >= 0 && amount <= 10) {
    return parseFloat(amount.toFixed(3));
  } else if (amount > 10 && amount <= 10000) {
    return parseFloat(amount.toFixed(2));
  } else {
    return Math.round(amount);
  }
}


export function convert(input: string, exchangeRates: Array<CurrencyRateTowardsNok>): string {
  let result: string = ""

  try {
    let currencyList: CurrencyList = { "NOK": "Norwegian krone" }
    exchangeRates.map(er => currencyList[er.id] = er.name)

    const fullList = makeFullCurrencyList([ currencyList ], Currencies.synonyms)

    const data = parseAmountAndCurrencies(input, fullList)
    const currencyCodes = getCurrencyCodes(data.currencies).filter((item, index, self) => {
      // remove duplicates
      return self.indexOf(item) === index; 
    });

    const norgesBankCodes = Object.keys(currencyList)
    const norgesBankIntersection = currencyCodes.filter((code) => !norgesBankCodes.includes(code))
    if (norgesBankIntersection.length === 0 && currencyCodes.length > 1) {
      const baseCode = currencyCodes[0]
      for (let i = 1; i < currencyCodes.length; i++) {
        const code = currencyCodes[i]
        let exchangedRate: number = 0
        if (baseCode === 'NOK') {
          const er = exchangeRates.find(r => r.id === code)?.actualRate || 0
          exchangedRate = er ? data.amount / er : 0
        } else {
          const ber = exchangeRates.find(r => r.id === baseCode)?.actualRate || 0
          const er = (code === 'NOK') ?
            1 :
            (exchangeRates.find(r => r.id === code)?.actualRate || 0)
          exchangedRate = (er && ber) ? data.amount * ber / er : 0
        }

        result += `${data.amount} ${baseCode} = ${roundCurrency(exchangedRate)} ${code}\n`
      }
    } else {
      result = "Not enough data for currency exchange."
    }
  }
  catch (error) {
    result = "Unexpected error."
  }

  return result
}
