'use client';

import { useEffect, useRef, useState } from 'react';
import { IoCloseCircleOutline } from 'react-icons/io5';
import { BsRocketTakeoffFill } from 'react-icons/bs';

type Message = {
    sender: 'user' | 'bot';
    text: string;
};

export default function AlexisChat({ onClose }: { onClose: () => void }) {
    const host = process.env.NEXT_PUBLIC_SERVER_URL;
    const url = host + '/ask';

    const [messages, setMessages] = useState<Message[]>([
        {
            sender: 'bot',
            text: "Hi! I'm Alexis. How can I help you with your course today?",
        },
    ]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const chatRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { sender: 'user', text: input.trim() };
        setMessages((prev) => [
            ...prev,
            userMsg as Message,
            { sender: 'bot', text: 'Thinking...' } as Message,
        ]);
        setInput('');

        await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                // session_id: 'test_user',
                question: input,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                setMessages((prev) =>
                    prev.slice(0, -1).concat({
                        sender: 'bot',
                        text: data.answer,
                    })
                );
            })
            .catch((err) => {
                console.error(err);
                setMessages((prev) =>
                    prev.slice(0, -1).concat({
                        sender: 'bot',
                        text: 'Sorry, something went wrong. Please try again later.',
                    })
                );
            });
    };

    return (
        <div
            ref={chatRef}
            className="fixed bottom-24 right-8 w-[300px] sm:w-[350px] h-[500px] rounded-xl shadow-lg z-50 flex flex-col animate-fade-in"
            style={{ backgroundColor: '#111827', color: '#FFFFFF' }}
        >
            {/* Header */}
            <div
                className="flex justify-between items-center px-4 py-2 rounded-t-xl"
                style={{ backgroundColor: '#f97316', color: '#000000' }}
            >
                <h2 className="font-bold">Alexis AI</h2>
                <button className="cursor-pointer" onClick={onClose}>
                    <IoCloseCircleOutline className="text-2xl" />
                </button>
            </div>

            {/* Message Area */}
            <div className="flex-1 p-4 overflow-y-auto text-sm space-y-2">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className="p-2 rounded-lg max-w-[90%] break-words whitespace-pre-wrap"
                        style={{
                            alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                            marginLeft: msg.sender === 'user' ? 'auto' : undefined,
                            backgroundColor:
                                msg.sender === 'user'
                                    ? 'rgba(251, 146, 60, 0.4)'
                                    : 'rgba(60, 124, 251, 0.2)',
                        }}
                    >
                        {msg.text}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div
                className="p-3 border-t rounded-b-xl"
                style={{
                    backgroundColor: '#0f172a',
                    borderTopColor: '#1A1A1A',
                    borderTopWidth: '1px',
                }}
            >
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey))
                                handleSend();
                        }}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-2 rounded-md focus:outline-none placeholder-[#9ca3af]"
                        style={{
                            backgroundColor: '#1f2937',
                            color: '#ffffff',
                            border: 'none',
                        }}
                    />
                    <button
                        onClick={handleSend}
                        className="cursor-pointer p-2 rounded-full bg-[#f97316] hover:opacity-90 transition"
                    >
                        <BsRocketTakeoffFill className="text-white w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
