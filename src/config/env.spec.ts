import { validateEnv } from './env';

describe('validateEnv', () => {
  const base = { DATABASE_URL: 'postgresql://x', JWT_SECRET: 'a'.repeat(16) };

  it('applies defaults', () => {
    expect(validateEnv(base)).toMatchObject({
      PORT: 3000,
      THROTTLE_LIMIT: 100,
    });
  });

  it('rejects a short JWT secret', () => {
    expect(() => validateEnv({ ...base, JWT_SECRET: 'short' })).toThrow(
      /JWT_SECRET/,
    );
  });
});
