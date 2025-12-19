export interface User {
  id: string;
  username: string;
  email?: string;
  password: string; // Basit demo için, gerçek uygulamada hash'lenmeli
}

export interface Team {
  id: string;
  name: string;
  players: string[];
}

export interface GameScore {
  teamId: string;
  remainingPoints: number;
  penalties: number;
  totalScore: number;
}

export interface Game {
  id: string;
  date: string;
  teams: Team[];
  scores: GameScore[];
  winner?: string | null; // null = beraberlik
  isDraw?: boolean;
  userId: string;
}

export interface GameState {
  currentGame: {
    teams: Team[];
    scores: GameScore[];
  } | null;
}

