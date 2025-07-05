"use client"

import { useEffect, useState } from 'react'
import { useTranslation } from '../../i18n'

interface PersonalizedWelcomeProps {
  lng: string
}

export default function PersonalizedWelcome({ lng }: PersonalizedWelcomeProps) {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [username, setUsername] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [t, setT] = useState<((key: string) => string) | null>(null)

  useEffect(() => {
    const loadTranslation = async () => {
      const { t: translationFunction } = await useTranslation(lng)
      setT(() => translationFunction)
    }
    
    loadTranslation()
  }, [lng])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = localStorage.getItem('authorized')
      const storedUsername = localStorage.getItem('username')
      
      setIsAuthorized(auth === 'true')
      setUsername(storedUsername || '')
      setIsLoading(false)
    }
  }, [])

  if (isLoading || !t) {
    return (
      <section id="welcome">
        <h2 className="project__subtitle">Loading...</h2>
        <p className="project__paragraph">Loading...</p>
        <p className="project__paragraph">Loading...</p>
      </section>
    )
  }

  if (isAuthorized && username) {
    return (
      <section id="welcome">
        <h2 className="project__subtitle">{t('hello-personalized').replace('{name}', username)}</h2>
        <p className="project__paragraph">{t('description-part-1')}</p>
        <p className="project__paragraph">{t('description-part-2')}</p>
      </section>
    )
  }

  return (
    <section id="welcome">
      <h2 className="project__subtitle">{t('hello')}</h2>
      <p className="project__paragraph">{t('description-part-1')}</p>
      <p className="project__paragraph">{t('description-part-2')}</p>
    </section>
  )
} 