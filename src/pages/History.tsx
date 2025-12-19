import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { useAuth } from '../context/AuthContext';

const History = () => {
  const navigate = useNavigate();
  const { games } = useGame();
  const { user } = useAuth();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen game-bg p-2 sm:p-4 relative overflow-hidden">
      {/* Dekoratif öğeler - Mobilde gizle */}
      <div className="hidden md:block absolute top-10 left-10 game-dice animate-float" style={{ animationDelay: '0s' }}>🎲</div>
      <div className="hidden md:block absolute top-20 right-20 game-tile animate-float" style={{ animationDelay: '2s' }}>🀄</div>
      <div className="hidden md:block absolute bottom-10 left-20 game-dice animate-float" style={{ animationDelay: '4s' }}>🎯</div>
      <div className="hidden md:block absolute bottom-20 right-10 game-tile animate-float" style={{ animationDelay: '1s' }}>🀅</div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="glass-card rounded-2xl md:rounded-3xl p-4 md:p-8 animate-slide-in">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 md:mb-6 gap-3 sm:gap-0">
            <div>
              <h1 className="text-2xl md:text-4xl font-bold text-white drop-shadow-lg">📜 Oyun Geçmişi</h1>
              {user && (
                <p className="text-white/80 mt-1 md:mt-2 text-sm md:text-base">👤 {user.username} - Kendi Oyunların</p>
              )}
            </div>
            <button
              onClick={() => navigate('/')}
              className="w-full sm:w-auto px-4 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 text-white rounded-xl hover:from-indigo-600 hover:via-purple-600 hover:to-indigo-700 transition-all duration-300 font-bold text-sm md:text-base shadow-xl hover:shadow-2xl transform hover:scale-[1.02]"
            >
              Ana Sayfa
            </button>
          </div>

          {games.length === 0 ? (
            <div className="text-center py-16">
              <div className="glass-card rounded-2xl p-8 border border-white/30 max-w-md mx-auto">
                <p className="text-readable-strong text-2xl mb-3 font-bold">Henüz oynanmış oyun yok</p>
                <p className="text-readable text-base mb-6">İlk oyununu başlat ve geçmişini burada gör!</p>
                <button
                  onClick={() => navigate('/')}
                  className="px-8 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 text-white rounded-xl hover:from-indigo-600 hover:via-purple-600 hover:to-indigo-700 transition-all duration-300 font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-[1.02]"
                >
                  🚀 Yeni Oyun Başlat
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {[...games].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((game) => {
                const winnerTeam = game.winner ? game.teams.find(t => t.id === game.winner) : null;
                const isDraw = game.isDraw || (!game.winner && game.scores[0]?.totalScore === game.scores[1]?.totalScore);
                return (
                  <div
                    key={game.id}
                    className="glass-card rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/30 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 md:mb-5 gap-3 sm:gap-0">
                      <div>
                        <p className="text-xs md:text-sm text-gray-600 mb-1 font-medium">{formatDate(game.date)}</p>
                        <p className="text-lg md:text-xl font-bold text-gray-900">
                          {game.teams[0].name} vs {game.teams[1].name}
                        </p>
                      </div>
                      {isDraw ? (
                        <div className="px-3 md:px-5 py-2 md:py-2.5 rounded-xl border-2 border-blue-400/70 bg-gradient-to-r from-blue-400/40 to-indigo-400/40 backdrop-blur-md">
                          <p className="text-sm md:text-base text-gray-900 font-bold">
                            🤝 Beraberlik
                          </p>
                        </div>
                      ) : winnerTeam && (
                        <div className="px-3 md:px-5 py-2 md:py-2.5 rounded-xl border-2 border-yellow-400/70 bg-gradient-to-r from-yellow-400/40 to-orange-400/40 backdrop-blur-md">
                          <p className="text-sm md:text-base text-gray-900 font-bold">
                            🏆 {winnerTeam.name}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-3 md:gap-4">
                      {game.teams.map((team) => {
                        const score = game.scores.find(s => s.teamId === team.id);
                        const isWinner = !isDraw && team.id === game.winner;
                        const isDrawTeam = isDraw && score?.totalScore === game.scores[0]?.totalScore;
                        return (
                          <div
                            key={team.id}
                            className={`rounded-lg md:rounded-xl p-3 md:p-5 border-2 ${
                              isWinner 
                                ? 'border-yellow-400/60 bg-gradient-to-br from-yellow-400/30 to-orange-400/30 backdrop-blur-md' 
                                : isDrawTeam
                                ? 'border-blue-400/60 bg-gradient-to-br from-blue-400/30 to-indigo-400/30 backdrop-blur-md'
                                : 'border-white/40 bg-white/20 backdrop-blur-md'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-3 md:mb-4">
                              <p className={`text-base md:text-lg font-bold ${
                                isWinner ? 'text-yellow-800' : isDrawTeam ? 'text-blue-800' : 'text-gray-900'
                              }`}>
                                👥 {team.name}
                              </p>
                              {isWinner && <span className="text-xl md:text-2xl">🏆</span>}
                              {isDrawTeam && <span className="text-xl md:text-2xl">🤝</span>}
                            </div>
                            
                            {team.players.length > 0 && (
                              <p className="text-xs md:text-sm text-gray-700 mb-2 md:mb-3 font-medium">
                                {team.players.join(', ')}
                              </p>
                            )}

                            <div className={`space-y-2 md:space-y-3 rounded-lg p-3 md:p-4 backdrop-blur-md ${
                              isWinner 
                                ? 'bg-white/40 border border-yellow-300/40' 
                                : 'bg-white/50 border border-gray-300/40'
                            }`}>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-800 font-semibold text-sm md:text-base">Kalan Puan:</span>
                                <span className="text-gray-900 font-bold text-base md:text-lg">{score?.remainingPoints || 0}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-800 font-semibold text-sm md:text-base">Ceza:</span>
                                <span className="text-red-600 font-bold text-base md:text-lg">+{score?.penalties || 0}</span>
                              </div>
                              <div className="flex justify-between items-center pt-2 border-t-2 border-gray-300/50">
                                <span className="font-bold text-gray-900 text-sm md:text-base">Toplam:</span>
                                <span className={`font-bold text-xl md:text-2xl ${
                                  isWinner ? 'text-yellow-700' : isDrawTeam ? 'text-blue-700' : 'text-gray-900'
                                }`}>
                                  {score?.totalScore || 0}
                                </span>
                              </div>
                              {isWinner && (
                                <p className="text-xs text-gray-600 mt-1 text-center italic">
                                  En düşük puan
                                </p>
                              )}
                              {isDrawTeam && (
                                <p className="text-xs text-gray-600 mt-1 text-center italic">
                                  Beraberlik
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;

