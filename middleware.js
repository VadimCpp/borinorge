import { NextResponse } from 'next/server'
import acceptLanguage from 'accept-language'
import { fallbackLng, languages, cookieName } from './app/i18n/settings'

acceptLanguage.languages(languages)

export const config = {
  // matcher: '/:lng*'
  matcher: ['/((?!_next/static|_next/image|assets|favicon.ico|apple-icon.png|sw.js|api(?!s)).*)']
}

export function middleware(req) {
  let lng
  if (req.cookies.has(cookieName)) lng = acceptLanguage.get(req.cookies.get(cookieName).value)
  if (!lng) lng = acceptLanguage.get(req.headers.get('Accept-Language'))
  if (!lng) lng = fallbackLng

  if (
    !languages.some(loc => req.nextUrl.pathname.startsWith(`/${loc}/`)) &&
    !languages.some(loc => req.nextUrl.pathname === `/${loc}`) &&
    !req.nextUrl.pathname.startsWith('/_next') &&
    !req.nextUrl.pathname.startsWith('/images') &&
    !req.nextUrl.pathname.startsWith('/icons') &&
    !req.nextUrl.pathname.startsWith('/public/fonts')
  ) {
    return NextResponse.redirect(new URL(`/${lng}${req. nextUrl.pathname}`, req.url))
  }

  if (req.headers.has('referer')) {
    const refererUrl = new URL(req.headers.get('referer'))
    const lngInReferer = languages.find((l) => refererUrl.pathname.startsWith(`/${l}`))
    const response = NextResponse.next()
    if (lngInReferer) response.cookies.set(cookieName, lngInReferer)
    return response
  }

  return NextResponse.next()
}
