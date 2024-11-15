// src/pages/_app.tsx

import React, { useEffect } from 'react';
import { AppProps } from 'next/app';
import { useSettings } from '@/hooks/useSettings';
import '@/styles/globals.css';
import { SessionProvider } from "next-auth/react";

export default function App({ Component, pageProps }: AppProps) {
    const { theme } = useSettings();

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
    }, [theme]);

    return (
        <SessionProvider>
            <Component {...pageProps} />
        </SessionProvider>
    );
}