import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TodoPriority } from '../../domain/entities/Todo';

interface Props {
  onAdd: (data: { title: string; priority: TodoPriority; category: string }) => void;
}

interface FormData {
  title: string;
  priority: TodoPriority;
  category: string;
}

export default function TodoForm({ onAdd }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { register, handleSubmit, reset, watch } = useForm<FormData>({
    defaultValues: {
      title: '',
      priority: TodoPriority.MEDIUM,
      category: 'Geral'
    }
  });

  const watchedTitle = watch('title');

  const submit = (data: FormData) => {
    if (!data.title.trim()) return;
    onAdd({
      title: data.title.trim(),
      priority: data.priority,
      category: data.category.trim() || 'Geral'
    });
    reset();
    setIsExpanded(false);
  };

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
      <form onSubmit={handleSubmit(submit)} className="space-y-4">
        {/* Main Input */}
        <div className="flex space-x-3">
          <div className="flex-1 relative">
            <input
              {...register('title', { required: true })}
              className="input-modern w-full pr-12"
              placeholder="Adicionar nova tarefa..."
              onFocus={() => setIsExpanded(true)}
            />
            {watchedTitle && (
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:scale-105 transition-all duration-200"
                title="Adicionar tarefa"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            )}
          </div>
          
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="glass p-3 rounded-xl hover:scale-105 transition-all duration-300"
            title={isExpanded ? 'Ocultar opções' : 'Mostrar opções'}
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

        {/* Expanded Options */}
        {isExpanded && (
          <div className="animate-fadeIn space-y-4 pt-4 border-t border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Priority Selection */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Prioridade
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {Object.values(TodoPriority).map((priority) => (
                    <label key={priority} className="relative cursor-pointer">
                      <input
                        {...register('priority')}
                        type="radio"
                        value={priority}
                        className="sr-only"
                      />
                      <div className={`
                        p-2 rounded-lg text-center text-xs font-medium transition-all duration-200
                        ${watch('priority') === priority 
                          ? `${getPriorityColor(priority)} text-white shadow-lg scale-105` 
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                        }
                      `}>
                        {getPriorityLabel(priority)}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Category Input */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Categoria
                </label>
                <input
                  {...register('category')}
                  className="input-modern w-full"
                  placeholder="Ex: Trabalho, Pessoal..."
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-2">
              <button
                type="submit"
                className="btn-primary flex-1"
                disabled={!watchedTitle?.trim()}
              >
                <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Adicionar Tarefa
              </button>
              <button
                type="button"
                onClick={() => {
                  reset();
                  setIsExpanded(false);
                }}
                className="btn-secondary"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
