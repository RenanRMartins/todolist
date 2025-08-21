import type { TodoRepository } from "../ports/TodoRepository"

export class ToggleTodo {
    constructor(private repo: TodoRepository) {}

    async execute(id: string) {
        return this.repo.toggle(id)
    }
}