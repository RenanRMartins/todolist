export interface TodoProps {
    id: string
    title: string
    done?: boolean
  }
  export class Todo {
    public readonly id: string
    public title: string
    public done: boolean

    constructor({ id, title, done = false }: TodoProps) {
        this.id = id
        this.title = title
        this.done = done
    }

    toggleDone() {
        this.done = !this.done
    }
  }