import { useForm } from "react-hook-form"

interface Props {
  onAdd: (title: string) => void
}

interface FormData {
  title: string
}

export default function TodoForm({ onAdd }: Props) {
  const { register, handleSubmit, reset } = useForm<FormData>()

  const submit = (data: FormData) => {
    if (!data.title.trim()) return
    onAdd(data.title)
    reset()
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="flex mb-5">
      <input
        {...register("title")}
        className="flex-1 p-3 rounded-l-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
        placeholder="Nova tarefa..."
      />
      <button
        type="submit"
        className="bg-pink-500 text-white px-5 rounded-r-lg font-semibold hover:bg-pink-600 transition"
      >
        Adicionar
      </button>
    </form>
  )
}
