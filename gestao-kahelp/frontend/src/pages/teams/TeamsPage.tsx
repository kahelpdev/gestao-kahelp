import { useEffect, useState } from 'react';
import { Users, Plus, UserPlus, UserMinus, Trash2, X } from 'lucide-react';
import { teamsApi, usersApi } from '../../services/api';
import { styles } from '../../styles';

export default function TeamsPage() {
  const [teams, setTeams] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', description: '' });
  const [selectedUserId, setSelectedUserId] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedTeam, setExpandedTeam] = useState<any>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [teamsRes, usersRes] = await Promise.all([teamsApi.list(), usersApi.list()]);
      setTeams(teamsRes.data);
      setUsers(usersRes.data);
    } catch {
      setTeams([]);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await teamsApi.create(form);
    setShowModal(false);
    setForm({ name: '', description: '' });
    fetchData();
  };

  const handleAddMember = async () => {
    if (!showMemberModal || !selectedUserId) return;
    await teamsApi.addMember(showMemberModal, { userId: selectedUserId });
    setShowMemberModal(null);
    setSelectedUserId('');
    fetchData();
    if (expandedTeam) {
      const res = await teamsApi.get(expandedTeam.id);
      setExpandedTeam(res.data);
    }
  };

  const handleRemoveMember = async (teamId: string, userId: string) => {
    await teamsApi.removeMember(teamId, userId);
    fetchData();
    if (expandedTeam) {
      const res = await teamsApi.get(expandedTeam.id);
      setExpandedTeam(res.data);
    }
  };

  const toggleExpand = async (team: any) => {
    if (expandedTeam?.id === team.id) {
      setExpandedTeam(null);
    } else {
      const res = await teamsApi.get(team.id);
      setExpandedTeam(res.data);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este time?')) return;
    await teamsApi.remove(id);
    fetchData();
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
          <h1 className={styles.pageTitle}>Equipe</h1>
          <p className={styles.pageSubtitle}>Gerencie times e membros</p>
        </div>
        <button onClick={() => setShowModal(true)} className={`${styles.btnPrimary} flex items-center gap-2`}>
          <Plus className="w-4 h-4" /> Novo Time
        </button>
      </div>

      <div className="space-y-3">
        {teams.length === 0 ? (
          <div className={`${styles.glassCard} p-16 text-center`}>
            <img src="/assets/empty-team.svg" alt="" className="w-32 h-24 mx-auto mb-4 opacity-50" />
            <p className="text-gray-500">Nenhum time cadastrado</p>
          </div>
        ) : (
          teams.map((team: any) => (
            <div key={team.id} className={`${styles.glassCardHover} overflow-hidden`}>
              <div className="p-5 flex items-center justify-between cursor-pointer" onClick={() => toggleExpand(team)}>
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md shadow-primary-600/15">
                    {team.name?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{team.name}</h3>
                    <p className="text-xs text-gray-500">{team._count?.members || 0} membros &middot; {team._count?.sprints || 0} sprints</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowMemberModal(team.id); }}
                    className={`${styles.btnGhost} text-xs flex items-center gap-1`}
                  >
                    <UserPlus className="w-3 h-3" /> Membro
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(team.id); }}
                    className={`${styles.btnDanger} text-xs`}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {expandedTeam?.id === team.id && (
                <div className="border-t border-white/[0.04] p-5 bg-surface-3/10">
                  <h4 className={`${styles.label} mb-3`}>Membros</h4>
                  {expandedTeam.members?.length === 0 ? (
                    <p className="text-xs text-gray-500">Nenhum membro adicionado</p>
                  ) : (
                    <div className="space-y-2">
                      {expandedTeam.members?.map((m: any) => (
                        <div key={m.id} className="flex items-center justify-between bg-surface-3/30 px-4 py-2.5 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 bg-primary-500/15 rounded-lg flex items-center justify-center text-primary-400 text-xs font-bold">
                              {m.user?.name?.charAt(0)}
                            </div>
                            <span className="text-sm text-white">{m.user?.name}</span>
                            <span className={`${styles.statusBadge} bg-surface-3 text-gray-400`}>{m.role}</span>
                          </div>
                          <button
                            onClick={() => handleRemoveMember(team.id, m.userId)}
                            className="text-accent-red/60 hover:text-accent-red transition-colors"
                          >
                            <UserMinus className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Create Team Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`${styles.glassCard} w-full max-w-md p-6`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Novo Time</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className={styles.label}>Nome</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={styles.inputField} required />
              </div>
              <div>
                <label className={styles.label}>Descricao</label>
                <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={styles.inputField} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className={`${styles.btnGhost} flex-1`}>Cancelar</button>
                <button type="submit" className={`${styles.btnPrimary} flex-1`}>Criar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showMemberModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`${styles.glassCard} w-full max-w-md p-6`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Adicionar Membro</h3>
              <button onClick={() => setShowMemberModal(null)} className="text-gray-400 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <select value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)} className={styles.inputField}>
                <option value="">Selecione um colaborador</option>
                {users.map((u: any) => (
                  <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                ))}
              </select>
              <div className="flex gap-3">
                <button onClick={() => setShowMemberModal(null)} className={`${styles.btnGhost} flex-1`}>Cancelar</button>
                <button onClick={handleAddMember} disabled={!selectedUserId} className={`${styles.btnPrimary} flex-1 disabled:opacity-50`}>Adicionar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
