import React, { createContext, useContext, useState, useEffect } from 'react';
import { Game, Team, GameScore } from '../types';

interface GameContextType {
  games: Game[];
  currentGame: Game | null;
  startGame: (teams: Team[]) => void;
  updateScores: (scores: GameScore[]) => void;
  finishGame: () => void;
  saveGame: () => void;
  loadGames: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode; userId: string }> = ({ 
  children, 
  userId 
}) => {
  const [games, setGames] = useState<Game[]>([]);
  const [currentGame, setCurrentGame] = useState<Game | null>(null);

  useEffect(() => {
    loadGames();
  }, [userId]);

  const loadGames = () => {
    if (!userId) {
      setGames([]);
      return;
    }
    
    const savedGames = localStorage.getItem(`games_${userId}`);
    if (savedGames) {
      const allGames: Game[] = JSON.parse(savedGames);
      // Sadece bu kullanıcıya ait oyunları göster (güvenlik için)
      const userGames = allGames.filter(game => game.userId === userId);
      setGames(userGames);
    } else {
      setGames([]);
    }
  };

  const startGame = (teams: Team[]) => {
    const newGame: Game = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      teams,
      scores: teams.map(team => ({
        teamId: team.id,
        remainingPoints: 0,
        penalties: 0,
        totalScore: 0,
      })),
      userId,
    };
    setCurrentGame(newGame);
  };

  const updateScores = (scores: GameScore[]) => {
    if (currentGame) {
      setCurrentGame({
        ...currentGame,
        scores: scores.map(score => ({
          ...score,
          totalScore: score.remainingPoints + score.penalties, // Kalan puan + cezalar
        })),
      });
    }
  };

  const finishGame = () => {
    if (currentGame && userId) {
      const scores = currentGame.scores.map(score => ({
        ...score,
        totalScore: score.remainingPoints + score.penalties, // Kalan puan + cezalar
      }));
      
      // Puanı en az olan kazanır (düşük puan = iyi)
      const sortedScores = [...scores].sort((a, b) => a.totalScore - b.totalScore);
      const minScore = sortedScores[0].totalScore;
      
      // Beraberlik kontrolü: En düşük puanı birden fazla takım varsa beraberlik
      const winners = sortedScores.filter(s => s.totalScore === minScore);
      const isDraw = winners.length > 1;

      const finishedGame: Game = {
        ...currentGame,
        scores,
        winner: isDraw ? null : winners[0].teamId,
        isDraw,
        userId, // Kullanıcı ID'sini garanti et
      };

      // Mevcut oyunları localStorage'dan yükle
      const savedGames = localStorage.getItem(`games_${userId}`);
      const existingGames: Game[] = savedGames ? JSON.parse(savedGames) : [];
      
      // Sadece bu kullanıcıya ait oyunları filtrele (güvenlik için)
      const userGames = existingGames.filter(g => g.userId === userId);
      
      // Yeni oyunu ekle
      const updatedGames = [...userGames, finishedGame];
      
      setGames(updatedGames);
      setCurrentGame(null);
      localStorage.setItem(`games_${userId}`, JSON.stringify(updatedGames));
    }
  };

  const saveGame = () => {
    if (currentGame && userId) {
      // Mevcut oyunları localStorage'dan yükle
      const savedGames = localStorage.getItem(`games_${userId}`);
      const existingGames: Game[] = savedGames ? JSON.parse(savedGames) : [];
      
      // Sadece bu kullanıcıya ait oyunları filtrele
      const userGames = existingGames.filter(g => g.userId === userId);
      
      // Oyunu güncelle veya ekle
      const gameIndex = userGames.findIndex(g => g.id === currentGame.id);
      const updatedGames = gameIndex >= 0
        ? userGames.map((g, idx) => idx === gameIndex ? { ...currentGame, userId } : g)
        : [...userGames, { ...currentGame, userId }];
      
      setGames(updatedGames);
      localStorage.setItem(`games_${userId}`, JSON.stringify(updatedGames));
    }
  };

  return (
    <GameContext.Provider value={{ 
      games, 
      currentGame, 
      startGame, 
      updateScores, 
      finishGame, 
      saveGame,
      loadGames 
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

