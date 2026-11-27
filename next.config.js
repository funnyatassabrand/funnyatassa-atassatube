/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers(){
    return [{
      source:'/:path*',
      headers:[
        {key:'Content-Security-Policy', value:"frame-ancestors 'self' https://funnyatassa.com https://www.funnyatassa.com https://funnyatassa.vercel.app"},
      ]
    }];
  }
};
module.exports = nextConfig;
