export const FOLKS = [ 'oksana', 'olena', 'vadym', 'iryna' ] as const

export type Folk = (typeof FOLKS)[number]

export type FolkData = {
  image: {
    src: string
  }
  contacts: {
    instagram: string
    linkedin: string
  }
  openGraph: {
    url: string
  },
  projects: {
    id: string
    titleSlug: string
    imageUrl: string
  }[] 
}

export const folksMapping: {[K in Folk]: FolkData } = {
  olena: {
    image: {
      src: "/images/folk/avatar-olena-varlamova.jpeg"
    },
    contacts: {
      instagram: "https://www.instagram.com/olena_varlamova/",
      linkedin: "https://www.linkedin.com/in/olenavarlamova/"
    },
    openGraph: {
      url: "/images/preview/folk/olena_varlamova_1200_630.jpeg"
    },
    projects: [
      {
        id: 'projects/ordbokene',
        titleSlug: 'project-ordbokene',
        imageUrl: '/images/preview/ordbokene_1200_630_v3.jpeg',
      },
      {
        id: 'norsklett',
        titleSlug: 'project-norsklett',
        imageUrl: '/images/preview/norsklett_1200_630.jpeg',
      },
      {
        id: 'alias',
        titleSlug: 'project-alias',
        imageUrl: '/images/preview/alias_1200_630.jpeg',
      },
    ]
  },
  oksana: {
    image: {
      src: "/images/folk/avatar-oksana-donets.jpeg"
    },
    contacts: {
      instagram: "https://www.instagram.com/oksanadonets.no/",
      linkedin: "https://www.linkedin.com/in/oksana-donets/"
    } ,
    openGraph: {
      url: "/images/preview/folk/oksana_donets_1200_630.jpeg"
    },
    projects: [
      {
        id: 'projects/ordbokene',
        titleSlug: 'project-ordbokene',
        imageUrl: '/images/preview/ordbokene_1200_630_v3.jpeg',
      },
      {
        id: 'norsklett',
        titleSlug: 'project-norsklett',
        imageUrl: '/images/preview/norsklett_1200_630.jpeg',
      },
      {
        id: 'alias',
        titleSlug: 'project-alias',
        imageUrl: '/images/preview/alias_1200_630.jpeg',
      },
    ]
  },
  iryna: {
    image: {
      src: "/images/folk/avatar-iryna-nepotenko.jpeg"
    },
    contacts: {
      instagram: "https://www.instagram.com/iryna_nepotenko/",
      linkedin: "https://www.linkedin.com/in/iryna-nepotenko-a17797287/"
    },
    openGraph: {
      url: "/images/preview/folk/iryna_nepotenko_1200_630.jpeg"
    },
    projects: [
      {
        id: 'projects/ordbokene',
        titleSlug: 'project-ordbokene',
        imageUrl: '/images/preview/ordbokene_1200_630_v3.jpeg',
      },
      {
        id: 'norsklett',
        titleSlug: 'project-norsklett',
        imageUrl: '/images/preview/norsklett_1200_630.jpeg',
      },
      {
        id: 'alias',
        titleSlug: 'project-alias',
        imageUrl: '/images/preview/alias_1200_630.jpeg',
      },
    ]
  },
  vadym: {
    image: {
      src: "/images/folk/avatar-vadym-kaninskyi.jpeg"
    },
    contacts: {
      instagram: "https://www.instagram.com/vadym_kaninskyi/",
      linkedin: "https://www.linkedin.com/in/vadym-kaninskyi/"
    },
    openGraph: {
      url: "/images/preview/folk/vadym_kaninskyi_1200_630.jpeg"
    },
    projects: [
      {
        id: 'direkte-stotte',
        titleSlug: 'project-direkte-stotte',
        imageUrl: '/images/preview/direkte_stotte_1200_630.jpeg',
      }
    ]
  }
}
