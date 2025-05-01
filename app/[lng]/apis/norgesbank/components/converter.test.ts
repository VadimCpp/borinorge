import {
  makeFullCurrencyList,
  parseAmountAndCurrencies,
  getCurrencyCodes,
  getServiceName,
  getCurrencyList,
  getExchangeRate,
  roundCurrency,
  convert,
  ExchangeRates,
  CurrencyRateTowardsNok
} from './converter'
import mockApiResponseAll from './json-data/mock-api-response-all.json'
import mockApiResponseDkk from './json-data/mock-api-response-dkk.json'
import mockApiResponsePln from './json-data/mock-api-response-pln.json'

describe('makeFullCurrencyList', () => {
  it('should return an empty array', () => {
    expect(makeFullCurrencyList([], {})).toEqual([])
  })

  it('should return an array of three elements', () => {
    const list1 = {
      'USD': 'United States Dollar',
      'EUR': 'Euro',
    }
    const list2 = {
      'USD': 'US Dollar',
      'GBP': 'British Pound'
    }
    const expected = [ 'USD', 'EUR', 'GBP' ]
    expect(makeFullCurrencyList([list1, list2], {})).toEqual(expected)
  })

  it('should return an array of five elements', () => {
    const list1 = {
      'USD': 'United States Dollar',
      'EUR': 'Euro',
      'GBP': 'British Pound'
    }
    const list2 = {
      'UAH': 'Ukrainian Hryvnia',
      'RUB': 'Russian Ruble'
    }
    const expected = [ 'USD', 'EUR', 'GBP', 'UAH', 'RUB']
    expect(makeFullCurrencyList([list1, list2], {})).toEqual(expected)
  })

  it('should return an array of six elements', () => {
    const list1 = {
      'USD': 'United States Dollar',
    }
    const list2 = {
      'RUB': 'Russian Ruble'
    }
    const synonyms = {
      'UAH': ['гривня', 'грн'],
      'RUB': ['рублей', 'руб'],
      'USD': ['баксов', 'долларов']
    }
    const expected = [ 'USD', 'баксов', 'долларов', 'RUB', 'рублей', 'руб']
    expect(makeFullCurrencyList([list1, list2], synonyms)).toEqual(expected)
  })

  it('should return an array of nine elements', () => {
    const list1 = {
      'USD': 'United States Dollar',
      'EUR': 'Euro',
      'GBP': 'British Pound'
    }
    const list2 = {
      'UAH': 'Ukrainian Hryvnia',
      'RUB': 'Russian Ruble'
    }
    const synonyms = {
      'UAH': ['гривня', 'грн'],
      'USD': ['баксов', 'долларов']
    }
    const expected = [ 'USD', 'баксов', 'долларов', 'EUR', 'GBP', 'UAH', 'гривня', 'грн', 'RUB']
    expect(makeFullCurrencyList([list1, list2], synonyms)).toEqual(expected)
  })
})

describe('parseAmountAndCurrencies', () => {
  it('should return an object with zero amount and empty currencies array', () => {
    expect(parseAmountAndCurrencies('', [])).toEqual({ amount: 0, currencies: [] })
    expect(parseAmountAndCurrencies('', [ 'UAH', 'USD' ])).toEqual({ amount: 0, currencies: [] })
    expect(parseAmountAndCurrencies('hello world!', [])).toEqual({ amount: 0, currencies: [] })
  })

  it('should return an object with amount and pair of currencies', () => {
    const input = 'Переведи 10 долларов в гривны'
    const currencies = [ 'USD', 'долларов', 'UAH', 'гривны' ]
    const expected = { amount: 10, currencies: [ 'долларов', 'гривны' ] }
    expect(parseAmountAndCurrencies(input, currencies)).toEqual(expected)
  })

  it('should return an object with amount and couple of currencies', () => {
    const input = 'Переведи 50 долларов в гривны, кроны, евро.'
    const currencies = [ 'USD', 'долларов', 'UAH', 'гривны', 'NOK', 'кроны', 'EUR', 'евро' ]
    const expected = { amount: 50, currencies: [ 'долларов', 'гривны', 'кроны', 'евро' ] }
    expect(parseAmountAndCurrencies(input, currencies)).toEqual(expected)
  })

  it('should return correct object for input with the question', () => {
    const input = 'Можешь перевести 9 крон в евро?'
    const currencies = [ 'NOK', 'крон', 'EUR', 'евро' ]
    const expected = { amount: 9, currencies: [ 'крон', 'евро' ] }
    expect(parseAmountAndCurrencies(input, currencies)).toEqual(expected)
  })

  it('should return correct object for input with the attention', () => {
    const input = 'Переведи 500 баксов в злотые!'
    const currencies = [ 'USD', 'баксов', 'PLH', 'злотые' ]
    const expected = { amount: 500, currencies: [ 'баксов', 'злотые' ] }
    expect(parseAmountAndCurrencies(input, currencies)).toEqual(expected)
  })

  it('should return correct amount for float', () => {
    const input = 'Переведи 7.5 баксов в злотые!'
    const currencies = [ 'USD', 'баксов', 'PLH', 'злотые' ]
    const expected = { amount: 7.5, currencies: [ 'баксов', 'злотые' ] }
    expect(parseAmountAndCurrencies(input, currencies)).toEqual(expected)
  })

  it('should return correct amount without space', () => {
    const input = 'Переведи 10kr в злотые!'
    const currencies = [ 'NOK', 'kr', 'PLH', 'злотые' ]
    const expected = { amount: 10, currencies: [ 'kr', 'злотые' ] }
    expect(parseAmountAndCurrencies(input, currencies)).toEqual(expected)
  })

  it('should return correct data for lowercase', () => {
    const input = '10 nok uah!'
    const currencies = [ 'NOK', 'UAH' ]
    const expected = { amount: 10, currencies: [ 'nok', 'uah' ] }
    expect(parseAmountAndCurrencies(input, currencies)).toEqual(expected)
  })

  it('should return correct amount for float and partially uppercase', () => {
    const input = 'Переведи 7.5 баксОв в злоТые!'
    const currencies = [ 'USD', 'баксов', 'PLH', 'злотые' ]
    const expected = { amount: 7.5, currencies: [ 'баксОв', 'злоТые' ] }
    expect(parseAmountAndCurrencies(input, currencies)).toEqual(expected)
  })

  it('should return correct amount without space and uppercase', () => {
    const input = 'Переведи 10KR в ЗЛОТЫЕ!'
    const currencies = [ 'NOK', 'kr', 'PLH', 'злотые' ]
    const expected = { amount: 10, currencies: [ 'KR', 'ЗЛОТЫЕ' ] }
    expect(parseAmountAndCurrencies(input, currencies)).toEqual(expected)
  })
})

describe('getCurrencyCodes',() => {
  it('should return an empty array', () => {
    expect(getCurrencyCodes([])).toEqual([])
  })

  it('should return an empty array for error values', () => {
    expect(getCurrencyCodes([ "hello", "world" ])).toEqual([])
  })

  it('should return correct array', () => {
    expect(getCurrencyCodes(["NOK", "USD"])).toEqual(["NOK", "USD"])
  })

  it('should return correct array for lowercase', () => {
    expect(getCurrencyCodes(["nok", "usd", "uah"])).toEqual(["NOK", "USD", "UAH"])
  })

  it('should return correct array for partially lowercase', () => {
    expect(getCurrencyCodes(["noK", "uSd", "Uah", "RUb"])).toEqual(["NOK", "USD", "UAH", "RUB"])
  })

  it('should return correct array for synonyms', () => {
    expect(getCurrencyCodes(["крон", "рублей", "баксов", "euro", "битков"])).toEqual(["NOK", "RUB", "USD", "EUR", "BTC" ])
  })
})

describe('getServiceName', () => {
  it('should return null', () => {
    expect(getServiceName([])).toBeNull()
  })

  it('should return null for feil currencies', () => {
    expect(getServiceName(["hello", "world"])).toBeNull()
  })

  it('should return "Norges Bank"', () => {
    expect(getServiceName(["PLN", "USD", "NOK", "USD"])).toEqual("Norges Bank")
  })

  it('should return "Open Exchange Rates"', () => {
    expect(getServiceName(["NOK", "UAH", "BTC"])).toEqual("Open Exchange Rates")
  })
})

describe('getCurrencyList', () => {
  beforeEach(() => {
    global.fetch = jest.fn() as jest.MockedFunction<typeof fetch>
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should return correct object with valid data', async () => {
    (global.fetch as jest.MockedFunction<typeof fetch>).mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ ...mockApiResponseAll }),
      }) as Promise<Response>
    )

    const list = await getCurrencyList()
    
    // Check that NOK is always present
    expect(list['NOK']).toEqual('Norwegian krone')
    
    // Check format of other currencies
    for (const key in list) {
      if (key !== 'NOK') {
        expect(typeof key).toEqual("string")
        expect(key.length).toEqual(3)
        expect(typeof list[key]).toEqual("string")
      }
    }
  })

  it('should handle API errors gracefully', async () => {
    (global.fetch as jest.MockedFunction<typeof fetch>).mockImplementationOnce(() =>
      Promise.reject(new Error('API Error'))
    )

    const list = await getCurrencyList()
    expect(list).toEqual({ 'NOK': 'Norwegian krone' })
  })

  it('should handle empty data sets', async () => {
    (global.fetch as jest.MockedFunction<typeof fetch>).mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({
          data: {
            dataSets: [],
            structure: {
              dimensions: {
                series: []
              }
            }
          }
        }),
      }) as Promise<Response>
    )

    const list = await getCurrencyList()
    expect(list).toEqual({ 'NOK': 'Norwegian krone' })
  })

  it('should handle invalid rate values', async () => {
    const mockResponse = {
      data: {
        dataSets: [{
          action: '',
          reportingBegin: '',
          reportingEnd: '',
          series: {
            '0:0:0:0': {
              attributes: [],
              observations: {
                '0': ['invalid']
              }
            }
          }
        }],
        structure: {
          name: '',
          description: '',
          dimensions: {
            series: [{
              id: 'BASE_CUR',
              name: 'US Dollar',
              values: [{
                id: 'USD',
                name: 'US Dollar'
              }]
            }]
          },
          attributes: {
            series: []
          }
        }
      }
    } as ExchangeRates

    (global.fetch as jest.MockedFunction<typeof fetch>).mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockResponse),
      }) as Promise<Response>
    )

    const list = await getCurrencyList()
    expect(list).toEqual({ 'NOK': 'Norwegian krone' })
  })

  it('should handle undefined or empty serie values', async () => {
    const mockResponse = {
      data: {
        dataSets: [{
          action: '',
          reportingBegin: '',
          reportingEnd: '',
          series: {
            '0:0:0:0': {
              attributes: [],
              observations: {
                '0': ['1.0']
              }
            }
          }
        }],
        structure: {
          name: '',
          description: '',
          dimensions: {
            series: [{
              id: 'BASE_CUR',
              name: '',
              values: undefined // Testing undefined values
            }]
          },
          attributes: {
            series: []
          }
        }
      }
    } as ExchangeRates

    (global.fetch as jest.MockedFunction<typeof fetch>).mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockResponse),
      }) as Promise<Response>
    )

    const list = await getCurrencyList()
    expect(list).toEqual({ 'NOK': 'Norwegian krone' })
  })

  it('should handle empty serie values array', async () => {
    const mockResponse = {
      data: {
        dataSets: [{
          action: '',
          reportingBegin: '',
          reportingEnd: '',
          series: {
            '0:0:0:0': {
              attributes: [],
              observations: {
                '0': ['1.0']
              }
            }
          }
        }],
        structure: {
          name: '',
          description: '',
          dimensions: {
            series: [{
              id: 'BASE_CUR',
              name: '',
              values: [] // Testing empty values array
            }]
          },
          attributes: {
            series: []
          }
        }
      }
    } as ExchangeRates

    (global.fetch as jest.MockedFunction<typeof fetch>).mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockResponse),
      }) as Promise<Response>
    )

    const list = await getCurrencyList()
    expect(list).toEqual({ 'NOK': 'Norwegian krone' })
  })

  it('should handle undefined serie', async () => {
    const mockResponse = {
      data: {
        dataSets: [{
          action: '',
          reportingBegin: '',
          reportingEnd: '',
          series: {
            '0:0:0:0': {
              attributes: [],
              observations: {
                '0': ['1.0']
              }
            }
          }
        }],
        structure: {
          name: '',
          description: '',
          dimensions: {
            series: [{
              id: 'WRONG_ID', // This will make find() return undefined
              name: '',
              values: [{
                id: 'USD',
                name: 'US Dollar'
              }]
            }]
          },
          attributes: {
            series: []
          }
        }
      }
    } as ExchangeRates

    (global.fetch as jest.MockedFunction<typeof fetch>).mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockResponse),
      }) as Promise<Response>
    )

    const list = await getCurrencyList()
    expect(list).toEqual({ 'NOK': 'Norwegian krone' })
  })

  it('should handle empty series array', async () => {
    const mockResponse = {
      data: {
        dataSets: [{
          action: '',
          reportingBegin: '',
          reportingEnd: '',
          series: {
            '0:0:0:0': {
              attributes: [],
              observations: {
                '0': ['1.0']
              }
            }
          }
        }],
        structure: {
          name: '',
          description: '',
          dimensions: {
            series: [] // Empty series array
          },
          attributes: {
            series: []
          }
        }
      }
    } as ExchangeRates

    (global.fetch as jest.MockedFunction<typeof fetch>).mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockResponse),
      }) as Promise<Response>
    )

    const list = await getCurrencyList()
    expect(list).toEqual({ 'NOK': 'Norwegian krone' })
  })
})

describe('getExchangeRate', () => {
  describe('DKK', () => {
    beforeEach(() => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({ ...mockApiResponseDkk }),
        }) as Promise<Response>
      )
    })

    afterEach(() => {
      jest.restoreAllMocks()
    })

    it('should return correct exchange rate', async () => {
      const rate = await getExchangeRate('DKK')
      expect(rate.id).toEqual("DKK")
      expect(rate.name).toEqual("Danish krone")
      expect(typeof rate.rate).toEqual("string")
      expect(rate.exponent).toEqual(2)
      expect(typeof rate.actualRate).toEqual("number")
    })
  })

  describe('PLN', () => {
    beforeEach(() => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({ ...mockApiResponsePln }),
        }) as Promise<Response>
      )
    })

    afterEach(() => {
      jest.restoreAllMocks()
    })

    it('should return correct exchange rate', async () => {
      const rate = await getExchangeRate('PLN')
      expect(rate.id).toEqual("PLN")
      expect(rate.name).toEqual("Polish zloty")
      expect(typeof rate.rate).toEqual("string")
      expect(rate.exponent).toEqual(0)
      expect(typeof rate.actualRate).toEqual("number")
    })
  })

  describe('Error handling', () => {
    beforeEach(() => {
      global.fetch = jest.fn() as jest.MockedFunction<typeof fetch>
    })

    afterEach(() => {
      jest.restoreAllMocks()
    })

    it('should handle fetch errors', async () => {
      (global.fetch as jest.MockedFunction<typeof fetch>).mockImplementationOnce(() => Promise.reject(new Error('Network error')))
      
      const rate = await getExchangeRate('USD')
      expect(rate).toEqual({
        id: "",
        name: "",
        rate: "",
        exponent: 0,
        actualRate: 0
      })
    })

    it('should handle empty data sets', async () => {
      (global.fetch as jest.MockedFunction<typeof fetch>).mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve({
            data: {
              dataSets: [],
              structure: {
                dimensions: {
                  series: []
                },
                attributes: {
                  series: []
                }
              }
            }
          }),
        }) as Promise<Response>
      )

      const rate = await getExchangeRate('USD')
      expect(rate).toEqual({
        id: "",
        name: "",
        rate: "",
        exponent: 0,
        actualRate: 0
      })
    })

    it('should handle missing rate value', async () => {
      (global.fetch as jest.MockedFunction<typeof fetch>).mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve({
            data: {
              dataSets: [{
                series: {
                  '0:0:0:0': {
                    observations: {
                      '0': [null]
                    }
                  }
                }
              }],
              structure: {
                dimensions: {
                  series: [{
                    id: 'BASE_CUR',
                    values: [{
                      id: 'USD',
                      name: 'US Dollar'
                    }]
                  }]
                },
                attributes: {
                  series: [{
                    id: 'UNIT_MULT',
                    values: [{
                      id: '0'
                    }]
                  }]
                }
              }
            }
          }),
        }) as Promise<Response>
      )

      const rate = await getExchangeRate('USD')
      expect(rate.actualRate).toEqual(0)
    })

    it('should handle invalid rate value', async () => {
      (global.fetch as jest.MockedFunction<typeof fetch>).mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve({
            data: {
              dataSets: [{
                series: {
                  '0:0:0:0': {
                    observations: {
                      '0': ['invalid']
                    }
                  }
                }
              }],
              structure: {
                dimensions: {
                  series: [{
                    id: 'BASE_CUR',
                    values: [{
                      id: 'USD',
                      name: 'US Dollar'
                    }]
                  }]
                },
                attributes: {
                  series: [{
                    id: 'UNIT_MULT',
                    values: [{
                      id: '0'
                    }]
                  }]
                }
              }
            }
          }),
        }) as Promise<Response>
      )

      const rate = await getExchangeRate('USD')
      expect(rate.actualRate).toEqual(0)
    })

    it('should handle missing currency information', async () => {
      (global.fetch as jest.MockedFunction<typeof fetch>).mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve({
            data: {
              dataSets: [{
                series: {
                  '0:0:0:0': {
                    observations: {
                      '0': ['1.0']
                    }
                  }
                }
              }],
              structure: {
                dimensions: {
                  series: [{
                    id: 'WRONG_ID',
                    values: [{
                      id: 'USD',
                      name: 'US Dollar'
                    }]
                  }]
                },
                attributes: {
                  series: [{
                    id: 'UNIT_MULT',
                    values: [{
                      id: '0'
                    }]
                  }]
                }
              }
            }
          }),
        }) as Promise<Response>
      )

      const rate = await getExchangeRate('USD')
      expect(rate.id).toEqual("")
      expect(rate.name).toEqual("")
    })

    it('should handle missing multiplier information', async () => {
      (global.fetch as jest.MockedFunction<typeof fetch>).mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve({
            data: {
              dataSets: [{
                series: {
                  '0:0:0:0': {
                    observations: {
                      '0': ['1.0']
                    }
                  }
                }
              }],
              structure: {
                dimensions: {
                  series: [{
                    id: 'BASE_CUR',
                    values: [{
                      id: 'USD',
                      name: 'US Dollar'
                    }]
                  }]
                },
                attributes: {
                  series: [{
                    id: 'WRONG_ID',
                    values: [{
                      id: '0'
                    }]
                  }]
                }
              }
            }
          }),
        }) as Promise<Response>
      )

      const rate = await getExchangeRate('USD')
      expect(rate.exponent).toEqual(0)
    })

    it('should handle invalid multiplier value', async () => {
      (global.fetch as jest.MockedFunction<typeof fetch>).mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve({
            data: {
              dataSets: [{
                series: {
                  '0:0:0:0': {
                    observations: {
                      '0': ['1.0']
                    }
                  }
                }
              }],
              structure: {
                dimensions: {
                  series: [{
                    id: 'BASE_CUR',
                    values: [{
                      id: 'USD',
                      name: 'US Dollar'
                    }]
                  }]
                },
                attributes: {
                  series: [{
                    id: 'UNIT_MULT',
                    values: [{
                      id: 'invalid'
                    }]
                  }]
                }
              }
            }
          }),
        }) as Promise<Response>
      )

      const rate = await getExchangeRate('USD')
      expect(rate.exponent).toEqual(0)
    })

    it('should handle rate calculations with different exponents', async () => {
      const testCases = [
        { rate: '1000', exponent: 3, expected: 1 },
        { rate: '100', exponent: 2, expected: 1 },
        { rate: '10', exponent: 1, expected: 1 },
        { rate: '1', exponent: 0, expected: 1 },
        { rate: '0.1', exponent: -1, expected: 1 },
        { rate: '0.01', exponent: -2, expected: 1 },
        { rate: '0.001', exponent: -3, expected: 1 }
      ]

      for (const testCase of testCases) {
        (global.fetch as jest.MockedFunction<typeof fetch>).mockImplementationOnce(() =>
          Promise.resolve({
            json: () => Promise.resolve({
              data: {
                dataSets: [{
                  series: {
                    '0:0:0:0': {
                      observations: {
                        '0': [testCase.rate]
                      }
                    }
                  }
                }],
                structure: {
                  dimensions: {
                    series: [{
                      id: 'BASE_CUR',
                      values: [{
                        id: 'USD',
                        name: 'US Dollar'
                      }]
                    }]
                  },
                  attributes: {
                    series: [{
                      id: 'UNIT_MULT',
                      values: [{
                        id: testCase.exponent.toString()
                      }]
                    }]
                  }
                }
              }
            }),
          }) as Promise<Response>
        )

        const rate = await getExchangeRate('USD')
        expect(rate.actualRate).toBeCloseTo(testCase.expected, 10)
      }
    })

    describe('rate extraction from observations', () => {
      it('should handle missing observations object', async () => {
        (global.fetch as jest.MockedFunction<typeof fetch>).mockImplementationOnce(() =>
          Promise.resolve({
            json: () => Promise.resolve({
              data: {
                dataSets: [{
                  series: {
                    '0:0:0:0': {
                      // No observations property
                    }
                  }
                }],
                structure: {
                  dimensions: {
                    series: [{
                      id: 'BASE_CUR',
                      values: [{
                        id: 'USD',
                        name: 'US Dollar'
                      }]
                    }]
                  },
                  attributes: {
                    series: [{
                      id: 'UNIT_MULT',
                      values: [{
                        id: '0'
                      }]
                    }]
                  }
                }
              }
            }),
          }) as Promise<Response>
        )

        const rate = await getExchangeRate('USD')
        expect(rate.rate).toEqual("")
      })

      it('should handle missing observations array', async () => {
        (global.fetch as jest.MockedFunction<typeof fetch>).mockImplementationOnce(() =>
          Promise.resolve({
            json: () => Promise.resolve({
              data: {
                dataSets: [{
                  series: {
                    '0:0:0:0': {
                      observations: {
                        // No '0' key
                      }
                    }
                  }
                }],
                structure: {
                  dimensions: {
                    series: [{
                      id: 'BASE_CUR',
                      values: [{
                        id: 'USD',
                        name: 'US Dollar'
                      }]
                    }]
                  },
                  attributes: {
                    series: [{
                      id: 'UNIT_MULT',
                      values: [{
                        id: '0'
                      }]
                    }]
                  }
                }
              }
            }),
          }) as Promise<Response>
        )

        const rate = await getExchangeRate('USD')
        expect(rate.rate).toEqual("")
      })

      it('should handle empty observations array', async () => {
        (global.fetch as jest.MockedFunction<typeof fetch>).mockImplementationOnce(() =>
          Promise.resolve({
            json: () => Promise.resolve({
              data: {
                dataSets: [{
                  series: {
                    '0:0:0:0': {
                      observations: {
                        '0': [] // Empty array
                      }
                    }
                  }
                }],
                structure: {
                  dimensions: {
                    series: [{
                      id: 'BASE_CUR',
                      values: [{
                        id: 'USD',
                        name: 'US Dollar'
                      }]
                    }]
                  },
                  attributes: {
                    series: [{
                      id: 'UNIT_MULT',
                      values: [{
                        id: '0'
                      }]
                    }]
                  }
                }
              }
            }),
          }) as Promise<Response>
        )

        const rate = await getExchangeRate('USD')
        expect(rate.rate).toEqual("")
      })

      it('should handle undefined observation value', async () => {
        (global.fetch as jest.MockedFunction<typeof fetch>).mockImplementationOnce(() =>
          Promise.resolve({
            json: () => Promise.resolve({
              data: {
                dataSets: [{
                  series: {
                    '0:0:0:0': {
                      observations: {
                        '0': [undefined] // Undefined value
                      }
                    }
                  }
                }],
                structure: {
                  dimensions: {
                    series: [{
                      id: 'BASE_CUR',
                      values: [{
                        id: 'USD',
                        name: 'US Dollar'
                      }]
                    }]
                  },
                  attributes: {
                    series: [{
                      id: 'UNIT_MULT',
                      values: [{
                        id: '0'
                      }]
                    }]
                  }
                }
              }
            }),
          }) as Promise<Response>
        )

        const rate = await getExchangeRate('USD')
        expect(rate.rate).toEqual("")
      })

      it('should handle null observation value', async () => {
        (global.fetch as jest.MockedFunction<typeof fetch>).mockImplementationOnce(() =>
          Promise.resolve({
            json: () => Promise.resolve({
              data: {
                dataSets: [{
                  series: {
                    '0:0:0:0': {
                      observations: {
                        '0': [null] // Null value
                      }
                    }
                  }
                }],
                structure: {
                  dimensions: {
                    series: [{
                      id: 'BASE_CUR',
                      values: [{
                        id: 'USD',
                        name: 'US Dollar'
                      }]
                    }]
                  },
                  attributes: {
                    series: [{
                      id: 'UNIT_MULT',
                      values: [{
                        id: '0'
                      }]
                    }]
                  }
                }
              }
            }),
          }) as Promise<Response>
        )

        const rate = await getExchangeRate('USD')
        expect(rate.rate).toEqual("")
      })

      it('should handle successful rate extraction', async () => {
        (global.fetch as jest.MockedFunction<typeof fetch>).mockImplementationOnce(() =>
          Promise.resolve({
            json: () => Promise.resolve({
              data: {
                dataSets: [{
                  series: {
                    '0:0:0:0': {
                      observations: {
                        '0': ['1.2345'] // Valid rate
                      }
                    }
                  }
                }],
                structure: {
                  dimensions: {
                    series: [{
                      id: 'BASE_CUR',
                      values: [{
                        id: 'USD',
                        name: 'US Dollar'
                      }]
                    }]
                  },
                  attributes: {
                    series: [{
                      id: 'UNIT_MULT',
                      values: [{
                        id: '0'
                      }]
                    }]
                  }
                }
              }
            }),
          }) as Promise<Response>
        )

        const rate = await getExchangeRate('USD')
        expect(rate.rate).toEqual("1.2345")
      })
    })
  })
})

describe('roundCurrency',() => {
  it('should round correct if less than 1', () => {
    expect(roundCurrency(0.00000124234)).toEqual(0.00000124)
    expect(roundCurrency(0.00099849223)).toEqual(0.000998)
    expect(roundCurrency(0.02355767967)).toEqual(0.0235)
  })

  it('should round correct if between 1 and 10', () => {
    expect(roundCurrency(9.1234567)).toEqual(9.123)
    expect(roundCurrency(7.7777777)).toEqual(7.778)
    expect(roundCurrency(5.5555555)).toEqual(5.556)
    expect(roundCurrency(3.3333333)).toEqual(3.333)
  })

  it('should round correct if between 10 and 10000', () => {
    expect(roundCurrency(10.857465)).toEqual(10.86)
    expect(roundCurrency(84.26580974472402)).toEqual(84.27)
    expect(roundCurrency(995.7431614295479)).toEqual(995.74)
    expect(roundCurrency(3513.03505088031)).toEqual(3513.04)
    expect(roundCurrency(5884.074717074991)).toEqual(5884.07)
  })

  it('should round correct if more than 10000', () => {
    expect(roundCurrency(19714.102)).toEqual(19714)
    expect(roundCurrency(46257.4975)).toEqual(46257)
    expect(roundCurrency(58228.276538948616)).toEqual(58228)
    expect(roundCurrency(681859.9214455937)).toEqual(681860)
    expect(roundCurrency(2472229.974636386 )).toEqual(2472230)
    expect(roundCurrency(5800881.616173422)).toEqual(5800882)
  })
})

describe('convert', () => {
  const mockExchangeRates: Array<CurrencyRateTowardsNok> = [
    {
      id: 'USD',
      name: 'US Dollar',
      rate: '10.5',
      exponent: 0,
      actualRate: 10.5
    },
    {
      id: 'EUR',
      name: 'Euro',
      rate: '11.2',
      exponent: 0,
      actualRate: 11.2
    },
    {
      id: 'NOK',
      name: 'Norwegian krone',
      rate: '1',
      exponent: 0,
      actualRate: 1
    }
  ]

  it('should convert NOK to other currencies', () => {
    const result = convert('100 NOK to USD, EUR', mockExchangeRates)
    expect(result).toContain('100 NOK = 9.524 USD')
    expect(result).toContain('100 NOK = 8.929 EUR')
  })

  it('should convert other currencies to NOK', () => {
    const result = convert('100 USD to NOK', mockExchangeRates)
    expect(result).toContain('100 USD = 1050 NOK')
  })

  it('should convert between non-NOK currencies', () => {
    const result = convert('100 USD to EUR', mockExchangeRates)
    expect(result).toContain('100 USD = 93.75 EUR')
  })

  it('should handle multiple currency conversions', () => {
    const result = convert('100 USD to EUR, NOK', mockExchangeRates)
    expect(result).toContain('100 USD = 93.75 EUR')
    expect(result).toContain('100 USD = 1050 NOK')
  })

  it('should handle decimal amounts', () => {
    const result = convert('100.5 USD to EUR', mockExchangeRates)
    expect(result).toContain('100.5 USD = 94.22 EUR')
  })

  it('should handle zero amounts', () => {
    const result = convert('0 USD to EUR', mockExchangeRates)
    expect(result).toContain('0 USD = 0 EUR')
  })

  it('should handle negative amounts', () => {
    const result = convert('-100 USD to EUR', mockExchangeRates)
    expect(result).toContain('-100 USD = -93 EUR')
  })

  it('should handle missing exchange rates', () => {
    const result = convert('100 JPY to USD', mockExchangeRates)
    expect(result).toEqual('Not enough data for currency exchange.')
  })

  it('should handle invalid input format', () => {
    const result = convert('invalid input', mockExchangeRates)
    expect(result).toEqual('Not enough data for currency exchange.')
  })

  it('should handle empty input', () => {
    const result = convert('', mockExchangeRates)
    expect(result).toEqual('Not enough data for currency exchange.')
  })

  it('should handle single currency input', () => {
    const result = convert('100 USD', mockExchangeRates)
    expect(result).toEqual('Not enough data for currency exchange.')
  })

  it('should handle duplicate currencies', () => {
    const result = convert('100 USD to USD, USD', mockExchangeRates)
    expect(result).toEqual('Not enough data for currency exchange.')
  })

  it('should handle case-insensitive currency codes', () => {
    const result = convert('100 usd to eur', mockExchangeRates)
    expect(result).toContain('100 USD = 93.75 EUR')
  })

  it('should handle currency synonyms', () => {
    const result = convert('100 dollars to euros', mockExchangeRates)
    expect(result).toContain('100 USD = 93.75 EUR')
  })

  it('should handle mixed currency formats', () => {
    const result = convert('100 USD to euros, NOK', mockExchangeRates)
    expect(result).toContain('100 USD = 93.75 EUR')
    expect(result).toContain('100 USD = 1050 NOK')
  })

  it('should handle very large numbers', () => {
    const result = convert('1000000 USD to EUR', mockExchangeRates)
    expect(result).toContain('1000000 USD = 937500 EUR')
  })

  it('should handle very small numbers', () => {
    const result = convert('0.0001 USD to EUR', mockExchangeRates)
    expect(result).toContain('0.0001 USD = 0.0000937 EUR')
  })

  it('should handle unexpected errors gracefully', () => {
    // Create a mock input that will cause an error in the conversion logic
    const result = convert('100 USD to EUR', [])
    expect(result).toEqual('Not enough data for currency exchange.')
  })

  describe('exchange rate calculations', () => {
    it('should handle zero exchange rates', () => {
      const zeroRates = [
        {
          id: 'USD',
          name: 'US Dollar',
          rate: '0',
          exponent: 0,
          actualRate: 0
        },
        {
          id: 'EUR',
          name: 'Euro',
          rate: '0',
          exponent: 0,
          actualRate: 0
        }
      ]
      const result = convert('100 USD to EUR', zeroRates)
      expect(result).toContain('100 USD = 0 EUR')
    })

    it('should handle missing base currency rate', () => {
      const missingBaseRate = [
        {
          id: 'EUR',
          name: 'Euro',
          rate: '11.2',
          exponent: 0,
          actualRate: 11.2
        }
      ]
      const result = convert('100 USD to EUR', missingBaseRate)
      expect(result).toEqual('Not enough data for currency exchange.')
    })

    it('should handle missing target currency rate', () => {
      const missingTargetRate = [
        {
          id: 'USD',
          name: 'US Dollar',
          rate: '10.5',
          exponent: 0,
          actualRate: 10.5
        }
      ]
      const result = convert('100 USD to EUR', missingTargetRate)
      expect(result).toEqual('Not enough data for currency exchange.')
    })

    it('should handle NOK as base currency with missing target rate', () => {
      const missingTargetRate = [
        {
          id: 'NOK',
          name: 'Norwegian krone',
          rate: '1',
          exponent: 0,
          actualRate: 1
        }
      ]
      const result = convert('100 NOK to EUR', missingTargetRate)
      expect(result).toEqual('Not enough data for currency exchange.')
    })

    it('should handle NOK as target currency with missing base rate', () => {
      const missingBaseRate = [
        {
          id: 'NOK',
          name: 'Norwegian krone',
          rate: '1',
          exponent: 0,
          actualRate: 1
        }
      ]
      const result = convert('100 USD to NOK', missingBaseRate)
      expect(result).toEqual('Not enough data for currency exchange.')
    })

    it('should handle very large exchange rates', () => {
      const largeRates = [
        {
          id: 'USD',
          name: 'US Dollar',
          rate: '1000000',
          exponent: 0,
          actualRate: 1000000
        },
        {
          id: 'EUR',
          name: 'Euro',
          rate: '2000000',
          exponent: 0,
          actualRate: 2000000
        }
      ]
      const result = convert('100 USD to EUR', largeRates)
      expect(result).toContain('100 USD = 50 EUR')
    })

    it('should handle very small exchange rates', () => {
      const smallRates = [
        {
          id: 'USD',
          name: 'US Dollar',
          rate: '0.000001',
          exponent: 0,
          actualRate: 0.000001
        },
        {
          id: 'EUR',
          name: 'Euro',
          rate: '0.000002',
          exponent: 0,
          actualRate: 0.000002
        }
      ]
      const result = convert('100 USD to EUR', smallRates)
      expect(result).toContain('100 USD = 50 EUR')
    })

    it('should handle exchange rates with different exponents', () => {
      const ratesWithExponents = [
        {
          id: 'USD',
          name: 'US Dollar',
          rate: '1050',
          exponent: 2,
          actualRate: 10.5
        },
        {
          id: 'EUR',
          name: 'Euro',
          rate: '1120',
          exponent: 2,
          actualRate: 11.2
        }
      ]
      const result = convert('100 USD to EUR', ratesWithExponents)
      expect(result).toContain('100 USD = 93.75 EUR')
    })

    it('should handle exchange rates with negative exponents', () => {
      const ratesWithNegativeExponents = [
        {
          id: 'USD',
          name: 'US Dollar',
          rate: '0.105',
          exponent: -1,
          actualRate: 10.5
        },
        {
          id: 'EUR',
          name: 'Euro',
          rate: '0.112',
          exponent: -1,
          actualRate: 11.2
        }
      ]
      const result = convert('100 USD to EUR', ratesWithNegativeExponents)
      expect(result).toContain('100 USD = 93.75 EUR')
    })

    it('should handle undefined actualRate in exchange rates', () => {
      const ratesWithUndefinedActualRate = [
        {
          id: 'USD',
          name: 'US Dollar',
          rate: '10.5',
          exponent: 0,
          actualRate: undefined
        },
        {
          id: 'EUR',
          name: 'Euro',
          rate: '11.2',
          exponent: 0,
          actualRate: 11.2
        }
      ] as any
      const result = convert('100 USD to EUR', ratesWithUndefinedActualRate)
      expect(result).toContain('100 USD = 0 EUR')
    })

    it('should handle null actualRate in exchange rates', () => {
      const ratesWithNullActualRate = [
        {
          id: 'USD',
          name: 'US Dollar',
          rate: '10.5',
          exponent: 0,
          actualRate: null
        },
        {
          id: 'EUR',
          name: 'Euro',
          rate: '11.2',
          exponent: 0,
          actualRate: 11.2
        }
      ] as any
      const result = convert('100 USD to EUR', ratesWithNullActualRate)
      expect(result).toContain('100 USD = 0 EUR')
    })

    it('should handle non-existent currency code in exchange rates', () => {
      const result = convert('100 XYZ to EUR', mockExchangeRates)
      expect(result).toEqual('Not enough data for currency exchange.')
    })

    it('should handle multiple currencies with undefined actualRate', () => {
      const ratesWithMultipleUndefined = [
        {
          id: 'USD',
          name: 'US Dollar',
          rate: '10.5',
          exponent: 0,
          actualRate: undefined
        },
        {
          id: 'EUR',
          name: 'Euro',
          rate: '11.2',
          exponent: 0,
          actualRate: undefined
        }
      ] as any
      const result = convert('100 USD to EUR', ratesWithMultipleUndefined)
      expect(result).toContain('100 USD = 0 EUR')
    })

    it('should handle mix of valid and undefined actualRates', () => {
      const mixedRates = [
        {
          id: 'USD',
          name: 'US Dollar',
          rate: '10.5',
          exponent: 0,
          actualRate: 10.5
        },
        {
          id: 'EUR',
          name: 'Euro',
          rate: '11.2',
          exponent: 0,
          actualRate: undefined
        },
        {
          id: 'GBP',
          name: 'British Pound',
          rate: '13.0',
          exponent: 0,
          actualRate: 13.0
        }
      ] as any
      const result = convert('100 USD to EUR, GBP', mixedRates)
      expect(result).toContain('100 USD = 0 EUR')
      expect(result).toContain('100 USD = 80.77 GBP')
    })

    it('should handle NOK conversion with undefined actualRate', () => {
      const ratesWithUndefinedNOK = [
        {
          id: 'USD',
          name: 'US Dollar',
          rate: '10.5',
          exponent: 0,
          actualRate: undefined
        },
        {
          id: 'NOK',
          name: 'Norwegian krone',
          rate: '1',
          exponent: 0,
          actualRate: 1
        }
      ] as any
      const result = convert('100 USD to NOK', ratesWithUndefinedNOK)
      expect(result).toContain('100 USD = 0 NOK')
    })

    it('should handle conversion from NOK with undefined target rate', () => {
      const ratesWithUndefinedTarget = [
        {
          id: 'USD',
          name: 'US Dollar',
          rate: '10.5',
          exponent: 0,
          actualRate: undefined
        },
        {
          id: 'NOK',
          name: 'Norwegian krone',
          rate: '1',
          exponent: 0,
          actualRate: 1
        }
      ] as any
      const result = convert('100 NOK to USD', ratesWithUndefinedTarget)
      expect(result).toContain('100 NOK = 0 USD')
    })

    it('should handle when exchangeRates.find returns undefined for base currency', () => {
      const rates = [
        {
          id: 'EUR',
          name: 'Euro',
          rate: '11.2',
          exponent: 0,
          actualRate: 11.2
        }
      ]
      // USD is not in the rates array, so find() will return undefined
      const result = convert('100 USD to EUR', rates)
      expect(result).toEqual('Not enough data for currency exchange.')
    })

    it('should handle when exchangeRates.find returns undefined for target currency', () => {
      const rates = [
        {
          id: 'USD',
          name: 'US Dollar',
          rate: '10.5',
          exponent: 0,
          actualRate: 10.5
        }
      ]
      // EUR is not in the rates array, so find() will return undefined
      const result = convert('100 USD to EUR', rates)
      expect(result).toEqual('Not enough data for currency exchange.')
    })

    it('should handle when exchangeRates.find returns undefined for one of multiple target currencies', () => {
      const rates = [
        {
          id: 'USD',
          name: 'US Dollar',
          rate: '10.5',
          exponent: 0,
          actualRate: 10.5
        },
        {
          id: 'GBP',
          name: 'British Pound',
          rate: '13.0',
          exponent: 0,
          actualRate: 13.0
        }
      ]
      // EUR is not in the rates array, but GBP is
      const result = convert('100 USD to EUR, GBP', rates)
      // Should return conversion for GBP only since EUR is not found
      expect(result).toContain('100 USD = 80.77 GBP')
      expect(result).not.toContain('EUR')
    })

    it('should handle when exchangeRates.find returns undefined for NOK conversion', () => {
      const rates = [
        {
          id: 'EUR',
          name: 'Euro',
          rate: '11.2',
          exponent: 0,
          actualRate: 11.2
        }
      ]
      // USD is not in the rates array
      const result = convert('100 USD to NOK', rates)
      expect(result).toEqual('Not enough data for currency exchange.')
    })

    it('should handle when exchangeRates.find returns undefined for conversion from NOK', () => {
      const rates = [
        {
          id: 'GBP',
          name: 'British Pound',
          rate: '13.0',
          exponent: 0,
          actualRate: 13.0
        }
      ]
      // EUR is not in the rates array
      const result = convert('100 NOK to EUR', rates)
      expect(result).toEqual('Not enough data for currency exchange.')
    })

    it('should handle empty exchangeRates array causing find to return undefined', () => {
      const result = convert('100 USD to EUR', [])
      expect(result).toEqual('Not enough data for currency exchange.')
    })

    it('should handle when exchangeRates array has no matching currencies', () => {
      const rates = [
        {
          id: 'GBP',
          name: 'British Pound',
          rate: '13.0',
          exponent: 0,
          actualRate: 13.0
        },
        {
          id: 'JPY',
          name: 'Japanese Yen',
          rate: '0.07',
          exponent: 0,
          actualRate: 0.07
        }
      ]
      // Neither USD nor EUR are in the rates array
      const result = convert('100 USD to EUR', rates)
      expect(result).toEqual('Not enough data for currency exchange.')
    })
  })

  describe('error handling', () => {
    it('should handle invalid amount input', () => {
      const result = convert('invalid USD to EUR', mockExchangeRates)
      expect(result).toContain('0 USD = 0 EUR')
    })

    it('should handle missing amount', () => {
      const result = convert('USD to EUR', mockExchangeRates)
      expect(result).toContain('0 USD = 0 EUR')
    })

    it('should handle missing target currencies', () => {
      const result = convert('100 USD', mockExchangeRates)
      expect(result).toEqual('Not enough data for currency exchange.')
    })

    it('should handle invalid currency codes', () => {
      const result = convert('100 XXX to YYY', mockExchangeRates)
      expect(result).toEqual('Not enough data for currency exchange.')
    })

    it('should handle empty exchange rates array', () => {
      const result = convert('100 USD to EUR', [])
      expect(result).toEqual('Not enough data for currency exchange.')
    })

    it('should handle exchange rates with invalid actualRate', () => {
      const invalidRates = [
        {
          id: 'USD',
          name: 'US Dollar',
          rate: 'invalid',
          exponent: 0,
          actualRate: NaN
        },
        {
          id: 'EUR',
          name: 'Euro',
          rate: '11.2',
          exponent: 0,
          actualRate: 11.2
        }
      ]
      const result = convert('100 USD to EUR', invalidRates)
      expect(result).toContain('100 USD = 0 EUR')
    })

    it('should handle exchange rates with Infinity values', () => {
      const infiniteRates = [
        {
          id: 'USD',
          name: 'US Dollar',
          rate: '10.5',
          exponent: 0,
          actualRate: Infinity
        },
        {
          id: 'EUR',
          name: 'Euro',
          rate: '11.2',
          exponent: 0,
          actualRate: 11.2
        }
      ]
      const result = convert('100 USD to EUR', infiniteRates)
      expect(result).toContain('100 USD = Infinity EUR')
    })

    it('should handle exchange rates with negative values', () => {
      const negativeRates = [
        {
          id: 'USD',
          name: 'US Dollar',
          rate: '-10.5',
          exponent: 0,
          actualRate: -10.5
        },
        {
          id: 'EUR',
          name: 'Euro',
          rate: '11.2',
          exponent: 0,
          actualRate: 11.2
        }
      ]
      const result = convert('100 USD to EUR', negativeRates)
      expect(result).toContain('100 USD = -93 EUR')
    })

    it('should handle exchange rates with very small exponents', () => {
      const smallExponentRates = [
        {
          id: 'USD',
          name: 'US Dollar',
          rate: '0.0000000001',
          exponent: -10,
          actualRate: 10.5
        },
        {
          id: 'EUR',
          name: 'Euro',
          rate: '0.0000000002',
          exponent: -10,
          actualRate: 11.2
        }
      ]
      const result = convert('100 USD to EUR', smallExponentRates)
      expect(result).toContain('100 USD = 93.75 EUR')
    })

    it('should handle exchange rates with very large exponents', () => {
      const largeExponentRates = [
        {
          id: 'USD',
          name: 'US Dollar',
          rate: '10000000000',
          exponent: 10,
          actualRate: 10.5
        },
        {
          id: 'EUR',
          name: 'Euro',
          rate: '20000000000',
          exponent: 10,
          actualRate: 11.2
        }
      ]
      const result = convert('100 USD to EUR', largeExponentRates)
      expect(result).toContain('100 USD = 93.75 EUR')
    })

    it('should handle exchange rates with mixed exponents', () => {
      const mixedExponentRates = [
        {
          id: 'USD',
          name: 'US Dollar',
          rate: '1050',
          exponent: 2,
          actualRate: 10.5
        },
        {
          id: 'EUR',
          name: 'Euro',
          rate: '0.112',
          exponent: -1,
          actualRate: 11.2
        }
      ]
      const result = convert('100 USD to EUR', mixedExponentRates)
      expect(result).toContain('100 USD = 93.75 EUR')
    })

    it('should handle exchange rates with zero exponents', () => {
      const zeroExponentRates = [
        {
          id: 'USD',
          name: 'US Dollar',
          rate: '10.5',
          exponent: 0,
          actualRate: 10.5
        },
        {
          id: 'EUR',
          name: 'Euro',
          rate: '11.2',
          exponent: 0,
          actualRate: 11.2
        }
      ]
      const result = convert('100 USD to EUR', zeroExponentRates)
      expect(result).toContain('100 USD = 93.75 EUR')
    })

    it('should handle exchange rates with missing exponents', () => {
      const missingExponentRates = [
        {
          id: 'USD',
          name: 'US Dollar',
          rate: '10.5',
          actualRate: 10.5
        },
        {
          id: 'EUR',
          name: 'Euro',
          rate: '11.2',
          actualRate: 11.2
        }
      ] as any
      const result = convert('100 USD to EUR', missingExponentRates)
      expect(result).toContain('100 USD = 93.75 EUR')
    })

    it('should handle exchange rates with missing actualRate', () => {
      const missingActualRate = [
        {
          id: 'USD',
          name: 'US Dollar',
          rate: '10.5',
          exponent: 0
        },
        {
          id: 'EUR',
          name: 'Euro',
          rate: '11.2',
          exponent: 0
        }
      ] as any
      const result = convert('100 USD to EUR', missingActualRate)
      expect(result).toContain('100 USD = 0 EUR')
    })

    it('should handle exchange rates with missing rate', () => {
      const missingRate = [
        {
          id: 'USD',
          name: 'US Dollar',
          exponent: 0,
          actualRate: 10.5
        },
        {
          id: 'EUR',
          name: 'Euro',
          exponent: 0,
          actualRate: 11.2
        }
      ] as any
      const result = convert('100 USD to EUR', missingRate)
      expect(result).toContain('100 USD = 93.75 EUR')
    })
  })
})