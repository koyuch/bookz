export abstract class ApiException extends Error {
  public readonly code!: number;
  public readonly payload?: object;

  protected constructor(message: string, code: number = 400, payload?: object) {
    super(message);
    this.code = code;
    this.payload = payload;
  }
}

export class NotFoundException extends ApiException {
  constructor(entity: string, id?: number) {
    super(`Entity ${entity} with id ${id} not found`, 404);
  }
}

export class ValidationException extends ApiException {
  constructor(payload?: object) {
    super("Input validation error", 400, payload);
  }
}

export class AuthorizationException extends ApiException {
  constructor() {
    super("You are not allowed to use this API", 401);
  }
}
