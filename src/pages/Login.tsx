import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!username.trim() || !password.trim()) {
      setError('Lütfen tüm alanları doldurun');
      setLoading(false);
      return;
    }

    const result = await login(username, password);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message || 'Giriş başarısız');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen game-bg flex items-center justify-center px-2 sm:px-4 py-4 sm:py-8 relative overflow-hidden">
      {/* Dekoratif öğeler - Mobilde gizle */}
      <div className="hidden md:block absolute top-20 left-10 game-dice animate-float" style={{ animationDelay: '0s' }}>🎲</div>
      <div className="hidden md:block absolute top-40 right-20 game-dice animate-float" style={{ animationDelay: '2s' }}>🎯</div>
      <div className="hidden md:block absolute bottom-20 left-20 game-tile animate-float" style={{ animationDelay: '4s' }}>🀄</div>
      <div className="hidden md:block absolute bottom-40 right-10 game-tile animate-float" style={{ animationDelay: '1s' }}>🀅</div>
      <div className="hidden md:block absolute top-1/2 left-1/4 game-tile animate-float" style={{ animationDelay: '3s' }}>🀆</div>
      <div className="hidden md:block absolute top-1/3 right-1/4 game-dice animate-float" style={{ animationDelay: '5s' }}>🎮</div>

      <div className="glass-card rounded-2xl md:rounded-3xl p-6 md:p-8 w-full max-w-md animate-slide-in relative z-10">
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">
            Yaz Boz Plus
          </h1>
          <p className="text-white/95 text-base md:text-lg font-semibold">Puan Çetelesi</p>
          <p className="text-white/75 text-xs md:text-sm mt-1">Giriş Yap</p>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-500/40 backdrop-blur-md border border-red-300/60 text-white rounded-xl text-sm animate-slide-in shadow-lg">
            <div className="flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-semibold text-readable-strong mb-3">
              👤 Kullanıcı Adı
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="glass-input w-full px-5 py-4 rounded-xl text-readable placeholder-white/80 focus:outline-none transition-all duration-300 font-medium"
              placeholder="Kullanıcı adınızı girin"
              required
              disabled={loading}
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-readable-strong mb-3">
              🔒 Parola
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="glass-input w-full px-5 py-4 rounded-xl text-readable placeholder-white/80 focus:outline-none transition-all duration-300 font-medium"
              placeholder="Parolanızı girin"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 text-white py-3 md:py-4 px-4 md:px-6 rounded-xl hover:from-indigo-600 hover:via-purple-600 hover:to-indigo-700 transition-all duration-300 font-bold text-base md:text-lg shadow-xl hover:shadow-2xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⏳</span>
                Giriş yapılıyor...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                🚀 Giriş Yap
              </span>
            )}
          </button>

          <div className="text-center pt-4">
            <p className="text-sm text-white/90">
              Hesabınız yok mu?{' '}
              <Link 
                to="/register" 
                className="text-indigo-200 hover:text-white font-bold underline decoration-2 underline-offset-2 transition-colors"
              >
                🎉 Kayıt Ol
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

