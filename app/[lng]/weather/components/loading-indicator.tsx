'use client'

import React from "react"

type LoadingIndicatorProps = {
  label: string // Label text to display under the loader
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ label }) => {
  return (
    <div className="flex flex-col items-center justify-center pt-24">
      {/* Cupertino-style loader */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
      </div>
      {/* Label below the loader */}
      <div className="mt-4 text-sm text-gray-600">{label}</div>
    </div>
  )
}
