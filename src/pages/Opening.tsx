
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';

export default function Opening() {
  const [phase, setPhase] = useState<'intro' | 'form'>('intro');
  const [playerName, setPlayerName] = useState('');
  const [showTitle, setShowTitle] = useState(false);
  const { createPlayer, player } = useGameStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (player) {
      navigate('/game');
    }
    const titleTimer = setTimeout(() => setShowTitle(true), 1000);
    return () => clearTimeout(titleTimer);
  }, [player, navigate]);

  useEffect(() => {
    if (phase === 'intro' && showTitle) {
      const formTimer = setTimeout(() => setPhase('form'), 3000);
      return () => clearTimeout(formTimer);
    }
  }, [phase, showTitle]);

  const handleStart = () => {
    if (playerName.trim()) {
      createPlayer(playerName.trim());
      navigate('/game');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center overflow-hidden relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-amber-400 rounded-full opacity-30 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-2xl w-full mx-4">
        {phase === 'intro' && (
          <div className="text-center">
            <div
              className={`transition-all duration-1000 ${
                showTitle
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="text-amber-400 text-6xl mb-4">🕵️</div>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                寻找
                <span className="text-amber-400">W</span>
                先生
              </h1>
              <p className="text-xl text-slate-300 mb-8">
                一场关于财务造假的侦探游戏
              </p>
            </div>
          </div>
        )}

        {phase === 'form' && (
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-slate-700 animate-fadeIn">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              欢迎，侦探！
            </h2>
            <p className="text-slate-300 mb-8 text-center">
              在开始你的财务侦探之旅前，请告诉我你的名字
            </p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  你的名字
                </label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="请输入你的名字"
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                  onKeyDown={(e) => e.key === 'Enter' && handleStart()}
                  autoFocus
                />
              </div>

              <button
                onClick={handleStart}
                disabled={!playerName.trim()}
                className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 active:scale-95 ${
                  playerName.trim()
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white shadow-lg hover:shadow-amber-500/30'
                    : 'bg-slate-600 text-slate-400 cursor-not-allowed'
                }`}
              >
                开始调查 🚀
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-700">
              <h3 className="text-sm font-semibold text-slate-300 mb-3">
                游戏特色
              </h3>
              <div className="grid grid-cols-1 gap-3 text-sm">
                <div className="flex items-center gap-3 text-slate-400">
                  <span className="text-amber-400">📊</span>
                  <span>学习识别财务造假</span>
                </div>
                <div className="flex items-center gap-3 text-slate-400">
                  <span className="text-amber-400">🔍</span>
                  <span>收集线索，破解谜团</span>
                </div>
                <div className="flex items-center gap-3 text-slate-400">
                  <span className="text-amber-400">🎯</span>
                  <span>提升技能，成为专家</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
