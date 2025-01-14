"use client"

import Link from 'next/link'
import { useState, useCallback, useEffect } from "react"

interface ExchangesProps {
  description: string
  exchangeLabel: string
  randomLabel: string
  placeholder1: string
  placeholder2: string
  authorInfo: string
  contactUs: string
}

export const isNorwegianWordWithArticle = (str: string) => {
  // Regular expression to match Norwegian articles followed by a space and then any word
  const regex = /^(en|et|ei)\s+[a-zæøåA-ZÆØÅ]+$/i

  // Test the string against the regex
  return regex.test(str)
}


type SearchResponse = {
  meta: {
    bm: {
      total: number
    }
  },
  articles: {
    bm: Array<number>
  }
}

type ArticleResponse = {
  article_id: number
  submitted: string
  suggest: Array<string>
  lemmas: Array<{
    final_lexeme: string
    hgno: number
    id: number
    inflection_class: "m1" | "m1, f1"
    lemma: string
    paradigm_info: Array<{
      from: string
      inflection: Array<{
        tags: Array<"Sing" | "Plur" | "Ind" | "Def">
        word_form: string
      }>
      inflection_group: "NOUN_regular"
      paradigm_id: number
      standardisation: string
      tags: Array<"NOUN" | "Masc" | "Fem">
      to: null
    }>
    split_inf: boolean
  }>,
  body: {
    etymology: Array<{
      type_: "etymology_reference"
      content: string
      items: Array<{
        type_: "entity"
        id: string
      } | {
        type_: "usage"
        items: Array<{
          type_: "article_ref"
          article_id: number
          lemmas: Array<{
            type_: "lemma"
            hgno: number
            id: number
            lemma: string
          }>
          definition_id: number | null
        }>
        text: string
      } | {
        type_: "article_ref",
        article_id: number,
        lemmas: [
          {
            type_: "lemma"
            hgno: number
            id: number
            lemma: string
          }
        ],
        definition_id: null
      }>
    }>,
    definitions: Array<{
      type_: "definition"
      elements: Array<{
        type_: string
        content?: string
        items?: Array<any>
        elements?: Array<any>
        id?: number
        sub_definition?: boolean
        intro?: {
          content: string
          items: Array<any>
        }
      }>
      id: number
      sub_definition: boolean
    }>
  }
  to_index?: Array<string>
  edit_state?: string
}

export default function Exchanges(props: ExchangesProps) {
  const {
    description,
    exchangeLabel,
    randomLabel,
    placeholder1,
    placeholder2,
    authorInfo,
    contactUs,
  } = props

  const [inputValue, setInputValue] = useState('')
  const [value, setValue] = useState('')
  const [result, setResult] = useState('')
  const [counter, setCounter] = useState(0)
  
  const getWord = useCallback(async () => {
    console.log("Get word inflection.")
    try {
      if (!isNorwegianWordWithArticle(value)) {
        throw new Error("Det er ikke et norsk ord med artikkel.")
      }

      const ord = value.split(" ")[1]
      const url1 = encodeURI(`https://ord.uib.no/api/articles?w=${ord}&dict=bm&wc=NOUN&scope=e`)
      const response1 = await fetch(url1)
      const data1 = await response1.json() as SearchResponse

      if (data1.meta.bm.total === 0) {
        throw new Error("Det er ikke et ord i Bokmålsordboka.")
      }

      const wordId = data1.articles.bm[0]
      const url2 = `https://ord.uib.no/bm/article/${wordId}.json`
      const response2 = await fetch(url2)
      const data2 = await response2.json() as ArticleResponse

      if (!data2.lemmas?.length) {
        throw new Error("No inflection found.")
      }

      let result: string = ""
      for (const lemma of data2.lemmas) {
        if (lemma.lemma !== ord) {
          console.log(`Ignore lemma: ${lemma.lemma}`)
        } else if (!lemma.paradigm_info.length) {
          console.log(`Ignore empty paradigm_info for lemma: ${lemma.lemma}`)  
        } else {
          for(const paradigm of lemma.paradigm_info) {
            if (paradigm.inflection_group !== "NOUN_regular") {
              console.log(`Ignore inflection_group (${paradigm.inflection_group}) for lemma: ${lemma.lemma}`)
            } else if (!paradigm.tags.length) {
              console.log(`Ignore empty tags fot lemma's paradigm: ${JSON.stringify(paradigm)}`)
            } else {
              result += `${paradigm.tags.join(',')}:\n`
              paradigm.inflection.forEach(inflection => {
                if (!inflection.tags.length) {
                  console.log(`Ignore empty tags for lemma's inflection: ${JSON.stringify(inflection)}`)
                } else {
                  result += `${inflection.tags.join(',')}: ${inflection.word_form}\n`
                }
              })
              result += "\n"
            }
          }
        }
      }
      
      setResult(result)
  
    } catch (error: any) {
      setResult("Error: " + error.message)
    }
  }, [value])

  const getManyRandomWords = useCallback(async () => {
    let i = 60
    let all = ""
    const id = setInterval(async () => {
      if (i <= 0) {
        clearInterval(id)

        if (all.length === 0) {
          setResult("No inflection NOUN found.")
        } else {
          setResult(all)
          setInputValue("")
          setCounter(0)
        }
      } else {
        setCounter(i)
        i--

        try {
          const baseId = Math.floor(Math.random() * 56000) + 1
          console.log(`Get word inflection for baseId: ${baseId}`)

          const url = `https://ord.uib.no/bm/article/${baseId}.json`
          const response = await fetch(url)
          const data = await response.json() as ArticleResponse

          if (!data.lemmas?.length) {
            throw new Error("No inflection found.")
          }
    
          let result: string = ""
          for (const lemma of data.lemmas) {
            for(const paradigm of lemma.paradigm_info) {
              if (!["NOUN_regular"].includes(paradigm.inflection_group)) {
                console.log(`Ignore lemma (${paradigm.inflection_group}): ${lemma.lemma}`)
              } else if (!paradigm.tags.length) {
                console.log(`Ignore empty tags fot lemma's paradigm: ${JSON.stringify(paradigm)}`)
              } else {

                const tags = paradigm.tags.join(', ')
                result += `${tags}:\n`
                paradigm.inflection.forEach(inflection => {
                  if (!inflection.tags.length) {
                    console.log(`Ignore empty tags for lemma's inflection: ${JSON.stringify(inflection)}`)
                  } else {
                    result += `${inflection.tags.join(',')}: ${inflection.word_form}\n`
                  }
                })
                result += "\n"
                setInputValue(lemma.lemma)
              }
            }
          }

          if (result) {
            all = `${baseId}\n${result}\n\n${all}`
            setResult(all)
            
          }
        } catch (error: any) {
          console.error("Error: " + error.message)
        }
      }
    }, 200)


  }, [])

  useEffect(() => {
    if (value) { // This check ensures doExchange is not called with an empty value
      getWord();
    }
  }, [value, getWord]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  }

  const handleSubmit = (event: React.FormEvent) => {
    console.log("Handle submit")
    event.preventDefault()
    setValue(inputValue)
  }

  return true ? (
    <>
      <div className="project__paragraph">
        <span>{description}</span>
        <ul>
          {["en katt", "et hus", "ei høne"].map((word, key) => (
            <li key={key} className="pb-1">
              <a
                className="underline underline-offset-4 text-blue-700 cursor-pointer"
                onClick={() => {
                  setValue(word)
                  setInputValue(word)
                }}
              >
                {word}
              </a>
            </li>
          ))}
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
        <button
          type="button"
          className="target-action__link ml-2"
          onClick={() => {
            console.log("Get some random words.")
            getManyRandomWords()
          }}
        >
          <span>{randomLabel}</span>
          {!!counter && <span className="text-xs pl-2">{counter}</span>}
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
