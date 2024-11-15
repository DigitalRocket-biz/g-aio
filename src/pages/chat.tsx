// src/pages/chat.tsx

import { useEffect } from 'react';
import { MainLayout } from '@/components/layouts/MainLayout';
import { ThreadList } from '@/components/Chat/ThreadList';
import { MessageList } from '@/components/Chat/MessageList';
import { ChatInput } from '@/components/Chat/ChatInput';
import { ChatHeader } from '@/components/Chat/ChatHeader';
import { useChat } from '@/hooks/useChat';

export default function Chat() {
    const {
        threads,
        currentThread,
        messages,
        loading,
        sendingMessage,
        loadThreads,
        loadMessages,
        sendMessage,
        setCurrentThread
    } = useChat();

    useEffect(() => {
        loadThreads();
    }, []);

    return (
        <MainLayout>
            <div className="h-full flex">
                <ThreadList
                    threads={threads}
                    selectedId={currentThread?.id}
                    onSelect={(thread) => {
                        setCurrentThread(thread);
                        loadMessages(thread.id);
                    }}
                    onNewThread={() => {/* Handle new thread */ }}
                    onStarThread={() => {/* Handle star thread */ }}
                />

                <div className="flex-1 flex flex-col">
                    {currentThread ? (
                        <>
                            <ChatHeader
                                title={currentThread.title}
                                isStarred={currentThread.isStarred}
                                onStarToggle={() => {/* Handle star toggle */ }}
                            />

                            <MessageList
                                messages={messages}
                                loading={sendingMessage}
                            />

                            <ChatInput
                                onSend={sendMessage}
                                disabled={loading || sendingMessage}
                            />
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center">
                                <h2 className="text-xl font-semibold text-slate-100">
                                    Select a conversation
                                </h2>
                                <p className="mt-2 text-slate-400">
                                    Choose an existing conversation or start a new one
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}