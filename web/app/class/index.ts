export class ApiError extends Error {
  message: string;
  constructor(message: string) {
    super(message || "Erro inesperado");
    this.message = message
    this.name = "ApiError";
  }
}

