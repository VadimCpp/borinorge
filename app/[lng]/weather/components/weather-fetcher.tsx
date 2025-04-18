'use client'

import React, { FC, useCallback, useEffect, useState } from 'react'
import { type WeatherLocales, type WeatherData, type TimeSerie } from "./weather.types"
import WeatherNow from './weather-now'
import WeatherNext from './weather-next'
import { useGeolocation } from "./hooks/useGeolocation"
import { LoadingIndicator } from "./loading-indicator"
import { ErrorMessage } from "./error-weather"
import { ErrorLocation } from "./error-location"
import { LocationSelector } from "./location-selector"
import { ManualLocation } from "./manual-location"

type WeatherFetcherProps = {
  locales: WeatherLocales
}

function findTimeSeries(timeseries: TimeSerie[], currentTime: Date): { current: TimeSerie, nextHours: Array<any> } | null {
  // Convert the current time to a Date object for comparison
  const currentTimeMillis = currentTime.getTime();
  const hoursToShow = 12;

  for (let i = 0; i < timeseries.length - 1; i++) {
    const currentSeriesTimeMillis = new Date(timeseries[i].time).getTime();
    const nextSeriesTimeMillis = new Date(timeseries[i + 1].time).getTime();

    // Check if current time falls within the range of this time series
    if (currentTimeMillis >= currentSeriesTimeMillis && currentTimeMillis < nextSeriesTimeMillis) {
      let nextHour = i + 1;

      return { current: timeseries[i], nextHours: timeseries.slice(nextHour, nextHour + hoursToShow) };
    }
  }

  // Handle case where current time is beyond the last time in the series
  const lastSeriesTimeMillis = new Date(timeseries[timeseries.length - 1].time).getTime();
  if (currentTimeMillis >= lastSeriesTimeMillis) {
    return { current: timeseries[timeseries.length - 1], nextHours: [] };
  }

  // If no match is found
  return null;
}

const WeatherFetcher: FC<WeatherFetcherProps> = ({ locales }) => {
  const {
    latitude,
    longitude,
    city,
    geoError,
    isLoadingPosition,
    getCurrentPosition,
    resetLocation,
    setGeolocationAndCity,
  } = useGeolocation()
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [weatherNow, setWeatherNow] = useState<TimeSerie | null>(null)
  const [weatherNext, setWeatherNext] = useState<TimeSerie[] | null>(null)
  const [weatherLoading, setWeatherLoading] = useState<boolean>(false)
  const [weatherError, setWeatherError] = useState<string | null>(null)
  const [verboseLocation, setVerboseLocation] = useState<string>("Not set")
  const [locationSelectorVisible, setLocationSecectorVisible] = useState<boolean>(false)
  const [locationManualVisible, setLocationManualVisible] = useState<boolean>(false)

  useEffect(() => {
    if (city) {
      setVerboseLocation(city)
    } else if (latitude && longitude) {
      setVerboseLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`)
    } else {
      setVerboseLocation("Not set")
    }
  }, [city, latitude, longitude])

  useEffect(() => {
    const timeseries = weather?.properties.timeseries
    if (timeseries) {
      let weather = findTimeSeries(timeseries, new Date());
      setWeatherNow(weather?.current || null)
      setWeatherNext(weather?.nextHours || null)
    }
  }, [weather])

  const fetchWeather = useCallback(async () => {
    if (!latitude || !longitude) {
      console.log('Skipping weather fetch, no lat/lon')
      return
    }

    try {
      console.log('Fetching weather for:', latitude, longitude, city)
      setWeatherLoading(true);
      const res = await fetch(`/api/weather?lat=${latitude}&lon=${longitude}`);

      if (!res.ok) {
        // Convert HTTP status to an error message
        throw new Error(`Request failed with status ${res.status}`);
      }

      const data: WeatherData = await res.json();
      setWeather(data);
    } catch (err) {
      setWeatherError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setWeatherLoading(false);
    }
  }, [latitude, longitude, city]);


  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);


  if (locationSelectorVisible) {
    return <LocationSelector
      locales={locales}
      onDetectLocation={() => {
        setLocationSecectorVisible(false)
        getCurrentPosition()
      }}
      onManualLocation={() => {
        setLocationSecectorVisible(false)
        setLocationManualVisible(true)
      }}
    />
  }

  if (locationManualVisible) {
    return <ManualLocation
      locales={locales}
      onLocationSelected={(lat, lon, city) => {
        setLocationSecectorVisible(false)
        setLocationManualVisible(false)
        setGeolocationAndCity(lat, lon, city)
      }}
    />
  }

  if (isLoadingPosition) {
    return <LoadingIndicator label="Getting geolocation..." />;
  }

  if (geoError) {
    return <ErrorLocation
      labelTryAgain={locales.try_again}
      labelManualInput={locales.enter_location_manually}
      message={locales.locationErrors[geoError]}
      onRetry={getCurrentPosition}
      onManualLocation={() => {
        setLocationSecectorVisible(false)
        setLocationManualVisible(true)
      }}
    />
  }

  if (weatherLoading) {
    return <LoadingIndicator label="Getting weather..." />;
  }

  if (weatherError) {
    return <ErrorMessage
      label={locales.try_again}
      message={`Error getting weather: ${weatherError}`}
      onRetry={fetchWeather}
    />
  }

  if (!weather || !weatherNow) {
    return <ErrorMessage
      label={locales.try_again}
      message={"No weather data available."}
      onRetry={fetchWeather}
    />
  }

  return (
    <>
      <WeatherNow
        units={weather.properties.meta.units}
        locales={locales}
        serie={weatherNow}
        city={verboseLocation}
        resetLocation={() => {
          resetLocation()
          setLocationSecectorVisible(true)
        }}
      />
      {weatherNext && (
        <WeatherNext
          locales={locales}
          series={weatherNext}
        />
      )}
    </>
  )
}

export default WeatherFetcher

// TODO: Fetch city name from coordinates
// Force city search on Enter press
// Cache city name
