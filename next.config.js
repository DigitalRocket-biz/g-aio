// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        domains: ['localhost'],
    },
    env: {
        NEXT_PUBLIC_APP_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    },
    typescript: {
        ignoreBuildErrors: false,
    },
    webpack: (config) => {
        config.resolve.fallback = { fs: false };
        config.module.rules = [
            ...config.module.rules,
            {
                test: /\.(tsx|ts|js|mjs|jsx)$/,
                exclude: /node_modules\/(?!next-auth)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env', { targets: "defaults" }],
                            '@babel/preset-react',
                            '@babel/preset-typescript'
                        ],
                        plugins: ['@babel/plugin-transform-runtime']
                    }
                }
            }
        ];
        config.resolve.extensions = ['.tsx', '.ts', '.js', '.jsx', ...config.resolve.extensions];
        return config;
    }
}

module.exports = nextConfig