"use client";

import ReactMarkdown from 'react-markdown';
import React, { useState, useRef, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    Avatar,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
    SelectChangeEvent,
    CircularProgress,
    IconButton,
    Tooltip,
    Fade,
    useTheme,
    alpha
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import GavelIcon from '@mui/icons-material/Gavel';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
}

export default function AIChatPage() {
    const theme = useTheme();
    const token = useSelector((state: RootState) => state.auth.user?.token);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            text: "### Legal Disclaimer\nI am an AI Legal Assistant designed to provide information based on the Laws of Sri Lanka. \n\n**WARNING**: This is NOT professional legal advice. For serious legal matters, always consult a qualified lawyer. \n\nHow can I assist you with the Sri Lankan Penal Code today?",
            sender: 'ai',
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [language, setLanguage] = useState('English');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleLanguageChange = (event: SelectChangeEvent) => {
        const newLang = event.target.value as string;
        setLanguage(newLang);
        setMessages(prev => [...prev, {
            id: Date.now(),
            text: `Language switched to **${newLang}**. How can I help you?`,
            sender: 'ai',
            timestamp: new Date()
        }]);
    };

    const handleSend = async () => {
        if (!input.trim() || loading) return;

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
            const response = await fetch(`${API_BASE_URL}/api/law/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    message: userMessage.text,
                    language: language
                }),
            });

            if (!response.ok) {
                throw new Error('API request failed');
            }

            const data = await response.json();

            if (data.error) {
                const errorMessage: Message = {
                    id: Date.now() + 1,
                    text: `**ERROR:** ${data.error}. Please ensure the backend server and Gemini API are correctly configured.`,
                    sender: 'ai',
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, errorMessage]);
            } else {
                const aiMessage: Message = {
                    id: Date.now() + 1,
                    text: data.reply || "I apologize, but I couldn't generate a response based on the current legal context.",
                    sender: 'ai',
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, aiMessage]);
            }

        } catch (error) {
            console.error("Chat Error:", error);
            const errorMessage: Message = {
                id: Date.now() + 1,
                text: "⚠️ **Network Error:** Could not connect to the Law AI service. Please check your internet connection or verify the backend status.",
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
        <Box
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            sx={{
                height: 'calc(100vh - 145px)',
                display: 'flex',
                flexDirection: 'column',
                maxWidth: '1200px',
                mx: 'auto',
                width: '100%',
                p: { xs: 1, md: 2 }
            }}
        >
            {/* Header Section */}
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
                sx={{
                    pb: 2,
                    borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                }}
            >
                <Box display="flex" alignItems="center" gap={1.5}>
                    <Box
                        sx={{
                            p: 1.2,
                            borderRadius: '12px',
                            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                            display: 'flex',
                            boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.4)}`
                        }}
                    >
                        <GavelIcon sx={{ color: 'white' }} />
                    </Box>
                    <Box>
                        <Typography variant="h5" fontWeight="800" sx={{ letterSpacing: '-0.5px' }}>
                            Law AI Assistant
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="flex" alignItems="center" gap={0.5}>
                            <AutoAwesomeIcon sx={{ fontSize: 12, color: theme.palette.primary.main }} /> Powered by Gemini RAG
                        </Typography>
                    </Box>
                </Box>

                <Box display="flex" alignItems="center" gap={2}>
                    <FormControl size="small" sx={{ minWidth: 130 }}>
                        <InputLabel>Language</InputLabel>
                        <Select
                            value={language}
                            label="Language"
                            onChange={handleLanguageChange}
                            sx={{
                                borderRadius: '10px',
                                bgcolor: alpha(theme.palette.background.paper, 0.5),
                                backdropFilter: 'blur(4px)',
                            }}
                        >
                            <MenuItem value="English">English</MenuItem>
                            <MenuItem value="Tamil">Tamil</MenuItem>
                            <MenuItem value="Sinhala">Sinhala</MenuItem>
                        </Select>
                    </FormControl>
                    <Tooltip title="About Law AI">
                        <IconButton size="small" sx={{ border: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                            <InfoOutlinedIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>

            {/* Chat Container */}
            <Paper
                elevation={0}
                sx={{
                    flexGrow: 1,
                    mb: 3,
                    p: { xs: 1.5, md: 3 },
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                    bgcolor: alpha(theme.palette.background.paper, 0.4),
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
                    borderRadius: '24px',
                    '&::-webkit-scrollbar': { width: '8px' },
                    '&::-webkit-scrollbar-thumb': {
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        borderRadius: '4px'
                    }
                }}
            >
                <AnimatePresence mode="popLayout">
                    {messages.map((msg) => (
                        <Box
                            key={msg.id}
                            component={motion.div}
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            layout
                            sx={{
                                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                maxWidth: { xs: '90%', md: '75%' },
                                display: 'flex',
                                gap: 1.5,
                                flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row'
                            }}
                        >
                            <Avatar
                                sx={{
                                    width: 36,
                                    height: 36,
                                    bgcolor: msg.sender === 'user' ? theme.palette.primary.main : alpha(theme.palette.primary.main, 0.1),
                                    color: msg.sender === 'user' ? 'white' : theme.palette.primary.main,
                                    border: msg.sender === 'ai' ? `1px solid ${alpha(theme.palette.primary.main, 0.2)}` : 'none',
                                    mt: 1
                                }}
                            >
                                {msg.sender === 'user' ? <PersonIcon fontSize="small" /> : <SmartToyIcon fontSize="small" />}
                            </Avatar>

                            <Box>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 2.5,
                                        bgcolor: msg.sender === 'user' ? theme.palette.primary.main : alpha(theme.palette.background.paper, 0.8),
                                        color: msg.sender === 'user' ? 'white' : 'text.primary',
                                        borderRadius: msg.sender === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                                        boxShadow: msg.sender === 'user'
                                            ? `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`
                                            : `0 4px 12px ${alpha(theme.palette.common.black, 0.1)}`,
                                        border: msg.sender === 'ai' ? `1px solid ${alpha(theme.palette.divider, 0.05)}` : 'none',
                                        '& h1, h2, h3': { color: msg.sender === 'user' ? 'white' : theme.palette.primary.light, mt: 0, mb: 1, fontSize: '1.2rem' },
                                        '& strong': { color: msg.sender === 'user' ? 'rgba(255,255,255,0.9)' : theme.palette.primary.main, fontWeight: 700 },
                                        '& ul': { pl: 2, mb: 0 },
                                        '& li': { mb: 0.5 },
                                        '& p': { mb: 1, '&:last-child': { mb: 0 } },
                                        '& blockquote': {
                                            borderLeft: `4px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                                            pl: 2,
                                            py: 0.5,
                                            my: 1,
                                            fontStyle: 'italic',
                                            color: 'text.secondary',
                                            bgcolor: alpha(theme.palette.primary.main, 0.05),
                                            borderRadius: '4px'
                                        }
                                    }}
                                >
                                    {msg.sender === 'ai' ? (
                                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                                    ) : (
                                        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                                            {msg.text}
                                        </Typography>
                                    )}
                                </Paper>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        opacity: 0.6,
                                        display: 'block',
                                        mt: 0.8,
                                        textAlign: msg.sender === 'user' ? 'right' : 'left',
                                        fontWeight: 500
                                    }}
                                >
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                </AnimatePresence>

                {loading && (
                    <Box
                        component={motion.div}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        sx={{ alignSelf: 'flex-start', ml: 6.5, display: 'flex', alignItems: 'center', gap: 1.5 }}
                    >
                        <CircularProgress size={16} thickness={5} sx={{ color: theme.palette.primary.main }} />
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, letterSpacing: '0.5px' }}>
                            AI is studying legal records...
                        </Typography>
                    </Box>
                )}
                <div ref={messagesEndRef} />
            </Paper>

            {/* Input Section */}
            <Box
                component={motion.div}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                display="flex"
                gap={2}
                alignItems="flex-end"
            >
                <TextField
                    fullWidth
                    multiline
                    maxRows={4}
                    variant="outlined"
                    placeholder={`Ask about Sri Lankan Law in ${language}...`}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            bgcolor: alpha(theme.palette.background.paper, 0.8),
                            borderRadius: '16px',
                            p: 2,
                            boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.1)}`,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                bgcolor: theme.palette.background.paper,
                            },
                        }
                    }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSend}
                    disabled={!input.trim() || loading}
                    sx={{
                        height: '56px',
                        width: '56px',
                        minWidth: '56px',
                        borderRadius: '16px',
                        boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
                        '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: `0 10px 25px ${alpha(theme.palette.primary.main, 0.4)}`,
                        }
                    }}
                >
                    <SendIcon />
                </Button>
            </Box>
        </Box>
    );
}
