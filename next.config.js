module.exports = {
  webpack: (config) => {
    return config;
  },
  reactStrictMode: true,
  swcMinify: true,
  async redirects() {
    return [
      {
        source: '/all-product/category/:id/:category([a-zA-Z0-9\-]+(?:%20[a-zA-Z0-9\-]+)*)-:category2([a-zA-Z0-9\-]+(?:%20[a-zA-Z0-9\-]+)*)',
        destination: '/category/:category-:category2?id=:id',
        permanent: false,
        statusCode: 301,
      },
      {
        source: '/all-product/brand/:id/:brand([a-zA-Z0-9\\-]+(?:%20[a-zA-Z0-9\\-]+)*)-:brand2([a-zA-Z0-9\\-]+(?:%20[a-zA-Z0-9\\-]+)*)',
        destination: '/brand/:brand-:brand2?id=:id',
        permanent: false,
        statusCode: 301,
      },
      {
        source: '/product-details/:id/:vrnt([a-zA-Z0-9\\-]+(?:%20[a-zA-Z0-9\\-]+)*)-:vrnt2([a-zA-Z0-9\\-]+(?:%20[a-zA-Z0-9\\-]+)*)',
        destination: '/products/:vrnt-:vrnt2?id=:id',
        permanent: false,
        statusCode: 301,
      },
    ];
  },
  images: {
    domains: ['localhost', 'api.suppkart.com', 'suppkart.com', 'front.suppkart.com'],
  },
};

