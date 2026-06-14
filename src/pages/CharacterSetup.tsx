import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCharacter } from '../api';

export default function CharacterSetup() {
  const navigate = useNavigate();
  const [characterName, setCharacterName] = useState('');
  const [characterBackground, setCharacterBackground] = useState('');
  const [personality, setPersonality] = useState('');
  const [goals, setGoals] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!characterName || !characterBackground) {
      setError('请填写角色名称和背景故事');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      await createCharacter({
        characterName,
        characterBackground,
        personality: personality || '正义、勇敢、聪明',
        goals: goals || '找出Mr.W的真相',
      });
      
      // 创建成功后跳转到游戏主页
      navigate('/game');
    } catch (err) {
      setError((err as Error).message || '创建角色失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const characterTemplates = [
    {
      name: '审计新人',
      background: '刚从财经大学毕业，加入审计部门的新人分析师',
      personality: '勤奋好学、谨慎认真',
      goals: '在审计工作中证明自己，逐步揭开财务造假的真相',
    },
    {
      name: '资深调查员',
      background: '在财务调查领域工作多年的老手',
      personality: '经验丰富、直觉敏锐',
      goals: '追踪Mr.W的真实身份，将其绳之以法',
    },
    {
      name: '内部举报人',
      background: '公司内部的知情员工，决定揭露造假行为',
      personality: '勇敢正直、内心挣扎',
      goals: '在不暴露身份的情况下收集证据',
    },
  ];

  const selectTemplate = (template: typeof characterTemplates[0]) => {
    setCharacterName(template.name);
    setCharacterBackground(template.background);
    setPersonality(template.personality);
    setGoals(template.goals);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-800/90 backdrop-blur-sm rounded-2xl p-8 w-full max-w-2xl border border-slate-700 shadow-2xl">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎭</div>
          <h1 className="text-3xl font-bold text-white mb-2">创建你的角色</h1>
          <p className="text-slate-400">在开始调查之前，请设定你的角色身份</p>
        </div>

        {/* 角色模板选择 */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">快速选择模板</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {characterTemplates.map((template, index) => (
              <button
                key={index}
                onClick={() => selectTemplate(template)}
                className="bg-slate-700/50 hover:bg-slate-700 border border-slate-600 hover:border-amber-500/50 rounded-lg p-3 text-left transition-all"
              >
                <div className="text-white font-medium mb-1">{template.name}</div>
                <div className="text-slate-400 text-xs">{template.background.substring(0, 30)}...</div>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              角色名称 *
            </label>
            <input
              type="text"
              value={characterName}
              onChange={(e) => setCharacterName(e.target.value)}
              placeholder="例如：财务分析师小明"
              required
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              角色背景故事 *
            </label>
            <textarea
              value={characterBackground}
              onChange={(e) => setCharacterBackground(e.target.value)}
              placeholder="描述你的角色背景：你是谁？来自哪里？有什么经历？"
              required
              rows={4}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              角色性格特征
            </label>
            <input
              type="text"
              value={personality}
              onChange={(e) => setPersonality(e.target.value)}
              placeholder="例如：聪明、勇敢、正义感强"
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              角色目标
            </label>
            <input
              type="text"
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              placeholder="例如：揭露财务造假，找出Mr.W"
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <h4 className="text-amber-400 font-medium mb-1">AI智能角色系统</h4>
                <p className="text-slate-300 text-sm">
                  你的角色将由AI大模型（智谱GLM-4.5-Flash）驱动！
                  AI会根据你的角色设定生成独特的对话、情节和反应，让你的游戏体验更加丰富和个性化。
                </p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 px-6 rounded-lg font-bold text-lg transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white shadow-lg"
          >
            {isLoading ? '正在创建角色...' : '开始调查之旅'}
          </button>
        </form>
      </div>
    </div>
  );
}
