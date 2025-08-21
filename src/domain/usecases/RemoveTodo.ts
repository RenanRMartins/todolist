import type { TodoRepository } from "../ports/TodoRepository"

export class RemoveTodo {
    constructor(private repo: TodoRepository) {}

    async execute(id: string) {
        return this.repo.remove(id)
    }
}