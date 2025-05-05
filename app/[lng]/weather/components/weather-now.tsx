"use client"

import React from "react"
import Image from 'next/image'
import { MapPinIcon, PencilIcon } from '@heroicons/react/24/outline'
import { ClockTimeIcon } from './icons/ClockTimeIcon'

import { type WeatherUnits, type WeatherLocales, type TimeSerie } from "./weather.types"

type WeatherNowProps = {
  units: WeatherUnits
  locales: WeatherLocales
  serie: TimeSerie
  city: string
  resetLocation: () => void
}

// Wind Chill Formula
// The commonly used formula to calculate "Feels Like" temperature in cold conditions
// Source: https://en.wikipedia.org/wiki/Wind_chill
const calculateFeelsLike = (temperature: number, windSpeed: number): number => {
  // Convert wind speed from m/s to km/h
  const windSpeedKmh = windSpeed * 3.6;

  // Apply wind chill formula (only applicable if temp < 10°C and wind > 4.8 km/h)
  if (temperature < 10 && windSpeedKmh > 4.8) {
    return (
      13.12 +
      0.6215 * temperature -
      11.37 * Math.pow(windSpeedKmh, 0.16) +
      0.3965 * temperature * Math.pow(windSpeedKmh, 0.16)
    );
  }

  // Return the air temperature if conditions are not met
  return temperature;
};

const WeatherNow: React.FC<WeatherNowProps> = ({ units, locales, serie, city, resetLocation }) => {
  const { data } = serie
  const details = data.instant.details

  const formatTime = (date: Date) => {
    return date
      .toLocaleString(locales.lang, {
        weekday: "long",
        hour: "numeric",
        minute: "numeric",
        hour12: false,
      })
      // Use a Unicode-aware regex to uppercase the first letter if it's a letter (Latin, Cyrillic, etc.)
      .replace(/^\p{L}/u, (char) => char.toUpperCase());
  };

  const weatherIcon = data.next_1_hours?.summary.symbol_code 
    || data.next_6_hours?.summary.symbol_code 
    || data.next_12_hours?.summary.symbol_code 
    || "clearsky_day"

  const precipitationAmount = 
    data.next_1_hours?.details.precipitation_amount
    || data.next_6_hours?.details.precipitation_amount
    || data.next_12_hours?.details.precipitation_amount
    || 0

  const feelsLike = Math.round(calculateFeelsLike(details.air_temperature, details.wind_speed))

  return (
    <div className="p-6 max-w-md mx-auto pt-10">
      <div className="flex flex-row justify-between mb-4">
        <div className="text-sm text-gray-700">
          <ClockTimeIcon className="w-4 h-4 mr-1 inline" />
          <span className="align-middle">{formatTime(new Date())}</span>
        </div>
        <div className="text-sm text-gray-700">
          <MapPinIcon className="w-4 h-4 mr-1 inline" />
          <button className="align-middle border-b border-gray-700" onClick={resetLocation}>
            <span className="align-middle">{city}</span>
            <PencilIcon className="w-4 h-4 ml-2 inline" />
          </button>
        </div>
      </div>
      <div className="flex items-center space-x-4 pt-4">
        <div className="flex items-center justify-center rounded-full w-16 h-16 text-white text-2xl">
          <Image
            width={64}
            height={64}
            src={`/images/weather/icons/${weatherIcon}.png`}
            alt="Weather icon"
            priority
          />
        </div>
        { details.air_temperature <= 0 && (
          <div className="text-5xl font-bold text-blue-800 pb-4">{Math.round(details.air_temperature)}°</div>
        )}
        { details.air_temperature > 0 && (
          <div className="text-5xl font-bold text-red-800 pb-4">{Math.round(details.air_temperature)}°</div>
        )}
      </div>
      <div className="mt-4 text-sm text-gray-600">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <div className="w-4 mr-1">
              <Image
                className="mx-auto"
                src="/icons/weather/temperature-half-solid.svg"
                width={10}
                height={16}
                alt="Temperature icon"
              />
            </div>
            <span>{locales.feels_like}</span>
          </div>
          <span className="text-blue-800">{feelsLike}°</span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <div className="w-4 mr-1">
              <Image
                className="mx-auto w-4"
                src="/icons/weather/umbrella-solid.svg"
                width={15}
                height={15}
                alt="Umbrella icon"
              />
            </div>
            <span>{locales.precipitation}</span>
          </div>
          <span>{precipitationAmount} {units.precipitation_amount}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-4 mr-1">
              <Image
                className="mx-auto w-3"
                src="/icons/weather/wind-solid.svg"
                width={18}
                height={16}
                alt="Wind icon"
              />
            </div>  
            <span>{locales.wind}</span>
          </div>
          <span>
            {details.wind_speed} {units.wind_speed}
            {/* TODO: display correct arrow direction */}
            {/* ↖ */}
            {/* ({details.wind_from_direction} {units.wind_from_direction}) */}
          </span>
        </div>
      </div>
    </div>
  )
}

export default WeatherNow
