import { PrismaClient } from '@prisma/client';
import { Router } from 'express';
import UserController from './user/controller';
import UserRepository from './user/repository';
import UserRouter from './user/router';
import UserService from './user/service';

export default class Factory {
  private static _prisma = new PrismaClient();

  public static get userRouter() {
    const userRepository = new UserRepository(Factory._prisma);
    const userService = new UserService(userRepository);
    const userController = new UserController(userService);
    const userRouter = new UserRouter(Router(), userController);

    return userRouter.router;
  }
}
