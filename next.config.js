/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config, context) => {
    // Enable polling based on env variable being set
    if(process.env.NEXT_WEBPACK_USEPOLLING) {
      config.watchOptions = {
        poll: 500,
        aggregateTimeout: 300
      }
    }
    return config
  },
  async redirects() {
    return [
      {
        source: '/vadym',
        destination: '/folk/vadym',
        permanent: true,
      },
      {
        source: '/olena',
        destination: '/folk/olena',
        permanent: true,
      },
      {
        source: '/oksana',
        destination: '/folk/oksana',
        permanent: true,
      },
      {
        source: '/kazka',
        destination: '/projects/kazka',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
