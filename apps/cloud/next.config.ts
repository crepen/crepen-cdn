import { NextConfig } from "next";
import path from 'path';

const PUBLISH_SUBPATH = process.env.BASE_PATH ?? '/';



const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: false,
  cleanDistDir: false,
  basePath: PUBLISH_SUBPATH ,
  assetPrefix: PUBLISH_SUBPATH,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  poweredByHeader: false,
  experimental: {
    esmExternals : true,
    serverActions: {
      bodySizeLimit: '1000mb'
    }
  }

};


export default nextConfig;
