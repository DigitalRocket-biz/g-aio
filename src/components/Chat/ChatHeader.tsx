// src/components/Chat/ChatHeader.tsx
import React from 'react';
import { Settings, Star, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui';
interface ChatHeaderProps {
    title: string;
    isStarred?: boolean;
    onStarToggle?: () => void;
    onSettingsClick?: () => void;
}

export const ChatHeader = ({
    title,
    isStarred = false,
    onStarToggle,
    onSettingsClick,
}: ChatHeaderProps) => (
    <div className="border-b border-slate-700 bg-slate-800 p-4">
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <h2 className="font-medium text-slate-100">{title}</h2>
            </div>
            <div className="flex items-center space-x-2">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onStarToggle}
                    aria-label={isStarred ? "Unstar conversation" : "Star conversation"}
                    className={`${isStarred ? 'text-yellow-500' : 'text-slate-400 hover:text-slate-300'}`}
                >
                    <Star size={16} className={isStarred ? 'fill-yellow-500' : ''} />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onSettingsClick}
                    aria-label="Settings"
                    className="text-slate-400 hover:text-slate-300"
                >
                    <Settings size={16} />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-400 hover:text-slate-300"
                >
                    <MoreVertical size={16} />
                </Button>
            </div>
        </div>
    </div>
);