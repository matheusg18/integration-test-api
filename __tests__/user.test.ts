import chai from 'chai';
import sinon from 'sinon';
import chaiHttp from 'chai-http';
import UserRepository from '../src/user/repository';
import app from '../src/app';
import { IUser } from '../src/interfaces';

chai.use(chaiHttp);
const { expect } = chai;

describe('POST /user', () => {
  const user = {
    id: 1,
    firstName: 'Homer',
    lastName: 'Simpson',
    email: 'homer@gmail.com',
    occupation: 'nuclear safety inspector',
  };
  before(() => {
    sinon.stub(UserRepository.prototype, 'create').resolves(user);
    sinon.stub(UserRepository.prototype, 'getByEmail').resolves(null);
  });

  after(() => {
    (UserRepository.prototype.create as sinon.SinonStub).restore();
    (UserRepository.prototype.getByEmail as sinon.SinonStub).restore();
  });

  it('success case', async () => {
    const { status, body } = await chai.request(app).post('/user').send({
      firstName: 'Homer',
      lastName: 'Simpson',
      email: 'homer@gmail.com',
      occupation: 'nuclear safety inspector',
    });

    expect(status).to.be.equal(201);
    expect(body).to.be.deep.equal(user);
  });

  it('wrong body', async () => {
    const { status, body } = await chai.request(app).post('/user').send({
      firstName: 'Homer',
      lastName: 'Simpson',
      email: 'homer',
      occupation: 'nuclear safety inspector',
    });

    expect(status).to.be.equal(400);
    expect(body).to.be.deep.equal({
      error: {
        message: '"email" must be a valid email'
      }
    });
  });
});
