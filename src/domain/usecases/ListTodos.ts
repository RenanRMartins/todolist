import type { TodoRepository } from "../ports/TodoRepository"

export class ListTodos {
  constructor(private repo: TodoRepository) {}

  async execute() {
    return this.repo.list()
  }
}
