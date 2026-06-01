
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { skills } from '../data/gameData';

export default function GameHome() {
  const { player, cases, isLoading, error, loadCases, resetGame } = useGameStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (player && cases.length === 0) {
      loadCases();
    }
  }, [player, cases.length, loadCases]);

  if (!player) {
    navigate('/');
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-red-400 text-xl">{error}</div>
      </div>
    );
  }

  const currentLevelExp = (player.level - 1) * 100;
  const nextLevelExp = player.level * 100;
  const expProgress = ((player.experience - currentLevelExp) / 100) * 100;

  const unlockedSkills = skills.filter(skill => 
    player.unlockedSkills.includes(skill.id)
  );

  const lockedSkills = skills.filter(skill => 
    !player.unlockedSkills.includes(skill.id)
  );

  const handleStartCase = (caseId: string) => {
    navigate(`/case/${caseId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                欢迎回来，{player.name}！
              </h1>
              <p className="text-slate-400">
                继续你的财务侦探之旅
              </p>
            </div>
            <button
              onClick={resetGame}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-sm transition-colors"
            >
              重新开始
            </button>
          </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">侦探档案</h2>
                <div className="flex items-center gap-2 bg-amber-500/20 px-3 py-1 rounded-full">
                  <span className="text-amber-400 text-lg">⭐</span>
                  <span className="text-amber-400 font-bold">Lv.{player.level}</span>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm text-slate-400 mb-2">
                  <span>经验值</span>
                  <span>{player.experience} / {nextLevelExp}</span>
                </div>
                <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-500"
                    style={{ width: `${Math.min(expProgress, 100)}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-slate-300 mb-2">已解锁技能</h3>
                  <div className="flex flex-wrap gap-2">
                    {unlockedSkills.map(skill => (
                      <div
                        key={skill.id}
                        className="flex items-center gap-2 bg-purple-500/20 px-3 py-2 rounded-lg border border-purple-500/30"
                      >
                        <span className="text-2xl">{skill.icon}</span>
                        <span className="text-purple-300 text-sm font-medium">{skill.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {lockedSkills.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-700">
                  <h3 className="text-sm font-semibold text-slate-400 mb-2">待解锁技能</h3>
                  <div className="flex flex-wrap gap-2">
                    {lockedSkills.map(skill => (
                      <div
                        key={skill.id}
                        className="flex items-center gap-2 bg-slate-700/50 px-3 py-2 rounded-lg border border-slate-600 opacity-60"
                      >
                        <span className="text-2xl">🔒</span>
                        <span className="text-slate-400 text-sm">{skill.name}</span>
                        <span className="text-xs text-slate-500">Lv.{skill.levelRequired}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-6">案件档案</h2>
              <div className="space-y-4">
                {cases.map((c, index) => {
                  const isUnlocked = player.unlockedCases.includes(c.id);
                  const isCompleted = c.isCompleted;

                  return (
                    <div
                      key={c.id}
                      className={`relative overflow-hidden rounded-xl border transition-all ${
                        isUnlocked
                          ? isCompleted
                            ? 'bg-green-500/10 border-green-500/30 hover:border-green-500/50'
                            : 'bg-slate-700/50 border-slate-600 hover:border-amber-500/50 cursor-pointer'
                          : 'bg-slate-800/50 border-slate-700 opacity-50'
                      }`}
                      onClick={() => isUnlocked && !isCompleted && handleStartCase(c.id)}
                    >
                      <div className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className={`px-2 py-1 rounded text-xs font-bold ${
                                isCompleted
                                  ? 'bg-green-500/30 text-green-400'
                                  : isUnlocked
                                  ? 'bg-amber-500/30 text-amber-400'
                                  : 'bg-slate-600/50 text-slate-400'
                              }`}>
                                案件 {index + 1}
                              </span>
                              <div className="flex items-center gap-1">
                                {[...Array(c.difficulty)].map((_, i) => (
                                  <span key={i} className="text-yellow-400">⭐</span>
                                ))}
                              </div>
                              {isCompleted && (
                                <span className="text-green-400 text-sm">✓ 已完成</span>
                              )}
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">
                              {c.title}
                            </h3>
                            <p className="text-slate-400 text-sm">
                              {c.description}
                            </p>
                          </div>
                          {!isUnlocked ? (
                            <div className="text-slate-500 text-3xl">🔒</div>
                          ) : !isCompleted ? (
                            <div className="text-amber-400 text-2xl">▶</div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-amber-400">🕵️</span>
                W先生线索
              </h2>
              {player.wClues.length > 0 ? (
                <div className="space-y-3">
                  {player.wClues.map((clue, index) => (
                    <div
                      key={index}
                      className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4"
                    >
                      <p className="text-amber-200 text-sm">{clue}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-sm">
                  完成案件以获取关于W先生的线索...
                </p>
              )}
            </div>

            <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-4">统计数据</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">已完成案件</span>
                  <span className="text-white font-bold">
                    {cases.filter(c => c.isCompleted).length} / {cases.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">已收集线索</span>
                  <span className="text-white font-bold">{player.wClues.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">总经验值</span>
                  <span className="text-white font-bold">{player.experience}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
