import { useEffect, useState } from 'react';
import { container } from '../../di/container';
import { Todo, TodoPriority } from '../../domain/entities/Todo';
import type { TodoFilters, TodoSortOptions } from '../../domain/ports/TodoRepository';
import TodoForm from '../components/TodoForm';
import TodoList from '../components/TodoList';
import FilterBar from '../components/FilterBar';
import StatsCard from '../components/StatsCard';
import ThemeToggle from '../components/ThemeToggle';
import NotificationContainer from '../components/NotificationContainer';

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<TodoFilters>({});
  const [sort, setSort] = useState<TodoSortOptions>({ field: 'createdAt', direction: 'desc' });
  const [categories, setCategories] = useState<string[]>([]);

  const loadTodos = async () => {
    try {
      setLoading(true);
      const response = await container.listTodos.execute({ filters, sort });
      if (response.success) {
        setTodos(response.todos);
        // Extract unique categories
        const uniqueCategories = [...new Set(response.todos.map(todo => todo.category))];
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, [filters, sort]);

  const handleAdd = async (data: { title: string; priority: TodoPriority; category: string }) => {
    const response = await container.addTodo.execute(data);
    if (response.success) {
      loadTodos();
    }
  };

  const handleToggle = async (id: string) => {
    const response = await container.toggleTodo.execute({ id });
    if (response.success) {
      loadTodos();
    }
  };

  const handleRemove = async (id: string) => {
    const response = await container.removeTodo.execute({ id });
    if (response.success) {
      loadTodos();
    }
  };

  const handleUpdate = async (id: string, updates: { title?: string; priority?: TodoPriority; category?: string }) => {
    const response = await container.updateTodo.execute({ id, ...updates });
    if (response.success) {
      loadTodos();
    }
  };

  const handleFiltersChange = (newFilters: TodoFilters, newSort: TodoSortOptions) => {
    setFilters(newFilters);
    setSort(newSort);
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Header */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="animate-fadeInUp">
            <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-2">
              TodoList Pro
            </h1>
            <p className="text-white/70 text-lg">
              Organize suas tarefas com estilo e eficiência
            </p>
          </div>
          <div className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            <ThemeToggle />
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Add Todo Form */}
            <div className="animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
              <TodoForm onAdd={handleAdd} />
            </div>

            {/* Filters */}
            <div className="animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
              <FilterBar 
                onFiltersChange={handleFiltersChange}
                categories={categories}
              />
            </div>

            {/* Todo List */}
            <div className="animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
              {loading ? (
                <div className="card-modern">
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-center space-x-4">
                        <div className="w-6 h-6 bg-white/20 rounded-full loading-shimmer"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-white/20 rounded loading-shimmer"></div>
                          <div className="h-3 bg-white/10 rounded w-2/3 loading-shimmer"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <TodoList
                  todos={todos}
                  onToggle={handleToggle}
                  onRemove={handleRemove}
                  onUpdate={handleUpdate}
                />
              )}
            </div>
          </div>

          {/* Right Column - Stats */}
          <div className="lg:col-span-1">
            <div className="animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
              <StatsCard />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center animate-fadeInUp" style={{ animationDelay: '0.7s' }}>
          <p className="text-white/50 text-sm">
            Feito com ❤️ usando React, TypeScript e princípios SOLID
          </p>
        </div>
      </div>

      {/* Notifications */}
      <NotificationContainer />
    </div>
  );
}
