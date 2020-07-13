"use strict";

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _FakeNotificationsRepository = _interopRequireDefault(require("../../notifications/repositories/fakes/FakeNotificationsRepository"));

var _FakeCacheProvider = _interopRequireDefault(require("../../../shared/container/providers/CacheProvider/fakes/FakeCacheProvider"));

var _FakeAppointmentsRepository = _interopRequireDefault(require("../repositories/fakes/FakeAppointmentsRepository"));

var _CreateAppointmentService = _interopRequireDefault(require("./CreateAppointmentService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fakeNotificationsRepository;
let fakeAppointmentsRepository;
let createAppointment;
let fakeCacheProvider;
describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new _FakeAppointmentsRepository.default();
    fakeNotificationsRepository = new _FakeNotificationsRepository.default();
    fakeCacheProvider = new _FakeCacheProvider.default();
    createAppointment = new _CreateAppointmentService.default(fakeAppointmentsRepository, fakeNotificationsRepository, fakeCacheProvider);
  });
  it('should able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 5, 20, 12).getTime();
    });
    const appointment = await createAppointment.execute({
      date: new Date(2020, 5, 20, 13),
      user_id: '123123',
      provider_id: '1231231231'
    });
    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('1231231231');
  });
  it('should not be able to create two appointments on the same time', async () => {
    const appointmentDate = new Date(2020, 4, 15, 11);
    await createAppointment.execute({
      date: appointmentDate,
      user_id: '123123',
      provider_id: '1231231231'
    });
    expect(createAppointment.execute({
      date: appointmentDate,
      user_id: '123123',
      provider_id: '1231231231'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should not be able to create an appointment on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 5, 20, 12).getTime();
    });
    await expect(createAppointment.execute({
      date: new Date(2020, 5, 20, 11),
      user_id: '123123',
      provider_id: '1231231231'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should not be able to create an appointment with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 5, 20, 12).getTime();
    });
    await expect(createAppointment.execute({
      date: new Date(2020, 5, 20, 13),
      user_id: '123123',
      provider_id: '123123'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should not be able to create an appointment outside available hours ', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 5, 20, 12).getTime();
    });
    await expect(createAppointment.execute({
      date: new Date(2020, 5, 21, 7),
      user_id: 'userId',
      provider_id: 'providerId'
    })).rejects.toBeInstanceOf(_AppError.default);
    await expect(createAppointment.execute({
      date: new Date(2020, 5, 21, 18),
      user_id: 'userId',
      provider_id: 'providerId'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
});