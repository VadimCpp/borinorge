// app/api/geonorge/route.ts
import { NextResponse } from 'next/server'

export type CityResponse = {
  metadata: {
    treffPerSide: number,
    side: number,
    totaltAntallTreff: number,
    sokeStreng: string,
    asciiKompatibel: boolean,
    viserFra: number,
    viserTil: number
  },
  adresser: Array<{
    adressenavn: string,
    adressetekst: string,
    adressetilleggsnavn: string | null,
    adressekode: number,
    nummer: number,
    bokstav: string,
    kommunenummer: string,
    kommunenavn: string,
    gardsnummer: number,
    bruksnummer: number,
    festenummer: number,
    undernummer: string | null,
    bruksenhetsnummer: Array<any>,
    objtype: string,
    poststed: string,
    postnummer: string,
    adressetekstutenadressetilleggsnavn: string,
    stedfestingverifisert: boolean,
    representasjonspunkt: {
      epsg: string,
      lat: number,
      lon: number
    },
    oppdateringsdato: string,
    meterDistanseTilPunkt: number
  }>
}

export async function GET(request: Request) {
  
  const formatCity = (city: string | null): string | null => {
    if (city && city.length ) {
      return city
      .toLowerCase()
      .replace(/^\p{L}/u, (char) => char.toUpperCase());
    }
    return null;
  };

  try {
    // Get the query parameters from the request, e.g. /api/city?lat=59.911491&lon=10.757933
    const url = new URL(request.url)
    const lat = url.searchParams.get('lat')
    const lon = url.searchParams.get('lon')

    if (typeof lat !== 'string' || typeof lon !== 'string') {
      return NextResponse.json(
        { message: 'Missing or invalid lat/lon parameters' },
        { status: 400 }
      )
    }

    // Search up to 1 address within 1000 meters of the given lat/lon
    const geonorgeUrl = `https://ws.geonorge.no/adresser/v1/punktsok?radius=1000&lat=${lat}&lon=${lon}&treffPerSide=1&side=1`

    const response = await fetch(geonorgeUrl)
    if (!response.ok) {
      // Return any upstream error from GeoNorge
      return NextResponse.json(
        { message: 'Failed to fetch from GeoNorge' },
        { status: 400 }
      )
    }

    const data: CityResponse = await response.json()
    const formatedCity = formatCity(data.adresser[0]?.poststed || null)

    return NextResponse.json({ city: formatedCity })
  } catch (error: any) {
    console.error(error)
    // Handle and forward error to the client
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    )
  }
}
