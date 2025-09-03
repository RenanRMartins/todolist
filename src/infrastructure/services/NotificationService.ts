import type { INotificationService } from '../../domain/interfaces/INotificationService';

export class NotificationService implements INotificationService {
  private notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'info';
    message: string;
    timestamp: Date;
  }> = [];

  private listeners: Array<(notifications: any[]) => void> = [];

  showSuccess(message: string): void {
    this.addNotification('success', message);
  }

  showError(message: string): void {
    this.addNotification('error', message);
  }

  showInfo(message: string): void {
    this.addNotification('info', message);
  }

  private addNotification(type: 'success' | 'error' | 'info', message: string): void {
    const notification = {
      id: crypto.randomUUID(),
      type,
      message,
      timestamp: new Date()
    };

    this.notifications.unshift(notification);
    
    // Manter apenas as últimas 10 notificações
    if (this.notifications.length > 10) {
      this.notifications = this.notifications.slice(0, 10);
    }

    this.notifyListeners();

    // Auto-remover após 5 segundos
    setTimeout(() => {
      this.removeNotification(notification.id);
    }, 5000);
  }

  removeNotification(id: string): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notifyListeners();
  }

  getNotifications() {
    return [...this.notifications];
  }

  subscribe(listener: (notifications: any[]) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener([...this.notifications]));
  }
}
