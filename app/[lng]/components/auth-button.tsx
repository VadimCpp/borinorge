"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRightOnRectangleIcon, UserCircleIcon } from '@heroicons/react/24/outline'

export default function AuthButton({ lng }: { lng: string }) {
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = localStorage.getItem('authorized')
      setAuthorized(auth === 'true')
    }
  }, [])

  if (authorized) {
    return (
      <Link href={`/${lng}/profile`} className="header__nav-link">
        <UserCircleIcon className="w-6 h-6" aria-label="User profile" />
      </Link>
    )
  }

  return (
    <Link href={`/${lng}/signin`} className="header__nav-link">
      <ArrowRightOnRectangleIcon className="w-6 h-6" aria-label="Sign In" />
    </Link>
  )
}
