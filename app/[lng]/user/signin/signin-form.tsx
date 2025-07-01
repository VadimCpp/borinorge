"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Labels {
  username: string
  password: string
  submit: string
}

export default function SignInForm({ lng, labels }: { lng: string; labels: Labels }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (typeof window !== 'undefined') {
      localStorage.setItem('authorized', 'true')
    }
    router.push(`/${lng}`)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="input input-bordered border-2 rounded-md border-gray-500 w-full p-2 text-gray-600"
        placeholder={labels.username}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="input input-bordered border-2 rounded-md border-gray-500 w-full p-2 text-gray-600"
        placeholder={labels.password}
      />
      <button type="submit" className="target-action__link">
        {labels.submit}
      </button>
    </form>
  )
}
