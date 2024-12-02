import React, { useState, useRef, useEffect } from 'react';
import { Button, Input, Card, Spin } from 'antd';
import { MessageOutlined, CloseOutlined, SendOutlined, LoadingOutlined } from '@ant-design/icons';

interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

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
                    history: messages.filter(m => m.role !== 'system')
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to get response');
            }

            const data = await response.json();

            const assistantMessage: Message = {
                role: 'assistant',
                content: data.response
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'I apologize, but I encountered an error. Please try again or check your connection.'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <div className="fixed bottom-6 right-6 z-50 transition-transform duration-200 hover:scale-110">
                <Button
                    type="primary"
                    shape="circle"
                    size="large"
                    icon={<MessageOutlined />}
                    onClick={() => setIsOpen(true)}
                    className="w-14 h-14 flex items-center justify-center shadow-lg bg-blue-600 hover:bg-blue-700"
                />
            </div>
        );
    }

    return (
        <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <Card
                className="w-96 shadow-2xl rounded-2xl border-0"
                bodyStyle={{ padding: '12px' }}
                title={
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="font-semibold">Google Ads Assistant</span>
                    </div>
                }
                extra={
                    <Button
                        type="text"
                        icon={<CloseOutlined />}
                        onClick={() => setIsOpen(false)}
                        className="hover:bg-gray-100 rounded-full"
                    />
                }
                headStyle={{
                    borderBottom: '1px solid #e8e8e8',
                    padding: '12px 16px'
                }}
            >
                <div className="flex flex-col h-[500px]">
                    <div className="flex-1 overflow-y-auto mb-4 px-2">
                        <div className="space-y-4">
                            {messages.length === 0 && (
                                <div className="text-center text-gray-500 mt-4">
                                    <p>👋 Hi! I'm your Google Ads Assistant.</p>
                                    <p className="text-sm mt-2">Ask me anything about your campaigns, performance metrics, or recommendations!</p>
                                </div>
                            )}
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} opacity-0 animate-fadeIn`}
                                >
                                    <div
                                        className={`max-w-[70%] rounded-2xl p-3 ${message.role === 'user'
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-800'
                                            }`}
                                    >
                                        {message.content}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-gray-100 rounded-2xl p-3">
                                        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    <div className="flex gap-2 p-2 border-t">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onPressEnter={handleSend}
                            placeholder="Ask about your Google Ads performance..."
                            disabled={isLoading}
                            className="rounded-full"
                        />
                        <Button
                            type="primary"
                            icon={<SendOutlined />}
                            onClick={handleSend}
                            loading={isLoading}
                            className="rounded-full"
                        />
                    </div>
                </div>
            </Card>
        </div>
    );
}; 