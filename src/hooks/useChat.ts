// src/hooks/useChat.ts

import { useEffect, useState } from 'react';
import { create } from 'zustand';
import type { Message } from '@prisma/client';
import type { Thread } from '../types';

interface ChatState {
    threads: Thread[];
    currentThread: Thread | null;
    messages: Message[];
    loading: boolean;
    error: string | null;
    setThreads: (threads: Thread[]) => void;
    setCurrentThread: (thread: Thread | null) => void;
    setMessages: (messages: Message[]) => void;
    addMessage: (message: Message) => void;
    clearError: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
    threads: [],
    currentThread: null,
    messages: [],
    loading: false,
    error: null,
    setThreads: (threads) => set({ threads }),
    setCurrentThread: (thread) => set({ currentThread: thread }),
    setMessages: (messages) => set({ messages }),
    addMessage: (message) => set((state) => ({
        messages: [...state.messages, message]
    })),
    clearError: () => set({ error: null })
}));

export const useChat = () => {
    const store = useChatStore();
    const [sendingMessage, setSendingMessage] = useState(false);

    const sendMessage = async (content: string) => {
        if (!store.currentThread) return;

        try {
            setSendingMessage(true);

            // Add user message
            const userMessage = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    threadId: store.currentThread.id,
                    content,
                    role: 'user'
                })
            }).then(res => res.json());

            store.addMessage(userMessage);

            // Get AI response
            const assistantMessage = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    threadId: store.currentThread.id,
                    messages: [...store.messages, userMessage]
                })
            }).then(res => res.json());

            store.addMessage(assistantMessage);
        } catch (error) {
            store.error = 'Failed to send message';
        } finally {
            setSendingMessage(false);
        }
    };

    const loadThreads = async () => {
        try {
            const threads = await fetch('/api/threads').then(res => res.json());
            store.setThreads(threads);
        } catch (error) {
            store.error = 'Failed to load threads';
        }
    };

    const loadMessages = async (threadId: string) => {
        try {
            const messages = await fetch(`/api/messages?threadId=${threadId}`).then(res => res.json());
            store.setMessages(messages);
        } catch (error) {
            store.error = 'Failed to load messages';
        }
    };

    return {
        ...store,
        sendMessage,
        sendingMessage,
        loadThreads,
        loadMessages
    };
};