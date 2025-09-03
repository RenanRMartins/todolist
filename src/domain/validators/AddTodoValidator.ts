import type { IValidator, ValidationResult } from '../interfaces/IValidator';

export interface AddTodoRequest {
  title: string;
  priority?: string;
  category?: string;
}

export class AddTodoValidator implements IValidator<AddTodoRequest> {
  validate(data: AddTodoRequest): ValidationResult {
    const errors: string[] = [];

    if (!data.title || data.title.trim().length === 0) {
      errors.push('Título é obrigatório');
    } else if (data.title.length > 200) {
      errors.push('Título não pode ter mais de 200 caracteres');
    }

    if (data.priority && !['low', 'medium', 'high', 'urgent'].includes(data.priority)) {
      errors.push('Prioridade inválida');
    }

    if (data.category && data.category.length > 50) {
      errors.push('Categoria não pode ter mais de 50 caracteres');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
