export class RepositoryError extends Error {
  constructor(message: string, public cause?: any) {
    super(message);
  }
}
