// src/components/layouts/MainLayout.tsx

import React from 'react';

interface MainLayoutProps {
    children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
    return (
        <div className="min-h-screen bg-background">
            <main className="container mx-auto px-4 py-6">
                {children}
            </main>
        </div>
    );
};