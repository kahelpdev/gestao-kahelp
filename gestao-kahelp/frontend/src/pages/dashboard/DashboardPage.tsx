import { useEffect, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Filter,
  RefreshCw,
  X,
} from 'lucide-react';
import { dashboardApi, projectsApi, usersApi } from '../../services/api';
import { styles } from '../../styles';

interface MonitorData {
  activeSprint: { id: string; name: string; startDate: string; endDate: string } | null;
  planned: any[];
  deviations: any[];
  hasDeviations: boolean;
  summary: { totalExecuting: number; plannedCount: number; deviationCount: number };
}

export default function DashboardPage() {
  const [data, setData] = useState<MonitorData | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [filters, setFilters] = useState({ projectId: '', assignedToId: '' });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [monitorRes, projectsRes, usersRes] = await Promise.all([
        dashboardApi.monitor(filters.projectId || filters.assignedToId ? filters : undefined),
        projectsApi.list(),
        usersApi.list(),
      ]);
      setData(monitorRes.data);
      setProjects(projectsRes.data);
      setMembers(usersRes.data);
    } catch {
      setData({ activeSprint: null, planned: [], deviations: [], hasDeviations: false, summary: { totalExecuting: 0, plannedCount: 0, deviationCount: 0 } });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [filters.projectId, filters.assignedToId]);

  const clearFilters = () => setFilters({ projectId: '', assignedToId: '' });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={styles.pageTitle}>Monitor de Execucao</h1>
          <p className={styles.pageSubtitle}>
            {data?.activeSprint
              ? <span>Sprint ativa: <span className="text-primary-400 font-semibold">{data.activeSprint.name}</span></span>
              : 'Nenhuma sprint ativa'}
          </p>
        </div>
        <button onClick={fetchData} className={`${styles.btnGhost} flex items-center gap-2`}>
          <RefreshCw className="w-4 h-4" /> Atualizar
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Em Execucao', value: data?.summary.totalExecuting || 0, sub: 'tarefas ativas agora', icon: Activity, color: 'text-primary-400', accent: 'from-primary-600/10 to-transparent' },
          { label: 'Programadas', value: data?.summary.plannedCount || 0, sub: 'dentro da sprint ativa', icon: CheckCircle2, color: 'text-accent-green', accent: 'from-accent-green/10 to-transparent' },
          { label: 'Desvios', value: data?.summary.deviationCount || 0, sub: 'fora da sprint ativa', icon: AlertTriangle, color: 'text-accent-red', accent: 'from-accent-red/10 to-transparent' },
        ].map((kpi) => (
          <div key={kpi.label} className={`${styles.glassCard} p-5 relative overflow-hidden`}>
            <div className={`absolute inset-0 bg-gradient-to-br ${kpi.accent} pointer-events-none`} />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">{kpi.label}</span>
                <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
              </div>
              <p className={`text-3xl font-bold ${kpi.color === 'text-primary-400' ? 'text-white' : kpi.color}`}>{kpi.value}</p>
              <p className="text-xs text-gray-500 mt-1">{kpi.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Deviation Alert */}
      {data?.hasDeviations && (
        <div className="bg-accent-red/[0.06] border border-accent-red/20 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-10 h-10 bg-accent-red/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-accent-red animate-pulse" />
          </div>
          <div>
            <p className="font-bold text-accent-red text-sm">Desvio de Foco Detectado</p>
            <p className="text-sm text-gray-400">
              {data.summary.deviationCount} colaborador(es) executando tarefas fora da sprint ativa.
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className={`${styles.glassCard} p-4 flex flex-wrap gap-4 items-end`}>
        <div className="flex items-center gap-2 text-gray-400">
          <Filter className="w-4 h-4" />
          <span className="text-[11px] font-semibold uppercase tracking-wider">Filtros</span>
        </div>
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
        <select
          value={filters.assignedToId}
          onChange={(e) => setFilters({ ...filters, assignedToId: e.target.value })}
          className={`${styles.inputField} max-w-[220px]`}
        >
          <option value="">Todos os Colaboradores</option>
          {members.map((m: any) => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
        {(filters.projectId || filters.assignedToId) && (
          <button onClick={clearFilters} className={`${styles.btnGhost} flex items-center gap-1 text-xs`}>
            <X className="w-3 h-3" /> Limpar
          </button>
        )}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Planned Tasks */}
        <div className="lg:col-span-2 space-y-3">
          <h2 className={`${styles.sectionTitle} text-accent-green`}>
            <div className={`${styles.glowDot} bg-accent-green`} />
            Execucao Planejada
          </h2>
          {data?.planned.length === 0 ? (
            <div className={`${styles.glassCard} p-16 text-center`}>
              <img src="/assets/empty-tasks.svg" alt="" className="w-32 h-28 mx-auto mb-4 opacity-60" />
              <p className="text-gray-500 text-sm">Nenhuma tarefa em execucao no momento</p>
            </div>
          ) : (
            data?.planned.map((task: any) => (
              <div key={task.id} className={`${styles.glassCardHover} p-5 flex items-center justify-between border-l-2 border-l-primary-500`}>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`${styles.statusBadge} bg-primary-500/10 text-primary-400`}>{task.project?.name || 'Sem projeto'}</span>
                    <span className={`${styles.statusBadge} bg-accent-green/10 text-accent-green`}>Programado</span>
                  </div>
                  <h4 className="font-semibold text-white text-[15px]">{task.title}</h4>
                  <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1.5">
                    <span className="w-5 h-5 bg-surface-3 rounded-md flex items-center justify-center text-[9px] font-bold text-primary-400">
                      {task.assignedTo?.name?.charAt(0)}
                    </span>
                    {task.assignedTo?.name}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-mono font-bold text-white">{task.estimatedHours || 0}h</span>
                  <div className="flex items-center gap-1 justify-end mt-1">
                    <div className={`${styles.glowDot} bg-accent-green`} />
                    <span className="text-[9px] font-semibold text-accent-green uppercase">Online</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Deviations */}
        <div className="space-y-3">
          <h2 className={`${styles.sectionTitle} text-accent-red`}>
            <AlertTriangle className="w-4 h-4" />
            Alertas de Desvio
          </h2>
          {data?.deviations.length === 0 ? (
            <div className={`${styles.glassCard} p-10 text-center`}>
              <CheckCircle2 className="w-8 h-8 text-accent-green/40 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Tudo conforme o planejado</p>
            </div>
          ) : (
            data?.deviations.map((task: any) => (
              <div key={task.id} className={`${styles.glassCard} p-4 border-accent-red/15`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`${styles.statusBadge} bg-accent-red text-white`}>Desvio</span>
                </div>
                <h4 className="text-sm font-semibold text-white mb-3">{task.title}</h4>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-gray-400">
                    <span>Colaborador</span>
                    <span className="font-semibold text-white">{task.assignedTo?.name}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Sprint atual</span>
                    <span className="font-semibold text-accent-red">{task.sprint?.name || 'Backlog'}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
