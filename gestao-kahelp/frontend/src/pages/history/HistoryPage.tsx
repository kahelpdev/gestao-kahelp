import { useEffect, useState } from 'react';
import { History, Clock, CheckCircle2 } from 'lucide-react';
import { historyApi, sprintsApi, projectsApi } from '../../services/api';
import { styles } from '../../styles';

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
        <div className="w-8 h-8 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className={styles.pageTitle}>Relatorio de Alocacao</h1>
        <p className={styles.pageSubtitle}>Historico detalhado de demandas por colaborador</p>
      </div>

      {/* Filters */}
      <div className={`${styles.glassCard} p-4 flex flex-wrap gap-4`}>
        <select
          value={filters.sprintId}
          onChange={(e) => setFilters({ ...filters, sprintId: e.target.value })}
          className={`${styles.inputField} max-w-[220px]`}
        >
          <option value="">Todas as Sprints</option>
          {sprints.map((s: any) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
        <select
          value={filters.projectId}
          onChange={(e) => setFilters({ ...filters, projectId: e.target.value })}
          className={`${styles.inputField} max-w-[220px]`}
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
          <div className={`${styles.glassCard} p-16 text-center col-span-full`}>
            <History className="w-10 h-10 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500">Nenhum dado de alocacao encontrado</p>
          </div>
        ) : (
          data.map((member: any) => (
            <div key={member.user.id} className={`${styles.glassCard} p-5`}>
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md shadow-primary-600/15">
                  {member.user.name?.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white text-lg">{member.user.name}</h3>
                  <p className="text-[10px] text-gray-500 uppercase font-medium tracking-widest">
                    {member.summary.totalTasks} tarefas
                  </p>
                </div>
              </div>

              {/* Mini stats */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                {[
                  { label: 'A fazer', value: member.summary.byStatus.todo, color: 'text-white' },
                  { label: 'Fazendo', value: member.summary.byStatus.inProgress, color: 'text-accent-amber' },
                  { label: 'Revisao', value: member.summary.byStatus.review, color: 'text-accent-cyan' },
                  { label: 'Feito', value: member.summary.byStatus.done, color: 'text-accent-green' },
                ].map((stat) => (
                  <div key={stat.label} className="bg-surface-3/30 rounded-lg p-2 text-center">
                    <p className="text-[10px] text-gray-500 mb-0.5">{stat.label}</p>
                    <p className={`text-sm font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                ))}
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
              <div className="space-y-1.5 max-h-[200px] overflow-y-auto">
                {member.tasks.map((task: any) => (
                  <div key={task.id} className="flex items-center justify-between bg-surface-3/20 px-3 py-2 rounded-lg">
                    <span className="text-xs font-medium text-gray-300 truncate max-w-[60%]">{task.title}</span>
                    <span className={`${styles.statusBadge} bg-primary-500/10 text-primary-400`}>
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
