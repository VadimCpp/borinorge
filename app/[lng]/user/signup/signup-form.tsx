"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Labels {
  email: string
  password: string
  'confirm-password': string
  submit: string
  'confirm-registration': string
  'confirmation-code': string
  'passwords-not-match': string
  'signup-success': string
  'confirmation-success': string
}

export default function SignUpForm({ lng, labels }: { lng: string; labels: Labels }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [confirmationCode, setConfirmationCode] = useState('')
  const [isSignupComplete, setIsSignupComplete] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsLoading(true)

    if (password !== confirmPassword) {
      setError(labels['passwords-not-match'])
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(labels['signup-success'])
        setIsSignupComplete(true)
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('An error occurred during signup')
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfirmation = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code: confirmationCode }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(labels['confirmation-success'])
        // Redirect to signin page after successful confirmation
        setTimeout(() => {
          router.push(`/${lng}/user/signin`)
        }, 2000)
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('An error occurred during confirmation')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSignupComplete) {
    return (
      <div className="space-y-4">
        <div className="text-green-600 font-medium">{success}</div>
        <form onSubmit={handleConfirmation} className="space-y-4">
          <input
            type="text"
            value={confirmationCode}
            onChange={(e) => setConfirmationCode(e.target.value)}
            className="input input-bordered border-2 rounded-md border-gray-500 w-full p-2 text-gray-600"
            placeholder={labels['confirmation-code']}
            required
          />
          <button 
            type="submit" 
            className="target-action__link"
            disabled={isLoading}
          >
            {isLoading ? 'Confirming...' : labels['confirm-registration']}
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {error && <div className="text-red-600 font-medium">{error}</div>}
      {success && <div className="text-green-600 font-medium">{success}</div>}
      
      <form onSubmit={handleSignup} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input input-bordered border-2 rounded-md border-gray-500 w-full p-2 text-gray-600"
          placeholder={labels.email}
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input input-bordered border-2 rounded-md border-gray-500 w-full p-2 text-gray-600"
          placeholder={labels.password}
          required
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="input input-bordered border-2 rounded-md border-gray-500 w-full p-2 text-gray-600"
          placeholder={labels['confirm-password']}
          required
        />
        <button 
          type="submit" 
          className="target-action__link"
          disabled={isLoading}
        >
          {isLoading ? 'Signing up...' : labels.submit}
        </button>
      </form>
    </div>
  )
}
