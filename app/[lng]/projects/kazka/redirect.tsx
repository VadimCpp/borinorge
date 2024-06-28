"use client"
import React, { useState, useEffect } from 'react'

const RedirectComponent = ({ url }: { url: string }) => {
  const [counter, setCounter] = useState(10)

  useEffect(() => {
    if(counter > 0) {
      const timer = setTimeout(() => setCounter(counter - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      window.location.href = url
    }
  }, [counter, url])

  return (
    <div className="project__paragraph">
      Реєстрація відкриєтья автоматично через {counter} секунд...
    </div>
  )
}

export default RedirectComponent
