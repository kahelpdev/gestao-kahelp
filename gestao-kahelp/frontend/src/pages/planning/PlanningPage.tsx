import { useEffect, useState } from 'react';
import { ArrowRight, ArrowLeft, Inbox, Target } from 'lucide-react';
import { tasksApi, sprintsApi } from '../../services/api';
import { styles } from '../../styles';

export default function PlanningPage() {
  const [sprints, setSprints] = useState<any[]>([]);
  const [selectedSprintId, setSelectedSprintId] = useState('');
  const [backlog, setBacklog] = useState<any[]>([]);
  const [sprintTasks, setSprintTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sprintsRes, backlogRes] = await Promise.all([
        sprintsApi.list(),
        tasksApi.list({ backlog: 'true' }),
      ]);
      setSprints(sprintsRes.data);
      setBacklog(backlogRes.data);

      const activeSprint = sprintsRes.data.find((s: any) => s.status === 'ACTIVE');
      const sprintId = selectedSprintId || activeSprint?.id || sprintsRes.data[0]?.id || '';
      setSelectedSprintId(sprintId);

      if (sprintId) {
        const tasksRes = await tasksApi.list({ sprintId });
        setSprintTasks(tasksRes.data);
      }
    } catch {
      setSprints([]);
      setBacklog([]);
      setSprintTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSprintChange = async (sprintId: string) => {
    setSelectedSprintId(sprintId);
    if (sprintId) {
      const res = await tasksApi.list({ sprintId });
      setSprintTasks(res.data);
    }
  };

  const moveToSprint = async (taskId: string) => {
    if (!selectedSprintId) return;
    await tasksApi.assignToSprint(taskId, selectedSprintId);
    fetchData();
  };

  const moveToBacklog = async (taskId: string) => {
    await tasksApi.removeFromSprint(taskId);
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
      {/* Header */}
      <div className={`${styles.glassCard} bg-gradient-to-r from-primary-600/[0.08] to-transparent p-6 flex flex-col md:flex-row justify-between items-center gap-4`}>
        <div>
          <h1 className={styles.pageTitle}>Montar Sprint</h1>
          <p className="text-gray-400 text-sm mt-1">Mova itens do backlog para a sprint selecionada</p>
        </div>
        <div className="flex items-center gap-3 bg-surface-3/50 px-4 py-2 rounded-xl border border-white/[0.06]">
          <label className={`${styles.label} mb-0 whitespace-nowrap`}>Destino:</label>
          <select
            value={selectedSprintId}
            onChange={(e) => handleSprintChange(e.target.value)}
            className="bg-surface-3 text-white rounded-lg text-sm font-semibold px-3 py-2 border border-white/[0.08] focus:outline-none focus:ring-2 focus:ring-primary-500/40 min-w-[180px]"
          >
            {sprints.map((s: any) => (
              <option key={s.id} value={s.id}>
                {s.name} {s.status === 'ACTIVE' ? '(Ativa)' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Backlog */}
        <div className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <h3 className={styles.sectionTitle}>
              <Inbox className="w-4 h-4" /> Backlog (Sem Sprint)
            </h3>
            <span className={`${styles.statusBadge} bg-surface-3 text-gray-400`}>{backlog.length} itens</span>
          </div>
          <div className="space-y-2 min-h-[300px]">
            {backlog.length === 0 ? (
              <div className={`${styles.glassCard} p-16 text-center`}>
                <img src="/assets/empty-tasks.svg" alt="" className="w-28 h-24 mx-auto mb-3 opacity-50" />
                <p className="text-gray-500 text-sm">Backlog vazio</p>
              </div>
            ) : (
              backlog.map((task: any) => (
                <div key={task.id} className={`${styles.glassCardHover} p-4 flex items-center justify-between group`}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`${styles.statusBadge} bg-primary-500/10 text-primary-400`}>{task.project?.name || 'Sem projeto'}</span>
                    </div>
                    <h4 className="text-sm font-semibold text-white truncate">{task.title}</h4>
                    <p className="text-[11px] text-gray-500 mt-1 flex items-center gap-3">
                      <span>{task.assignedTo?.name || 'Sem responsavel'}</span>
                      <span className="font-semibold text-gray-400">{task.estimatedHours || 0}h</span>
                    </p>
                  </div>
                  <button
                    onClick={() => moveToSprint(task.id)}
                    className="w-9 h-9 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 flex items-center justify-center transition-all opacity-40 group-hover:opacity-100 shadow-lg shadow-primary-600/20 active:scale-95"
                  >
                    <ArrowRight className="w-4 h-4 text-white" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sprint items */}
        <div className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <h3 className={`${styles.sectionTitle} text-primary-400`}>
              <Target className="w-4 h-4" /> Planejado na Sprint
            </h3>
            <span className={`${styles.statusBadge} bg-primary-500/10 text-primary-400`}>{sprintTasks.length} itens</span>
          </div>
          <div className="space-y-2 min-h-[300px]">
            {sprintTasks.length === 0 ? (
              <div className={`${styles.glassCard} p-16 text-center border-2 border-dashed border-primary-500/10`}>
                <Target className="w-8 h-8 text-primary-500/20 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">Nenhum item nesta sprint</p>
              </div>
            ) : (
              sprintTasks.map((task: any) => (
                <div key={task.id} className={`${styles.glassCardHover} p-4 flex items-center justify-between group border-l-2 border-l-primary-500`}>
                  <button
                    onClick={() => moveToBacklog(task.id)}
                    className="w-9 h-9 rounded-xl bg-accent-red/80 hover:bg-accent-red flex items-center justify-center transition-all opacity-40 group-hover:opacity-100 shadow-lg mr-3 active:scale-95"
                  >
                    <ArrowLeft className="w-4 h-4 text-white" />
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`${styles.statusBadge} bg-primary-500/10 text-primary-400`}>{task.project?.name || 'Sem projeto'}</span>
                    </div>
                    <h4 className="text-sm font-semibold text-white truncate">{task.title}</h4>
                    <p className="text-[11px] text-gray-500 mt-1 flex items-center gap-3">
                      <span>{task.assignedTo?.name || 'Sem responsavel'}</span>
                      <span className="font-semibold text-gray-400">{task.estimatedHours || 0}h</span>
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
