'use client'

import React from "react"
import { type WeatherLocales } from "./weather.types"

type LocationSelectorProps = {
  onDetectLocation: () => void
  onManualLocation: () => void
  locales: WeatherLocales
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  onDetectLocation,
  onManualLocation,
  locales
}) => {
  return (
    <div className="flex flex-col items-center justify-center pt-24 px-6">
      {/* Instructional Message */}
      <p className="pb-8 text-center text-gray-800">
        {locales.manual_or_automatically}
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={onDetectLocation}
          className="target-action__link"
        >
          {locales.detect_my_location}
        </button>

        <button
          onClick={onManualLocation}
          className="target-action__link"
        >
          {locales.enter_location_manually}
        </button>
      </div>
    </div>
  )
}
