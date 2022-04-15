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

describe('POST /user', () => {
  describe('em caso de sucesso', () => {
    before(() => {
      sinon.stub(UserRepository.prototype, 'create').resolves(fakeData.post.mock);
      sinon.stub(UserRepository.prototype, 'getByEmail').resolves(null);
      sinon.stub(Logger, 'save').resolves();
    });

    after(() => {
      (UserRepository.prototype.create as sinon.SinonStub).restore();
      (UserRepository.prototype.getByEmail as sinon.SinonStub).restore();
      (Logger.save as sinon.SinonStub).restore();
    });

    it('deve retornar o usuário criado enviar status 201', async () => {
      const { status, body } = await chai.request(app).post('/user').send(fakeData.post.request);

      expect(status).to.be.equal(201);
      expect(body).to.be.an('object');
      expect(body).to.be.deep.equal(fakeData.post.response);
      expect((Logger.save as sinon.SinonStub).calledWith('create() success')).to.be.true;
    });
  });

  describe('caso email já esteja cadastrado', () => {
    before(() => {
      sinon.stub(UserRepository.prototype, 'create').resolves();
      sinon.stub(UserRepository.prototype, 'getByEmail').resolves(fakeData.post.mock);
      sinon.stub(Logger, 'save').resolves();
    });

    after(() => {
      (UserRepository.prototype.create as sinon.SinonStub).restore();
      (UserRepository.prototype.getByEmail as sinon.SinonStub).restore();
      (Logger.save as sinon.SinonStub).restore();
    });

    it('deve retornar a mensagem do erro e enviar status 409', async () => {
      const { status, body } = await chai.request(app).post('/user').send(fakeData.post.request);

      expect(status).to.be.equal(409);
      expect(body).to.have.property('error');
      expect(body.error.message).to.be.equal('user already exists');
      expect((Logger.save as sinon.SinonStub).calledWith('create() fail')).to.be.true;
    });
  });

  describe('em caso de erro no banco de dados', () => {
    before(() => {
      sinon.stub(UserRepository.prototype, 'create').throws(new Error('db error'));
      sinon.stub(UserRepository.prototype, 'getByEmail').resolves(null);
      sinon.stub(Logger, 'save').resolves();
    });

    after(() => {
      (UserRepository.prototype.create as sinon.SinonStub).restore();
      (UserRepository.prototype.getByEmail as sinon.SinonStub).restore();
      (Logger.save as sinon.SinonStub).restore();
    });

    it('deve retornar a mensagem do erro e enviar status 500', async () => {
      const { status, body } = await chai.request(app).post('/user').send(fakeData.post.request);

      expect(status).to.be.equal(500);
      expect(body).to.have.property('error');
      expect(body.error.message).to.be.equal('db error');
      expect((Logger.save as sinon.SinonStub).calledWith('create() fail')).to.be.true;
    });
  });

  // não chega a acessar o controller, é parado no middleware, então não precisa de mocks
  describe('caso o firstName não seja enviado', () => {
    it('deve retornar a mensagem do erro e enviar status 400', async () => {
      const { status, body } = await chai
        .request(app)
        .post('/user')
        .send({ ...fakeData.post.request, firstName: undefined });

      expect(status).to.be.equal(400);
      expect(body).to.have.property('error');
      expect(body.error.message).to.be.equal('"firstName" is required');
    });
  });

  // não chega a acessar o controller, é parado no middleware, então não precisa de mocks
  describe('caso o firstName não seja string', () => {
    it('deve retornar a mensagem do erro e enviar status 400', async () => {
      const { status, body } = await chai
        .request(app)
        .post('/user')
        .send({ ...fakeData.post.request, firstName: 999 });

      expect(status).to.be.equal(400);
      expect(body).to.have.property('error');
      expect(body.error.message).to.be.equal('"firstName" must be a string');
    });
  });

  // não chega a acessar o controller, é parado no middleware, então não precisa de mocks
  describe('caso o lastName não seja enviado', () => {
    it('deve retornar a mensagem do erro e enviar status 400', async () => {
      const { status, body } = await chai
        .request(app)
        .post('/user')
        .send({ ...fakeData.post.request, lastName: undefined });

      expect(status).to.be.equal(400);
      expect(body).to.have.property('error');
      expect(body.error.message).to.be.equal('"lastName" is required');
    });
  });

  // não chega a acessar o controller, é parado no middleware, então não precisa de mocks
  describe('caso o lastName não seja string', () => {
    it('deve retornar a mensagem do erro e enviar status 400', async () => {
      const { status, body } = await chai
        .request(app)
        .post('/user')
        .send({ ...fakeData.post.request, lastName: 999 });

      expect(status).to.be.equal(400);
      expect(body).to.have.property('error');
      expect(body.error.message).to.be.equal('"lastName" must be a string');
    });
  });

  // não chega a acessar o controller, é parado no middleware, então não precisa de mocks
  describe('caso o email não seja enviado', () => {
    it('deve retornar a mensagem do erro e enviar status 400', async () => {
      const { status, body } = await chai
        .request(app)
        .post('/user')
        .send({ ...fakeData.post.request, email: undefined });

      expect(status).to.be.equal(400);
      expect(body).to.have.property('error');
      expect(body.error.message).to.be.equal('"email" is required');
    });
  });

  // não chega a acessar o controller, é parado no middleware, então não precisa de mocks
  describe('caso o email não seja string', () => {
    it('deve retornar a mensagem do erro e enviar status 400', async () => {
      const { status, body } = await chai
        .request(app)
        .post('/user')
        .send({ ...fakeData.post.request, email: 999 });

      expect(status).to.be.equal(400);
      expect(body).to.have.property('error');
      expect(body.error.message).to.be.equal('"email" must be a string');
    });
  });

  describe('caso o email não seja um email válido (homer@.co)', () => {
    it('deve retornar a mensagem do erro e enviar status 400', async () => {
      const { status, body } = await chai
        .request(app)
        .post('/user')
        .send({ ...fakeData.post.request, email: 'homer@.co' });

      expect(status).to.be.equal(400);
      expect(body).to.have.property('error');
      expect(body.error.message).to.be.equal('"email" must be a valid email');
    });
  });

  // não chega a acessar o controller, é parado no middleware, então não precisa de mocks
  describe('caso o occupation não seja enviado', () => {
    it('deve retornar a mensagem do erro e enviar status 400', async () => {
      const { status, body } = await chai
        .request(app)
        .post('/user')
        .send({ ...fakeData.post.request, occupation: undefined });

      expect(status).to.be.equal(400);
      expect(body).to.have.property('error');
      expect(body.error.message).to.be.equal('"occupation" is required');
    });
  });

  // não chega a acessar o controller, é parado no middleware, então não precisa de mocks
  describe('caso o occupation não seja string', () => {
    it('deve retornar a mensagem do erro e enviar status 400', async () => {
      const { status, body } = await chai
        .request(app)
        .post('/user')
        .send({ ...fakeData.post.request, occupation: 999 });

      expect(status).to.be.equal(400);
      expect(body).to.have.property('error');
      expect(body.error.message).to.be.equal('"occupation" must be a string');
    });
  });
});

describe('PUT /user/:id', () => {
  describe('caso o usuário exista', () => {
    before(() => {
      sinon.stub(UserRepository.prototype, 'update').resolves(fakeData.put.mock);
      sinon.stub(UserRepository.prototype, 'getById').resolves(fakeData.put.getByIdMock);
      sinon.stub(Logger, 'save').resolves();
    });

    after(() => {
      (UserRepository.prototype.update as sinon.SinonStub).restore();
      (UserRepository.prototype.getById as sinon.SinonStub).restore();
      (Logger.save as sinon.SinonStub).restore();
    });

    it('deve retornar o usuário atualziado e enviar status 200', async () => {
      // id = 2 -> ragnar
      const { status, body } = await chai.request(app).put('/user/2 ').send(fakeData.put.request);

      expect(status).to.be.equal(200);
      expect(body).to.be.an('object');
      expect(body).to.be.deep.equal(fakeData.put.response);
      expect((Logger.save as sinon.SinonStub).calledWith('update() success')).to.be.true;
    });
  });

  describe('caso o usuário não exista', () => {
    before(() => {
      sinon.stub(UserRepository.prototype, 'update').resolves(fakeData.put.mock);
      sinon.stub(UserRepository.prototype, 'getById').resolves(null);
      sinon.stub(Logger, 'save').resolves();
    });

    after(() => {
      (UserRepository.prototype.update as sinon.SinonStub).restore();
      (UserRepository.prototype.getById as sinon.SinonStub).restore();
      (Logger.save as sinon.SinonStub).restore();
    });

    it('deve retornar a mensagem do erro e enviar status 404', async () => {
      // id = 9999
      const { status, body } = await chai.request(app).put('/user/9999').send(fakeData.put.mock);

      expect(status).to.be.equal(404);
      expect(body).to.have.property('error');
      expect(body.error.message).to.be.equal('user not found');
      expect((Logger.save as sinon.SinonStub).calledWith('update() fail')).to.be.true;
    });
  });

  describe('em caso de erro no banco de dados', () => {
    before(() => {
      sinon.stub(UserRepository.prototype, 'update').throws(new Error('db error'));
      sinon.stub(UserRepository.prototype, 'getById').resolves(fakeData.put.getByIdMock);
      sinon.stub(Logger, 'save').resolves();
    });

    after(() => {
      (UserRepository.prototype.update as sinon.SinonStub).restore();
      (UserRepository.prototype.getById as sinon.SinonStub).restore();
      (Logger.save as sinon.SinonStub).restore();
    });

    it('deve retornar a mensagem do erro e enviar status 500', async () => {
      // id = 2 -> ragnar
      const { status, body } = await chai.request(app).put('/user/2').send(fakeData.post.request);

      expect(status).to.be.equal(500);
      expect(body).to.have.property('error');
      expect(body.error.message).to.be.equal('db error');
      expect((Logger.save as sinon.SinonStub).calledWith('update() fail')).to.be.true;
    });
  });

  // não chega a acessar o controller, é parado no middleware, então não precisa de mocks
  describe('caso o firstName não seja string', () => {
    it('deve retornar a mensagem do erro e enviar status 400', async () => {
      // id = 2 -> ragnar
      const { status, body } = await chai
        .request(app)
        .put('/user/2')
        .send({ ...fakeData.put.request, firstName: 999 });

      expect(status).to.be.equal(400);
      expect(body).to.have.property('error');
      expect(body.error.message).to.be.equal('"firstName" must be a string');
    });
  });

  // não chega a acessar o controller, é parado no middleware, então não precisa de mocks
  describe('caso o lastName não seja string', () => {
    it('deve retornar a mensagem do erro e enviar status 400', async () => {
      // id = 2 -> ragnar
      const { status, body } = await chai
        .request(app)
        .put('/user/2')
        .send({ ...fakeData.put.request, lastName: 999 });

      expect(status).to.be.equal(400);
      expect(body).to.have.property('error');
      expect(body.error.message).to.be.equal('"lastName" must be a string');
    });
  });

  // não chega a acessar o controller, é parado no middleware, então não precisa de mocks
  describe('caso o email não seja string', () => {
    it('deve retornar a mensagem do erro e enviar status 400', async () => {
      // id = 2 -> ragnar
      const { status, body } = await chai
        .request(app)
        .put('/user/2')
        .send({ ...fakeData.put.request, email: 999 });

      expect(status).to.be.equal(400);
      expect(body).to.have.property('error');
      expect(body.error.message).to.be.equal('"email" must be a string');
    });
  });

  describe('caso o email não seja um email válido (homer@.co)', () => {
    it('deve retornar a mensagem do erro e enviar status 400', async () => {
      // id = 2 -> ragnar
      const { status, body } = await chai
        .request(app)
        .put('/user/2')
        .send({ ...fakeData.put.request, email: 'homer@.co' });

      expect(status).to.be.equal(400);
      expect(body).to.have.property('error');
      expect(body.error.message).to.be.equal('"email" must be a valid email');
    });
  });

  // não chega a acessar o controller, é parado no middleware, então não precisa de mocks
  describe('caso o occupation não seja string', () => {
    it('deve retornar a mensagem do erro e enviar status 400', async () => {
      // id = 2 -> ragnar
      const { status, body } = await chai
        .request(app)
        .put('/user/2')
        .send({ ...fakeData.put.request, occupation: 999 });

      expect(status).to.be.equal(400);
      expect(body).to.have.property('error');
      expect(body.error.message).to.be.equal('"occupation" must be a string');
    });
  });
});

describe('DELETE /user/:id', () => {
  describe('caso o usuário exista', () => {
    before(() => {
      sinon.stub(UserRepository.prototype, 'delete').resolves(fakeData._delete.mock);
      sinon.stub(UserRepository.prototype, 'getById').resolves(fakeData._delete.mock);
      sinon.stub(Logger, 'save').resolves();
    });

    after(() => {
      (UserRepository.prototype.delete as sinon.SinonStub).restore();
      (UserRepository.prototype.getById as sinon.SinonStub).restore();
      (Logger.save as sinon.SinonStub).restore();
    });

    it('deve retornar um usuário e enviar status 204', async () => {
      // id = 1 -> homer
      const { status, body } = await chai.request(app).delete('/user/1');

      expect(status).to.be.equal(204);
      expect(body).to.be.deep.equal({})
      expect((Logger.save as sinon.SinonStub).calledWith('delete() success')).to.be.true;
    });
  });

  describe('caso o usuário não exista', () => {
    before(() => {
      sinon.stub(UserRepository.prototype, 'delete').resolves();
      sinon.stub(UserRepository.prototype, 'getById').resolves(null);
      sinon.stub(Logger, 'save').resolves();
    });

    after(() => {
      (UserRepository.prototype.delete as sinon.SinonStub).restore();
      (UserRepository.prototype.getById as sinon.SinonStub).restore();
      (Logger.save as sinon.SinonStub).restore();
    });

    it('deve retornar a mensagem do erro e enviar status 404', async () => {
      // id = 9999
      const { status, body } = await chai.request(app).delete('/user/9999');

      expect(status).to.be.equal(404);
      expect(body).to.have.property('error');
      expect(body.error.message).to.be.equal('user not found');
      expect((Logger.save as sinon.SinonStub).calledWith('delete() fail')).to.be.true;
    });
  });

  describe('em caso de erro no banco de dados', () => {
    before(() => {
      sinon.stub(UserRepository.prototype, 'delete').throws(new Error('db error'));
      sinon.stub(UserRepository.prototype, 'getById').resolves(fakeData._delete.mock);
      sinon.stub(Logger, 'save').resolves();
    });

    after(() => {
      (UserRepository.prototype.delete as sinon.SinonStub).restore();
      (UserRepository.prototype.getById as sinon.SinonStub).restore();
      (Logger.save as sinon.SinonStub).restore();
    });

    it('deve retornar a mensagem do erro e enviar status 500', async () => {
      // id = 1 -> homer
      const { status, body } = await chai.request(app).delete('/user/1');

      expect(status).to.be.equal(500);
      expect(body).to.have.property('error');
      expect(body.error.message).to.be.equal('db error');
      expect((Logger.save as sinon.SinonStub).calledWith('delete() fail')).to.be.true;
    });
  });
});
