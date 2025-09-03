import { useEffect, useState } from 'react';
import { container } from '../../di/container';
import { TodoPriority } from '../../domain/entities/Todo';

interface Stats {
  total: number;
  completed: number;
  pending: number;
  byPriority: Record<TodoPriority, number>;
  byCategory: Record<string, number>;
}

export default function StatsCard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await container.getTodoStats.execute();
      if (response.success) {
        setStats(response.stats);
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card-modern animate-pulse">
        <div className="space-y-4">
          <div className="h-6 bg-white/20 rounded loading-shimmer"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-16 bg-white/20 rounded loading-shimmer"></div>
            <div className="h-16 bg-white/20 rounded loading-shimmer"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const getPriorityColor = (priority: TodoPriority) => {
    switch (priority) {
      case TodoPriority.LOW: return 'text-green-400';
      case TodoPriority.MEDIUM: return 'text-yellow-400';
      case TodoPriority.HIGH: return 'text-orange-400';
      case TodoPriority.URGENT: return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getPriorityLabel = (priority: TodoPriority) => {
    switch (priority) {
      case TodoPriority.LOW: return 'Baixa';
      case TodoPriority.MEDIUM: return 'Média';
      case TodoPriority.HIGH: return 'Alta';
      case TodoPriority.URGENT: return 'Urgente';
      default: return 'Média';
    }
  };

  return (
    <div className="card-modern">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Estatísticas</h3>
        <button
          onClick={loadStats}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          title="Atualizar estatísticas"
        >
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Progress Ring */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-24 h-24">
          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="url(#gradient)"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - completionRate / 100)}`}
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#667eea" />
                <stop offset="100%" stopColor="#764ba2" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">{completionRate}%</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-4 rounded-xl bg-white/5">
          <div className="text-2xl font-bold text-white">{stats.total}</div>
          <div className="text-sm text-white/70">Total</div>
        </div>
        <div className="text-center p-4 rounded-xl bg-white/5">
          <div className="text-2xl font-bold text-green-400">{stats.completed}</div>
          <div className="text-sm text-white/70">Concluídas</div>
        </div>
        <div className="text-center p-4 rounded-xl bg-white/5">
          <div className="text-2xl font-bold text-orange-400">{stats.pending}</div>
          <div className="text-sm text-white/70">Pendentes</div>
        </div>
        <div className="text-center p-4 rounded-xl bg-white/5">
          <div className="text-2xl font-bold text-blue-400">{Object.keys(stats.byCategory).length}</div>
          <div className="text-sm text-white/70">Categorias</div>
        </div>
      </div>

      {/* Priority Distribution */}
      <div className="space-y-3">
        <h4 className="text-lg font-semibold text-white">Por Prioridade</h4>
        {Object.entries(stats.byPriority).map(([priority, count]) => (
          <div key={priority} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${getPriorityColor(priority as TodoPriority).replace('text-', 'bg-')}`}></div>
              <span className="text-white/80 text-sm">{getPriorityLabel(priority as TodoPriority)}</span>
            </div>
            <span className="text-white font-semibold">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
