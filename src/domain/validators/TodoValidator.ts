import type { IValidator, ValidationResult } from '../interfaces/IValidator';
import { Todo } from '../entities/Todo';

export class TodoValidator implements IValidator<Partial<Todo>> {
  validate(data: Partial<Todo>): ValidationResult {
    const errors: string[] = [];

    if (data.title !== undefined) {
      if (!data.title || data.title.trim().length === 0) {
        errors.push('Título é obrigatório');
      } else if (data.title.length > 200) {
        errors.push('Título não pode ter mais de 200 caracteres');
      }
    }

    if (data.category !== undefined && data.category.length > 50) {
      errors.push('Categoria não pode ter mais de 50 caracteres');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
