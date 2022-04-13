import { PrismaClient } from '@prisma/client';
import { IUser, IUserCreateRequest, IUserUpdateRequest } from '../interfaces';

export default class UserRepository {
  private _prisma: PrismaClient;

  constructor(prisma = new PrismaClient()) {
    this._prisma = prisma;
  }

  public async getAll(): Promise<IUser[]> {
    return this._prisma.user.findMany();
  }

  public async getById(id: number): Promise<IUser | null> {
    return this._prisma.user.findUnique({ where: { id } });
  }

  public async getByEmail(email: string): Promise<IUser | null> {
    return this._prisma.user.findUnique({ where: { email } });
  }

  public async create(newUser: IUserCreateRequest): Promise<IUser> {
    return this._prisma.user.create({ data: newUser });
  }

  public async update(id: number, payload: IUserUpdateRequest): Promise<IUser> {
    return this._prisma.user.update({ where: { id }, data: payload });
  }

  public async delete(id: number): Promise<IUser> {
    return this._prisma.user.delete({ where: { id } });
  }
}
