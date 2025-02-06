export type WeatherUnits = {
  air_pressure_at_sea_level: string,
  air_temperature: string,
  cloud_area_fraction: string,
  precipitation_amount: string,
  relative_humidity: string,
  wind_from_direction: string,
  wind_speed: string
}

export type TimeSerie = {
  time: string;
  data: {
    instant: {
      details: {
        air_pressure_at_sea_level: number
        air_temperature: number
        relative_humidity: number
        cloud_area_fraction: number
        wind_from_direction: number
        wind_speed: number
      }
    },
    next_12_hours?: {
      summary: {
        symbol_code: string
      },
      details: {
        precipitation_amount?: number
      }
    },
    next_1_hours?: {
      summary: {
        symbol_code: string
      },
      details: {
        precipitation_amount?: number
      }
    },
    next_6_hours?: {
      summary: {
        symbol_code: string
      },
      details: {
        precipitation_amount?: number
      }
    }
  }
}

export type WeatherData = {
  type: string
  geometry: {
    type: string
    coordinates: [number, number, number]
  }
  properties: {
    meta: {
      updated_at: string
      units: WeatherUnits
    }
    timeseries: Array<TimeSerie>
  }
}

export type LocationErrors = {
  user_denied_the_request_for_geolocation: string
  location_information_is_unavailable: string
  the_request_to_get_user_location_timed_out: string
  browser_location_services_disabled: string
  browser_permissions_services_unavailable: string
  an_unknown_error_occurred: string
}

export type WeatherLocales = {
  lang: string
  feels_like: string
  precipitation: string
  wind: string
  locationErrors: LocationErrors
  try_again: string
  manual_or_automatically: string
  detect_my_location: string
  enter_location_manually: string
  enter_norwegian_address: string
  manual_location_error: string
  read_the_ukr_newspaper: string
}
