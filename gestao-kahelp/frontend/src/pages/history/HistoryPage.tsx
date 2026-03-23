import { useEffect, useState } from 'react';
import { History, Clock, CheckCircle2 } from 'lucide-react';
import { historyApi, sprintsApi, projectsApi } from '../../services/api';

export default function HistoryPage() {
  const [data, setData] = useState<any[]>([]);
  const [sprints, setSprints] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [filters, setFilters] = useState({ sprintId: '', projectId: '' });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [historyRes, sprintsRes, projectsRes] = await Promise.all([
        historyApi.allocation(filters.sprintId || filters.projectId ? filters : undefined),
        sprintsApi.list(),
        projectsApi.list(),
      ]);
      setData(historyRes.data);
      setSprints(sprintsRes.data);
      setProjects(projectsRes.data);
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [filters.sprintId, filters.projectId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Relatório de Alocação</h1>
        <p className="text-gray-500 text-sm mt-1">Histórico detalhado de demandas por colaborador</p>
      </div>

      {/* Filters */}
      <div className="bg-surface-card/80 backdrop-blur-xl border border-white/5 rounded-2xl shadow-lg p-4 flex flex-wrap gap-4">
        <select
          value={filters.sprintId}
          onChange={(e) => setFilters({ ...filters, sprintId: e.target.value })}
          className="w-full bg-surface-3 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all max-w-[220px]"
        >
          <option value="">Todas as Sprints</option>
          {sprints.map((s: any) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
        <select
          value={filters.projectId}
          onChange={(e) => setFilters({ ...filters, projectId: e.target.value })}
          className="w-full bg-surface-3 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all max-w-[220px]"
        >
          <option value="">Todos os Projetos</option>
          {projects.map((p: any) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.length === 0 ? (
          <div className="bg-surface-card/80 backdrop-blur-xl border border-white/5 rounded-2xl shadow-lg p-16 text-center col-span-full">
            <History className="w-10 h-10 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500">Nenhum dado de alocação encontrado</p>
          </div>
        ) : (
          data.map((member: any) => (
            <div key={member.user.id} className="bg-surface-card/80 backdrop-blur-xl border border-white/5 rounded-2xl shadow-lg p-5">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary-500/20">
                  {member.user.name?.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white text-lg">{member.user.name}</h3>
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">
                    {member.summary.totalTasks} tarefas
                  </p>
                </div>
              </div>

              {/* Mini stats */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                <div className="bg-surface-3/50 rounded-lg p-2 text-center">
                  <p className="text-xs text-gray-500">A fazer</p>
                  <p className="text-sm font-bold text-white">{member.summary.byStatus.todo}</p>
                </div>
                <div className="bg-surface-3/50 rounded-lg p-2 text-center">
                  <p className="text-xs text-gray-500">Fazendo</p>
                  <p className="text-sm font-bold text-accent-amber">{member.summary.byStatus.inProgress}</p>
                </div>
                <div className="bg-surface-3/50 rounded-lg p-2 text-center">
                  <p className="text-xs text-gray-500">Revisão</p>
                  <p className="text-sm font-bold text-accent-cyan">{member.summary.byStatus.review}</p>
                </div>
                <div className="bg-surface-3/50 rounded-lg p-2 text-center">
                  <p className="text-xs text-gray-500">Feito</p>
                  <p className="text-sm font-bold text-accent-green">{member.summary.byStatus.done}</p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex gap-4 mb-4 text-xs">
                <div className="flex items-center gap-1.5 text-gray-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Estimado: <b className="text-white">{member.summary.totalEstimatedHours}h</b></span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Gasto: <b className="text-white">{member.summary.totalTimeSpent}h</b></span>
                </div>
              </div>

              {/* Task list */}
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {member.tasks.map((task: any) => (
                  <div key={task.id} className="flex items-center justify-between bg-surface-3/30 px-3 py-2 rounded-lg">
                    <span className="text-xs font-semibold text-gray-300 truncate max-w-[60%]">{task.title}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-primary-500/20 text-primary-400">
                      {task.sprint?.name || 'Backlog'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
