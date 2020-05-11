// import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let listProviders: ListProvidersService;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    listProviders = new ListProvidersService(fakeUsersRepository);
  });

  it('should able to list providers', async () => {
    const fulano = await fakeUsersRepository.create({
      name: 'Fulano',
      email: 'fulano@fulano.com',
      password: 'fulano',
    });

    const ciclano = await fakeUsersRepository.create({
      name: 'Ciclano',
      email: 'ciclano@ciclano.com',
      password: 'ciclano',
    });

    const loggedUser = await fakeUsersRepository.create({
      name: 'teste',
      email: 'teste@teste.com',
      password: 'teste',
    });

    const providers = await listProviders.execute({
      user_id: loggedUser.id,
    });

    expect(providers).toEqual([fulano, ciclano]);
  });
});
