// app/api/geonorge/route.ts
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    // Get the query parameters from the request, e.g. /api/geonorge?q=Oslo
    const url = new URL(request.url)
    const q = url.searchParams.get('q')

    if (typeof q !== 'string' || q.length < 4) {
      return NextResponse.json(
        { message: 'Missing or invalid q parameter' },
        { status: 400 }
      )
    }

    // Search up to 5 hits
    const filter = encodeURIComponent('navn.skrivemåte,navn.fylker.fylkesnavn,navn.kommuner.kommunenavn,navn.representasjonspunkt.nord,navn.representasjonspunkt.øst')
    const geonorgeUrl = 
      `https://ws.geonorge.no/stedsnavn/v1/navn?sok=${encodeURIComponent(q)}`
      + `&filtrer=${filter}&treffPerSide=5&side=1`

    // Expected response: { navn: [...], metadata: { ... } }
    /*
      {
        "navn": [
          {
            "fylker": [
              {
                "fylkesnavn": "Buskerud"
              }
            ],
            "kommuner": [
              {
                "kommunenavn": "Drammen"
              }
            ],
            "representasjonspunkt": {
              "nord": 59.54228,
              "øst": 10.37813
            },
            "skrivemåte": "Berger"
          },
          {
            "fylker": [
              {
                "fylkesnavn": "Akershus"
              }
            ],
            "kommuner": [
              {
                "kommunenavn": "Nesodden"
              }
            ],
            "representasjonspunkt": {
              "nord": 59.83305,
              "øst": 10.69409
            },
            "skrivemåte": "Berger"
          },
          ...
        ]
      }
    */

    const response = await fetch(geonorgeUrl)
    if (!response.ok) {
      // Return any upstream error from GeoNorge
      return NextResponse.json(
        { message: 'Failed to fetch from GeoNorge' },
        { status: 400 }
      )
    }

    const data = await response.json()
    // data typically has shape: { navn: [...], metadata: { ... } }

    // Transform the raw data to only what you need
    // Example: store city, fylke, lat, and lon for each suggestion
    // Some records might have partial data, so be sure to handle that gracefully
    const suggestions =
      data?.navn?.map((item: any) => ({
        city: item["skrivemåte"] ?? "",
        fylke: item.fylker?.[0]?.fylkesnavn ?? "",
        kommune: item.kommuner?.[0]?.kommunenavn ?? "",
        lat: item.representasjonspunkt?.["nord"] ?? null,
        lng: item.representasjonspunkt?.["øst"] ?? null,
      })) ?? []

    return NextResponse.json(suggestions)
  } catch (error: any) {
    console.error(error)
    // Handle and forward error to the client
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    )
  }
}
