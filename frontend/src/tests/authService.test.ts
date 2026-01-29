import { authService } from '../services/authService';

describe('authService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('stores token and user on successful login', () => {
    const mockResponse = {
      token: 'test-token',
      type: 'Bearer',
      username: 'testuser',
      email: 'test@example.com',
    };

    localStorage.setItem('token', mockResponse.token);
    localStorage.setItem('user', JSON.stringify({
      username: mockResponse.username,
      email: mockResponse.email,
    }));

    expect(authService.getToken()).toBe('test-token');
    expect(authService.isAuthenticated()).toBe(true);
    expect(authService.getCurrentUser()).toEqual({
      username: 'testuser',
      email: 'test@example.com',
    });
  });

  test('clears token and user on logout', () => {
    localStorage.setItem('token', 'test-token');
    localStorage.setItem('user', JSON.stringify({ username: 'testuser' }));

    authService.logout();

    expect(authService.getToken()).toBeNull();
    expect(authService.isAuthenticated()).toBe(false);
    expect(authService.getCurrentUser()).toBeNull();
  });

  test('returns null when no user is logged in', () => {
    expect(authService.getToken()).toBeNull();
    expect(authService.isAuthenticated()).toBe(false);
    expect(authService.getCurrentUser()).toBeNull();
  });
});
