import HttpError from './HttpError';

export class NotFound extends HttpError {
  public httpCode: number;

  public name: string;

  constructor(message: string, httpCode = 404) {
    super(message);

    this.httpCode = httpCode;
    this.name = 'NotFound';
  }
}
