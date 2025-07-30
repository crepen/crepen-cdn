import { NextConfig } from "next";
import path from 'path';

const PUBLISH_SUBPATH = process.env.BASE_PATH ?? '/';

(globalThis as Record<string,unknown>).test = 'test';

const loadLocaleJson = () => {
  console.log(path.join(__dirname , './'))
}


const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: false,
  cleanDistDir: false,
  basePath: PUBLISH_SUBPATH,
  assetPrefix: PUBLISH_SUBPATH,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  experimental: {
    esmExternals : true,
    serverActions: {
      bodySizeLimit: '100mb'
    }
  }

};

loadLocaleJson();

export default nextConfig;
