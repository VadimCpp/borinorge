'use client'

import React from "react"

type ErrorLocationProps = {
  labelTryAgain: string // Label for the retry button
  labelManualInput: string // Label for the manual input button
  message: string // Error message to display
  onRetry: () => void // Callback function to retry the operation
  onManualLocation: () => void // Callback function to retry the operation
}

export const ErrorLocation: React.FC<ErrorLocationProps> = ({ 
  labelTryAgain,
  labelManualInput,
  message,
  onRetry,
  onManualLocation
}) => {
  return (
    <div className="flex flex-col items-center justify-center pt-24 px-6">
      {/* Error Message */}
      <p className="pb-8 text-center text-red-700">
        {message}
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={onRetry}
          className="target-action__link"
        >
          {labelTryAgain}
        </button>

        <button
          onClick={onManualLocation}
          className="target-action__link"
        >
          {labelManualInput}
        </button>
      </div>
    </div>
  )
}
