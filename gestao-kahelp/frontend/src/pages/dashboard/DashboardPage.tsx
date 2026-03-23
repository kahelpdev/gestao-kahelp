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
      // API not available yet - use empty state
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
        <div className="w-8 h-8 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Monitor de Execução</h1>
          <p className="text-gray-500 text-sm mt-1">
            {data?.activeSprint
              ? <span>Sprint ativa: <span className="text-primary-400 font-semibold">{data.activeSprint.name}</span></span>
              : 'Nenhuma sprint ativa'}
          </p>
        </div>
        <button onClick={fetchData} className="text-gray-400 hover:text-white hover:bg-surface-hover px-4 py-2 rounded-xl transition-all duration-200 text-sm font-medium flex items-center gap-2">
          <RefreshCw className="w-4 h-4" /> Atualizar
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface-card/80 backdrop-blur-xl border border-white/5 rounded-2xl shadow-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Em Execução</span>
            <Activity className="w-5 h-5 text-primary-400" />
          </div>
          <p className="text-3xl font-bold text-white">{data?.summary.totalExecuting || 0}</p>
          <p className="text-xs text-gray-500 mt-1">tarefas ativas agora</p>
        </div>

        <div className="bg-surface-card/80 backdrop-blur-xl border border-white/5 rounded-2xl shadow-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Programadas</span>
            <CheckCircle2 className="w-5 h-5 text-accent-green" />
          </div>
          <p className="text-3xl font-bold text-accent-green">{data?.summary.plannedCount || 0}</p>
          <p className="text-xs text-gray-500 mt-1">dentro da sprint ativa</p>
        </div>

        <div className="bg-surface-card/80 backdrop-blur-xl border border-white/5 rounded-2xl shadow-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Desvios</span>
            <AlertTriangle className="w-5 h-5 text-accent-red" />
          </div>
          <p className="text-3xl font-bold text-accent-red">{data?.summary.deviationCount || 0}</p>
          <p className="text-xs text-gray-500 mt-1">fora da sprint ativa</p>
        </div>
      </div>

      {/* Deviation Alert */}
      {data?.hasDeviations && (
        <div className="bg-accent-red/10 border border-accent-red/30 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-10 h-10 bg-accent-red/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-accent-red animate-pulse" />
          </div>
          <div>
            <p className="font-bold text-accent-red">Desvio de Foco Detectado</p>
            <p className="text-sm text-gray-400">
              {data.summary.deviationCount} colaborador(es) executando tarefas fora da sprint ativa.
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-surface-card/80 backdrop-blur-xl border border-white/5 rounded-2xl shadow-lg p-4 flex flex-wrap gap-4 items-end">
        <div className="flex items-center gap-2 text-gray-400">
          <Filter className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">Filtros</span>
        </div>
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
        <select
          value={filters.assignedToId}
          onChange={(e) => setFilters({ ...filters, assignedToId: e.target.value })}
          className="w-full bg-surface-3 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all max-w-[220px]"
        >
          <option value="">Todos os Colaboradores</option>
          {members.map((m: any) => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
        {(filters.projectId || filters.assignedToId) && (
          <button onClick={clearFilters} className="text-gray-400 hover:text-white hover:bg-surface-hover px-4 py-2 rounded-xl transition-all duration-200 text-sm font-medium flex items-center gap-1 text-xs">
            <X className="w-3 h-3" /> Limpar
          </button>
        )}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Planned Tasks */}
        <div className="lg:col-span-2 space-y-3">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 px-1">
            <div className="w-2 h-2 rounded-full animate-pulse bg-accent-green" />
            Execução Planejada
          </h2>
          {data?.planned.length === 0 ? (
            <div className="bg-surface-card/80 backdrop-blur-xl border border-white/5 rounded-2xl shadow-lg p-16 text-center">
              <Clock className="w-10 h-10 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Nenhuma tarefa em execução no momento</p>
            </div>
          ) : (
            data?.planned.map((task: any) => (
              <div key={task.id} className="bg-surface-card/80 backdrop-blur-xl border border-white/5 rounded-2xl shadow-lg hover:border-primary-500/30 hover:shadow-primary-500/5 transition-all duration-300 p-5 flex items-center justify-between border-l-4 border-l-primary-500">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-primary-500/20 text-primary-400">{task.project?.name || 'Sem projeto'}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-accent-green/20 text-accent-green">Programado</span>
                  </div>
                  <h4 className="font-bold text-white text-base">{task.title}</h4>
                  <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1">
                    <span className="w-5 h-5 bg-surface-3 rounded-md flex items-center justify-center text-[9px] font-bold text-primary-400">
                      {task.assignedTo?.name?.charAt(0)}
                    </span>
                    {task.assignedTo?.name}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-mono font-bold text-white">{task.estimatedHours || 0}h</span>
                  <div className="flex items-center gap-1 justify-end mt-1">
                    <div className="w-2 h-2 rounded-full animate-pulse bg-accent-green" />
                    <span className="text-[9px] font-bold text-accent-green uppercase">Online</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Deviations */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-accent-red uppercase tracking-wider flex items-center gap-2 px-1">
            <AlertTriangle className="w-4 h-4" />
            Alertas de Desvio
          </h2>
          {data?.deviations.length === 0 ? (
            <div className="bg-surface-card/80 backdrop-blur-xl border border-white/5 rounded-2xl shadow-lg p-10 text-center">
              <CheckCircle2 className="w-8 h-8 text-accent-green mx-auto mb-2" />
              <p className="text-sm text-gray-500">Tudo conforme o planejado</p>
            </div>
          ) : (
            data?.deviations.map((task: any) => (
              <div key={task.id} className="bg-surface-card/80 backdrop-blur-xl border border-white/5 rounded-2xl shadow-lg p-4 border border-accent-red/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-accent-red text-white">Desvio</span>
                </div>
                <h4 className="text-sm font-bold text-white mb-3">{task.title}</h4>
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
