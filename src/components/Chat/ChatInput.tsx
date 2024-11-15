// src/components/Chat/ChatInput.tsx

import React, { useState, useRef } from 'react';
import { Send, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ChatInputProps {
    onSend: (message: string) => void;
    disabled?: boolean;
    placeholder?: string;
}

export const ChatInput = ({
    onSend,
    disabled = false,
    placeholder = "Type your message..."
}: ChatInputProps) => {
    const [message, setMessage] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = () => {
        if (message.trim() && !disabled) {
            onSend(message.trim());
            setMessage('');
            textareaRef.current?.focus();
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);
        e.target.style.height = 'auto';
        e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
    };

    return (
        <div className="border-t border-slate-700 bg-slate-800 p-4">
            <div className="relative flex items-end max-w-4xl mx-auto">
                <textarea
                    ref={textareaRef}
                    value={message}
                    onChange={handleTextareaChange}
                    onKeyPress={handleKeyPress}
                    placeholder={placeholder}
                    disabled={disabled}
                    rows={1}
                    aria-label="Chat message input"
                    className="flex-1 resize-none rounded-lg bg-slate-700 border border-slate-600 px-4 py-3 pr-20
            text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="absolute bottom-2 right-2 flex items-center space-x-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-slate-400 hover:text-slate-300"
                        onClick={() => {/* Handle file upload */ }}
                    >
                        <Paperclip size={16} />
                    </Button>
                    <Button
                        variant="primary"
                        size="sm"
                        disabled={!message.trim() || disabled}
                        onClick={handleSubmit}
                    >
                        <Send size={16} />
                    </Button>
                </div>
            </div>
        </div>
    );
};