import { IUser, IUserCreateRequest, IUserUpdateRequest } from '../interfaces';
import { Conflict, NotFound } from '../utils/errors';
import UserRepository from './repository';

export default class UserService {
  private _repository: UserRepository;

  constructor(repository = new UserRepository()) {
    this._repository = repository;
  }

  public async getAll(): Promise<IUser[]> {
    return this._repository.getAll();
  }

  public async getById(id: number): Promise<IUser> {
    const user = await this._repository.getById(id);

    if (!user) throw new NotFound('user not found');

    return user;
  }

  public async create(newUser: IUserCreateRequest): Promise<IUser> {
    const userExists = await this._repository.getByEmail(newUser.email);

    if (userExists) throw new Conflict('user already exists');

    return this._repository.create(newUser);
  }

  public async update(id: number, payload: IUserUpdateRequest): Promise<IUser> {
    const user = await this._repository.getById(id);

    if (!user) throw new NotFound('user not found');

    return this._repository.update(id, payload);
  }

  public async delete(id: number): Promise<IUser> {
    const user = await this._repository.getById(id);

    if (!user) throw new NotFound('user not found');

    return this._repository.delete(id);
  }
}
