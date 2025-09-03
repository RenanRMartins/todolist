import { Todo, TodoPriority } from "../../domain/entities/Todo";
import type { TodoRepository, TodoFilters, TodoSortOptions } from "../../domain/ports/TodoRepository";

const STORAGE_KEY = "todos";

export class LocalStorageTodoRepository implements TodoRepository {
  private getTodos(): Todo[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      
      const parsed = JSON.parse(data);
      return parsed.map((item: any) => Todo.fromJSON(item));
    } catch (error) {
      console.error('Erro ao carregar todos do localStorage:', error);
      return [];
    }
  }

  private saveTodos(todos: Todo[]): void {
    try {
      const serialized = todos.map(todo => todo.toJSON());
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
    } catch (error) {
      console.error('Erro ao salvar todos no localStorage:', error);
      throw new Error('Erro ao salvar dados');
    }
  }

  private filterTodos(todos: Todo[], filters?: TodoFilters): Todo[] {
    if (!filters) return todos;

    return todos.filter(todo => {
      if (filters.done !== undefined && todo.done !== filters.done) {
        return false;
      }
      if (filters.priority && todo.priority !== filters.priority) {
        return false;
      }
      if (filters.category && todo.category !== filters.category) {
        return false;
      }
      if (filters.search && !todo.title.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      return true;
    });
  }

  private sortTodos(todos: Todo[], sort?: TodoSortOptions): Todo[] {
    if (!sort) return todos;

    return [...todos].sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sort.field) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'priority':
          const priorityOrder = { [TodoPriority.LOW]: 1, [TodoPriority.MEDIUM]: 2, [TodoPriority.HIGH]: 3, [TodoPriority.URGENT]: 4 };
          aValue = priorityOrder[a.priority];
          bValue = priorityOrder[b.priority];
          break;
        case 'createdAt':
          aValue = a.createdAt.getTime();
          bValue = b.createdAt.getTime();
          break;
        case 'updatedAt':
          aValue = a.updatedAt.getTime();
          bValue = b.updatedAt.getTime();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sort.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sort.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  async list(filters?: TodoFilters, sort?: TodoSortOptions): Promise<Todo[]> {
    const todos = this.getTodos();
    const filtered = this.filterTodos(todos, filters);
    return this.sortTodos(filtered, sort);
  }

  async findById(id: string): Promise<Todo | null> {
    const todos = this.getTodos();
    return todos.find(todo => todo.id === id) || null;
  }

  async add(todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>): Promise<Todo> {
    const newTodo = new Todo({
      id: crypto.randomUUID(),
      title: todo.title,
      done: todo.done,
      priority: todo.priority,
      category: todo.category
    });

    const todos = this.getTodos();
    todos.push(newTodo);
    this.saveTodos(todos);
    return newTodo;
  }

  async update(id: string, updates: Partial<Pick<Todo, 'title' | 'done' | 'priority' | 'category'>>): Promise<Todo> {
    const todos = this.getTodos();
    const todoIndex = todos.findIndex(t => t.id === id);
    
    if (todoIndex === -1) {
      throw new Error('Tarefa não encontrada');
    }

    const todo = todos[todoIndex];
    
    if (updates.title !== undefined) todo.title = updates.title;
    if (updates.done !== undefined) {
      if (updates.done) todo.markAsDone();
      else todo.markAsPending();
    }
    if (updates.priority !== undefined) todo.priority = updates.priority;
    if (updates.category !== undefined) todo.category = updates.category;

    this.saveTodos(todos);
    return todo;
  }

  async remove(id: string): Promise<void> {
    const todos = this.getTodos().filter(t => t.id !== id);
    this.saveTodos(todos);
  }

  async removeAll(): Promise<void> {
    this.saveTodos([]);
  }

  async getStats(): Promise<{
    total: number;
    completed: number;
    pending: number;
    byPriority: Record<TodoPriority, number>;
    byCategory: Record<string, number>;
  }> {
    const todos = this.getTodos();
    
    const stats = {
      total: todos.length,
      completed: todos.filter(t => t.done).length,
      pending: todos.filter(t => !t.done).length,
      byPriority: {
        [TodoPriority.LOW]: 0,
        [TodoPriority.MEDIUM]: 0,
        [TodoPriority.HIGH]: 0,
        [TodoPriority.URGENT]: 0
      } as Record<TodoPriority, number>,
      byCategory: {} as Record<string, number>
    };

    todos.forEach(todo => {
      stats.byPriority[todo.priority]++;
      stats.byCategory[todo.category] = (stats.byCategory[todo.category] || 0) + 1;
    });

    return stats;
  }
}
