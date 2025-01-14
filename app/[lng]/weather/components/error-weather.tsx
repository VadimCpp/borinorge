'use client'

import React from "react"

type ErrorMessageProps = {
  label: string // Error message to display
  message: string // Error message to display
  onRetry: () => void // Callback function to retry the operation
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ label, message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center pt-24 px-6">
      {/* Error Message */}
      <p className="text-red-700 pb-8">{message}</p>

      {/* Retry Button */}
      <button
        onClick={onRetry}
        className="target-action__link"
      >
        {label}
      </button>
    </div>
  )
}
