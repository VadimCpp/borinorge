"use client"

import React from "react"
import Image from 'next/image'
import { ClockIcon } from '@heroicons/react/24/outline'

import { type WeatherLocales, type TimeSerie, type TimeSerieData } from "./weather.types"

type WeatherNextProps = {
  locales: WeatherLocales
  series: Array<TimeSerie> 
}

const WeatherNext: React.FC<WeatherNextProps> = ({ locales, series }) => {

  const formatTime = (date: Date) => {
    return date
      .toLocaleString(locales.lang, {
        hour: "numeric",
        minute: "numeric",
        hour12: false,
      })
      // Use a Unicode-aware regex to uppercase the first letter if it's a letter (Latin, Cyrillic, etc.)
      .replace(/^\p{L}/u, (char) => char.toUpperCase());
  };

  const getWeatherIcon = (data: TimeSerieData) => {
    return (
      data?.next_1_hours?.summary.symbol_code
      || data?.next_6_hours?.summary.symbol_code
      || data?.next_12_hours?.summary.symbol_code
      || "clearsky_day"
    )
  }

  return (
    <div className="p-6 pt-0 max-w-md mx-auto">
      <div className="flex flex-col justify-center">
        {series?.map((item, index) => (
          <div key={index} className="flex justify-between py-1">
            <div className="flex items-center text-sm text-gray-700 pr-4">
              <ClockIcon className="w-4 h-4 mr-1 inline" />
              <span className="align-middle">{formatTime(new Date(item.time))}</span>
            </div>
            <div className="flex">
              <div className="flex items-center justify-center rounded-full text-white text-xl pr-2">
                <Image
                  width={32}
                  height={32}
                  src={`/images/weather/icons/${getWeatherIcon(item.data)}.png`}
                  alt="Weather icon"
                  priority
                />
              </div>
              <div className={`text-xl min-w-[50px] font-bold text-center ${
                item.data.instant.details.air_temperature <= 0 ? 'text-blue-800' : 'text-red-800'
              }`}>
                {Math.round(item.data.instant.details.air_temperature)}°
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default WeatherNext
