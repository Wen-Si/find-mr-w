import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { skills } from '../data/gameData';
import { AIChatPanel } from '../components/AIChatPanel';
import { MessageCircle, TrendingUp, AlertTriangle, Briefcase, FileText, Target, User, Sparkles, BookOpen } from 'lucide-react';

export default function GameHome() {
  const { player, user, cases, isLoading, error, fetchCases, logout } = useGameStore();
  const navigate = useNavigate();
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

  useEffect(() => {
    if (player && cases.length === 0) {
      fetchCases();
    }
  }, [player, cases.length, fetchCases]);

  if (!player) {
    navigate('/');
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 flex items-center justify-center">
        <div className="text-emerald-300 text-xl flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          正在加载侦探事务所...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 flex items-center justify-center">
        <div className="text-red-400 text-xl flex items-center gap-3">
          <AlertTriangle className="w-6 h-6" />
          {error}
        </div>
      </div>
    );
  }

  const currentLevelExp = (player.level - 1) * 100;
  const nextLevelExp = player.level * 100;
  const expProgress = ((player.experience - currentLevelExp) / 100) * 100;

  const unlockedSkills = skills.filter(skill => 
    player.unlockedSkills?.includes(skill.id)
  );

  const completedCount = player.completedCases?.length || 0;
  const completionRate = cases.length > 0 ? Math.round((completedCount / cases.length) * 100) : 0;

  const handleStartCase = (caseId: string) => {
    navigate(`/case/${caseId}`);
  };

  const handleStartStory = (caseId: string) => {
    navigate(`/story/${caseId}`);
  };

  const handleSetupCharacter = () => {
    navigate('/setup');
  };

  // 获取当前职业头衔
  const getTitle = (level: number) => {
    if (level >= 8) return { name: '首席审计师', color: 'text-purple-400', bg: 'bg-purple-500/20', border: 'border-purple-500/30' };
    if (level >= 5) return { name: '审计大师', color: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500/30' };
    if (level >= 3) return { name: '高级分析师', color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/30' };
    return { name: '初级财务分析师', color: 'text-slate-300', bg: 'bg-slate-700/50', border: 'border-slate-600' };
  };

  const currentTitle = getTitle(player.level);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 顶部导航栏 */}
        <header className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center text-2xl shadow-lg shadow-emerald-500/30">
                🔍
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">财务侦探事务所</h1>
                <p className="text-emerald-400 text-sm">Financial Detective Bureau</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsAIChatOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-purple-500/25"
              >
                <MessageCircle className="w-4 h-4" />
                神秘顾问
              </button>
              <div className="flex items-center gap-3 bg-slate-800/60 rounded-xl px-4 py-2 border border-slate-700">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                  {user?.username?.[0]?.toUpperCase() || 'D'}
                </div>
                <div className="hidden sm:block">
                  <p className="text-white text-sm font-medium">{user?.username || '侦探'}</p>
                  <p className="text-slate-400 text-xs">{user?.email}</p>
                </div>
                <button
                  onClick={logout}
                  className="ml-2 text-slate-400 hover:text-red-400 transition-colors"
                  title="退出登录"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* 主内容区 */}
        <div className="grid lg:grid-cols-12 gap-6">
          {/* 左侧 - 侦探档案 (4列) */}
          <div className="lg:col-span-4 space-y-6">
            {/* 侦探名片 */}
            <div className="bg-gradient-to-br from-slate-800/90 to-emerald-900/40 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center text-4xl shadow-xl shadow-amber-500/30">
                    🕵️
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-white mb-1">{user?.username || '侦探'}</h2>
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${currentTitle.bg} ${currentTitle.color} border ${currentTitle.border}`}>
                      <span className="text-xs">📋</span>
                      {currentTitle.name}
                    </div>
                  </div>
                </div>

                {/* 等级进度条 */}
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-amber-400">⭐</span>
                      <span className="text-amber-300 font-semibold">等级 {player.level}</span>
                    </div>
                    <span className="text-slate-400 text-sm">{player.experience} / {nextLevelExp} XP</span>
                  </div>
                  <div className="h-2.5 bg-slate-700/60 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 transition-all duration-700"
                      style={{ width: `${Math.min(expProgress, 100)}%` }}
                    />
                  </div>
                </div>

                {/* 职业技能 */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4 text-emerald-400" />
                    专业技能
                  </h3>
                  <div className="space-y-2">
                    {unlockedSkills.length > 0 ? (
                      unlockedSkills.map(skill => (
                        <div
                          key={skill.id}
                          className="flex items-center gap-3 bg-slate-700/40 rounded-xl p-3 border border-slate-600/50"
                        >
                          <span className="text-2xl">{skill.icon}</span>
                          <div className="flex-1">
                            <p className="text-white font-medium text-sm">{skill.name}</p>
                            <p className="text-slate-400 text-xs">{skill.description}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-500 text-sm py-3">完成案件解锁更多技能...</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* W先生线索 */}
            <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-amber-400">🔮</span>
                W先生线索墙
              </h2>
              {player.wClues && player.wClues.length > 0 ? (
                <div className="space-y-3">
                  {player.wClues.map((clue, index) => (
                    <div
                      key={index}
                      className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 relative"
                    >
                      <div className="absolute -top-2 -left-1 w-6 h-6 bg-amber-500/20 rounded-full border-2 border-dashed border-amber-500/40"></div>
                      <p className="text-amber-200 text-sm leading-relaxed">{clue}</p>
                      <div className="mt-2 text-xs text-amber-400/60">线索 #{index + 1}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3 opacity-30">🔍</div>
                  <p className="text-slate-500 text-sm">完成案件以获取W先生线索...</p>
                </div>
              )}
            </div>
          </div>

          {/* 右侧 - 案件和统计 (8列) */}
          <div className="lg:col-span-8 space-y-6">
            {/* 统计卡片 */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-emerald-900/50 to-emerald-800/30 rounded-2xl p-5 border border-emerald-700/30">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <span className="text-emerald-300 text-sm font-medium">完成案件</span>
                </div>
                <p className="text-3xl font-bold text-white">{completedCount} <span className="text-lg text-emerald-400 font-normal">/ {cases.length}</span></p>
                <div className="mt-2 flex items-center gap-1">
                  <div className="h-1.5 bg-emerald-900/50 rounded-full flex-1 overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${completionRate}%` }}></div>
                  </div>
                  <span className="text-emerald-400 text-xs font-medium">{completionRate}%</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 rounded-2xl p-5 border border-purple-700/30">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-400">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="text-purple-300 text-sm font-medium">收集线索</span>
                </div>
                <p className="text-3xl font-bold text-white">{player.wClues?.length || 0}</p>
                <p className="mt-2 text-purple-400 text-xs">关于W先生的线索</p>
              </div>

              <div className="bg-gradient-to-br from-amber-900/50 to-amber-800/30 rounded-2xl p-5 border border-amber-700/30">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center text-amber-400">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <span className="text-amber-300 text-sm font-medium">总经验值</span>
                </div>
                <p className="text-3xl font-bold text-white">{player.experience}</p>
                <p className="mt-2 text-amber-400 text-xs">经验值累计</p>
              </div>
            </div>

            {/* AI剧情入口卡片 */}
            <div className="bg-gradient-to-r from-purple-900/60 via-pink-900/40 to-purple-900/60 rounded-2xl p-6 border border-purple-500/30 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-purple-500/30">
                      🤖
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                        <Sparkles className="text-amber-400" />
                        AI智能剧情体验
                      </h3>
                      <p className="text-purple-200/80 text-sm">
                        由AI大模型驱动，你的角色将自动演绎精彩剧情，对话和情节完全由AI生成！
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={handleSetupCharacter}
                      className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white rounded-xl font-medium transition-all shadow-lg shadow-purple-500/30"
                    >
                      <User className="w-4 h-4" />
                      {player.wClues && player.wClues.length > 0 ? '查看/修改角色' : '设定角色'}
                    </button>
                    {cases.length > 0 && (
                      <button
                        onClick={() => handleStartStory(cases[0].id)}
                        className="flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 border border-purple-400/30 text-purple-200 rounded-xl font-medium transition-all"
                      >
                        <BookOpen className="w-4 h-4" />
                        体验AI剧情
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 案件档案 */}
            <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-400" />
                  案件档案库
                </h2>
                <span className="text-slate-400 text-sm">{cases.length} 个案件</span>
              </div>

              <div className="space-y-4">
                {cases.map((c, index) => {
                  const isUnlocked = player.unlockedCases?.includes(c.id);
                  const isCompleted = player.completedCases?.includes(c.id);

                  return (
                    <div
                      key={c.id}
                      className={`relative overflow-hidden rounded-2xl border transition-all ${
                        isUnlocked
                          ? isCompleted
                            ? 'bg-gradient-to-r from-emerald-900/40 to-emerald-800/20 border-emerald-700/40'
                            : 'bg-slate-700/50 border-slate-600 hover:border-emerald-500/50 hover:bg-slate-700/70 cursor-pointer group'
                          : 'bg-slate-800/50 border-slate-700 opacity-60'
                      }`}
                      onClick={() => isUnlocked && !isCompleted && handleStartCase(c.id)}
                    >
                      {/* 装饰元素 */}
                      {(isCompleted || isUnlocked) && (
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2"></div>
                      )}

                      <div className="p-5 relative z-10">
                        <div className="flex items-start gap-4">
                          {/* 案件编号徽章 */}
                          <div className={`flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center ${
                            isCompleted
                              ? 'bg-emerald-500/20 border border-emerald-500/40'
                              : isUnlocked
                                ? 'bg-amber-500/20 border border-amber-500/40'
                                : 'bg-slate-700/50 border border-slate-600'
                          }`}>
                            {isCompleted ? (
                              <span className="text-2xl">✅</span>
                            ) : isUnlocked ? (
                              <span className="text-2xl">📁</span>
                            ) : (
                              <span className="text-2xl">🔒</span>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                isCompleted
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : isUnlocked
                                    ? 'bg-amber-500/20 text-amber-400'
                                    : 'bg-slate-700/50 text-slate-500'
                              }`}>
                                案件 {index + 1}
                              </span>
                              <div className="flex items-center gap-1">
                                {[...Array(3)].map((_, i) => (
                                  <span 
                                    key={i} 
                                    className={`text-lg ${i < c.difficulty ? 'text-amber-400' : 'text-slate-600'}`}
                                  >
                                    ⭐
                                  </span>
                                ))}
                              </div>
                              {isCompleted && (
                                <span className="text-emerald-400 text-sm font-medium flex items-center gap-1">
                                  <span>✓</span>
                                  已结案
                                </span>
                              )}
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">
                              {c.title}
                            </h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                              {c.description}
                            </p>
                          </div>

                          {/* 操作按钮 */}
                          <div className="flex-shrink-0 flex flex-col gap-2 items-end">
                            {!isUnlocked ? (
                              <div className="text-slate-500 text-sm flex items-center gap-1">
                                <span>🔒</span>
                                未解锁
                              </div>
                            ) : !isCompleted ? (
                              <div className="group-hover:translate-x-1 transition-transform">
                                <div className="flex items-center gap-2 text-emerald-400 font-medium">
                                  <span>开始调查</span>
                                  <span className="text-lg">→</span>
                                </div>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI 聊天面板 */}
      <AIChatPanel
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
      />
    </div>
  );
}
