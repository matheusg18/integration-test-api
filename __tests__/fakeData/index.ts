import { IUser } from '../../src/interfaces';

const homer: IUser = {
  id: 1,
  firstName: 'Homer',
  lastName: 'Simpson',
  email: 'homer@gmail.com',
  occupation: 'nuclear safety inspector',
};

const ragnar: IUser = {
  id: 2,
  firstName: 'Ragnar',
  lastName: 'Lodbrok',
  email: 'ragnar@gmail.com',
  occupation: 'king',
};

const updatedRagnar: IUser = {
  id: 2,
  firstName: 'Bjorn',
  lastName: 'Ironside',
  email: 'ragnar@gmail.com',
  occupation: 'king',
};

const eren: IUser = {
  id: 3,
  firstName: 'Eren',
  lastName: 'Yeager',
  email: 'eren.yeager@gmail.com',
  occupation: 'soldier',
};

const morty: IUser = {
  id: 4,
  firstName: 'Morty',
  lastName: 'Smith',
  email: 'msmith.125@gmail.com',
  occupation: 'student',
};

export const get = {
  mock: [homer, ragnar, eren, morty],
  response: [homer, ragnar, eren, morty],
};

export const getId = {
  mock: eren,
  response: eren,
};

export const post = {
  mock: morty,
  request: {
    firstName: morty.firstName,
    lastName: morty.lastName,
    email: morty.email,
    occupation: morty.occupation,
  },
  response: morty,
};

export const put = {
  getByIdMock: ragnar,
  mock: updatedRagnar,
  request: {
    firstName: updatedRagnar.firstName,
    lastName: updatedRagnar.lastName,
  },
  response: updatedRagnar,
};

export const _delete = {
  mock: homer,
};
