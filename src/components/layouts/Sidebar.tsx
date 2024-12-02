import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MdDashboard, MdChat } from 'react-icons/md';

export const Sidebar = () => {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    const menuItems = [
        {
            name: 'Dashboard',
            path: '/dashboard',
            icon: MdDashboard
        },
        {
            name: 'Chat',
            path: '/chat',
            icon: MdChat
        }
    ];

    return (
        <div className="w-64 h-screen bg-slate-800 fixed left-0 top-0 border-r border-slate-700">
            <div className="p-4">
                <h1 className="text-xl font-bold text-white mb-8">Google Ads Assistant</h1>
                <nav className="space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                                    isActive(item.path)
                                        ? 'bg-slate-700 text-white'
                                        : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                                }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}; 