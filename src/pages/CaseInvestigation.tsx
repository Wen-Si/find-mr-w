
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { Case, FinancialStatements, FakePoint, Clue } from '../types';

export default function CaseInvestigation() {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const { player, cases, isLoading, error, loadCases, loadCase, startCase, collectClue, identifyFakePoint, completeCase } = useGameStore();
  const [currentScene, setCurrentScene] = useState(0);
  const [activeTab, setActiveTab] = useState<'balance' | 'income' | 'cashflow'>('balance');
  const [showCaseComplete, setShowCaseComplete] = useState(false);
  const [showClueNotification, setShowClueNotification] = useState<Clue | null>(null);
  const [showFakePointNotification, setShowFakePointNotification] = useState<FakePoint | null>(null);

  const currentCase = cases.find(c => c.id === caseId) as Case | undefined;

  useEffect(() => {
    if (player) {
      if (cases.length === 0) {
        loadCases();
      } else if (!currentCase && caseId) {
        loadCase(caseId);
      }
    }
  }, [player, cases.length, caseId, currentCase, loadCases, loadCase]);

  useEffect(() => {
    if (!player) {
      navigate('/');
      return;
    }
    if (currentCase && (!player.currentProgress || player.currentProgress.caseId !== caseId)) {
      startCase(caseId!);
    }
  }, [player, currentCase, caseId, navigate, startCase]);

  if (!player) return null;

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

  if (!currentCase) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Case not found</div>
      </div>
    );
  }

  const progress = player.currentProgress;
  if (!progress) return null;

  const collectedClues = currentCase.clues.filter(c => 
    progress.collectedClues.includes(c.id)
  );
  const identifiedFakePoints = currentCase.fakePoints.filter(fp => 
    progress.identifiedFakePoints.includes(fp.id)
  );

  const canComplete = currentCase.fakePoints.length > 0 && 
    identifiedFakePoints.length >= currentCase.fakePoints.length;

  const handleCollectClue = (clue: Clue) => {
    if (progress.collectedClues.includes(clue.id)) return;
    collectClue(clue.id);
    setShowClueNotification(clue);
    setTimeout(() => setShowClueNotification(null), 3000);
  };

  const handleIdentifyFakePoint = (fakePoint: FakePoint) => {
    if (progress.identifiedFakePoints.includes(fakePoint.id)) return;
    
    const hasRequiredClues = !fakePoint.requiredClues || 
      fakePoint.requiredClues.every(clueId => progress.collectedClues.includes(clueId));
    
    if (!hasRequiredClues) {
      alert('你需要先收集相关线索才能发现这个问题！');
      return;
    }
    
    identifyFakePoint(fakePoint.id);
    setShowFakePointNotification(fakePoint);
    setTimeout(() => setShowFakePointNotification(null), 3000);
  };

  const handleCompleteCase = () => {
    completeCase();
    setShowCaseComplete(true);
  };

  const renderFinancialTable = (statements: FinancialStatements) => {
    let statement;
    let title;
    switch (activeTab) {
      case 'balance':
        statement = statements.balanceSheet;
        title = '资产负债表';
        break;
      case 'income':
        statement = statements.incomeStatement;
        title = '利润表';
        break;
      case 'cashflow':
        statement = statements.cashFlowStatement;
        title = '现金流量表';
        break;
    }

    const relatedFakePoints = currentCase.fakePoints.filter(fp => {
      if (activeTab === 'balance' && fp.statementType === 'balanceSheet') return true;
      if (activeTab === 'income' && fp.statementType === 'incomeStatement') return true;
      if (activeTab === 'cashflow' && fp.statementType === 'cashFlowStatement') return true;
      return false;
    });

    return (
      <div className="bg-slate-800 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
        <div className="space-y-2">
          {statement.items.map(item => {
            const relatedFakePoint = relatedFakePoints.find(fp => fp.itemId === item.id);
            const isIdentified = relatedFakePoint && progress.identifiedFakePoints.includes(relatedFakePoint.id);
            
            return (
              <div
                key={item.id}
                className={`flex items-center justify-between p-4 rounded-lg border transition-all cursor-pointer ${
                  relatedFakePoint && !isIdentified
                    ? 'bg-red-500/10 border-red-500/30 hover:bg-red-500/20'
                    : isIdentified
                    ? 'bg-green-500/10 border-green-500/30'
                    : 'bg-slate-700/50 border-slate-600 hover:bg-slate-700'
                }`}
                onClick={() => {
                  if (relatedFakePoint && !isIdentified) {
                    handleIdentifyFakePoint(relatedFakePoint);
                  }
                }}
              >
                <div className="flex items-center gap-3">
                  {relatedFakePoint && (
                    <span className={isIdentified ? 'text-green-400' : 'text-red-400'}>
                      {isIdentified ? '✓' : '⚠️'}
                    </span>
                  )}
                  <span className={item.notes ? 'text-amber-300 font-medium' : 'text-slate-200'}>
                    {item.name}
                  </span>
                  {item.notes && (
                    <span className="text-xs text-slate-400 bg-slate-600 px-2 py-1 rounded">
                      {item.notes}
                    </span>
                  )}
                </div>
                <span className="text-white font-semibold">{item.value}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (caseId === 'case-3') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              {currentCase.title}
            </h1>
            <p className="text-slate-300">{currentCase.description}</p>
          </div>

          <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-8 border border-slate-700 mb-6">
            <div className="text-center">
              <div className="text-8xl mb-6">🎭</div>
              <h2 className="text-3xl font-bold text-amber-400 mb-4">
                W先生的真实身份
              </h2>
              <p className="text-xl text-white mb-6">
                经过一番调查，你终于发现了真相...
              </p>
              <div className="bg-slate-700/50 rounded-lg p-6 mb-6">
                <p className="text-slate-200 text-lg leading-relaxed">
                  {currentCase.wClue || 'W先生其实是你内心深处对财务真相的执着追求！通过这段旅程，你已经成长为一名真正的财务侦探。'}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-purple-500/20 rounded-lg p-4 border border-purple-500/30">
                  <div className="text-4xl mb-2">📊</div>
                  <h3 className="text-purple-300 font-semibold">财务分析</h3>
                  <p className="text-purple-400 text-sm">掌握财务报表分析技巧</p>
                </div>
                <div className="bg-amber-500/20 rounded-lg p-4 border border-amber-500/30">
                  <div className="text-4xl mb-2">🔍</div>
                  <h3 className="text-amber-300 font-semibold">欺诈识别</h3>
                  <p className="text-amber-400 text-sm">识别各类财务造假手段</p>
                </div>
                <div className="bg-green-500/20 rounded-lg p-4 border border-green-500/30">
                  <div className="text-4xl mb-2">🏆</div>
                  <h3 className="text-green-300 font-semibold">侦探技能</h3>
                  <p className="text-green-400 text-sm">成为顶级财务侦探</p>
                </div>
              </div>
              <button
                onClick={() => {
                  completeCase();
                  navigate('/game');
                }}
                className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-bold rounded-lg text-lg transition-all transform hover:scale-105"
              >
                完成游戏 🎉
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {showClueNotification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 animate-slideIn">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔍</span>
            <div>
              <p className="font-bold">发现线索！</p>
              <p className="text-sm">{showClueNotification.title}</p>
            </div>
          </div>
        </div>
      )}

      {showFakePointNotification && (
        <div className="fixed top-4 right-4 bg-amber-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 animate-slideIn">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="font-bold">发现造假！</p>
              <p className="text-sm">{showFakePointNotification.description}</p>
            </div>
          </div>
        </div>
      )}

      {showCaseComplete && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full mx-4 text-center animate-scaleIn">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-white mb-4">案件完成！</h2>
            <p className="text-slate-300 mb-6">
              你获得了 {currentCase.experienceReward} 点经验值！
            </p>
            {currentCase.wClue && (
              <div className="bg-amber-500/20 border border-amber-500/30 rounded-lg p-4 mb-6">
                <p className="text-amber-300 text-sm">
                  <span className="font-bold">W先生线索：</span>
                  {currentCase.wClue}
                </p>
              </div>
            )}
            <button
              onClick={() => navigate('/game')}
              className="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-bold rounded-lg transition-all"
            >
              继续调查
            </button>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <button
              onClick={() => navigate('/game')}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-2"
            >
              <span>←</span>
              <span>返回</span>
            </button>
            <h1 className="text-2xl font-bold text-white">{currentCase.title}</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-700 px-4 py-2 rounded-lg">
              <span className="text-slate-300">线索</span>
              <span className="text-amber-400 font-bold">
                {collectedClues.length}/{currentCase.clues.length}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-slate-700 px-4 py-2 rounded-lg">
              <span className="text-slate-300">疑点</span>
              <span className="text-red-400 font-bold">
                {identifiedFakePoints.length}/{currentCase.fakePoints.length}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-6">
          <p className="text-slate-300">{currentCase.story}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-bold text-white mb-4">案发现场</h3>
              <div className="flex gap-2 mb-4">
                {currentCase.scenes.map((scene, index) => (
                  <button
                    key={scene.id}
                    onClick={() => setCurrentScene(index)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      currentScene === index
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {scene.name}
                  </button>
                ))}
              </div>
              <div className="relative">
                <img
                  src={currentCase.scenes[currentScene].image}
                  alt={currentCase.scenes[currentScene].name}
                  className="w-full h-64 object-cover rounded-lg"
                />
                <div className="mt-4 p-4 bg-slate-700/50 rounded-lg">
                  <p className="text-slate-300">{currentCase.scenes[currentScene].description}</p>
                </div>
                
                <div className="mt-4 space-y-3">
                  <h4 className="text-sm font-semibold text-slate-300">在此场景可收集的线索：</h4>
                  {currentCase.clues
                    .filter(clue => clue.sceneId === currentCase.scenes[currentScene].id || !clue.sceneId)
                    .map(clue => {
                      const isCollected = progress.collectedClues.includes(clue.id);
                      return (
                        <div
                          key={clue.id}
                          onClick={() => !isCollected && handleCollectClue(clue)}
                          className={`p-4 rounded-lg border transition-all cursor-pointer ${
                            isCollected
                              ? 'bg-green-500/10 border-green-500/30'
                              : 'bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/20'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className={`font-medium ${isCollected ? 'text-green-400' : 'text-amber-300'}`}>
                                {isCollected ? '✓ ' : '🔍 '}{clue.title}
                              </p>
                              {isCollected && (
                                <p className="text-sm text-slate-400 mt-1">{clue.content}</p>
                              )}
                            </div>
                            {!isCollected && (
                              <span className="text-amber-400">点击收集</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>

            <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setActiveTab('balance')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === 'balance'
                      ? 'bg-purple-500 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  资产负债表
                </button>
                <button
                  onClick={() => setActiveTab('income')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === 'income'
                      ? 'bg-purple-500 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  利润表
                </button>
                <button
                  onClick={() => setActiveTab('cashflow')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === 'cashflow'
                      ? 'bg-purple-500 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  现金流量表
                </button>
              </div>
              {renderFinancialTable(currentCase.financialStatements)}
            </div>

            {canComplete && (
              <button
                onClick={handleCompleteCase}
                className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-bold rounded-lg text-lg transition-all transform hover:scale-105"
              >
                完成案件并提交报告 📝
              </button>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-bold text-white mb-4">收集的线索</h3>
              {collectedClues.length > 0 ? (
                <div className="space-y-3">
                  {collectedClues.map(clue => (
                    <div
                      key={clue.id}
                      className="bg-green-500/10 border border-green-500/30 rounded-lg p-4"
                    >
                      <p className="text-green-300 font-medium mb-1">{clue.title}</p>
                      <p className="text-sm text-slate-400">{clue.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-sm">还没有收集到线索...</p>
              )}
            </div>

            <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-bold text-white mb-4">发现的疑点</h3>
              {identifiedFakePoints.length > 0 ? (
                <div className="space-y-3">
                  {identifiedFakePoints.map(fp => (
                    <div
                      key={fp.id}
                      className="bg-red-500/10 border border-red-500/30 rounded-lg p-4"
                    >
                      <p className="text-red-300 font-medium mb-1">⚠️ {fp.description}</p>
                      <p className="text-sm text-slate-400">{fp.hint}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-sm">点击报表中可疑的项目来发现造假...</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes scaleIn {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
