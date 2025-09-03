import type { ICommand } from "../interfaces/ICommand";
import type { TodoRepository } from "../ports/TodoRepository";
import type { INotificationService } from "../interfaces/INotificationService";

export interface RemoveTodoRequest {
  id: string;
}

export interface RemoveTodoResponse {
  success: boolean;
  message: string;
}

export class RemoveTodo implements ICommand<RemoveTodoRequest, RemoveTodoResponse> {
  constructor(
    private repository: TodoRepository,
    private notificationService: INotificationService
  ) {}

  async execute(request: RemoveTodoRequest): Promise<RemoveTodoResponse> {
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

      await this.repository.remove(request.id);
      
      this.notificationService.showSuccess('Tarefa removida com sucesso!');
      
      return {
        success: true,
        message: 'Tarefa removida com sucesso!'
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao remover tarefa';
      this.notificationService.showError(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    }
  }
}