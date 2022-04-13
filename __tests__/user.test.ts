import chai from 'chai';
import sinon from 'sinon';
import chaiHttp from 'chai-http';
import UserRepository from '../src/user/repository';
import app from '../src/app';
import * as fakeData from './fakeData';
import Logger from '../src/utils/logger';

chai.use(chaiHttp);
const { expect } = chai;

describe('GET /user', () => {
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

  describe('em caso de erro no banco de dados', () => {
    before(() => {
      sinon.stub(UserRepository.prototype, 'getAll').throws(new Error('db error'));
      sinon.stub(Logger, 'save').resolves();
    });

    after(() => {
      (UserRepository.prototype.getAll as sinon.SinonStub).restore();
      (Logger.save as sinon.SinonStub).restore();
    });

    it('deve retornar a mensagem do erro e enviar status 500', async () => {
      const { status, body } = await chai.request(app).get('/user');

      expect(status).to.be.equal(500);
      expect(body).to.have.property('error');
      expect(body.error.message).to.be.equal('db error');
      expect((Logger.save as sinon.SinonStub).calledWith('getAll() fail')).to.be.true;
    });
  });
});

describe('GET /user/:id', () => {
  describe('caso o usuário exista', () => {
    before(() => {
      sinon.stub(UserRepository.prototype, 'getById').resolves(fakeData.getId.mock);
      sinon.stub(Logger, 'save').resolves();
    });

    after(() => {
      (UserRepository.prototype.getById as sinon.SinonStub).restore();
      (Logger.save as sinon.SinonStub).restore();
    });

    it('deve retornar um usuário e enviar status 200', async () => {
      // id = 3 -> eren
      const { status, body } = await chai.request(app).get('/user/3');

      expect(status).to.be.equal(200);
      expect(body).to.be.an('object');
      expect(body).to.be.deep.equal(fakeData.getId.response);
      expect((Logger.save as sinon.SinonStub).calledWith('getById() success')).to.be.true;
    });
  });

  describe('caso o usuário não exista', () => {
    before(() => {
      sinon.stub(UserRepository.prototype, 'getById').resolves(null);
      sinon.stub(Logger, 'save').resolves();
    });

    after(() => {
      (UserRepository.prototype.getById as sinon.SinonStub).restore();
      (Logger.save as sinon.SinonStub).restore();
    });

    it('deve retornar a mensagem do erro e enviar status 404', async () => {
      // id = 9999
      const { status, body } = await chai.request(app).get('/user/9999');

      expect(status).to.be.equal(404);
      expect(body).to.have.property('error');
      expect(body.error.message).to.be.equal('user not found');
      expect((Logger.save as sinon.SinonStub).calledWith('getById() fail')).to.be.true;
    });
  });

  describe('em caso de erro no banco de dados', () => {
    before(() => {
      sinon.stub(UserRepository.prototype, 'getById').throws(new Error('db error'));
      sinon.stub(Logger, 'save').resolves();
    });

    after(() => {
      (UserRepository.prototype.getById as sinon.SinonStub).restore();
      (Logger.save as sinon.SinonStub).restore();
    });

    it('deve retornar a mensagem do erro e enviar status 500', async () => {
      // id = 3 -> eren
      const { status, body } = await chai.request(app).get('/user/3');

      expect(status).to.be.equal(500);
      expect(body).to.have.property('error');
      expect(body.error.message).to.be.equal('db error');
      expect((Logger.save as sinon.SinonStub).calledWith('getById() fail')).to.be.true;
    });
  });
});
