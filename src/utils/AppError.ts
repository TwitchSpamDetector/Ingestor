/**
 * Error de aplicación con la forma que espera el ErrorResponse
 * del contrato OpenAPI (status, error, message, field).
 */
export class AppError extends Error {
  public readonly status: number;
  public readonly error: string;
  public readonly field: string | null;

  constructor(status: number, error: string, message: string, field: string | null = null) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.error = error;
    this.field = field;

    Object.setPrototypeOf(this, AppError.prototype);
  }
}
