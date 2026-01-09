"use client";

import React, { useState, useRef, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
    SelectChangeEvent,
    CircularProgress
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/Android';
import PersonIcon from '@mui/icons-material/Person';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
}

export default function AIChatPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            text: "Hello! I am your AI Legal Assistant. You can ask me about penal codes, legal procedures, or your rights. I can verify information and provide guidance. Please select your preferred language.",
            sender: 'ai',
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [language, setLanguage] = useState('English');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleLanguageChange = (event: SelectChangeEvent) => {
        setLanguage(event.target.value as string);
        // In a real app, this might trigger a system prompt change to the AI
        setMessages(prev => [...prev, {
            id: Date.now(),
            text: `Language switched to ${event.target.value}. How can I help you?`,
            sender: 'ai',
            timestamp: new Date()
        }]);
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: Message = {
            id: Date.now(),
            text: input,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: userMessage.text,
                    language: language
                }),
            });

            const data = await response.json();

            if (data.error) {
                // Handle API errors (e.g., missing key)
                const errorMessage: Message = {
                    id: Date.now() + 1,
                    text: `Error: ${data.error}. Please contact support or check configuration.`,
                    sender: 'ai',
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, errorMessage]);
            } else {
                const aiMessage: Message = {
                    id: Date.now() + 1,
                    text: data.reply || "I apologize, but I couldn't generate a response.",
                    sender: 'ai',
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, aiMessage]);
            }

        } catch (error) {
            console.error("Chat Error:", error);
            const errorMessage: Message = {
                id: Date.now() + 1,
                text: "Network error. Please try again.",
                sender: 'ai',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <Box sx={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h4" fontWeight="bold" color="primary">
                    Chat With AI For LAW
                </Typography>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Language</InputLabel>
                    <Select
                        value={language}
                        label="Language"
                        onChange={handleLanguageChange}
                    >
                        <MenuItem value="English">English</MenuItem>
                        <MenuItem value="Tamil">Tamil</MenuItem>
                        <MenuItem value="Sinhala">Sinhala</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <Paper sx={{ flexGrow: 1, mb: 2, p: 2, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
                {messages.map((msg) => (
                    <Box
                        key={msg.id}
                        sx={{
                            alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                            maxWidth: '70%',
                            display: 'flex',
                            gap: 1,
                            flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row'
                        }}
                    >
                        <Avatar sx={{ bgcolor: msg.sender === 'user' ? 'primary.main' : 'secondary.main', color: msg.sender === 'ai' ? 'primary.main' : 'white' }}>
                            {msg.sender === 'user' ? <PersonIcon /> : <SmartToyIcon />}
                        </Avatar>
                        <Paper
                            sx={{
                                p: 2,
                                bgcolor: msg.sender === 'user' ? 'primary.main' : 'rgba(255,255,255,0.05)',
                                color: msg.sender === 'user' ? 'white' : 'text.primary',
                                borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px'
                            }}
                        >
                            <Typography variant="body1">{msg.text}</Typography>
                            <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', mt: 0.5, textAlign: 'right' }}>
                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Typography>
                        </Paper>
                    </Box>
                ))}
                {loading && (
                    <Box sx={{ alignSelf: 'flex-start', ml: 6 }}>
                        <CircularProgress size={20} />
                    </Box>
                )}
                <div ref={messagesEndRef} />
            </Paper>

            <Box display="flex" gap={1}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder={`Type your legal question in ${language}...`}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    sx={{ bgcolor: 'background.paper' }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSend}
                    disabled={!input.trim()}
                    sx={{ px: 4 }}
                >
                    <SendIcon />
                </Button>
            </Box>
        </Box>
    );
}
