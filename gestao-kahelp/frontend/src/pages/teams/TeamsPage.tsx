import { useEffect, useState } from 'react';
import { Users, Plus, UserPlus, UserMinus, Trash2, X } from 'lucide-react';
import { teamsApi, usersApi } from '../../services/api';

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
        <div className="w-8 h-8 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Equipe</h1>
          <p className="text-gray-500 text-sm mt-1">Gerencie times e membros</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-primary-600 hover:bg-primary-500 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-lg shadow-primary-600/25 hover:shadow-primary-500/40 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Novo Time
        </button>
      </div>

      <div className="space-y-3">
        {teams.length === 0 ? (
          <div className="bg-surface-card/80 backdrop-blur-xl border border-white/5 rounded-2xl shadow-lg p-16 text-center">
            <Users className="w-10 h-10 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500">Nenhum time cadastrado</p>
          </div>
        ) : (
          teams.map((team: any) => (
            <div key={team.id} className="bg-surface-card/80 backdrop-blur-xl border border-white/5 rounded-2xl shadow-lg hover:border-primary-500/30 hover:shadow-primary-500/5 transition-all duration-300 overflow-hidden">
              <div className="p-5 flex items-center justify-between cursor-pointer" onClick={() => toggleExpand(team)}>
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-primary-500/20">
                    {team.name?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{team.name}</h3>
                    <p className="text-xs text-gray-500">{team._count?.members || 0} membros &middot; {team._count?.sprints || 0} sprints</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowMemberModal(team.id); }}
                    className="text-gray-400 hover:text-white hover:bg-surface-hover px-4 py-2 rounded-xl transition-all duration-200 text-sm font-medium text-xs flex items-center gap-1"
                  >
                    <UserPlus className="w-3 h-3" /> Membro
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(team.id); }}
                    className="text-gray-400 hover:text-white hover:bg-surface-hover px-4 py-2 rounded-xl transition-all duration-200 text-sm font-medium text-xs text-accent-red hover:bg-accent-red/10"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {expandedTeam?.id === team.id && (
                <div className="border-t border-white/5 p-5 bg-surface-3/20">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Membros</h4>
                  {expandedTeam.members?.length === 0 ? (
                    <p className="text-xs text-gray-500">Nenhum membro adicionado</p>
                  ) : (
                    <div className="space-y-2">
                      {expandedTeam.members?.map((m: any) => (
                        <div key={m.id} className="flex items-center justify-between bg-surface-3/50 px-4 py-2.5 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 bg-primary-500/20 rounded-lg flex items-center justify-center text-primary-400 text-xs font-bold">
                              {m.user?.name?.charAt(0)}
                            </div>
                            <span className="text-sm text-white">{m.user?.name}</span>
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-surface-3 text-gray-400">{m.role}</span>
                          </div>
                          <button
                            onClick={() => handleRemoveMember(team.id, m.userId)}
                            className="text-accent-red hover:text-red-300"
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
          <div className="bg-surface-card/80 backdrop-blur-xl border border-white/5 rounded-2xl shadow-lg w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Novo Time</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Nome</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-surface-3 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Descrição</label>
                <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full bg-surface-3 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white hover:bg-surface-hover px-4 py-2 rounded-xl transition-all duration-200 text-sm font-medium flex-1">Cancelar</button>
                <button type="submit" className="bg-primary-600 hover:bg-primary-500 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-lg shadow-primary-600/25 hover:shadow-primary-500/40 flex-1">Criar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showMemberModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-card/80 backdrop-blur-xl border border-white/5 rounded-2xl shadow-lg w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Adicionar Membro</h3>
              <button onClick={() => setShowMemberModal(null)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <select value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)} className="w-full bg-surface-3 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all">
                <option value="">Selecione um colaborador</option>
                {users.map((u: any) => (
                  <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                ))}
              </select>
              <div className="flex gap-3">
                <button onClick={() => setShowMemberModal(null)} className="text-gray-400 hover:text-white hover:bg-surface-hover px-4 py-2 rounded-xl transition-all duration-200 text-sm font-medium flex-1">Cancelar</button>
                <button onClick={handleAddMember} disabled={!selectedUserId} className="bg-primary-600 hover:bg-primary-500 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-lg shadow-primary-600/25 hover:shadow-primary-500/40 flex-1 disabled:opacity-50">Adicionar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
