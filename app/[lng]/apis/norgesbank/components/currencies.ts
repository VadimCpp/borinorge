import openExchangeRatesList from './json-data/open-exchange-rates.json'
import norgesBankList from './json-data/norges-bank.json'
import synonymsData from './json-data/synonyms.json'

//
// The currencies have been fetched from the following API:
// https://openexchangerates.org/api/currencies.json
//
export const openExchangeRateCurrencies = openExchangeRatesList

//
// The currencies have been fetched from the following API:
// https://app.norges-bank.no/query/#/no/
//
// NOTE!
// Some of exchange rates are not available.
// For example:
//  - Russian rouble is under sanctions;
//  - Croatian kuna is lost its official status in favor of euro.
// Please see the function getCurrencyList in converter.ts for more details.
//
export const norgesBankCurrencies = norgesBankList

// 
// The synonyms for some of the currencies
//
export const synonyms = synonymsData
