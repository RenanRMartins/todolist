import { Todo } from "../../domain/entities/Todo"

interface Props {
  todos: Todo[]
  onToggle: (id: string) => void
  onRemove: (id: string) => void
}

export default function TodoList({ todos, onToggle, onRemove }: Props) {
  return (
    <ul>
      {todos.map((todo) => (
        <li
          key={todo.id}
          className="flex items-center justify-between p-3 bg-gray-700 mb-2 rounded-lg hover:bg-gray-600 transition-colors"
        >
          <span
            className={`flex-1 cursor-pointer break-words ${
              todo.done ? "line-through text-gray-400" : "text-white"
            }`}
            onClick={() => onToggle(todo.id)}
          >
            {todo.title}
          </span>
          <button
            className="ml-3 text-red-500 font-bold px-3 py-1 rounded hover:text-red-700 transition"
            onClick={() => onRemove(todo.id)}
          >
            X
          </button>
        </li>
      ))}
    </ul>
  )
}
