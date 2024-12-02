// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    transpilePackages: [
        'antd',
        '@ant-design/icons',
        '@ant-design/icons-svg',
        'rc-util',
        'rc-pagination',
        'rc-picker',
        'rc-table',
        'rc-tree',
        'rc-select',
        'rc-cascader',
        'rc-checkbox',
        'rc-dropdown',
        'rc-menu',
        'rc-input',
        'rc-input-number',
        'rc-motion',
        'rc-notification',
        'rc-tooltip',
        'rc-tree-select',
        '@ant-design/cssinjs',
        '@ant-design/colors',
        '@ant-design/react-slick',
        '@ant-design/pro-layout',
        '@ant-design/pro-utils',
        '@ant-design/pro-provider',
    ],
    webpack: (config) => {
        config.resolve.extensionAlias = {
            '.js': ['.js', '.ts', '.tsx']
        }
        return config
    }
}

module.exports = nextConfig