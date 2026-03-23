import { useEffect, useState } from 'react';
import { FolderKanban, Plus, Pencil, Trash2, X } from 'lucide-react';
import { projectsApi } from '../../services/api';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', description: '', color: '#6366f1' });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await projectsApi.list();
      setProjects(res.data);
    } catch {
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await projectsApi.update(editingId, form);
    } else {
      await projectsApi.create(form);
    }
    setShowModal(false);
    setEditingId(null);
    setForm({ name: '', description: '', color: '#6366f1' });
    fetchData();
  };

  const openEdit = (project: any) => {
    setForm({ name: project.name, description: project.description || '', color: project.color || '#6366f1' });
    setEditingId(project.id);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este projeto?')) return;
    await projectsApi.remove(id);
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
          <h1 className="text-2xl font-bold text-white">Projetos</h1>
          <p className="text-gray-500 text-sm mt-1">Gerencie os projetos da organização</p>
        </div>
        <button onClick={() => { setEditingId(null); setForm({ name: '', description: '', color: '#6366f1' }); setShowModal(true); }} className="bg-primary-600 hover:bg-primary-500 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-lg shadow-primary-600/25 hover:shadow-primary-500/40 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Novo Projeto
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.length === 0 ? (
          <div className="bg-surface-card/80 backdrop-blur-xl border border-white/5 rounded-2xl shadow-lg p-16 text-center col-span-full">
            <FolderKanban className="w-10 h-10 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500">Nenhum projeto cadastrado</p>
          </div>
        ) : (
          projects.map((project: any) => (
            <div key={project.id} className="bg-surface-card/80 backdrop-blur-xl border border-white/5 rounded-2xl shadow-lg hover:border-primary-500/30 hover:shadow-primary-500/5 transition-all duration-300 p-5 group">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-lg"
                  style={{ backgroundColor: project.color || '#6366f1' }}
                >
                  {project.name?.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white">{project.name}</h3>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                    {project._count?.tasks || 0} tarefas
                  </p>
                </div>
              </div>
              {project.description && (
                <p className="text-xs text-gray-400 mb-4 line-clamp-2">{project.description}</p>
              )}
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(project)} className="text-gray-400 hover:text-white hover:bg-surface-hover px-4 py-2 rounded-xl transition-all duration-200 text-sm font-medium text-xs flex items-center gap-1">
                  <Pencil className="w-3 h-3" /> Editar
                </button>
                <button onClick={() => handleDelete(project.id)} className="text-gray-400 hover:text-white hover:bg-surface-hover px-4 py-2 rounded-xl transition-all duration-200 text-sm font-medium text-xs text-accent-red hover:bg-accent-red/10 flex items-center gap-1">
                  <Trash2 className="w-3 h-3" /> Excluir
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-card/80 backdrop-blur-xl border border-white/5 rounded-2xl shadow-lg w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">{editingId ? 'Editar Projeto' : 'Novo Projeto'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Nome</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-surface-3 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all"
                  placeholder="Ex: Delphi 3.0"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Descrição</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-surface-3 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all"
                  placeholder="Descrição do projeto"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Cor</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                    className="w-10 h-10 rounded-lg cursor-pointer border-0"
                  />
                  <span className="text-sm text-gray-400 font-mono">{form.color}</span>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white hover:bg-surface-hover px-4 py-2 rounded-xl transition-all duration-200 text-sm font-medium flex-1">
                  Cancelar
                </button>
                <button type="submit" className="bg-primary-600 hover:bg-primary-500 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-lg shadow-primary-600/25 hover:shadow-primary-500/40 flex-1">
                  {editingId ? 'Salvar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
