import { renderHook } from "@testing-library/react-hooks";
import { useAuth, AuthProvider } from '../../hooks/auth';
import MockAdapter from 'axios-mock-adapter';
import api from '../../services/api';

const apiMock = new MockAdapter(api);

describe('Auth hook', () => {
  it('should be able to sign in', async () => {
    const apiResponse = {
      user: {
        id: 'user123',
        name: 'teste',
        email: 'teste@teste.com',
      },
      token: 'token123',
    };

    apiMock.onPost('sessions').reply(200, apiResponse);


    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    result.current.signIn({
      email: 'teste@teste.com',
      password: '123123',
    });

    await waitForNextUpdate();

    expect(setItemSpy).toHaveBeenCalledWith('@GoBarber:token', apiResponse.token);
    expect(setItemSpy).toHaveBeenCalledWith('@GoBarber:user', JSON.stringify(apiResponse.user));

    expect(result.current.user.email).toEqual('teste@teste.com');
  });
});
