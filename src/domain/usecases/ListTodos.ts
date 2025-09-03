import type { IQuery } from "../interfaces/ICommand";
import type { TodoRepository, TodoFilters, TodoSortOptions } from "../ports/TodoRepository";
import { Todo } from "../entities/Todo";

export interface ListTodosRequest {
  filters?: TodoFilters;
  sort?: TodoSortOptions;
}

export interface ListTodosResponse {
  todos: Todo[];
  total: number;
  success: boolean;
  message: string;
}

export class ListTodos implements IQuery<ListTodosRequest, ListTodosResponse> {
  constructor(private repository: TodoRepository) {}

  async execute(request: ListTodosRequest = {}): Promise<ListTodosResponse> {
    try {
      const todos = await this.repository.list(request.filters, request.sort);
      
      return {
        todos,
        total: todos.length,
        success: true,
        message: `${todos.length} tarefa(s) encontrada(s)`
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao listar tarefas';
      return {
        todos: [],
        total: 0,
        success: false,
        message: errorMessage
      };
    }
  }
}
