import { Todo } from "../entities/Todo"

export interface TodoRepository {
    list(): Promise<Todo[]>
    add(title: string): Promise<Todo>
    toggle(id: string): Promise<void>
    remove(id: string): Promise<void>
}