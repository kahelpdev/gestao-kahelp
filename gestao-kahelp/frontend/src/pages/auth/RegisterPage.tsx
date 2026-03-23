import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { styles } from '../../styles';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', organizationName: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface bg-grid-pattern relative flex items-center justify-center p-8">
      {/* Ambient orbs */}
      <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-primary-600 rounded-full blur-[160px] opacity-[0.06]" />
      <div className="absolute bottom-1/3 right-1/3 w-48 h-48 bg-primary-400 rounded-full blur-[120px] opacity-[0.04]" />

      <div className="w-full max-w-md relative z-10">
        <div className="flex items-center gap-3 mb-10 justify-center">
          <img src="/assets/logo.svg" alt="SprintControl" className="w-10 h-10" />
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Sprint<span className="text-primary-400">Control</span>
          </h1>
        </div>

        <div className={`${styles.glassCard} p-8`}>
          <h3 className="text-xl font-bold text-white mb-1 tracking-tight">Criar Organizacao</h3>
          <p className="text-gray-500 text-sm mb-6">Configure sua organizacao e comece a gerenciar sprints</p>

          {error && (
            <div className="bg-accent-red/8 border border-accent-red/20 text-accent-red px-4 py-3 rounded-xl text-sm mb-6 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={styles.label}>Nome da Organizacao</label>
              <input
                type="text"
                value={form.organizationName}
                onChange={(e) => setForm({ ...form, organizationName: e.target.value })}
                className={styles.inputField}
                placeholder="Ex: NewStandard"
                required
              />
            </div>
            <div>
              <label className={styles.label}>Seu Nome</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={styles.inputField}
                placeholder="Seu nome completo"
                required
              />
            </div>
            <div>
              <label className={styles.label}>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={styles.inputField}
                placeholder="seu@email.com"
                required
              />
            </div>
            <div>
              <label className={styles.label}>Senha</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className={styles.inputField}
                placeholder="Minimo 6 caracteres"
                minLength={6}
                required
              />
            </div>

            <button type="submit" disabled={loading} className={`${styles.btnPrimary} w-full mt-2 disabled:opacity-50 disabled:cursor-not-allowed`}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Criando...
                </span>
              ) : 'Criar Organizacao'}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          Ja tem conta?{' '}
          <Link to="/login" className="text-primary-400 hover:text-primary-300 font-semibold transition-colors">
            Fazer login
          </Link>
        </p>
      </div>
    </div>
  );
}
