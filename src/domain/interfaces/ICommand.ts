export interface ICommand<TRequest = void, TResponse = void> {
  execute(request: TRequest): Promise<TResponse>;
}

export interface IQuery<TRequest = void, TResponse = void> {
  execute(request: TRequest): Promise<TResponse>;
}
