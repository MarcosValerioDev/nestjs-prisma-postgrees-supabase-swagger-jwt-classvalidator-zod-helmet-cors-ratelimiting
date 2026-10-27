import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  const jwt = { signAsync: jest.fn().mockResolvedValue('token') };
  const hash = bcrypt.hashSync('secret123', 4);
  const users = {
    findByEmail: jest.fn(async (email: string) =>
      email === 'a@b.com' ? { id: '1', email, password: hash } : null,
    ),
  };
  const service = new AuthService(users as any, jwt as any);

  it('returns a token for valid credentials', async () => {
    await expect(
      service.login({ email: 'a@b.com', password: 'secret123' }),
    ).resolves.toEqual({ accessToken: 'token' });
  });

  it('rejects invalid credentials', async () => {
    await expect(
      service.login({ email: 'a@b.com', password: 'wrong' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
    await expect(
      service.login({ email: 'x@b.com', password: 'secret123' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
