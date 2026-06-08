import path from 'node:path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [process.cwd(), path.join(process.cwd(), 'node_modules')],
    quietDeps: true,
    silenceDeprecations: ['import', 'legacy-js-api'],
  },
};

export default nextConfig;
