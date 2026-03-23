import { useEffect, useState } from 'react';
import { CalendarRange, Plus, Play, Archive, Trash2, X } from 'lucide-react';
import { sprintsApi, teamsApi } from '../../services/api';
import { styles } from '../../styles';

export default function SprintsPage() {
  const [sprints, setSprints] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', startDate: '', endDate: '', teamId: '', goal: '' });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sprintsRes, teamsRes] = await Promise.all([
        sprintsApi.list(),
        teamsApi.list(),
      ]);
      setSprints(sprintsRes.data);
      setTeams(teamsRes.data);
    } catch {
      setSprints([]);
      setTeams([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await sprintsApi.create(form);
    setShowModal(false);
    setForm({ name: '', startDate: '', endDate: '', teamId: '', goal: '' });
    fetchData();
  };

  const handleActivate = async (id: string) => {
    await sprintsApi.activate(id);
    fetchData();
  };

  const handleArchive = async (id: string) => {
    await sprintsApi.archive(id);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta sprint?')) return;
    await sprintsApi.remove(id);
    fetchData();
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-primary-500 text-white';
      case 'COMPLETED': return 'bg-surface-3 text-gray-400';
      case 'PLANNING': return 'bg-accent-amber/15 text-accent-amber';
      case 'CANCELLED': return 'bg-accent-red/15 text-accent-red';
      default: return 'bg-surface-3 text-gray-400';
    }
  };

  const statusLabels: Record<string, string> = {
    ACTIVE: 'Ativa',
    COMPLETED: 'Concluida',
    PLANNING: 'Planejamento',
    CANCELLED: 'Cancelada',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={styles.pageTitle}>Calendario de Sprints</h1>
          <p className={styles.pageSubtitle}>Gerencie os ciclos de entrega do time</p>
        </div>
        <button onClick={() => setShowModal(true)} className={`${styles.btnPrimary} flex items-center gap-2`}>
          <Plus className="w-4 h-4" /> Nova Sprint
        </button>
      </div>

      {/* Sprint Grid */}
      <div className="space-y-3">
        {sprints.length === 0 ? (
          <div className={`${styles.glassCard} p-16 text-center`}>
            <CalendarRange className="w-10 h-10 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 mb-4">Nenhuma sprint cadastrada</p>
            <button onClick={() => setShowModal(true)} className={`${styles.btnPrimary} text-sm`}>
              Criar primeira sprint
            </button>
          </div>
        ) : (
          sprints.map((sprint: any) => (
            <div
              key={sprint.id}
              className={`${styles.glassCardHover} p-5 flex items-center justify-between ${sprint.status === 'ACTIVE' ? 'border-l-2 border-l-primary-500' : ''}`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold text-white text-base">{sprint.name}</h3>
                  <span className={`${styles.statusBadge} ${getStatusStyle(sprint.status)}`}>
                    {statusLabels[sprint.status] || sprint.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="font-mono">{formatDate(sprint.startDate)} — {formatDate(sprint.endDate)}</span>
                  <span>{sprint.team?.name}</span>
                  <span>{sprint._count?.tasks || 0} tarefas</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {sprint.status !== 'ACTIVE' && sprint.status !== 'COMPLETED' && (
                  <button
                    onClick={() => handleActivate(sprint.id)}
                    className="text-accent-green hover:bg-accent-green/[0.06] px-3 py-2 rounded-xl transition-all duration-200 text-xs font-medium flex items-center gap-1"
                  >
                    <Play className="w-3.5 h-3.5" /> Ativar
                  </button>
                )}
                {sprint.status === 'ACTIVE' && (
                  <button
                    onClick={() => handleArchive(sprint.id)}
                    className="text-accent-amber hover:bg-accent-amber/[0.06] px-3 py-2 rounded-xl transition-all duration-200 text-xs font-medium flex items-center gap-1"
                  >
                    <Archive className="w-3.5 h-3.5" /> Arquivar
                  </button>
                )}
                {sprint.status !== 'ACTIVE' && (
                  <button
                    onClick={() => handleDelete(sprint.id)}
                    className={`${styles.btnDanger} text-xs`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`${styles.glassCard} w-full max-w-md p-6`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Nova Sprint</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className={styles.label}>Nome</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={styles.inputField} placeholder="Ex: Sprint Marco - Semana 1" required />
              </div>
              <div>
                <label className={styles.label}>Time</label>
                <select value={form.teamId} onChange={(e) => setForm({ ...form, teamId: e.target.value })} className={styles.inputField} required>
                  <option value="">Selecione o time</option>
                  {teams.map((t: any) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={styles.label}>Inicio</label>
                  <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className={styles.inputField} required />
                </div>
                <div>
                  <label className={styles.label}>Fim</label>
                  <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className={styles.inputField} required />
                </div>
              </div>
              <div>
                <label className={styles.label}>Objetivo (opcional)</label>
                <input type="text" value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })} className={styles.inputField} placeholder="Objetivo principal da sprint" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className={`${styles.btnGhost} flex-1`}>Cancelar</button>
                <button type="submit" className={`${styles.btnPrimary} flex-1`}>Criar Sprint</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
