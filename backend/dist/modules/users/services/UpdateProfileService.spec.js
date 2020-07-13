"use strict";

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _FakeHashProvider = _interopRequireDefault(require("../providers/hashProvider/fakes/FakeHashProvider"));

var _FakeUsersRepository = _interopRequireDefault(require("../repositories/fakes/FakeUsersRepository"));

var _UpdateProfileService = _interopRequireDefault(require("./UpdateProfileService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fakeUsersRepository;
let fakeHashProvider;
let updateProfile;
describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new _FakeUsersRepository.default();
    fakeHashProvider = new _FakeHashProvider.default();
    updateProfile = new _UpdateProfileService.default(fakeUsersRepository, fakeHashProvider);
  });
  it('should able to update the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Fulano',
      email: 'fulano@fulano.com',
      password: 'fulano'
    });
    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Fulano dois',
      email: 'fulanodois@email.com'
    });
    expect(updatedUser.name).toBe('Fulano dois');
    expect(updatedUser.email).toBe('fulanodois@email.com');
  });
  it('should not be able to update the profile from non-existing user', async () => {
    expect(updateProfile.execute({
      user_id: 'non-existing id',
      name: 'fulano',
      email: 'fulano@fulano.com'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should not be able to change to a already used email', async () => {
    await fakeUsersRepository.create({
      name: 'Fulano',
      email: 'fulano@fulano.com',
      password: 'fulano'
    });
    const user = await fakeUsersRepository.create({
      name: 'Teste',
      email: 'teste@fulano.com',
      password: 'fulano'
    });
    await expect(updateProfile.execute({
      user_id: user.id,
      name: 'Fulano dois',
      email: 'fulano@fulano.com'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Fulano',
      email: 'fulano@fulano.com',
      password: '123456'
    });
    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Teste',
      email: 'teste@fulano.com',
      old_password: '123456',
      new_password: '123123'
    });
    expect(updatedUser.password).toBe('123123');
  });
  it('should not be able to update the password without old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Fulano',
      email: 'fulano@fulano.com',
      password: '123456'
    });
    await expect(updateProfile.execute({
      user_id: user.id,
      name: 'Teste',
      email: 'teste@fulano.com',
      new_password: '123123'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should not be able to update the password with wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Fulano',
      email: 'fulano@fulano.com',
      password: '123456'
    });
    await expect(updateProfile.execute({
      user_id: user.id,
      name: 'Teste',
      email: 'teste@fulano.com',
      new_password: '123123',
      old_password: 'senhaerrada'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
});