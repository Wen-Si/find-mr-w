import { useState, useRef, useEffect } from 'react';
import { Send, X, MessageCircle, User, Trash2, RefreshCw } from 'lucide-react';
import type { AIChatMessage, AIPersona, AIPersonaInfo } from '../types';

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

// 本地AI响应逻辑
const getLocalAIResponse = (message: string, persona: AIPersona | null, caseId?: string): string => {
  const activePersona = persona || 'partner';

  if (activePersona === 'boss') {
    const responses = [
      `关于你提到的"${message.slice(0, 20)}..."，这是一个严肃的问题。作为专业的财务人员，你需要更系统地分析。`,
      `嗯...你的思路有一定道理，但还不够深入。记住，每一笔数字背后都可能隐藏着真相。`,
      `不要急于下结论。在财务调查中，证据是最重要的。你找到相关的凭证了吗？`,
      `我对你目前的进展不太满意。一个优秀的侦探应该能看到数字之间的联系。`,
      `好的发现！但这只是冰山一角。继续深入，你会发现更多的异常。`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  if (activePersona === 'rival') {
    const responses = [
      `哈哈哈，你觉得这能算发现吗？我早就注意到这一点了。😏`,
      `这个方向...我不太确定你走对了路。让我看看我会不会在终点等你。`,
      `有趣的发现，但我怀疑这是真正的问题所在。不过，你愿意怎么查就怎么查吧。`,
      `我已经找到了更关键的证据。不过我不会告诉你是什么，祝你好运！`,
      `...这个发现还说得过去。但别以为这样就能赢过我。`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // partner (默认)
  const responses = [
    `关于你的问题，我觉得可以从以下几个方面思考：\n\n1. 检查相关的财务凭证\n2. 对比同行业的数据\n3. 注意时间线是否合理\n\n希望对你有帮助！`,
    `这是一个好问题！我查了一下，类似的案例通常涉及到关联交易或收入确认问题。`,
    `我刚才整理了一些相关资料。你提到的这个点确实值得怀疑，但需要更多的证据支持。`,
    `别担心，我们一步一步来。先收集证据，再做判断。我会在旁边协助你的！`,
    `发现了一个可能的线索，但不确定是否相关。你可以再仔细看看相关的合同和银行流水。`,
  ];
  return responses[Math.floor(Math.random() * responses.length)];
};

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

  const loadConversation = () => {
    try {
      const stored = localStorage.getItem('fmw_ai_messages');
      if (stored) {
        setMessages(JSON.parse(stored));
      } else if (messages.length === 0) {
        // 初始欢迎消息
        const welcomeMessage: AIChatMessage = {
          role: 'assistant',
          content: '你好！我是你的AI顾问。有什么问题需要我帮助分析吗？你可以选择不同的角色来获得不同的视角。',
          timestamp: new Date().toISOString(),
          persona: 'partner',
        };
        setMessages([welcomeMessage]);
      }
    } catch (error) {
      console.error('Failed to load conversation:', error);
    }
  };

  const handleClearConversation = () => {
    if (confirm('确定要清空对话历史吗？')) {
      localStorage.removeItem('fmw_ai_messages');
      setMessages([]);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: AIChatMessage = {
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputMessage('');
    setIsLoading(true);

    try {
      // 模拟延迟
      await new Promise(resolve => setTimeout(resolve, 800));

      const responseContent = getLocalAIResponse(inputMessage.trim(), selectedPersona, caseId);
      const personaForResponse = selectedPersona || 'partner';
      const aiMessage: AIChatMessage = {
        role: 'assistant',
        content: responseContent,
        timestamp: new Date().toISOString(),
        persona: personaForResponse,
      };

      const finalMessages = [...newMessages, aiMessage];
      setMessages(finalMessages);
      localStorage.setItem('fmw_ai_messages', JSON.stringify(finalMessages));
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: AIChatMessage = {
        role: 'assistant',
        content: '抱歉，我现在无法提供帮助，请稍后再试。',
        timestamp: new Date().toISOString(),
        persona: 'partner',
      };
      setMessages([...newMessages, errorMessage]);
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
              <p className="text-slate-400 text-xs">由本地 AI 驱动</p>
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
        <div className="p-3 border-b border-slate-700 bg-slate-800/50">
          <div className="grid grid-cols-3 gap-2">
            {personaOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setSelectedPersona(selectedPersona === option.id ? null : option.id)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all border ${
                  selectedPersona === option.id
                    ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 border-purple-400 text-white shadow-lg shadow-purple-500/20'
                    : 'border-slate-600/50 text-slate-400 hover:text-white hover:border-slate-500 hover:bg-slate-700/50'
                }`}
              >
                <span className="text-2xl">{option.icon}</span>
                <span className="text-xs font-medium">{option.name}</span>
                <span className="text-[10px] text-slate-500 hidden sm:block">{option.description}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white text-sm font-medium'
                    : 'bg-gradient-to-br from-purple-500 to-pink-500 text-lg'
                }`}
              >
                {msg.role === 'user' ? <User className="w-4 h-4" /> : getPersonaIcon(msg.persona)}
              </div>
              <div
                className={`max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-br-md'
                      : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-md'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
                <div className={`text-xs text-slate-500 mt-1 ${msg.role === 'user' ? 'text-right' : ''}`}>
                  {msg.role === 'user' ? '你' : getPersonaInfo(msg.persona).name}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-lg">
                {getPersonaIcon(selectedPersona || 'partner')}
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-slate-700 bg-slate-800/50">
          <div className="flex gap-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="输入你的问题..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="px-5 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white rounded-xl font-medium transition-all shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">发送</span>
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-2 text-center">
            选择角色可以获得不同风格的回答
          </p>
        </div>
      </div>
    </div>
  );
}
