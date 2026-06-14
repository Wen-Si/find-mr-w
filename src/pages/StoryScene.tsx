import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { generateStory, characterInteraction } from '../api';
import { ArrowLeft, MessageCircle, Lightbulb, AlertTriangle, Sparkles } from 'lucide-react';

interface Dialogue {
  speaker: string;
  role: string;
  content: string;
  emotion?: string;
  revealsClue?: boolean;
  clueText?: string;
}

interface StoryData {
  title: string;
  narrative: string;
  dialogues: Dialogue[];
  plotTwists: string[];
  playerActions: string[];
  aiInsight: string;
}

export default function StoryScene() {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(true);
  const [storyData, setStoryData] = useState<StoryData | null>(null);
  const [currentStage, setCurrentStage] = useState<'intro' | 'development' | 'climax' | 'conclusion'>('intro');
  const [error, setError] = useState('');
  
  // 角色互动
  const [interactionMode, setInteractionMode] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState('boss');
  const [interactionInput, setInteractionInput] = useState('');
  const [interactions, setInteractions] = useState<Array<{speaker: string; content: string}>>([]);
  const [isInteracting, setIsInteracting] = useState(false);

  const characterOptions = [
    { id: 'boss', name: '王主任', icon: '👔', description: '严厉的上司' },
    { id: 'partner', name: '李助理', icon: '🤝', description: '热情的同事' },
    { id: 'rival', name: '张探长', icon: '🔍', description: '神秘对手' },
    { id: 'witness', name: '神秘证人', icon: '🕵️', description: '关键证人' },
    { id: 'suspect', name: '嫌疑人', icon: '⚠️', description: '被调查者' },
  ];

  useEffect(() => {
    loadStory();
  }, [caseId, currentStage]);

  const loadStory = async () => {
    if (!caseId) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const result = await generateStory(caseId, currentStage);
      if (result.success && result.data) {
        setStoryData(result.data.story);
      } else {
        setError('生成剧情失败');
      }
    } catch (err) {
      setError((err as Error).message || '加载剧情失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCharacterInteraction = async () => {
    if (!interactionInput.trim() || !caseId) return;
    
    setIsInteracting(true);
    
    try {
      const result = await characterInteraction(caseId, selectedCharacter, interactionInput);
      if (result.success && result.data) {
        setInteractions([
          ...interactions,
          { speaker: '你', content: interactionInput },
          { speaker: result.data.speaker, content: result.data.response },
        ]);
        setInteractionInput('');
      }
    } catch (err) {
      console.error('Interaction error:', err);
    } finally {
      setIsInteracting(false);
    }
  };

  const stageButtons = [
    { id: 'intro', label: '开场', icon: '🎬' },
    { id: 'development', label: '发展', icon: '📖' },
    { id: 'climax', label: '高潮', icon: '⚡' },
    { id: 'conclusion', label: '结局', icon: '🎯' },
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 p-4">
      {/* 头部导航 */}
      <div className="max-w-4xl mx-auto mb-6">
        <button
          onClick={() => navigate('/game')}
          className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft size={20} />
          <span>返回游戏主页</span>
        </button>

        <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
          <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <Sparkles className="text-amber-400" />
            AI剧情演绎
          </h1>
          <p className="text-slate-400 text-sm">
            当前案件：{caseId} | 你的角色将由AI智能驱动，体验独特的剧情发展
          </p>
        </div>
      </div>

      {/* 剧情阶段选择 */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="flex gap-2">
          {stageButtons.map((stage) => (
            <button
              key={stage.id}
              onClick={() => setCurrentStage(stage.id)}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                currentStage === stage.id
                  ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              <span>{stage.icon}</span>
              <span>{stage.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 加载状态 */}
      {isLoading && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-12 border border-slate-700 text-center">
            <div className="text-6xl mb-4 animate-bounce">🤖</div>
            <p className="text-xl text-white mb-2">AI正在生成剧情...</p>
            <p className="text-slate-400">请稍候，剧情即将展开</p>
          </div>
        </div>
      )}

      {/* 错误提示 */}
      {error && !isLoading && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <p className="text-red-400">{error}</p>
            <button
              onClick={loadStory}
              className="mt-2 text-amber-400 hover:text-amber-300"
            >
              点击重试
            </button>
          </div>
        </div>
      )}

      {/* 剧情内容 */}
      {!isLoading && storyData && !error && (
        <div className="max-w-4xl mx-auto space-y-6">
          {/* 叙述文字 */}
          {storyData.narrative && (
            <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <h2 className="text-xl font-bold text-amber-400 mb-4">{storyData.title}</h2>
              <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                {storyData.narrative}
              </div>
            </div>
          )}

          {/* 对话展示 */}
          {storyData.dialogues && storyData.dialogues.length > 0 && (
            <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <MessageCircle className="text-emerald-400" />
                角色对话
              </h3>
              <div className="space-y-4">
                {storyData.dialogues.map((dialogue, index) => (
                  <div
                    key={index}
                    className={`flex gap-3 ${dialogue.role === 'narrator' ? 'justify-center' : 'justify-start'}`}
                  >
                    {dialogue.role !== 'narrator' && (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-lg flex-shrink-0">
                        {dialogue.speaker[0]}
                      </div>
                    )}
                    <div className={`flex-1 ${dialogue.role === 'narrator' ? 'text-center' : ''}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-white">{dialogue.speaker}</span>
                        <span className="text-xs text-slate-500">({dialogue.role})</span>
                        {dialogue.emotion && (
                          <span className="text-xs text-amber-400">[{dialogue.emotion}]</span>
                        )}
                      </div>
                      <div className="bg-slate-700/50 rounded-lg p-3 text-slate-300">
                        {dialogue.content}
                      </div>
                      {dialogue.revealsClue && dialogue.clueText && (
                        <div className="mt-2 bg-amber-500/20 border border-amber-500/30 rounded-lg p-3">
                          <div className="flex items-center gap-2 text-amber-400 text-sm mb-1">
                            <Lightbulb size={16} />
                            <span className="font-semibold">关键线索</span>
                          </div>
                          <p className="text-amber-300 text-sm">{dialogue.clueText}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 剧情转折 */}
          {storyData.plotTwists && storyData.plotTwists.length > 0 && (
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6">
              <h3 className="text-lg font-bold text-purple-400 mb-3 flex items-center gap-2">
                <AlertTriangle size={20} />
                剧情转折
              </h3>
              <ul className="space-y-2">
                {storyData.plotTwists.map((twist, index) => (
                  <li key={index} className="text-purple-300 flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span>{twist}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* AI洞察 */}
          {storyData.aiInsight && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-2xl flex-shrink-0">
                  🤖
                </div>
                <div>
                  <h3 className="text-lg font-bold text-amber-400 mb-2">AI提示</h3>
                  <p className="text-amber-300 leading-relaxed">{storyData.aiInsight}</p>
                </div>
              </div>
            </div>
          )}

          {/* 角色互动区域 */}
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <MessageCircle className="text-emerald-400" />
                与角色对话
              </h3>
              <button
                onClick={() => setInteractionMode(!interactionMode)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  interactionMode
                    ? 'bg-red-500 text-white'
                    : 'bg-emerald-500 text-white hover:bg-emerald-400'
                }`}
              >
                {interactionMode ? '关闭对话' : '开启对话'}
              </button>
            </div>

            {interactionMode && (
              <>
                {/* 角色选择 */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    选择对话角色
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {characterOptions.map((char) => (
                      <button
                        key={char.id}
                        onClick={() => setSelectedCharacter(char.id)}
                        className={`p-3 rounded-lg text-center transition-all ${
                          selectedCharacter === char.id
                            ? 'bg-amber-500 text-white border-2 border-amber-400'
                            : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700 border border-slate-600'
                        }`}
                      >
                        <div className="text-2xl mb-1">{char.icon}</div>
                        <div className="text-xs">{char.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 对话历史 */}
                {interactions.length > 0 && (
                  <div className="mb-4 space-y-3 max-h-64 overflow-y-auto">
                    {interactions.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex gap-2 ${msg.speaker === '你' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs rounded-lg p-3 ${
                            msg.speaker === '你'
                              ? 'bg-amber-500 text-white'
                              : 'bg-slate-700 text-slate-300'
                          }`}
                        >
                          <div className="text-xs opacity-75 mb-1">{msg.speaker}</div>
                          <div>{msg.content}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 输入框 */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={interactionInput}
                    onChange={(e) => setInteractionInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleCharacterInteraction()}
                    placeholder={`向${characterOptions.find(c => c.id === selectedCharacter)?.name}提问...`}
                    disabled={isInteracting}
                    className="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
                  />
                  <button
                    onClick={handleCharacterInteraction}
                    disabled={isInteracting || !interactionInput.trim()}
                    className="px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isInteracting ? '...' : '发送'}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* 玩家行动 */}
          {storyData.playerActions && storyData.playerActions.length > 0 && (
            <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-bold text-white mb-4">接下来你要做什么？</h3>
              <div className="grid grid-cols-2 gap-3">
                {storyData.playerActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (action.includes('继续') || action.includes('发展')) {
                        setCurrentStage('development');
                      } else if (action.includes('高潮') || action.includes('转折')) {
                        setCurrentStage('climax');
                      } else {
                        setInteractionMode(true);
                      }
                    }}
                    className="py-3 px-4 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/30 transition-colors text-left"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
