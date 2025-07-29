'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  TextField, 
  Button, 
  Typography, 
  Container,
  Paper,
  Avatar,
  Stack
} from '@mui/material';
import { Send, SmartToy, Person, AutoAwesome } from '@mui/icons-material';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const scrollToBottom = () => {
    const messagesContainer = messagesEndRef.current?.parentElement;
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // エージェントの返答用のメッセージID
    const agentMessageId = `agent_${Date.now()}`;

    const currentInput = inputMessage;
    setInputMessage('');

    // AbortControllerを作成
    abortControllerRef.current = new AbortController();

    try {
      console.log('Sending request to agent:', currentInput);
      const response = await fetch('/api/invocations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: currentInput }),
        signal: abortControllerRef.current.signal,
      });
      console.log('Received response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      console.log('Response body readable:', response.body !== null);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('Response body is not readable');
      }

      let buffer = '';
      let isReceivedContent = false;
      
      console.log('Starting stream processing...');
      
      const processStream = async (): Promise<void> => {
        const result = await reader.read();
        
        if (result.done) {
          console.log('Stream completed, buffer remaining:', buffer);
          return;
        }

        const chunk = result.value;
        const decodedChunk = decoder.decode(chunk, { stream: true });
        console.log('Decoded chunk (length:', chunk.length, '):', JSON.stringify(decodedChunk.substring(0, 200)) + (decodedChunk.length > 200 ? '...' : ''));
        buffer += decodedChunk;
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        console.log('Processing lines:', lines.length, 'lines:', lines);
        for (const line of lines) {
          console.log('Processing line:', JSON.stringify(line));
          if (line.startsWith('data: ')) {
            console.log('Found data line, parsing:', line);
            try {
              const data = JSON.parse(line.slice(6));
              const event = data.event;
              console.log('Received event:', event);
              
              if (event?.messageStart) {
                console.log('Agent message started');
                setIsTyping(false);
              }
              
              if (event?.contentBlockDelta?.delta?.text) {
                const textChunk = event.contentBlockDelta.delta.text;
                console.log('Received text chunk:', textChunk);
                isReceivedContent = true;
                
                setMessages(prev => {
                  const existingAgent = prev.find(msg => msg.id === agentMessageId);
                  if (existingAgent) {
                    return prev.map(msg => 
                      msg.id === agentMessageId 
                        ? { ...msg, text: msg.text + textChunk }
                        : msg
                    );
                  } else {
                    const newAgentMessage: Message = {
                      id: agentMessageId,
                      text: textChunk,
                      sender: 'agent',
                      timestamp: new Date(),
                    };
                    setIsTyping(false);
                    return [...prev, newAgentMessage];
                  }
                });
              }
              
              if (event?.messageStop) {
                console.log('Agent message completed:', event.messageStop.stopReason);
              }
              
            } catch (e) {
              console.error('Error parsing SSE data:', e, 'Raw line:', line);
            }
          }
        }

        return processStream();
      };

      await processStream();
      
      // コンテンツが受信されていない場合の処理
      if (!isReceivedContent) {
        console.log('No content received, showing fallback message');
        const fallbackMessage: Message = {
          id: agentMessageId,
          text: '応答を受信できませんでした。再度お試しください。',
          sender: 'agent',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, fallbackMessage]);
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Request was aborted');
      } else {
        console.error('Error sending message:', error);
        const errorMessage: Message = {
          id: agentMessageId,
          text: 'エラーが発生しました。もう一度お試しください。',
          sender: 'agent',
          timestamp: new Date(),
        };
        setMessages(prev => {
          const existingAgent = prev.find(msg => msg.id === agentMessageId);
          if (existingAgent) {
            return prev.map(msg => 
              msg.id === agentMessageId 
                ? { ...msg, text: 'エラーが発生しました。もう一度お試しください。' }
                : msg
            );
          } else {
            return [...prev, errorMessage];
          }
        });
      }
    } finally {
      setIsTyping(false);
      abortControllerRef.current = null;
    }
  };

  const handleKeyDown = () => {
    // Enterキーでの送信を無効化
  };

  return (
    <Container maxWidth="lg" sx={{ height: '100vh', display: 'flex', flexDirection: 'column', p: 0 }}>
      {/* Header */}
      <Paper 
        elevation={2} 
        sx={{ 
          p: 3, 
          borderRadius: 0,
          background: 'linear-gradient(45deg, #ff4757 30%, #ff6b7a 90%)'
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box sx={{ position: 'relative' }}>
            <Avatar src="/popo.png" sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
              <SmartToy sx={{ fontSize: 32, color: 'white' }} />
            </Avatar>
            <AutoAwesome 
              sx={{ 
                position: 'absolute', 
                top: -4, 
                right: -4, 
                color: 'white',
                fontSize: 20,
                animation: 'pulse 2s infinite'
              }} 
            />
          </Box>
          <Box>
            <Typography variant="h3" sx={{ color: 'white', fontWeight: 700, mb: 0.5 }}>
              となりのぽっぽくん
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {/* Messages */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 3, display: 'flex', flexDirection: 'column-reverse' }}>
        {isTyping && (
          <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ mb: 2 }}>
            <Avatar src="/popo.png" sx={{ bgcolor: 'primary.main' }}>
              <SmartToy />
            </Avatar>
            <Card sx={{ maxWidth: '70%' }}>
              <CardContent sx={{ py: 1.5 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Box 
                    sx={{ 
                      width: 8, 
                      height: 8, 
                      bgcolor: 'primary.main', 
                      borderRadius: '50%',
                      animation: 'bounce 1s infinite'
                    }} 
                  />
                  <Box 
                    sx={{ 
                      width: 8, 
                      height: 8, 
                      bgcolor: 'secondary.main', 
                      borderRadius: '50%',
                      animation: 'bounce 1s infinite 0.15s'
                    }} 
                  />
                  <Box 
                    sx={{ 
                      width: 8, 
                      height: 8, 
                      bgcolor: 'primary.main', 
                      borderRadius: '50%',
                      animation: 'bounce 1s infinite 0.3s'
                    }} 
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                    考え中...
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        )}

        {messages.length === 0 && (
          <Box sx={{ textAlign: 'center', mt: 8 }}>
            <Box sx={{ position: 'relative', display: 'inline-block', mb: 4 }}>
              <Avatar 
                src="/popo.png"
                sx={{ 
                  width: 120, 
                  height: 120, 
                  bgcolor: 'primary.main',
                  mx: 'auto',
                  mb: 2,
                  background: 'linear-gradient(45deg, #ff4757 30%, #ff6b7a 90%)'
                }}
              >
                <SmartToy sx={{ fontSize: 60 }} />
              </Avatar>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, color: 'primary.main' }}>
              となりのぽっぽくんへようこそ
            </Typography>
          </Box>
        )}
        
        {messages.slice().reverse().map((message) => (
          <Stack
            key={message.id}
            direction="row"
            spacing={2}
            sx={{
              justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
              mb: 2
            }}
          >
            {message.sender === 'agent' && (
              <Avatar src="/popo.png" sx={{ bgcolor: 'primary.main' }}>
                <SmartToy />
              </Avatar>
            )}
            
            <Card 
              sx={{
                maxWidth: '70%',
                bgcolor: message.sender === 'user' ? 'primary.main' : 'background.paper',
                color: message.sender === 'user' ? 'primary.contrastText' : 'text.primary',
                boxShadow: 3
              }}
            >
              <CardContent sx={{ py: 1.5 }}>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                  {message.text}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    opacity: 0.7, 
                    mt: 1, 
                    display: 'block',
                    color: message.sender === 'user' ? 'inherit' : 'text.secondary'
                  }}
                >
                  {message.timestamp.toLocaleTimeString()}
                </Typography>
              </CardContent>
            </Card>

            {message.sender === 'user' && (
              <Avatar sx={{ bgcolor: 'secondary.main' }}>
                <Person />
              </Avatar>
            )}
          </Stack>
        ))}

        <div ref={messagesEndRef} />
      </Box>

      {/* Input */}
      <Paper elevation={2} sx={{ p: 3, borderRadius: 0 }}>
        <Stack direction="row" spacing={2} alignItems="flex-end">
          <TextField
            fullWidth
            multiline
            minRows={2}
            maxRows={4}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="何でも聞いてくださいね..."
            disabled={isTyping}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: 'background.paper',
                '&:hover': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.light'
                  }
                },
                '&.Mui-focused': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main'
                  }
                }
              }
            }}
          />
          <Button
            variant="contained"
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isTyping}
            sx={{
              minWidth: 64,
              height: 64,
              borderRadius: 3,
              background: 'linear-gradient(45deg, #ff4757 30%, #ff6b7a 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #e84357 30%, #ff5569 90%)',
                transform: 'scale(1.05)',
                boxShadow: 6
              },
              '&:disabled': {
                transform: 'none'
              },
              transition: 'all 0.3s ease'
            }}
          >
            <Send />
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
