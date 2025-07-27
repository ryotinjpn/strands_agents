'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card, CardContent } from './ui/card';

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
      const response = await fetch('/api/invocations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: currentInput }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('Response body is not readable');
      }

      let buffer = '';
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // 最後の不完全な行を保持

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              const event = data.event;
              
              if (event?.contentBlockDelta?.delta?.text) {
                const textChunk = event.contentBlockDelta.delta.text;
                // リアルタイムでテキストを追加
                setMessages(prev => {
                  const existingAgent = prev.find(msg => msg.id === agentMessageId);
                  if (existingAgent) {
                    // 既存のエージェントメッセージを更新
                    return prev.map(msg => 
                      msg.id === agentMessageId 
                        ? { ...msg, text: msg.text + textChunk }
                        : msg
                    );
                  } else {
                    // 新しいエージェントメッセージを作成
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
            } catch (e) {
              console.error('Error parsing SSE data:', e);
            }
          }
        }
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
    <div className="flex flex-col h-screen max-w-6xl mx-auto bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border bg-card shadow-lg">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Bot className="w-10 h-10 text-primary" />
            <Sparkles className="w-4 h-4 text-accent-foreground absolute -top-1 -right-1 animate-pulse" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Strands Agents
            </h1>
            <p className="text-sm text-muted-foreground">AI-powered conversation</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col-reverse">
        {isTyping && (
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-lg">
                <Bot className="w-5 h-5 text-primary-foreground" />
              </div>
            </div>
            <Card className="bg-card border border-border shadow-lg">
              <CardContent className="px-4 py-1">
                <div className="flex space-x-1 items-center">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                  <span className="text-xs text-muted-foreground ml-2">Thinking...</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {messages.length === 0 && (
          <div className="text-center mt-12">
            <div className="relative inline-block">
              <Bot className="w-20 h-20 text-primary mx-auto mb-6" />
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Welcome to Strands Agents</h2>
            <p className="text-muted-foreground">Start a conversation and experience the future of AI interaction</p>
          </div>
        )}
        
        {messages.slice().reverse().map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-4 ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.sender === 'agent' && (
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-lg">
                  <Bot className="w-5 h-5 text-primary-foreground" />
                </div>
              </div>
            )}
            
            <Card className={`max-w-lg shadow-lg ${
              message.sender === 'user'
                ? 'bg-primary text-primary-foreground ml-auto border-0'
                : 'bg-card border border-border'
            }`}>
              <CardContent className="px-4 py-1">
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.text}</p>
                <p className="text-xs opacity-70 mt-2">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </CardContent>
            </Card>

            {message.sender === 'user' && (
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center shadow-lg">
                  <User className="w-5 h-5 text-accent-foreground" />
                </div>
              </div>
            )}
          </div>
        ))}

        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-6 border-t border-border bg-card">
        <div className="flex space-x-4 items-end">
          <div className="flex-1">
            <Textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              className="resize-none min-h-[60px] bg-background border-border focus:border-primary focus:ring-primary/20 shadow-lg"
              disabled={isTyping}
            />
          </div>
          <Button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isTyping}
            className="bg-primary hover:bg-primary/80 shadow-lg w-[60px] h-[60px] transition-all duration-300 hover:shadow-xl hover:scale-105 disabled:hover:scale-100"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}