import { useEffect, useState } from "react"
import { container } from "../../di/container"
import { Todo } from "../../domain/entities/Todo"
import TodoForm from "../components/TodoForm"
import TodoList from "../components/TodoList"

type Filter = "all" | "pending" | "done"

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [filter, setFilter] = useState<Filter>("all")

  const loadTodos = async () => {
    const data = await container.listTodos.execute()
    setTodos(data)
  }

  useEffect(() => {
    loadTodos()
  }, [])

  const handleAdd = async (title: string) => {
    await container.addTodo.execute(title)
    loadTodos()
  }

  const handleToggle = async (id: string) => {
    await container.toggleTodo.execute(id)
    loadTodos()
  }

  const handleRemove = async (id: string) => {
    await container.removeTodo.execute(id)
    loadTodos()
  }

  const filteredTodos = todos.filter((todo) => {
    if (filter === "pending") return !todo.done
    if (filter === "done") return todo.done
    return true
  })

  return (
    <div className="max-w-md md:max-w-lg mx-auto mt-10 p-6 bg-gray-900 rounded-xl shadow-xl">
      <h1 className="text-3xl font-bold text-white mb-6 text-center">My Todo List</h1>

      {/* Formulário */}
      <TodoForm onAdd={handleAdd} />

      {/* Filtros */}
      <div className="flex justify-center mb-5 space-x-3">
        <button
          className={`px-4 py-2 rounded-full font-semibold ${
            filter === "all" ? "bg-pink-500 text-white" : "bg-gray-700 text-gray-300"
          }`}
          onClick={() => setFilter("all")}
        >
          Todas
        </button>
        <button
          className={`px-4 py-2 rounded-full font-semibold ${
            filter === "pending" ? "bg-pink-500 text-white" : "bg-gray-700 text-gray-300"
          }`}
          onClick={() => setFilter("pending")}
        >
          Pendentes
        </button>
        <button
          className={`px-4 py-2 rounded-full font-semibold ${
            filter === "done" ? "bg-pink-500 text-white" : "bg-gray-700 text-gray-300"
          }`}
          onClick={() => setFilter("done")}
        >
          Concluídas
        </button>
      </div>

      {/* Lista */}
      <TodoList
        todos={filteredTodos}
        onToggle={handleToggle}
        onRemove={handleRemove}
      />
    </div>
  )
}
