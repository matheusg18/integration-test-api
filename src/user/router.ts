import { Router } from 'express';
import Middlewares from '../middlewares';
import UserController from './controller';

export default class UserRouter {
  private _router: Router;

  private _controller: UserController;

  constructor(router = Router(), controller = new UserController()) {
    this._router = router;
    this._controller = controller;

    this._router.get('/', this._controller.getAll);
    this._router.get('/:id', this._controller.getById);
    this._router.post('/', Middlewares.createValidation, this._controller.create);
    this._router.put('/:id', Middlewares.updateValidation, this._controller.update);
    this._router.delete('/:id', this._controller.delete);
  }

  get router() {
    return this._router;
  }
}
