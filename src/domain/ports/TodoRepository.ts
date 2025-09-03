import { Todo, TodoPriority } from "../entities/Todo";

export interface TodoFilters {
  done?: boolean;
  priority?: TodoPriority;
  category?: string;
  search?: string;
}

export interface TodoSortOptions {
  field: 'createdAt' | 'updatedAt' | 'title' | 'priority';
  direction: 'asc' | 'desc';
}

export interface TodoRepository {
  list(filters?: TodoFilters, sort?: TodoSortOptions): Promise<Todo[]>;
  findById(id: string): Promise<Todo | null>;
  add(todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>): Promise<Todo>;
  update(id: string, updates: Partial<Pick<Todo, 'title' | 'done' | 'priority' | 'category'>>): Promise<Todo>;
  remove(id: string): Promise<void>;
  removeAll(): Promise<void>;
  getStats(): Promise<{
    total: number;
    completed: number;
    pending: number;
    byPriority: Record<TodoPriority, number>;
    byCategory: Record<string, number>;
  }>;
}