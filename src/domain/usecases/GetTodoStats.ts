import type { IQuery } from "../interfaces/ICommand";
import type { TodoRepository } from "../ports/TodoRepository";

export interface GetTodoStatsResponse {
  stats: {
    total: number;
    completed: number;
    pending: number;
    byPriority: Record<string, number>;
    byCategory: Record<string, number>;
  };
  success: boolean;
  message: string;
}

export class GetTodoStats implements IQuery<void, GetTodoStatsResponse> {
  constructor(private repository: TodoRepository) {}

  async execute(): Promise<GetTodoStatsResponse> {
    try {
      const stats = await this.repository.getStats();
      
      return {
        stats,
        success: true,
        message: 'Estatísticas carregadas com sucesso'
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar estatísticas';
      return {
        stats: {
          total: 0,
          completed: 0,
          pending: 0,
          byPriority: {},
          byCategory: {}
        },
        success: false,
        message: errorMessage
      };
    }
  }
}
