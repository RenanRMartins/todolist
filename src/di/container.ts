import { LocalStorageTodoRepository } from "../infrastructure/repositories/LocalStorageTodoRepository"
import { AddTodo } from "../domain/usecases/AddTodo"
import { ToggleTodo } from "../domain/usecases/ToggleTodo"
import { RemoveTodo } from "../domain/usecases/RemoveTodo"
import { ListTodos } from "../domain/usecases/ListTodos"

const repo = new LocalStorageTodoRepository()

export const container = {
  addTodo: new AddTodo(repo),
  toggleTodo: new ToggleTodo(repo),
  removeTodo: new RemoveTodo(repo),
  listTodos: new ListTodos(repo),
}
