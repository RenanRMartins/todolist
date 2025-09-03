import { useState } from 'react';
import { TodoPriority } from '../../domain/entities/Todo';
import type { TodoFilters, TodoSortOptions } from '../../domain/ports/TodoRepository';

interface Props {
  onFiltersChange: (filters: TodoFilters, sort: TodoSortOptions) => void;
  categories: string[];
}

export default function FilterBar({ onFiltersChange, categories }: Props) {
  const [filters, setFilters] = useState<TodoFilters>({});
  const [sort, setSort] = useState<TodoSortOptions>({ field: 'createdAt', direction: 'desc' });
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilters = (newFilters: Partial<TodoFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters, sort);
  };

  const updateSort = (newSort: TodoSortOptions) => {
    setSort(newSort);
    onFiltersChange(filters, newSort);
  };

  const clearFilters = () => {
    const clearedFilters: TodoFilters = {};
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters, sort);
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  const getPriorityColor = (priority: TodoPriority) => {
    switch (priority) {
      case TodoPriority.LOW: return 'bg-green-500';
      case TodoPriority.MEDIUM: return 'bg-yellow-500';
      case TodoPriority.HIGH: return 'bg-orange-500';
      case TodoPriority.URGENT: return 'bg-red-500';
      default: return 'bg-gray-500';
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
    <div className="card-modern mb-6">
      {/* Quick Filters */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => updateFilters({ done: undefined })}
            className={`
              px-4 py-2 rounded-lg font-medium transition-all duration-200
              ${!filters.done ? 'btn-primary' : 'bg-white/10 text-white/70 hover:bg-white/20'}
            `}
          >
            Todas
          </button>
          <button
            onClick={() => updateFilters({ done: false })}
            className={`
              px-4 py-2 rounded-lg font-medium transition-all duration-200
              ${filters.done === false ? 'btn-primary' : 'bg-white/10 text-white/70 hover:bg-white/20'}
            `}
          >
            Pendentes
          </button>
          <button
            onClick={() => updateFilters({ done: true })}
            className={`
              px-4 py-2 rounded-lg font-medium transition-all duration-200
              ${filters.done === true ? 'btn-primary' : 'bg-white/10 text-white/70 hover:bg-white/20'}
            `}
          >
            Concluídas
          </button>
        </div>

        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors"
              title="Limpar filtros"
            >
              <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="glass p-2 rounded-lg hover:scale-105 transition-all duration-300"
            title={isExpanded ? 'Ocultar filtros avançados' : 'Mostrar filtros avançados'}
          >
            <svg 
              className={`w-5 h-5 text-white transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      {isExpanded && (
        <div className="animate-fadeIn space-y-4 pt-4 border-t border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Buscar
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={filters.search || ''}
                  onChange={(e) => updateFilters({ search: e.target.value || undefined })}
                  className="input-modern w-full pl-10"
                  placeholder="Buscar tarefas..."
                />
                <svg className="w-4 h-4 text-white/50 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Priority Filter */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Prioridade
              </label>
              <select
                value={filters.priority || ''}
                onChange={(e) => updateFilters({ priority: e.target.value as TodoPriority || undefined })}
                className="input-modern w-full"
              >
                <option value="">Todas as prioridades</option>
                {Object.values(TodoPriority).map((priority) => (
                  <option key={priority} value={priority}>
                    {getPriorityLabel(priority)}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Categoria
              </label>
              <select
                value={filters.category || ''}
                onChange={(e) => updateFilters({ category: e.target.value || undefined })}
                className="input-modern w-full"
              >
                <option value="">Todas as categorias</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sort Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Ordenar por
              </label>
              <select
                value={sort.field}
                onChange={(e) => updateSort({ ...sort, field: e.target.value as any })}
                className="input-modern w-full"
              >
                <option value="createdAt">Data de criação</option>
                <option value="updatedAt">Data de atualização</option>
                <option value="title">Título</option>
                <option value="priority">Prioridade</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Direção
              </label>
              <select
                value={sort.direction}
                onChange={(e) => updateSort({ ...sort, direction: e.target.value as 'asc' | 'desc' })}
                className="input-modern w-full"
              >
                <option value="desc">Decrescente</option>
                <option value="asc">Crescente</option>
              </select>
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="pt-4 border-t border-white/10">
              <h4 className="text-sm font-medium text-white/80 mb-2">Filtros ativos:</h4>
              <div className="flex flex-wrap gap-2">
                {filters.search && (
                  <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-sm">
                    Busca: "{filters.search}"
                  </span>
                )}
                {filters.priority && (
                  <span className={`px-3 py-1 rounded-full text-sm ${getPriorityColor(filters.priority)}`}>
                    {getPriorityLabel(filters.priority)}
                  </span>
                )}
                {filters.category && (
                  <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm">
                    {filters.category}
                  </span>
                )}
                {filters.done !== undefined && (
                  <span className={`px-3 py-1 rounded-full text-sm ${filters.done ? 'bg-green-500/20 text-green-300' : 'bg-orange-500/20 text-orange-300'}`}>
                    {filters.done ? 'Concluídas' : 'Pendentes'}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
