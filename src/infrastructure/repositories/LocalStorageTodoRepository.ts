import { Todo } from "../../domain/entities/Todo"
import type { TodoRepository } from "../../domain/ports/TodoRepository"

const STORAGE_KEY = "todos"

export class LocalStorageTodoRepository implements TodoRepository {
  private getTodos(): Todo[] {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  }

  private saveTodos(todos: Todo[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }

  async list(): Promise<Todo[]> {
    return this.getTodos()
  }

  async add(title: string): Promise<Todo> {
    const todos = this.getTodos()
    const todo = new Todo({
      id: crypto.randomUUID(),
      title,
    })
    todos.push(todo)
    this.saveTodos(todos)
    return todo
  }

  async toggle(id: string): Promise<void> {
    const todos = this.getTodos()
    const todo = todos.find((t) => t.id === id)
    if (todo) {
      todo.done = !todo.done
      this.saveTodos(todos)
    }
  }

  async remove(id: string): Promise<void> {
    const todos = this.getTodos().filter((t) => t.id !== id)
    this.saveTodos(todos)
  }
}
