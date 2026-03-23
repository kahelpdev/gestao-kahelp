import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { styles } from '../../styles';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch {
      setError('Email ou senha invalidos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-surface-2 items-center justify-center p-16 relative overflow-hidden">
        {/* Ambient orbs */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-primary-600 rounded-full blur-[160px] opacity-[0.08]" />
        <div className="absolute bottom-1/4 right-1/4 w-60 h-60 bg-primary-400 rounded-full blur-[120px] opacity-[0.06]" />

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-40" />

        <div className="relative z-10 max-w-md">
          <div className="flex items-center gap-4 mb-10">
            <img src="/assets/logo.svg" alt="SprintControl" className="w-14 h-14" />
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                Sprint<span className="text-primary-400">Control</span>
              </h1>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-[0.2em] mt-0.5">Gestao Agil</p>
            </div>
          </div>

          <h2 className="text-4xl font-extrabold text-white leading-[1.1] mb-5 tracking-tight">
            Gestao de sprints{' '}
            <span className="text-gradient">inteligente</span>
          </h2>
          <p className="text-gray-400 text-base leading-relaxed">
            Monitore sua equipe em tempo real, detecte desvios de foco e mantenha o controle total sobre suas entregas.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2 mt-8">
            {['Monitor em tempo real', 'Alertas de desvio', 'Relatorios'].map((f) => (
              <span key={f} className="text-xs font-medium text-gray-400 bg-white/[0.04] border border-white/[0.06] px-3 py-1.5 rounded-lg">
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
            <img src="/assets/logo.svg" alt="SprintControl" className="w-10 h-10" />
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Sprint<span className="text-primary-400">Control</span>
            </h1>
          </div>

          <h3 className="text-2xl font-bold text-white tracking-tight mb-1">Bem-vindo de volta</h3>
          <p className="text-gray-500 text-sm mb-8">Entre com suas credenciais para continuar</p>

          {error && (
            <div className="bg-accent-red/8 border border-accent-red/20 text-accent-red px-4 py-3 rounded-xl text-sm mb-6 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className={styles.label}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.inputField}
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <label className={styles.label}>Senha</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${styles.inputField} pr-12`}
                  placeholder="Sua senha"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className={`${styles.btnPrimary} w-full disabled:opacity-50 disabled:cursor-not-allowed`}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Entrando...
                </span>
              ) : 'Entrar'}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-8">
            Ainda nao tem conta?{' '}
            <Link to="/register" className="text-primary-400 hover:text-primary-300 font-semibold transition-colors">
              Criar organizacao
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
