"use strict";

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _FakeUsersRepository = _interopRequireDefault(require("../repositories/fakes/FakeUsersRepository"));

var _FakeHashProvider = _interopRequireDefault(require("../providers/hashProvider/fakes/FakeHashProvider"));

var _CreateSessionService = _interopRequireDefault(require("./CreateSessionService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fakeUsersRepository;
let fakeHashProvider;
let createSession;
describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new _FakeUsersRepository.default();
    fakeHashProvider = new _FakeHashProvider.default();
    createSession = new _CreateSessionService.default(fakeUsersRepository, fakeHashProvider);
  });
  it('should be able to authenticate', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Infinity Test',
      email: 'test@test.com',
      password: '12345678'
    });
    const response = await createSession.execute({
      email: 'test@test.com',
      password: '12345678'
    });
    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });
  it('should be not able to authenticate with non existing user', async () => {
    await expect(createSession.execute({
      email: 'test@test.com',
      password: '12345678'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should not be able to authenticate with wrong password ', async () => {
    await fakeUsersRepository.create({
      name: 'Infinity Test',
      email: 'test@test.com',
      password: '12345678'
    });
    await expect(createSession.execute({
      email: 'test@test.com',
      password: 'wrong password'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
});