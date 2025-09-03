export interface TodoProps {
  id: string;
  title: string;
  done?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  priority?: TodoPriority;
  category?: string;
}

export enum TodoPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export class Todo {
  public readonly id: string;
  private _title: string;
  private _done: boolean;
  public readonly createdAt: Date;
  private _updatedAt: Date;
  private _priority: TodoPriority;
  private _category: string;

  constructor({ 
    id, 
    title, 
    done = false, 
    createdAt = new Date(),
    updatedAt = new Date(),
    priority = TodoPriority.MEDIUM,
    category = 'Geral'
  }: TodoProps) {
    this.id = id;
    this._title = this.validateTitle(title);
    this._done = done;
    this.createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._priority = priority;
    this._category = category;
  }

  get title(): string {
    return this._title;
  }

  get done(): boolean {
    return this._done;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get priority(): TodoPriority {
    return this._priority;
  }

  get category(): string {
    return this._category;
  }

  set title(newTitle: string) {
    this._title = this.validateTitle(newTitle);
    this._updatedAt = new Date();
  }

  set priority(newPriority: TodoPriority) {
    this._priority = newPriority;
    this._updatedAt = new Date();
  }

  set category(newCategory: string) {
    this._category = newCategory;
    this._updatedAt = new Date();
  }

  toggleDone(): void {
    this._done = !this._done;
    this._updatedAt = new Date();
  }

  markAsDone(): void {
    this._done = true;
    this._updatedAt = new Date();
  }

  markAsPending(): void {
    this._done = false;
    this._updatedAt = new Date();
  }

  private validateTitle(title: string): string {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      throw new Error('Título não pode estar vazio');
    }
    if (trimmedTitle.length > 200) {
      throw new Error('Título não pode ter mais de 200 caracteres');
    }
    return trimmedTitle;
  }

  toJSON() {
    return {
      id: this.id,
      title: this._title,
      done: this._done,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
      priority: this._priority,
      category: this._category
    };
  }

  static fromJSON(data: any): Todo {
    return new Todo({
      id: data.id,
      title: data.title,
      done: data.done,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
      priority: data.priority || TodoPriority.MEDIUM,
      category: data.category || 'Geral'
    });
  }
}