import { useState, useRef, useEffect } from 'react';
import { Send, X, MessageCircle, User, Trash2, RefreshCw } from 'lucide-react';
import { sendAIChat, fetchAIConversation, clearAIConversation } from '../api';
import type { AIChatMessage, AIChatResponse, AIConversationResponse, AIPersona, AIPersonaInfo } from '../types';

interface AIChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  caseId?: string;
}

interface PersonaOption {
  id: AIPersona;
  name: string;
  icon: string;
  description: string;
}

const personaOptions: PersonaOption[] = [
  {
    id: 'boss',
    name: '王主任',
    icon: '👨‍💼',
    description: '严厉的上司，专业指导'
  },
  {
    id: 'partner',
    name: '李助理',
    icon: '👩‍💻',
    description: '热情的伙伴，分享信息'
  },
  {
    id: 'rival',
    name: '张探长',
    icon: '🕵️',
    description: '竞争的对手，制造麻烦'
  },
];

export function AIChatPanel({ isOpen, onClose, caseId }: AIChatPanelProps) {
  const [messages, setMessages] = useState<AIChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<AIPersona | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      loadConversation();
    }
  }, [isOpen]);

  const loadConversation = async () => {
    try {
      const result: AIConversationResponse = await fetchAIConversation();
      if (result.success) {
        setMessages(result.data);
      }
    } catch (error) {
      console.error('Failed to load conversation:', error);
    }
  };

  const handleClearConversation = async () => {
    if (confirm('确定要清空对话历史吗？')) {
      try {
        await clearAIConversation();
        setMessages([]);
      } catch (error) {
        console.error('Failed to clear conversation:', error);
      }
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: AIChatMessage = {
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const result: AIChatResponse = await sendAIChat(inputMessage, caseId, selectedPersona);
      
      if (result.success) {
        const aiMessage: AIChatMessage = {
          role: 'assistant',
          content: result.data.response,
          timestamp: new Date().toISOString(),
          persona: result.data.persona,
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        const fallbackMessage: AIChatMessage = {
          role: 'assistant',
          content: result.data.response || '抱歉，我现在无法提供帮助，请稍后再试。',
          timestamp: new Date().toISOString(),
          persona: 'partner',
        };
        setMessages(prev => [...prev, fallbackMessage]);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: AIChatMessage = {
        role: 'assistant',
        content: '抱歉，连接失败，请稍后再试。',
        timestamp: new Date().toISOString(),
        persona: 'partner',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getPersonaInfo = (persona?: AIPersona): AIPersonaInfo => {
    const personaMap: Record<AIPersona, AIPersonaInfo> = {
      boss: {
        name: '王主任',
        style: '严厉的上司',
        color: '#8B0000',
      },
      partner: {
        name: '李助理',
        style: '热情的伙伴',
        color: '#4169E1',
      },
      rival: {
        name: '张探长',
        style: '竞争的对手',
        color: '#2F4F4F',
      },
    };
    return personaMap[persona || 'partner'];
  };

  const getPersonaIcon = (persona?: AIPersona) => {
    switch (persona) {
      case 'boss':
        return '👨‍💼';
      case 'rival':
        return '🕵️';
      default:
        return '👩‍💻';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-slate-900 w-full sm:w-[600px] max-h-[90vh] sm:max-h-[80vh] rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col border border-slate-700">
        {/* Header */}
        <div className="p-4 border-b border-slate-700 flex items-center justify-between bg-gradient-to-r from-purple-900/50 to-indigo-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-white font-semibold">神秘顾问</h2>
              <p className="text-slate-400 text-xs">由 Qwen AI 驱动</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadConversation}
              className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
              title="刷新对话"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleClearConversation}
              className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
              title="清空历史"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Persona Selector */}
        <div className="p-3 bg-slate-800/50 border-b border-slate-700">
          <p className="text-xs text-slate-400 mb-2">选择咨询对象（下次对话生效）：</p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {personaOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setSelectedPersona(selectedPersona === option.id ? null : option.id)}
                className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm transition-all ${
                  selectedPersona === option.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                <span className="mr-1">{option.icon}</span>
                {option.name}
              </button>
            ))}
            {selectedPersona && (
              <button
                onClick={() => setSelectedPersona(null)}
                className="flex-shrink-0 px-3 py-2 rounded-lg text-sm bg-slate-600 text-slate-300 hover:bg-slate-500"
              >
                🎲 随机
              </button>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px] max-h-[50vh] sm:max-h-[500px]">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-slate-400">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-4">
                <MessageCircle className="w-10 h-10 text-purple-400" />
              </div>
              <p className="text-lg mb-2">开始你的对话吧！</p>
              <p className="text-sm max-w-xs">
                你可以向我咨询案件相关问题，我会根据角色身份给你帮助或制造麻烦 😉
              </p>
            </div>
          ) : (
            messages.map((msg, index) => {
              return (
                <div
                  key={index}
                  className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.role === 'user'
                        ? 'bg-blue-600'
                        : 'bg-gradient-to-br from-purple-600 to-pink-600'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <span className="text-sm">{getPersonaIcon(msg.persona)}</span>
                    )}
                  </div>
                  <div
                    className={`max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}
                  >
                    {msg.role === 'assistant' && msg.persona && (
                      <span
                        className="text-xs mb-1 px-2 py-0.5 rounded-full inline-block"
                        style={{
                          backgroundColor: `${getPersonaInfo(msg.persona).color}30`,
                          color: getPersonaInfo(msg.persona).color,
                        }}
                      >
                        {getPersonaInfo(msg.persona).name}
                      </span>
                    )}
                    <div
                      className={`px-4 py-3 rounded-2xl ${
                        msg.role === 'user'
                          ? 'bg-blue-600 text-white rounded-br-md'
                          : 'bg-slate-700 text-slate-100 rounded-bl-md'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                    <span className="text-xs text-slate-500 mt-1">
                      {new Date(msg.timestamp).toLocaleTimeString('zh-CN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              );
            })
          )}

          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0">
                <span className="text-sm">🤔</span>
              </div>
              <div className="bg-slate-700 px-4 py-3 rounded-2xl rounded-bl-md">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-slate-700">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="输入你的问题..."
              className="flex-1 bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-2 text-center">
            💡 提示：角色会随机切换，他们的建议需要你自己判断真伪！
          </p>
        </div>
      </div>
    </div>
  );
}