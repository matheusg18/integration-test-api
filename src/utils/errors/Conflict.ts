import HttpError from './HttpError';

export class Conflict extends HttpError {
  public httpCode: number;

  public name: string;

  constructor(message: string, httpCode = 409) {
    super(message);

    this.httpCode = httpCode;
    this.name = 'Conflict';
  }
}
