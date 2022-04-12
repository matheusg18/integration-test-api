export interface IUser extends IUserCreateRequest {
  id: number;
}

export interface IUserCreateRequest {
  firstName: string;
  lastName: string;
  email: string;
  occupation: string | undefined | null;
}

export interface IUserUpdateRequest extends Partial<IUserCreateRequest> {}
