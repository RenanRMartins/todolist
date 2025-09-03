import type { ICommand } from "../interfaces/ICommand";
import type { TodoRepository } from "../ports/TodoRepository";
import { Todo, TodoPriority } from "../entities/Todo";
import { TodoValidator } from "../validators/TodoValidator";
import type { INotificationService } from "../interfaces/INotificationService";

export interface UpdateTodoRequest {
  id: string;
  title?: string;
  priority?: TodoPriority;
  category?: string;
}

export interface UpdateTodoResponse {
  todo: Todo | null;
  success: boolean;
  message: string;
}

export class UpdateTodo implements ICommand<UpdateTodoRequest, UpdateTodoResponse> {
  private validator = new TodoValidator();

  constructor(
    private repository: TodoRepository,
    private notificationService: INotificationService
  ) {}

  async execute(request: UpdateTodoRequest): Promise<UpdateTodoResponse> {
    try {
      const existingTodo = await this.repository.findById(request.id);
      
      if (!existingTodo) {
        const errorMessage = 'Tarefa não encontrada';
        this.notificationService.showError(errorMessage);
        return {
          todo: null,
          success: false,
          message: errorMessage
        };
      }

      // Validar dados de atualização
      const validation = this.validator.validate(request);
      if (!validation.isValid) {
        const errorMessage = validation.errors.join(', ');
        this.notificationService.showError(errorMessage);
        return {
          todo: null,
          success: false,
          message: errorMessage
        };
      }

      const updatedTodo = await this.repository.update(request.id, {
        title: request.title,
        priority: request.priority,
        category: request.category
      });
      
      this.notificationService.showSuccess('Tarefa atualizada com sucesso!');
      
      return {
        todo: updatedTodo,
        success: true,
        message: 'Tarefa atualizada com sucesso!'
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar tarefa';
      this.notificationService.showError(errorMessage);
      return {
        todo: null,
        success: false,
        message: errorMessage
      };
    }
  }
}
