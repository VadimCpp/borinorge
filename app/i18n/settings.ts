export const fallbackLng = 'nb'
export const languages = [fallbackLng, 'nn', 'uk', 'en', 'ru']
export const defaultNS = 'translation'
export const cookieName = 'i18next'

export const verboseLanguages: { [key: string]: string } = {
  'nb': 'Bokmål',
  'nn': 'Nynorsk',
  'en': 'English',
  'ru': 'Русский',
  'uk': 'Українська'
}

export function getOptions (lng = fallbackLng, ns = defaultNS) {
  return {
    // debug: true,
    supportedLngs: languages,
    fallbackLng,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns
  }
}

