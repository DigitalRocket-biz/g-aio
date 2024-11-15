// src/components/Chat/ThreadList.tsx

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, Plus, Star } from 'lucide-react';

interface Thread {
    id: string;
    title: string;
    lastMessage?: string;
    isStarred: boolean;
    updatedAt: string;
}

interface ThreadListProps {
    threads: Thread[];
    selectedId?: string;
    onSelect: (thread: Thread) => void;
    onNewThread: () => void;
    onStarThread: (threadId: string) => void;
}

export const ThreadList = ({
    threads,
    selectedId,
    onSelect,
    onNewThread,
    onStarThread
}: ThreadListProps) => (
    <div className="w-80 flex flex-col h-full border-r border-slate-700">
        <div className="p-4 border-b border-slate-700">
            <Button
                variant="primary"
                className="w-full"
                icon={<Plus size={16} />}
                onClick={onNewThread}
            >
                New Chat
            </Button>
        </div>

        <div className="p-4">
            <Input
                placeholder="Search conversations..."
                icon={<Search size={16} />}
            />
        </div>

        <div className="overflow-y-auto flex-1">
            {threads.map(thread => (
                <div
                    key={thread.id}
                    onClick={() => onSelect(thread)}
                    className={`
            p-4 cursor-pointer hover:bg-slate-700/50
            ${selectedId === thread.id ? 'bg-slate-700' : ''}
          `}
                >
                    <div className="flex justify-between items-start">
                        <h3 className="font-medium text-slate-100 truncate">{thread.title}</h3>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="p-1"
                            onClick={(e) => {
                                e.stopPropagation();
                                onStarThread(thread.id);
                            }}
                        >
                            <Star
                                size={16}
                                className={thread.isStarred ? 'fill-yellow-500 text-yellow-500' : 'text-slate-400'}
                            />
                        </Button>
                    </div>
                    {thread.lastMessage && (
                        <p className="text-sm text-slate-400 mt-1 truncate">
                            {thread.lastMessage}
                        </p>
                    )}
                    <p className="text-xs text-slate-500 mt-2">
                        {new Date(thread.updatedAt).toLocaleDateString()}
                    </p>
                </div>
            ))}
        </div>
    </div>
);