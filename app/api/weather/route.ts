// app/api/weather/route.ts
import { NextResponse } from 'next/server'
// NOTE! Uncomment for testing
// import testWeather from './example.json'

// This function handles GET requests to /api/hello
export async function GET(request: Request) {
  // You can do database operations or any other server-side logic here
  try {
    // Get the query parameters from the request, e.g. /api/weather?lat=59.911491&lon=10.757933
    const url = new URL(request.url)
    const lat = url.searchParams.get('lat')
    const lon = url.searchParams.get('lon')

    if (typeof lat !== 'string' || typeof lon !== 'string') {
      return NextResponse.json(
        { message: 'Missing or invalid lat/lon parameters' },
        { status: 400 }
      )
    }

    // Convert lat/lon to numbers and truncate to 4 decimals
    const latTruncated = parseFloat(parseFloat(lat).toFixed(4))
    const lonTruncated = parseFloat(parseFloat(lon).toFixed(4))

    // Validate the parsed coordinates
    if (isNaN(latTruncated) || isNaN(lonTruncated)) {
      return NextResponse.json(
        { message: 'Lat/Lon must be valid numbers' },
        { status: 400 }
      )
    }

    // MET Weather API requires a unique User-Agent
    const headers = {
      'User-Agent': 'ArWeatherApiForUkrainereINorge/1.0.0 borinorge.no/weather vadym.kaninskyi@gmail.com',
      'Accept-Encoding': 'gzip, deflate',
    }

    // Using the Locationforecast 2.0 (compact) endpoint
    const response = await fetch(
      `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${latTruncated}&lon=${lonTruncated}`,
      {
        headers,
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch weather data')
    }

    const data = await response.json()

    // NOTE! Uncomment for testing
    // const data = testWeather

    // Forward the API response to the client
    return NextResponse.json(data)
  } catch (error: any) {
    console.error(error)
    // Handle and forward error to the client
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    )
  }
}

// If you want to support POST, PATCH, etc., simply export additional functions:
// export async function POST(request: Request) { ... }
