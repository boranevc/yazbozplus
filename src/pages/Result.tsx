import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { Game } from '../types';

const Result = () => {
  const navigate = useNavigate();
  const { games } = useGame();
  const [lastGame, setLastGame] = useState<Game | null>(null);

  useEffect(() => {
    if (games.length > 0) {
      setLastGame(games[games.length - 1]);
    } else {
      navigate('/');
    }
  }, [games, navigate]);

  if (!lastGame) return null;

  const winnerTeam = lastGame.winner ? lastGame.teams.find(t => t.id === lastGame.winner) : null;
  const isDraw = lastGame.isDraw || (!lastGame.winner && lastGame.scores[0]?.totalScore === lastGame.scores[1]?.totalScore);
  const scores = lastGame.scores;
  
  // Kazanma farkını hesapla
  const winnerScore = winnerTeam ? scores.find(s => s.teamId === winnerTeam.id)?.totalScore || 0 : 0;
  const loserScore = scores.find(s => s.teamId !== winnerTeam?.id)?.totalScore || 0;
  const scoreDifference = !isDraw ? loserScore - winnerScore : 0;

  return (
    <div className="min-h-screen game-bg p-2 sm:p-4 relative overflow-hidden">
      {/* Dekoratif öğeler - Mobilde gizle */}
      <div className="hidden md:block absolute top-10 left-10 game-dice animate-float" style={{ animationDelay: '0s' }}>🎲</div>
      <div className="hidden md:block absolute top-20 right-20 game-tile animate-float" style={{ animationDelay: '2s' }}>🀄</div>
      <div className="hidden md:block absolute bottom-10 left-20 game-dice animate-float" style={{ animationDelay: '4s' }}>🎯</div>
      <div className="hidden md:block absolute bottom-20 right-10 game-tile animate-float" style={{ animationDelay: '1s' }}>🀅</div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="glass-card rounded-2xl md:rounded-3xl p-4 md:p-8 animate-slide-in">
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-4 md:mb-6 drop-shadow-lg">🏆 Oyun Sonucu</h1>

          {isDraw ? (
            <div className="mb-4 md:mb-6 p-4 md:p-8 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 rounded-xl md:rounded-2xl text-center shadow-2xl animate-pulse-glow">
              <p className="text-base md:text-xl text-white mb-2 font-semibold">Beraberlik!</p>
              <p className="text-2xl md:text-5xl font-bold text-white drop-shadow-lg">
                🤝 Eşit Puan 🤝
              </p>
              <p className="text-sm md:text-base text-white/90 mt-2">
                Her iki takım da {scores[0]?.totalScore || 0} puan
              </p>
            </div>
          ) : (
            <div className="mb-4 md:mb-6 p-4 md:p-8 bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 rounded-xl md:rounded-2xl text-center shadow-2xl animate-pulse-glow">
              <p className="text-base md:text-xl text-white mb-2 font-semibold">Kazanan Takım</p>
              <p className="text-2xl md:text-5xl font-bold text-white drop-shadow-lg">
                {winnerTeam?.name || 'Belirlenemedi'} 🏆
              </p>
              {scoreDifference > 0 && (
                <p className="text-lg md:text-2xl text-white mt-3 font-bold drop-shadow-lg">
                  {scoreDifference} puan farkla kazandı! 🎉
                </p>
              )}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
            {lastGame.teams.map((team) => {
              const score = scores.find(s => s.teamId === team.id);
              const isWinner = !isDraw && team.id === lastGame.winner;
              const isDrawTeam = isDraw && score?.totalScore === scores[0]?.totalScore;
              
              return (
                <div
                  key={team.id}
                  className={`glass-card rounded-xl md:rounded-2xl p-4 md:p-6 border ${
                    isWinner
                      ? 'border-green-400/50 bg-green-500/20'
                      : isDrawTeam
                      ? 'border-blue-400/50 bg-blue-500/20'
                      : 'border-white/30'
                  }`}
                >
                  <h2 className={`text-xl md:text-2xl font-semibold mb-3 md:mb-4 text-readable-strong ${
                    (isWinner || isDrawTeam) ? 'drop-shadow-lg' : ''
                  }`}>
                    👥 {team.name}
                    {isWinner && <span className="ml-2">🏆</span>}
                    {isDrawTeam && <span className="ml-2">🤝</span>}
                  </h2>
                  
                  {team.players.length > 0 && (
                    <p className="text-sm text-readable mb-4">
                      Oyuncular: {team.players.join(', ')}
                    </p>
                  )}

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-semibold">Kalan Puan:</span>
                      <span className="font-bold text-black text-lg">{score?.remainingPoints || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-semibold">Ceza:</span>
                      <span className="font-bold text-red-600 text-lg">+{score?.penalties || 0}</span>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-white/30">
                      <span className="text-lg font-semibold text-readable-strong">Toplam (Kalan + Ceza):</span>
                      <span className={`text-3xl font-bold ${
                        isWinner ? 'text-green-700 drop-shadow-lg' : isDrawTeam ? 'text-blue-200 drop-shadow-lg' : 'text-readable-strong'
                      }`}>
                        {score?.totalScore || 0}
                      </span>
                    </div>
                    {isWinner && (
                      <div className="mt-2 text-center">
                        <p className="text-xs text-readable opacity-80">
                          ⭐ En düşük puan = Kazanan
                        </p>
                        {scoreDifference > 0 && (
                          <p className="text-sm text-green-700 font-bold mt-1 drop-shadow-md">
                            🎯 {scoreDifference} puan farkla kazandı
                          </p>
                        )}
                      </div>
                    )}
                    {isDrawTeam && (
                      <p className="text-xs text-readable mt-2 text-center opacity-80">
                        🤝 Beraberlik
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <button
              onClick={() => navigate('/')}
              className="w-full sm:w-auto px-4 md:px-6 py-2.5 md:py-3 glass text-white rounded-xl hover:bg-white/30 transition font-medium text-sm md:text-base"
            >
              Ana Sayfa
            </button>
            <button
              onClick={() => navigate('/history')}
              className="flex-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 text-white py-2.5 md:py-3 px-4 md:px-6 rounded-xl hover:from-indigo-600 hover:via-purple-600 hover:to-indigo-700 transition-all duration-300 font-bold text-sm md:text-base shadow-xl hover:shadow-2xl transform hover:scale-[1.02]"
            >
              📜 Geçmiş Oyunları Görüntüle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;

