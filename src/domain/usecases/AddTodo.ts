import type { TodoRepository } from "../ports/TodoRepository"

export class AddTodo {
    constructor(private repo: TodoRepository) {}

    async execute(title: string) {
        return this.repo.add(title)
    }
}