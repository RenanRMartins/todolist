import { useState } from 'react';
import { Todo, TodoPriority } from '../../domain/entities/Todo';

interface Props {
  todos: Todo[];
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onUpdate?: (id: string, updates: { title?: string; priority?: TodoPriority; category?: string }) => void;
}

export default function TodoList({ todos, onToggle, onRemove, onUpdate }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editPriority, setEditPriority] = useState<TodoPriority>(TodoPriority.MEDIUM);
  const [editCategory, setEditCategory] = useState('');

  const startEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditTitle(todo.title);
    setEditPriority(todo.priority);
    setEditCategory(todo.category);
  };

  const saveEdit = () => {
    if (editingId && onUpdate) {
      onUpdate(editingId, {
        title: editTitle.trim(),
        priority: editPriority,
        category: editCategory.trim() || 'Geral'
      });
    }
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setEditPriority(TodoPriority.MEDIUM);
    setEditCategory('');
  };

  const getPriorityColor = (priority: TodoPriority) => {
    switch (priority) {
      case TodoPriority.LOW: return 'priority-low';
      case TodoPriority.MEDIUM: return 'priority-medium';
      case TodoPriority.HIGH: return 'priority-high';
      case TodoPriority.URGENT: return 'priority-urgent';
      default: return 'priority-medium';
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

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (todos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
          <svg className="w-12 h-12 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-white/70 mb-2">Nenhuma tarefa encontrada</h3>
        <p className="text-white/50">Adicione uma nova tarefa para começar!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {todos.map((todo, index) => (
        <div
          key={todo.id}
          className={`
            card-modern animate-fadeInUp
            ${todo.done ? 'opacity-75' : ''}
          `}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          {editingId === todo.id ? (
            // Edit Mode
            <div className="space-y-4">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="input-modern w-full"
                placeholder="Título da tarefa..."
                autoFocus
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Prioridade
                  </label>
                  <select
                    value={editPriority}
                    onChange={(e) => setEditPriority(e.target.value as TodoPriority)}
                    className="input-modern w-full"
                  >
                    {Object.values(TodoPriority).map((priority) => (
                      <option key={priority} value={priority}>
                        {getPriorityLabel(priority)}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Categoria
                  </label>
                  <input
                    type="text"
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="input-modern w-full"
                    placeholder="Categoria..."
                  />
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={saveEdit}
                  className="btn-primary flex-1"
                  disabled={!editTitle.trim()}
                >
                  Salvar
                </button>
                <button
                  onClick={cancelEdit}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            // View Mode
            <div className="flex items-start space-x-4">
              {/* Checkbox */}
              <button
                onClick={() => onToggle(todo.id)}
                className={`
                  w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200
                  ${todo.done 
                    ? 'bg-green-500 border-green-500' 
                    : 'border-white/30 hover:border-white/60'
                  }
                `}
              >
                {todo.done && (
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className={`
                      text-lg font-medium break-words transition-all duration-200
                      ${todo.done 
                        ? 'line-through text-white/50' 
                        : 'text-white'
                      }
                    `}>
                      {todo.title}
                    </h3>
                    
                    <div className="flex items-center space-x-3 mt-2">
                      {/* Priority Badge */}
                      <span className={`
                        px-2 py-1 rounded-full text-xs font-medium
                        ${getPriorityColor(todo.priority)}
                      `}>
                        {getPriorityLabel(todo.priority)}
                      </span>
                      
                      {/* Category Badge */}
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-white/10 text-white/70">
                        {todo.category}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 mt-3 text-xs text-white/50">
                      <span>Criado: {formatDate(todo.createdAt)}</span>
                      {todo.updatedAt.getTime() !== todo.createdAt.getTime() && (
                        <span>Atualizado: {formatDate(todo.updatedAt)}</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center space-x-2 ml-4">
                    {onUpdate && (
                      <button
                        onClick={() => startEdit(todo)}
                        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                        title="Editar tarefa"
                      >
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    )}
                    
                    <button
                      onClick={() => onRemove(todo.id)}
                      className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors"
                      title="Remover tarefa"
                    >
                      <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
