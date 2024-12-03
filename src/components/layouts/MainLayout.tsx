// src/components/layouts/MainLayout.tsx

import React from 'react';
import { Sidebar } from './Sidebar';
import { ChatWidget } from '../Chat/ChatWidget';

interface MainLayoutProps {
    children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
    return (
        <div className="min-h-screen bg-background flex">
            <Sidebar />
            <main className="flex-1 ml-64 px-6 py-6">
                {children}
            </main>
            <ChatWidget />
        </div>
    );
};