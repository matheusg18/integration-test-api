import chai from 'chai';
import sinon from 'sinon';
import chaiHttp from 'chai-http';
import UserRepository from '../src/user/repository';
import app from '../src/app';
import * as fakeData from './fakeData';
import Logger from '../src/utils/logger';

chai.use(chaiHttp);
const { expect } = chai;

describe('em caso de sucesso', () => {
  before(() => {
    sinon.stub(UserRepository.prototype, 'getAll').resolves(fakeData.get.mock);
    sinon.stub(Logger, 'save').resolves();
  });

  after(() => {
    (UserRepository.prototype.getAll as sinon.SinonStub).restore();
    (Logger.save as sinon.SinonStub).restore();
  });

  it('deve retornar um array de usuários e enviar status 200', async () => {
    const { status, body } = await chai.request(app).get('/user');

    expect(status).to.be.equal(200);
    expect(body).to.be.an('array');
    expect(body).to.be.deep.equal(fakeData.get.response);
    expect((Logger.save as sinon.SinonStub).calledWith('getAll() success')).to.be.true;
  });
});