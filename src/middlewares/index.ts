import { ErrorRequestHandler, RequestHandler } from 'express';
import joi from 'joi';
import { IUserCreateRequest, IUserUpdateRequest } from '../interfaces';
import { BadRequest } from '../utils/errors/BadRequest';
import HttpError from '../utils/errors/HttpError';

export default class Middlewares {
  private static _createSchema = joi.object({
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    email: joi.string().email().required(),
    occupation: joi.string().required(),
  });

  private static _updateSchema = joi.object({
    firstName: joi.string(),
    lastName: joi.string(),
    email: joi.string().email(),
    occupation: joi.string(),
  });

  public static error: ErrorRequestHandler = (err, _req, res, _next) => {
    if (err instanceof HttpError) {
      const { httpCode, message } = err;

      return res.status(httpCode).json({ error: { message } });
    }

    return res.status(500).json({ error: { message: err.message } });
  };

  public static createValidation: RequestHandler = (req, _res, next) => {
    const { email, firstName, lastName, occupation } = req.body as IUserCreateRequest;
    const { error } = Middlewares._createSchema.validate({
      email,
      firstName,
      lastName,
      occupation,
    });

    if (error) return next(new BadRequest(error.message));

    next();
  };

  public static updateValidation: RequestHandler = (req, _res, next) => {
    const { email, firstName, lastName, occupation } = req.body as IUserUpdateRequest;
    const { error } = Middlewares._updateSchema.validate({
      email,
      firstName,
      lastName,
      occupation,
    });

    if (error) return next(new BadRequest(error.message));

    next();
  };
}
