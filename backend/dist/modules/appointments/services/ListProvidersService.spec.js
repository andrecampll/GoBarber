"use strict";

var _FakeCacheProvider = _interopRequireDefault(require("../../../shared/container/providers/CacheProvider/fakes/FakeCacheProvider"));

var _FakeUsersRepository = _interopRequireDefault(require("../../users/repositories/fakes/FakeUsersRepository"));

var _ListProvidersService = _interopRequireDefault(require("./ListProvidersService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import AppError from '@shared/errors/AppError';
let fakeUsersRepository;
let listProviders;
let fakeCacheProvider;
describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new _FakeUsersRepository.default();
    fakeCacheProvider = new _FakeCacheProvider.default();
    listProviders = new _ListProvidersService.default(fakeUsersRepository, fakeCacheProvider);
  });
  it('should able to list providers', async () => {
    const fulano = await fakeUsersRepository.create({
      name: 'Fulano',
      email: 'fulano@fulano.com',
      password: 'fulano'
    });
    const ciclano = await fakeUsersRepository.create({
      name: 'Ciclano',
      email: 'ciclano@ciclano.com',
      password: 'ciclano'
    });
    const loggedUser = await fakeUsersRepository.create({
      name: 'teste',
      email: 'teste@teste.com',
      password: 'teste'
    });
    const providers = await listProviders.execute({
      user_id: loggedUser.id
    });
    expect(providers).toEqual([fulano, ciclano]);
  });
});