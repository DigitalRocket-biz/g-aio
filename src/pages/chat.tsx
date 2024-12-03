// src/pages/chat.tsx

import React, { useState, useRef, useEffect } from 'react';
import { MainLayout } from '@/components/layouts/MainLayout';
import { Input, Button, Select, Card } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import type { Campaign } from '@/types/campaign';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

const ChatPage = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [isFetchingCampaigns, setIsFetchingCampaigns] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const fetchCampaigns = async () => {
        setIsFetchingCampaigns(true);
        try {
            const response = await fetch('/api/campaigns');
            const data = await response.json();
            // Ensure data is an array before setting it
            setCampaigns(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching campaigns:', error);
            setCampaigns([]);
        } finally {
            setIsFetchingCampaigns(false);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: Message = {
            role: 'user',
            content: input
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: input,
                    selectedCampaigns,
                    history: messages
                }),
            });

            const data = await response.json();
            
            const assistantMessage: Message = {
                role: 'assistant',
                content: data.response
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <MainLayout>
            <div className="flex flex-col h-[calc(100vh-2rem)] max-w-4xl mx-auto">
                <Card className="mb-4">
                    <Select
                        mode="multiple"
                        style={{ width: '100%' }}
                        placeholder={isFetchingCampaigns ? "Loading campaigns..." : "Select campaigns to analyze"}
                        onChange={setSelectedCampaigns}
                        options={campaigns?.map(campaign => ({
                            value: campaign.id,
                            label: campaign.name || `Campaign ${campaign.id}`
                        })) || []}
                        loading={isFetchingCampaigns}
                        disabled={isFetchingCampaigns}
                    />
                </Card>
                
                <div className="flex-1 overflow-y-auto bg-slate-800 rounded-lg p-4 mb-4">
                    <div className="space-y-4">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[70%] rounded-lg p-3 ${
                                        message.role === 'user'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-slate-700 text-slate-100'
                                    }`}
                                >
                                    {message.content}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                <div className="flex gap-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onPressEnter={handleSend}
                        placeholder="Type your message..."
                        disabled={isLoading}
                        className="flex-1"
                    />
                    <Button
                        type="primary"
                        icon={<SendOutlined />}
                        onClick={handleSend}
                        loading={isLoading}
                    >
                        Send
                    </Button>
                </div>
            </div>
        </MainLayout>
    );
};

export default ChatPage;