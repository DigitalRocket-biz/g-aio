import React from 'react';
import { ConfigProvider, App as AntdApp, theme } from 'antd';
import { StyleProvider } from '@ant-design/cssinjs';

interface AntdProviderProps {
    children: React.ReactNode;
}

const AntdProvider: React.FC<AntdProviderProps> = ({ children }) => {
    return (
        <StyleProvider hashPriority="high">
            <ConfigProvider
                theme={{
                    algorithm: [theme.darkAlgorithm, theme.compactAlgorithm],
                    token: {
                        colorPrimary: '#1890ff',
                        borderRadius: 6,
                        colorBgContainer: '#141414',
                        colorBgElevated: '#1f1f1f',
                        colorText: '#ffffff',
                    },
                    components: {
                        Layout: {
                            headerBg: '#141414',
                            bodyBg: '#141414',
                            siderBg: '#141414',
                        },
                        Card: {
                            colorBgContainer: '#1f1f1f',
                        },
                        Button: {
                            colorPrimary: '#1890ff',
                        },
                    },
                }}
            >
                <AntdApp>{children}</AntdApp>
            </ConfigProvider>
        </StyleProvider>
    );
};

export default AntdProvider; 