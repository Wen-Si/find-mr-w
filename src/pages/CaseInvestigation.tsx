import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { Case, FinancialStatements, FakePoint, Clue } from '../types';
import { AIChatPanel } from '../components/AIChatPanel';
import { MessageCircle, ArrowLeft, Search, AlertTriangle, CheckCircle, FileText, TrendingUp, Target } from 'lucide-react';

export default function CaseInvestigation() {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const { player, cases, isLoading, error, loadCases, loadCase, startCase, collectClue, identifyFakePoint, completeCase } = useGameStore();
  const [currentScene, setCurrentScene] = useState(0);
  const [activeTab, setActiveTab] = useState<'balance' | 'income' | 'cashflow'>('balance');
  const [showCaseComplete, setShowCaseComplete] = useState(false);
  const [showClueNotification, setShowClueNotification] = useState<Clue | null>(null);
  const [showFakePointNotification, setShowFakePointNotification] = useState<FakePoint | null>(null);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

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
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 flex items-center justify-center">
        <div className="text-emerald-300 text-xl flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          正在加载案件档案...
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

  if (!currentCase) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 flex items-center justify-center">
        <div className="text-white text-xl">案件未找到</div>
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

  const handleCompleteCase = async () => {
    await completeCase(caseId!, currentCase.experienceReward);
    setShowCaseComplete(true);
  };

  const renderFinancialTable = (statements: FinancialStatements) => {
    let statement;
    let title;
    let subtitle;
    switch (activeTab) {
      case 'balance':
        statement = statements.balanceSheet;
        title = '资产负债表';
        subtitle = 'Balance Sheet';
        break;
      case 'income':
        statement = statements.incomeStatement;
        title = '利润表';
        subtitle = 'Income Statement';
        break;
      case 'cashflow':
        statement = statements.cashFlowStatement;
        title = '现金流量表';
        subtitle = 'Cash Flow Statement';
        break;
    }

    const relatedFakePoints = currentCase.fakePoints.filter(fp => {
      if (activeTab === 'balance' && fp.statementType === 'balanceSheet') return true;
      if (activeTab === 'income' && fp.statementType === 'incomeStatement') return true;
      if (activeTab === 'cashflow' && fp.statementType === 'cashFlowStatement') return true;
      return false;
    });

    return (
      <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-700 overflow-hidden">
        {/* 表格头部 */}
        <div className="bg-slate-700/50 px-6 py-4 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white">{title}</h3>
              <p className="text-slate-400 text-sm">{subtitle}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-sm flex items-center gap-1">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                {relatedFakePoints.filter(fp => !progress.identifiedFakePoints.includes(fp.id)).length} 个可疑项
              </span>
            </div>
          </div>
        </div>

        {/* 表格内容 */}
        <div className="p-6">
          {/* 表头 */}
          <div className="grid grid-cols-12 gap-4 mb-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <div className="col-span-1">状态</div>
            <div className="col-span-8">项目</div>
            <div className="col-span-3 text-right">金额</div>
          </div>

          <div className="space-y-2">
            {statement.items.map((item, index) => {
              const relatedFakePoint = relatedFakePoints.find(fp => fp.itemId === item.id);
              const isIdentified = relatedFakePoint && progress.identifiedFakePoints.includes(relatedFakePoint.id);
              
              return (
                <div
                  key={item.id}
                  className={`grid grid-cols-12 gap-4 items-center p-4 rounded-xl border transition-all cursor-pointer group ${
                    relatedFakePoint && !isIdentified
                      ? 'bg-red-500/10 border-red-500/30 hover:bg-red-500/20 hover:border-red-500/50'
                      : isIdentified
                      ? 'bg-emerald-500/10 border-emerald-500/30'
                      : 'bg-slate-700/40 border-slate-700/60 hover:bg-slate-700/70 hover:border-slate-600'
                  }`}
                  onClick={() => {
                    if (relatedFakePoint && !isIdentified) {
                      handleIdentifyFakePoint(relatedFakePoint);
                    }
                  }}
                >
                  {/* 状态列 */}
                  <div className="col-span-1 flex justify-center">
                    {relatedFakePoint ? (
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isIdentified 
                          ? 'bg-emerald-500/20 text-emerald-400' 
                          : 'bg-amber-500/20 text-amber-400 group-hover:bg-amber-500/30'
                      }`}>
                        {isIdentified ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-slate-600/30 flex items-center justify-center text-slate-500">
                        <div className="w-2 h-2 rounded-full bg-slate-500"></div>
                      </div>
                    )}
                  </div>

                  {/* 项目名称 */}
                  <div className="col-span-8">
                    <div className="flex items-center gap-3">
                      <div>
                        <span className={`font-medium ${
                          relatedFakePoint && !isIdentified 
                            ? 'text-amber-200' 
                            : isIdentified 
                              ? 'text-emerald-200' 
                              : 'text-slate-200'
                        }`}>
                          {item.name}
                        </span>
                        {item.notes && (
                          <span className="ml-2 text-xs bg-slate-700/70 text-slate-300 px-2 py-0.5 rounded-full">
                            {item.notes}
                          </span>
                        )}
                      </div>
                    </div>
                    {relatedFakePoint && isIdentified && (
                      <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        {relatedFakePoint.description}
                      </p>
                    )}
                    {relatedFakePoint && !isIdentified && (
                      <p className="text-xs text-amber-400 mt-1 flex items-center gap-1 opacity-70 group-hover:opacity-100">
                        <Search className="w-3 h-3" />
                        点击查看详情
                      </p>
                    )}
                  </div>

                  {/* 金额 */}
                  <div className="col-span-3 text-right">
                    <span className={`font-mono font-semibold text-lg ${
                      item.value.includes('-') ? 'text-red-400' : 'text-white'
                    }`}>
                      {item.value}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  if (caseId === 'case-3') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/30 rounded-full px-4 py-2 mb-6">
              <span className="text-amber-400">🎯</span>
              <span className="text-amber-300 text-sm font-medium">最终章节</span>
            </div>
            <h1 className="text-5xl font-black text-white mb-4">
              {currentCase.title}
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              {currentCase.description}
            </p>
          </div>

          <div className="bg-gradient-to-br from-slate-800/90 to-amber-900/20 backdrop-blur-sm rounded-3xl p-10 border border-slate-700 mb-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent"></div>
            <div className="relative z-10">
              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-6xl mx-auto mb-8 shadow-2xl shadow-amber-500/30">
                  🎭
                </div>
                <h2 className="text-4xl font-black text-amber-400 mb-6">
                  W先生的真实身份
                </h2>
                <p className="text-2xl text-white mb-8 font-light">
                  经过一番调查，你终于发现了真相...
                </p>
                
                <div className="bg-slate-800/70 rounded-2xl p-8 mb-10 border border-slate-700">
                  <p className="text-slate-200 text-xl leading-relaxed">
                    {currentCase.wClue || 'W先生其实是你内心深处对财务真相的执着追求！通过这段旅程，你已经成长为一名真正的财务侦探。'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                  <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 rounded-2xl p-6 border border-emerald-500/30">
                    <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4">
                      📊
                    </div>
                    <h3 className="text-emerald-200 font-bold text-lg mb-2">财务分析</h3>
                    <p className="text-emerald-400/80 text-sm">掌握财务报表分析技巧</p>
                  </div>
                  <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/10 rounded-2xl p-6 border border-amber-500/30">
                    <div className="w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4">
                      🔍
                    </div>
                    <h3 className="text-amber-200 font-bold text-lg mb-2">欺诈识别</h3>
                    <p className="text-amber-400/80 text-sm">识别各类财务造假手段</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-2xl p-6 border border-purple-500/30">
                    <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4">
                      🏆
                    </div>
                    <h3 className="text-purple-200 font-bold text-lg mb-2">侦探技能</h3>
                    <p className="text-purple-400/80 text-sm">成为顶级财务侦探</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    completeCase();
                    navigate('/game');
                  }}
                  className="group inline-flex items-center gap-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white text-xl font-bold py-5 px-12 rounded-2xl transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-amber-500/30"
                >
                  <span className="text-2xl group-hover:animate-bounce">🎉</span>
                  <span>完成游戏</span>
                  <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950">
      {/* 通知弹窗 */}
      {showClueNotification && (
        <div className="fixed top-6 right-6 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-7 py-5 rounded-2xl shadow-2xl z-50 animate-slideIn border border-emerald-500/30">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500/30 rounded-xl flex items-center justify-center text-2xl">
              🔍
            </div>
            <div>
              <p className="font-bold text-lg">发现线索！</p>
              <p className="text-emerald-100 text-sm">{showClueNotification.title}</p>
            </div>
          </div>
        </div>
      )}

      {showFakePointNotification && (
        <div className="fixed top-6 right-6 bg-gradient-to-r from-amber-600 to-orange-600 text-white px-7 py-5 rounded-2xl shadow-2xl z-50 animate-slideIn border border-amber-500/30">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-500/30 rounded-xl flex items-center justify-center text-2xl">
              ⚠️
            </div>
            <div>
              <p className="font-bold text-lg">发现造假！</p>
              <p className="text-amber-100 text-sm">{showFakePointNotification.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* 案件完成弹窗 */}
      {showCaseComplete && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-10 max-w-lg w-full text-center animate-scaleIn border border-slate-700 shadow-2xl">
            <div className="w-24 h-24 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-5xl mx-auto mb-6 shadow-xl shadow-amber-500/30">
              🎉
            </div>
            <h2 className="text-3xl font-black text-white mb-4">案件完成！</h2>
            <p className="text-slate-300 text-lg mb-6">
              你获得了 <span className="text-amber-400 font-bold">{currentCase.experienceReward}</span> 点经验值！
            </p>
            {currentCase.wClue && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 mb-8">
                <p className="text-amber-200 text-sm">
                  <span className="font-bold block mb-2 text-amber-300">W先生线索：</span>
                  {currentCase.wClue}
                </p>
              </div>
            )}
            <button
              onClick={() => navigate('/game')}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold rounded-xl text-lg transition-all transform hover:scale-105 active:scale-95"
            >
              继续调查
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 顶部导航栏 */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/game')}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors bg-slate-800/50 hover:bg-slate-700/50 px-4 py-2.5 rounded-xl border border-slate-700/50"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">返回</span>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">{currentCase.title}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-slate-400 text-sm">案件编号：</span>
                <span className="text-emerald-400 font-mono text-sm">{caseId?.toUpperCase()}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* 线索统计 */}
            <div className="flex items-center gap-3 bg-slate-800/60 px-5 py-2.5 rounded-xl border border-slate-700">
              <Search className="w-5 h-5 text-amber-400" />
              <span className="text-slate-300 text-sm font-medium">线索</span>
              <div className="flex items-center gap-1">
                <span className="text-amber-400 font-bold text-lg">{collectedClues.length}</span>
                <span className="text-slate-500">/</span>
                <span className="text-slate-400">{currentCase.clues.length}</span>
              </div>
            </div>
            
            {/* 疑点统计 */}
            <div className="flex items-center gap-3 bg-slate-800/60 px-5 py-2.5 rounded-xl border border-slate-700">
              <Target className="w-5 h-5 text-red-400" />
              <span className="text-slate-300 text-sm font-medium">疑点</span>
              <div className="flex items-center gap-1">
                <span className="text-red-400 font-bold text-lg">{identifiedFakePoints.length}</span>
                <span className="text-slate-500">/</span>
                <span className="text-slate-400">{currentCase.fakePoints.length}</span>
              </div>
            </div>
            
            {/* AI顾问按钮 */}
            <button
              onClick={() => setIsAIChatOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-purple-500/25"
            >
              <MessageCircle className="w-5 h-5" />
              神秘顾问
            </button>
          </div>
        </div>

        {/* 案件介绍 */}
        <div className="bg-gradient-to-r from-slate-800/90 to-emerald-900/30 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
              📋
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2">案件描述</h3>
              <p className="text-slate-300 leading-relaxed text-lg">{currentCase.story}</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* 左侧 - 案发现场和财务报表 */}
          <div className="lg:col-span-8 space-y-8">
            {/* 案发现场 */}
            <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-700 overflow-hidden">
              <div className="bg-slate-700/50 px-6 py-4 border-b border-slate-700">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-400" />
                  案发现场
                </h3>
              </div>
              
              <div className="p-6">
                {/* 场景切换 */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                  {currentCase.scenes.map((scene, index) => (
                    <button
                      key={scene.id}
                      onClick={() => setCurrentScene(index)}
                      className={`px-5 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap ${
                        currentScene === index
                          ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25'
                          : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700 border border-slate-600'
                      }`}
                    >
                      {scene.name}
                    </button>
                  ))}
                </div>

                {/* 场景内容 */}
                <div className="relative">
                  <div className="aspect-video bg-slate-700/30 rounded-2xl overflow-hidden mb-6">
                    <img
                      src={currentCase.scenes[currentScene].image}
                      alt={currentCase.scenes[currentScene].name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="bg-slate-700/50 rounded-xl p-5 mb-6 border border-slate-700/50">
                    <p className="text-slate-300">{currentCase.scenes[currentScene].description}</p>
                  </div>
                  
                  {/* 线索收集区 */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
                      <Search className="w-4 h-4 text-amber-400" />
                      在此场景可收集的线索
                    </h4>
                    <div className="space-y-3">
                      {currentCase.clues
                        .filter(clue => clue.sceneId === currentCase.scenes[currentScene].id || !clue.sceneId)
                        .map(clue => {
                          const isCollected = progress.collectedClues.includes(clue.id);
                          return (
                            <div
                              key={clue.id}
                              onClick={() => !isCollected && handleCollectClue(clue)}
                              className={`p-5 rounded-xl border transition-all cursor-pointer group ${
                                isCollected
                                  ? 'bg-emerald-500/10 border-emerald-500/30'
                                  : 'bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/20 hover:border-amber-500/50'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-4">
                                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0 ${
                                    isCollected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                                  }`}>
                                    {isCollected ? <CheckCircle className="w-5 h-5" /> : <Search className="w-5 h-5" />}
                                  </div>
                                  <div>
                                    <p className={`font-semibold text-lg ${
                                      isCollected ? 'text-emerald-300' : 'text-amber-200'
                                    }`}>
                                      {isCollected ? '✓ ' : ''}{clue.title}
                                    </p>
                                    {isCollected && (
                                      <p className="text-sm text-slate-400 mt-2 leading-relaxed">{clue.content}</p>
                                    )}
                                  </div>
                                </div>
                                {!isCollected && (
                                  <div className="flex-shrink-0">
                                    <span className="text-amber-400 font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
                                      点击收集
                                      <span className="text-lg">→</span>
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 财务报表 */}
            <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-700 overflow-hidden">
              <div className="bg-slate-700/50 px-6 py-4 border-b border-slate-700">
                <div className="flex gap-3">
                  <button
                    onClick={() => setActiveTab('balance')}
                    className={`px-5 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 ${
                      activeTab === 'balance'
                        ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/25'
                        : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700 border border-slate-600'
                    }`}
                  >
                    <div className="w-4 h-4"></div>
                    资产负债表
                  </button>
                  <button
                    onClick={() => setActiveTab('income')}
                    className={`px-5 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 ${
                      activeTab === 'income'
                        ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/25'
                        : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700 border border-slate-600'
                    }`}
                  >
                    <div className="w-4 h-4"></div>
                    利润表
                  </button>
                  <button
                    onClick={() => setActiveTab('cashflow')}
                    className={`px-5 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 ${
                      activeTab === 'cashflow'
                        ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/25'
                        : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700 border border-slate-600'
                    }`}
                  >
                    <div className="w-4 h-4"></div>
                    现金流量表
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {renderFinancialTable(currentCase.financialStatements)}
              </div>
            </div>

            {/* 完成案件按钮 */}
            {canComplete && (
              <button
                onClick={handleCompleteCase}
                className="w-full py-5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold text-xl rounded-2xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-3"
              >
                <FileText className="w-6 h-6" />
                完成案件并提交报告
              </button>
            )}
          </div>

          {/* 右侧 - 收集的线索和发现的疑点 */}
          <div className="lg:col-span-4 space-y-8">
            {/* 收集的线索 */}
            <div className="bg-gradient-to-br from-slate-800/90 to-emerald-900/20 backdrop-blur-sm rounded-2xl border border-slate-700 overflow-hidden">
              <div className="bg-slate-700/50 px-6 py-4 border-b border-slate-700">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Search className="w-5 h-5 text-emerald-400" />
                  收集的线索
                  <span className="ml-auto bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-sm font-medium">
                    {collectedClues.length}/{currentCase.clues.length}
                  </span>
                </h3>
              </div>
              
              <div className="p-6">
                {collectedClues.length > 0 ? (
                  <div className="space-y-4">
                    {collectedClues.map((clue, index) => (
                      <div
                        key={clue.id}
                        className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400 flex-shrink-0">
                            {index + 1}
                          </div>
                          <div>
                            <p className="text-emerald-200 font-semibold mb-2">{clue.title}</p>
                            <p className="text-sm text-slate-400 leading-relaxed">{clue.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-5xl mb-4 opacity-30">🔍</div>
                    <p className="text-slate-500">还没有收集到线索...</p>
                    <p className="text-slate-600 text-sm mt-2">去案发现场探索吧</p>
                  </div>
                )}
              </div>
            </div>

            {/* 发现的疑点 */}
            <div className="bg-gradient-to-br from-slate-800/90 to-red-900/20 backdrop-blur-sm rounded-2xl border border-slate-700 overflow-hidden">
              <div className="bg-slate-700/50 px-6 py-4 border-b border-slate-700">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  发现的疑点
                  <span className="ml-auto bg-red-500/20 text-red-300 px-3 py-1 rounded-full text-sm font-medium">
                    {identifiedFakePoints.length}/{currentCase.fakePoints.length}
                  </span>
                </h3>
              </div>
              
              <div className="p-6">
                {identifiedFakePoints.length > 0 ? (
                  <div className="space-y-4">
                    {identifiedFakePoints.map((fp, index) => (
                      <div
                        key={fp.id}
                        className="bg-red-500/10 border border-red-500/30 rounded-xl p-5"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center text-red-400 flex-shrink-0">
                            <AlertTriangle className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-red-200 font-semibold mb-2">疑点 {index + 1}</p>
                            <p className="text-red-100 text-sm mb-2">{fp.description}</p>
                            <p className="text-xs text-slate-500 bg-slate-800/50 px-3 py-2 rounded-lg">
                              💡 {fp.hint}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-5xl mb-4 opacity-30">📊</div>
                    <p className="text-slate-500">还没有发现疑点...</p>
                    <p className="text-slate-600 text-sm mt-2">仔细检查财务报表</p>
                  </div>
                )}
              </div>
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

      {/* AI 聊天面板 */}
      <AIChatPanel
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
        caseId={caseId}
      />
    </div>
  );
}
