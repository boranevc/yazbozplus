import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { GameScore } from '../types';

interface TeamInputs {
  remainingPoints: number[];
  penalties: number[];
}

const Game = () => {
  const navigate = useNavigate();
  const { currentGame, updateScores, finishGame } = useGame();
  const [scores, setScores] = useState<GameScore[]>([]);
  const [teamInputs, setTeamInputs] = useState<Record<string, TeamInputs>>({});
  const [inputValues, setInputValues] = useState<Record<string, { remainingPoints: string; penalties: string }>>({});

  useEffect(() => {
    if (!currentGame) {
      navigate('/');
      return;
    }
    setScores(currentGame.scores);
    // Her takım için boş listeler başlat
    const initialInputs: Record<string, TeamInputs> = {};
    const initialValues: Record<string, { remainingPoints: string; penalties: string }> = {};
    currentGame.teams.forEach(team => {
      initialInputs[team.id] = { remainingPoints: [], penalties: [] };
      initialValues[team.id] = { remainingPoints: '', penalties: '' };
    });
    setTeamInputs(initialInputs);
    setInputValues(initialValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentGame?.id, navigate]);

  // Debug için - state değişikliklerini izle
  useEffect(() => {
    console.log('teamInputs updated:', teamInputs);
  }, [teamInputs]);

  const addValue = (teamId: string, field: 'remainingPoints' | 'penalties', value: string) => {
    const trimmedValue = value.trim();
    if (trimmedValue === '') return;
    
    const numValue = parseInt(trimmedValue);
    if (isNaN(numValue)) return;

    // Önce mevcut state'i al ve yeni değeri ekle
    setTeamInputs(prev => {
      const currentInputs = prev[teamId] || { remainingPoints: [], penalties: [] };
      const newArray = [...(currentInputs[field] || []), numValue];
      
      const updatedInputs = {
        ...currentInputs,
        [field]: newArray
      };
      
      return {
        ...prev,
        [teamId]: updatedInputs
      };
    });

    // Input'u temizle
    setInputValues(prev => ({
      ...prev,
      [teamId]: { 
        ...(prev[teamId] || { remainingPoints: '', penalties: '' }), 
        [field]: '' 
      }
    }));
  };

  // teamInputs değiştiğinde score'ları güncelle
  useEffect(() => {
    if (Object.keys(teamInputs).length === 0 || scores.length === 0) return;

    const updatedScores = scores.map(score => {
      const teamInput = teamInputs[score.teamId];
      if (!teamInput) return score;

      const totalRemaining = (teamInput.remainingPoints || []).reduce((sum, val) => sum + val, 0);
      const totalPenalties = (teamInput.penalties || []).reduce((sum, val) => sum + val, 0);
      const totalScore = totalRemaining + totalPenalties;

      return {
        ...score,
        remainingPoints: totalRemaining,
        penalties: totalPenalties,
        totalScore,
      };
    });

    setScores(updatedScores);
    updateScores(updatedScores);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamInputs]);

  // Input değiştiğinde sadece state'i güncelle, hesaplama yapma
  const handleInputChange = (teamId: string, field: 'remainingPoints' | 'penalties', value: string) => {
    setInputValues(prev => {
      const current = prev[teamId] || { remainingPoints: '', penalties: '' };
      return {
        ...prev,
        [teamId]: {
          ...current,
          [field]: value
        }
      };
    });
  };

  // Enter tuşu ile ekleme
  const handleKeyPress = (e: React.KeyboardEvent, teamId: string, field: 'remainingPoints' | 'penalties') => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const currentValue = inputValues[teamId]?.[field] || '';
      if (currentValue.trim() !== '') {
        addValue(teamId, field, currentValue);
      }
    }
  };


  const handleFinish = () => {
    finishGame();
    navigate('/result');
  };

  if (!currentGame) return null;

  const team1 = currentGame.teams[0];
  const team2 = currentGame.teams[1];

  return (
    <div className="min-h-screen game-bg p-2 sm:p-4 relative overflow-hidden">
      {/* Dekoratif öğeler - Mobilde gizle */}
      <div className="hidden md:block absolute top-10 left-10 game-dice animate-float" style={{ animationDelay: '0s' }}>🎲</div>
      <div className="hidden md:block absolute top-20 right-20 game-tile animate-float" style={{ animationDelay: '2s' }}>🀄</div>
      <div className="hidden md:block absolute bottom-10 left-20 game-dice animate-float" style={{ animationDelay: '4s' }}>🎯</div>
      <div className="hidden md:block absolute bottom-20 right-10 game-tile animate-float" style={{ animationDelay: '1s' }}>🀅</div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="glass-card rounded-2xl md:rounded-3xl p-4 md:p-8 animate-slide-in">
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-4 md:mb-6 drop-shadow-lg">🎮 Oyun Devam Ediyor</h1>

          <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
            {/* Takım 1 */}
            <div className="glass-card rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/30">
              <h2 className="text-xl md:text-2xl font-semibold text-readable-strong mb-3 md:mb-4">👥 {team1.name}</h2>
              {team1.players.length > 0 && (
                <p className="text-sm text-readable mb-4">
                  Oyuncular: {team1.players.join(', ')}
                </p>
              )}
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-readable-strong mb-2">
                    📊 Kalan Puan
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={(inputValues[team1.id] && inputValues[team1.id].remainingPoints) || ''}
                      onChange={(e) => handleInputChange(team1.id, 'remainingPoints', e.target.value)}
                      onKeyDown={(e) => handleKeyPress(e, team1.id, 'remainingPoints')}
                      placeholder=""
                      className="glass-input flex-1 px-3 md:px-4 py-3 md:py-3 rounded-xl text-black placeholder-gray-500 focus:outline-none transition-all duration-300 font-semibold text-base md:text-lg min-h-[44px]"
                    />
                    <button
                      onClick={() => {
                        const val = inputValues[team1.id]?.remainingPoints || '';
                        if (val.trim() !== '') {
                          addValue(team1.id, 'remainingPoints', val);
                        }
                      }}
                      className="px-4 md:px-4 py-3 md:py-3 bg-indigo-500/80 hover:bg-indigo-600 text-white rounded-xl transition font-semibold text-lg md:text-xl min-h-[44px] min-w-[44px]"
                    >
                      +
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <button
                      onClick={() => addValue(team1.id, 'remainingPoints', '-101')}
                      className="px-2 md:px-3 py-3 md:py-2 bg-red-500/80 hover:bg-red-600 active:bg-red-700 text-white rounded-lg transition font-semibold text-xs md:text-sm min-h-[44px] touch-manipulation"
                    >
                      Sil (-101)
                    </button>
                    <button
                      onClick={() => addValue(team1.id, 'remainingPoints', '-202')}
                      className="px-2 md:px-3 py-3 md:py-2 bg-red-600/80 hover:bg-red-700 active:bg-red-800 text-white rounded-lg transition font-semibold text-xs md:text-sm min-h-[44px] touch-manipulation"
                    >
                      Çift Sil (-202)
                    </button>
                    <button
                      onClick={() => addValue(team1.id, 'remainingPoints', '808')}
                      className="px-2 md:px-3 py-3 md:py-2 bg-purple-500/80 hover:bg-purple-600 active:bg-purple-700 text-white rounded-lg transition font-semibold text-xs md:text-sm min-h-[44px] touch-manipulation"
                    >
                      KAFA 😱
                    </button>
                  </div>
                  {teamInputs[team1.id]?.remainingPoints && teamInputs[team1.id].remainingPoints.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-readable-strong font-semibold" style={{ color: '#000' }}>
                        {teamInputs[team1.id].remainingPoints.join(', ')}
                      </p>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-readable-strong mb-2">
                    ⚠️ Ceza
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={(inputValues[team1.id] && inputValues[team1.id].penalties) || ''}
                      onChange={(e) => handleInputChange(team1.id, 'penalties', e.target.value)}
                      onKeyDown={(e) => handleKeyPress(e, team1.id, 'penalties')}
                      placeholder=""
                      className="glass-input flex-1 px-3 md:px-4 py-3 md:py-3 rounded-xl text-black placeholder-gray-500 focus:outline-none transition-all duration-300 font-semibold text-base md:text-lg min-h-[44px]"
                    />
                    <button
                      onClick={() => {
                        const val = inputValues[team1.id]?.penalties || '';
                        if (val.trim() !== '') {
                          addValue(team1.id, 'penalties', val);
                        }
                      }}
                      className="px-4 md:px-4 py-3 md:py-3 bg-indigo-500/80 hover:bg-indigo-600 text-white rounded-xl transition font-semibold text-lg md:text-xl min-h-[44px] min-w-[44px]"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex gap-2 mb-2">
                    <button
                      onClick={() => addValue(team1.id, 'penalties', '101')}
                      className="w-full px-3 md:px-3 py-3 md:py-2 bg-orange-500/80 hover:bg-orange-600 active:bg-orange-700 text-white rounded-lg transition font-semibold text-sm md:text-sm min-h-[44px] touch-manipulation"
                    >
                      101 CEZA
                    </button>
                  </div>
                  {teamInputs[team1.id]?.penalties && teamInputs[team1.id].penalties.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-readable-strong font-semibold" style={{ color: '#000' }}>
                        {teamInputs[team1.id].penalties.join(', ')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Takım 2 */}
            <div className="glass-card rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/30">
              <h2 className="text-xl md:text-2xl font-semibold text-readable-strong mb-3 md:mb-4">👥 {team2.name}</h2>
              {team2.players.length > 0 && (
                <p className="text-sm text-readable mb-4">
                  Oyuncular: {team2.players.join(', ')}
                </p>
              )}
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-readable-strong mb-2">
                    📊 Kalan Puan
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={(inputValues[team2.id] && inputValues[team2.id].remainingPoints) || ''}
                      onChange={(e) => handleInputChange(team2.id, 'remainingPoints', e.target.value)}
                      onKeyDown={(e) => handleKeyPress(e, team2.id, 'remainingPoints')}
                      placeholder=""
                      className="glass-input flex-1 px-3 md:px-4 py-3 md:py-3 rounded-xl text-black placeholder-gray-500 focus:outline-none transition-all duration-300 font-semibold text-base md:text-lg min-h-[44px]"
                    />
                    <button
                      onClick={() => {
                        const val = inputValues[team2.id]?.remainingPoints || '';
                        if (val.trim() !== '') {
                          addValue(team2.id, 'remainingPoints', val);
                        }
                      }}
                      className="px-4 md:px-4 py-3 md:py-3 bg-indigo-500/80 hover:bg-indigo-600 text-white rounded-xl transition font-semibold text-lg md:text-xl min-h-[44px] min-w-[44px]"
                    >
                      +
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <button
                      onClick={() => addValue(team2.id, 'remainingPoints', '-101')}
                      className="px-2 md:px-3 py-3 md:py-2 bg-red-500/80 hover:bg-red-600 active:bg-red-700 text-white rounded-lg transition font-semibold text-xs md:text-sm min-h-[44px] touch-manipulation"
                    >
                      Sil (-101)
                    </button>
                    <button
                      onClick={() => addValue(team2.id, 'remainingPoints', '-202')}
                      className="px-2 md:px-3 py-3 md:py-2 bg-red-600/80 hover:bg-red-700 active:bg-red-800 text-white rounded-lg transition font-semibold text-xs md:text-sm min-h-[44px] touch-manipulation"
                    >
                      Çift Sil (-202)
                    </button>
                    <button
                      onClick={() => addValue(team2.id, 'remainingPoints', '808')}
                      className="px-2 md:px-3 py-3 md:py-2 bg-purple-500/80 hover:bg-purple-600 active:bg-purple-700 text-white rounded-lg transition font-semibold text-xs md:text-sm min-h-[44px] touch-manipulation"
                    >
                      KAFA 😱
                    </button>
                  </div>
                  {teamInputs[team2.id]?.remainingPoints && teamInputs[team2.id].remainingPoints.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-readable-strong font-semibold" style={{ color: '#000' }}>
                        {teamInputs[team2.id].remainingPoints.join(', ')}
                      </p>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-readable-strong mb-2">
                    ⚠️ Ceza
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={(inputValues[team2.id] && inputValues[team2.id].penalties) || ''}
                      onChange={(e) => handleInputChange(team2.id, 'penalties', e.target.value)}
                      onKeyDown={(e) => handleKeyPress(e, team2.id, 'penalties')}
                      placeholder=""
                      className="glass-input flex-1 px-3 md:px-4 py-3 md:py-3 rounded-xl text-black placeholder-gray-500 focus:outline-none transition-all duration-300 font-semibold text-base md:text-lg min-h-[44px]"
                    />
                    <button
                      onClick={() => {
                        const val = inputValues[team2.id]?.penalties || '';
                        if (val.trim() !== '') {
                          addValue(team2.id, 'penalties', val);
                        }
                      }}
                      className="px-4 md:px-4 py-3 md:py-3 bg-indigo-500/80 hover:bg-indigo-600 text-white rounded-xl transition font-semibold text-lg md:text-xl min-h-[44px] min-w-[44px]"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex gap-2 mb-2">
                    <button
                      onClick={() => addValue(team2.id, 'penalties', '101')}
                      className="w-full px-3 md:px-3 py-3 md:py-2 bg-orange-500/80 hover:bg-orange-600 active:bg-orange-700 text-white rounded-lg transition font-semibold text-sm md:text-sm min-h-[44px] touch-manipulation"
                    >
                      101 CEZA
                    </button>
                  </div>
                  {teamInputs[team2.id]?.penalties && teamInputs[team2.id].penalties.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-readable-strong font-semibold" style={{ color: '#000' }}>
                        {teamInputs[team2.id].penalties.join(', ')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <button
              onClick={() => navigate('/')}
              className="w-full sm:w-auto px-4 md:px-6 py-2.5 md:py-3 glass text-white rounded-xl hover:bg-white/30 transition font-medium text-sm md:text-base"
            >
              İptal
            </button>
            <button
              onClick={handleFinish}
              className="flex-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 text-white py-2.5 md:py-3 px-4 md:px-6 rounded-xl hover:from-indigo-600 hover:via-purple-600 hover:to-indigo-700 transition-all duration-300 font-bold text-sm md:text-base shadow-xl hover:shadow-2xl transform hover:scale-[1.02]"
            >
              ✅ Oyunu Bitir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;
