import { useNavigate } from 'react-router-dom';

export default function Opening() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* 背景装饰 - 财务图标 */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 text-9xl">📊</div>
        <div className="absolute top-20 right-20 text-8xl">📈</div>
        <div className="absolute bottom-20 left-20 text-7xl">💰</div>
        <div className="absolute bottom-10 right-10 text-9xl">📉</div>
        <div className="absolute top-1/2 left-10 text-6xl">💼</div>
        <div className="absolute top-1/3 right-10 text-6xl">📑</div>
      </div>

      <div className="max-w-5xl w-full relative z-10">
        {/* 顶部标题区 */}
        <div className="text-center mb-12">
          {/* 徽章 */}
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/40 rounded-full px-4 py-2 mb-6">
            <span className="text-emerald-400">🔍</span>
            <span className="text-emerald-300 text-sm font-medium">财务反欺诈 · 学习游戏</span>
          </div>

          {/* 主标题 */}
          <div className="mb-6">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center text-4xl shadow-lg shadow-amber-500/30">
                🕵️
              </div>
            </div>
            <h1 className="text-6xl font-black text-white mb-3 tracking-tight">
              寻找<span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent"> W先生</span>
            </h1>
            <p className="text-2xl text-emerald-300 font-light">
              财报侦探 · 破解造假迷局
            </p>
          </div>

          {/* 副标题卡片 */}
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 max-w-2xl mx-auto">
            <p className="text-lg text-slate-300 leading-relaxed">
              化身<span className="text-amber-400 font-semibold">财务侦探</span>，通过真实案例学习识别财务造假技巧，
              收集线索、发现疑点，揭开<span className="text-emerald-400 font-semibold">W先生</span>的神秘面纱！
            </p>
          </div>
        </div>

        {/* 游戏特色 */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 hover:border-emerald-500/50 transition-all group">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="text-3xl">📊</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">财报分析</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              解读资产负债表、利润表、现金流量表，掌握三大报表分析技巧
            </p>
          </div>

          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 hover:border-amber-500/50 transition-all group">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-500/20 to-amber-600/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="text-3xl">🔍</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">线索收集</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              在案发现场寻找蛛丝马迹，收集财务异常线索，拼凑完整证据链
            </p>
          </div>

          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 hover:border-purple-500/50 transition-all group">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="text-3xl">🏆</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">技能进阶</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              从初级分析师到审计大师，解锁专业技能，挑战复杂案件
            </p>
          </div>
        </div>

        {/* 核心玩法 */}
        <div className="bg-gradient-to-r from-slate-800/80 to-emerald-900/30 backdrop-blur-sm rounded-2xl p-8 mb-12 border border-slate-700">
          <h2 className="text-2xl font-bold text-white mb-6 text-center flex items-center justify-center gap-3">
            <span className="text-emerald-400">📈</span>
            如何成为财报侦探
          </h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-xl font-bold text-white mx-auto mb-3">
                1
              </div>
              <h4 className="font-semibold text-white mb-1">登录系统</h4>
              <p className="text-xs text-slate-400">注册账号，开启侦探之旅</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-xl font-bold text-white mx-auto mb-3">
                2
              </div>
              <h4 className="font-semibold text-white mb-1">选择案件</h4>
              <p className="text-xs text-slate-400">从简单到复杂，逐步挑战</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-xl font-bold text-white mx-auto mb-3">
                3
              </div>
              <h4 className="font-semibold text-white mb-1">收集线索</h4>
              <p className="text-xs text-slate-400">探查现场，发现异常数据</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-xl font-bold text-white mx-auto mb-3">
                4
              </div>
              <h4 className="font-semibold text-white mb-1">识破造假</h4>
              <p className="text-xs text-slate-400">识别财务造假点，提交报告</p>
            </div>
          </div>
        </div>

        {/* 开始按钮 */}
        <div className="text-center">
          <button
            onClick={handleStart}
            className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 via-amber-500 to-emerald-600 hover:from-emerald-400 hover:via-amber-400 hover:to-emerald-500 text-white text-xl font-bold py-5 px-16 rounded-2xl transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-emerald-500/30"
          >
            <span className="text-2xl group-hover:animate-bounce">🎯</span>
            <span>开始侦探之旅</span>
            <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>

        {/* 底部版权 */}
        <div className="text-center mt-12 pt-8 border-t border-slate-800">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <span>📊</span>
              <span>财务教育</span>
            </div>
            <div className="w-1 h-1 bg-slate-700 rounded-full"></div>
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <span>🎮</span>
              <span>互动学习</span>
            </div>
            <div className="w-1 h-1 bg-slate-700 rounded-full"></div>
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <span>🏆</span>
              <span>技能提升</span>
            </div>
          </div>
          <p className="text-slate-600 text-sm">
            © 2024 寻找W先生 · 财务反欺诈学习平台
          </p>
        </div>
      </div>
    </div>
  );
}
