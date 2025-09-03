import type { ICommand } from "../interfaces/ICommand";
import type { TodoRepository } from "../ports/TodoRepository";
import { Todo, TodoPriority } from "../entities/Todo";
import { AddTodoValidator } from "../validators/AddTodoValidator";
import type { INotificationService } from "../interfaces/INotificationService";

export interface AddTodoRequest {
  title: string;
  priority?: TodoPriority;
  category?: string;
}

export interface AddTodoResponse {
  todo: Todo;
  success: boolean;
  message: string;
}

export class AddTodo implements ICommand<AddTodoRequest, AddTodoResponse> {
  private validator = new AddTodoValidator();

  constructor(
    private repository: TodoRepository,
    private notificationService: INotificationService
  ) {}

  async execute(request: AddTodoRequest): Promise<AddTodoResponse> {
    try {
      // Validar entrada
      const validation = this.validator.validate(request);
      if (!validation.isValid) {
        const errorMessage = validation.errors.join(', ');
        this.notificationService.showError(errorMessage);
        return {
          todo: null as any,
          success: false,
          message: errorMessage
        };
      }

      // Criar todo
      const todo = new Todo({
        id: crypto.randomUUID(),
        title: request.title,
        priority: request.priority || TodoPriority.MEDIUM,
        category: request.category || 'Geral'
      });

      // Salvar no repositório
      const savedTodo = await this.repository.add(todo);
      
      this.notificationService.showSuccess('Tarefa adicionada com sucesso!');
      
      return {
        todo: savedTodo,
        success: true,
        message: 'Tarefa adicionada com sucesso!'
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao adicionar tarefa';
      this.notificationService.showError(errorMessage);
      return {
        todo: null as any,
        success: false,
        message: errorMessage
      };
    }
  }
}