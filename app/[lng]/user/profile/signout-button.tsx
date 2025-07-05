'use client'

export default function SignOutButton({ label, lng }: { label: string, lng: string }) {
  const handleClick = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authorized', 'false')
      localStorage.removeItem('username')
      window.location.href = `/${lng}`
    }
  }

  return (
    <button onClick={handleClick} className='target-action__link'>
      {label}
    </button>
  )
}
