// src/pages/_app.tsx

import React from 'react';
import { AppProps } from 'next/app';
import { useSettings } from '@/hooks/useSettings';
import '@/styles/globals.css';
import { SessionProvider } from "next-auth/react";
import dynamic from 'next/dynamic';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const AntdProvider = dynamic(
  () => import('../providers/AntdProvider'),
  { ssr: false }
);

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
    const { theme } = useSettings();

    React.useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
    }, [theme]);

    return (
        <SessionProvider session={session}>
            <AntdProvider>
                <Component {...pageProps} />
            </AntdProvider>
        </SessionProvider>
    );
}