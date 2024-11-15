// src/components/Chat/MessageList.tsx

import React, { useEffect, useRef } from 'react';
import { User, Bot } from 'lucide-react';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    createdAt: string;
}

interface MessageListProps {
    messages: Message[];
    loading?: boolean;
}

export const MessageList = ({ messages, loading }: MessageListProps) => {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
                <div
                    key={message.id}
                    className={`flex items-start space-x-3 ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                        }`}
                >
                    <div
                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
              ${message.role === 'user' ? 'bg-blue-600' : 'bg-slate-700'}`}
                    >
                        {message.role === 'user' ? (
                            <User size={16} className="text-white" />
                        ) : (
                            <Bot size={16} className="text-white" />
                        )}
                    </div>
                    <div
                        className={`flex flex-col max-w-[80%] space-y-1
              ${message.role === 'user' ? 'items-end' : 'items-start'}`}
                    >
                        <div
                            className={`rounded-lg px-4 py-2 shadow-sm
                ${message.role === 'user'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-slate-700 text-slate-100'
                                }`}
                        >
                            {message.content}
                        </div>
                        <span className="text-xs text-slate-500">
                            {new Date(message.createdAt).toLocaleTimeString()}
                        </span>
                    </div>
                </div>
            ))}
            {loading && (
                <div className="flex items-center space-x-2 text-slate-400" role="status" aria-label="Loading">
                    <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce delay-100" />
                    <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce delay-200" />
                    <span className="sr-only">Loading...</span>
                </div>
            )}
            <div ref={bottomRef} />
        </div>
    );
};