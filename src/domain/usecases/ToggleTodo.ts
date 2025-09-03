import type { ICommand } from "../interfaces/ICommand";
import type { TodoRepository } from "../ports/TodoRepository";
import type { INotificationService } from "../interfaces/INotificationService";

export interface ToggleTodoRequest {
  id: string;
}

export interface ToggleTodoResponse {
  success: boolean;
  message: string;
}

export class ToggleTodo implements ICommand<ToggleTodoRequest, ToggleTodoResponse> {
  constructor(
    private repository: TodoRepository,
    private notificationService: INotificationService
  ) {}

  async execute(request: ToggleTodoRequest): Promise<ToggleTodoResponse> {
    try {
      const todo = await this.repository.findById(request.id);
      
      if (!todo) {
        const errorMessage = 'Tarefa não encontrada';
        this.notificationService.showError(errorMessage);
        return {
          success: false,
          message: errorMessage
        };
      }

      await this.repository.update(request.id, { done: !todo.done });
      
      const message = todo.done ? 'Tarefa marcada como pendente' : 'Tarefa marcada como concluída';
      this.notificationService.showSuccess(message);
      
      return {
        success: true,
        message
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao alterar status da tarefa';
      this.notificationService.showError(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    }
  }
}