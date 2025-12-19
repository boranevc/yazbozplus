import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import { Team } from '../types';

const Home = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { startGame } = useGame();
  const [team1Name, setTeam1Name] = useState('');
  const [team2Name, setTeam2Name] = useState('');
  const [team1Players, setTeam1Players] = useState(['', '']);
  const [team2Players, setTeam2Players] = useState(['', '']);

  const handleStartGame = () => {
    if (team1Name.trim() && team2Name.trim()) {
      const teams: Team[] = [
        {
          id: 'team1',
          name: team1Name,
          players: team1Players.filter(p => p.trim()),
        },
        {
          id: 'team2',
          name: team2Name,
          players: team2Players.filter(p => p.trim()),
        },
      ];
      startGame(teams);
      navigate('/game');
    }
  };

  const updatePlayer = (team: number, index: number, value: string) => {
    if (team === 1) {
      const newPlayers = [...team1Players];
      newPlayers[index] = value;
      setTeam1Players(newPlayers);
    } else {
      const newPlayers = [...team2Players];
      newPlayers[index] = value;
      setTeam2Players(newPlayers);
    }
  };

  return (
    <div className="min-h-screen game-bg p-2 sm:p-4 relative overflow-hidden">
      {/* Dekoratif öğeler - Mobilde gizle */}
      <div className="hidden md:block absolute top-10 left-10 game-dice animate-float" style={{ animationDelay: '0s' }}>🎲</div>
      <div className="hidden md:block absolute top-20 right-20 game-tile animate-float" style={{ animationDelay: '2s' }}>🀄</div>
      <div className="hidden md:block absolute bottom-10 left-20 game-dice animate-float" style={{ animationDelay: '4s' }}>🎯</div>
      <div className="hidden md:block absolute bottom-20 right-10 game-tile animate-float" style={{ animationDelay: '1s' }}>🀅</div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="glass-card rounded-2xl md:rounded-3xl p-4 md:p-8 mb-4 md:mb-6 animate-slide-in">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 md:mb-6 gap-3 md:gap-0">
            <h1 className="text-2xl md:text-4xl font-bold text-white drop-shadow-lg">🎲 Yaz Boz Plus</h1>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
              <span className="text-white/90 font-medium text-sm md:text-base text-center sm:text-left">Hoş geldin, {user?.username}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate('/history')}
                  className="flex-1 sm:flex-none glass px-3 md:px-4 py-2 text-white rounded-xl hover:bg-white/30 transition font-medium text-sm md:text-base"
                >
                  📜 Geçmiş
                </button>
                <button
                  onClick={logout}
                  className="flex-1 sm:flex-none px-3 md:px-4 py-2 bg-red-500/80 backdrop-blur-md text-white rounded-xl hover:bg-red-600/80 transition font-medium text-sm md:text-base"
                >
                  Çıkış
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4 md:space-y-6">
            <h2 className="text-xl md:text-2xl font-semibold text-white">Yeni Oyun Başlat</h2>
            
            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
              {/* Takım 1 */}
              <div className="glass-card rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/30">
                <h3 className="text-lg md:text-xl font-semibold text-readable-strong mb-3 md:mb-4">👥 Takım 1</h3>
                <input
                  type="text"
                  value={team1Name}
                  onChange={(e) => setTeam1Name(e.target.value)}
                  placeholder="Takım adını girin..."
                  className="input-team w-full px-4 py-3 rounded-xl mb-4 focus:outline-none transition-all duration-300"
                />
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-readable-strong mb-2">Oyuncular (2 kişi)</label>
                  {team1Players.map((player, index) => (
                    <input
                      key={index}
                      type="text"
                      value={player}
                      onChange={(e) => updatePlayer(1, index, e.target.value)}
                      placeholder={`Oyuncu ${index + 1} adı...`}
                      className="input-team w-full px-4 py-2.5 rounded-xl focus:outline-none transition-all duration-300"
                    />
                  ))}
                </div>
              </div>

              {/* Takım 2 */}
              <div className="glass-card rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/30">
                <h3 className="text-lg md:text-xl font-semibold text-readable-strong mb-3 md:mb-4">👥 Takım 2</h3>
                <input
                  type="text"
                  value={team2Name}
                  onChange={(e) => setTeam2Name(e.target.value)}
                  placeholder="Takım adını girin..."
                  className="input-team w-full px-4 py-3 rounded-xl mb-4 focus:outline-none transition-all duration-300"
                />
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-readable-strong mb-2">Oyuncular (2 kişi)</label>
                  {team2Players.map((player, index) => (
                    <input
                      key={index}
                      type="text"
                      value={player}
                      onChange={(e) => updatePlayer(2, index, e.target.value)}
                      placeholder={`Oyuncu ${index + 1} adı...`}
                      className="input-team w-full px-4 py-2.5 rounded-xl focus:outline-none transition-all duration-300"
                    />
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleStartGame}
              disabled={!team1Name.trim() || !team2Name.trim()}
              className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 text-white py-3 md:py-4 px-4 md:px-6 rounded-xl hover:from-indigo-600 hover:via-purple-600 hover:to-indigo-700 transition-all duration-300 font-bold text-base md:text-lg shadow-xl hover:shadow-2xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              🚀 Oyunu Başlat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

