import { LocalStorageTodoRepository } from "../infrastructure/repositories/LocalStorageTodoRepository";
import { NotificationService } from "../infrastructure/services/NotificationService";
import { ThemeService } from "../infrastructure/services/ThemeService";
import { AddTodo } from "../domain/usecases/AddTodo";
import { ToggleTodo } from "../domain/usecases/ToggleTodo";
import { RemoveTodo } from "../domain/usecases/RemoveTodo";
import { ListTodos } from "../domain/usecases/ListTodos";
import { UpdateTodo } from "../domain/usecases/UpdateTodo";
import { GetTodoStats } from "../domain/usecases/GetTodoStats";

// Singleton instances
let repository: LocalStorageTodoRepository | null = null;
let notificationService: NotificationService | null = null;
let themeService: ThemeService | null = null;

// Lazy initialization
const getRepository = (): LocalStorageTodoRepository => {
  if (!repository) {
    repository = new LocalStorageTodoRepository();
  }
  return repository;
};

const getNotificationService = (): NotificationService => {
  if (!notificationService) {
    notificationService = new NotificationService();
  }
  return notificationService;
};

const getThemeService = (): ThemeService => {
  if (!themeService) {
    themeService = new ThemeService();
  }
  return themeService;
};

// Use cases with dependency injection
export const container = {
  // Services
  get notificationService() { return getNotificationService(); },
  get themeService() { return getThemeService(); },
  
  // Use cases
  get addTodo() { 
    return new AddTodo(getRepository(), getNotificationService()); 
  },
  
  get toggleTodo() { 
    return new ToggleTodo(getRepository(), getNotificationService()); 
  },
  
  get removeTodo() { 
    return new RemoveTodo(getRepository(), getNotificationService()); 
  },
  
  get listTodos() { 
    return new ListTodos(getRepository()); 
  },
  
  get updateTodo() { 
    return new UpdateTodo(getRepository(), getNotificationService()); 
  },
  
  get getTodoStats() { 
    return new GetTodoStats(getRepository()); 
  }
};

// Reset function for testing
export const resetContainer = () => {
  repository = null;
  notificationService = null;
  themeService = null;
};
