/* eslint-env jest */
import withAuth from '../src/index';

const noop = () => true;

test('returns an error if auth context is missing', async () => {
  const result = await withAuth(noop)(null, null, {}, {});
  expect(result).toBeInstanceOf(Error);
});

test('returns an error if the user is not authenticated', async () => {
  const result = await withAuth(noop)(
    null,
    null,
    {
      auth: {
        isAuthenticated: false,
      },
    },
    {}
  );
  expect(result).toBeInstanceOf(Error);
});

test("returns an error if the user doesn't have proper scope", async () => {
  const result = await withAuth(['scope:user'], noop)(
    null,
    null,
    {
      auth: {
        isAuthenticated: true,
        scope: ['scope:post'],
      },
    },
    {}
  );
  expect(result).toBeInstanceOf(Error);
});

test('resolves if the user is authenticated', async () => {
  const result = await withAuth(noop)(
    null,
    null,
    {
      auth: {
        isAuthenticated: true,
        scope: [],
      },
    },
    {}
  );
  expect(result).toBe(true);
});

test('resolves if the user has correct scope', async () => {
  const result = await withAuth(['scope:user'], noop)(
    null,
    null,
    {
      auth: {
        isAuthenticated: true,
        scope: ['scope:user', 'scope:post'],
      },
    },
    {}
  );
  expect(result).toBe(true);
});

test('resolves if the user has a wildcard scope', async () => {
  const result = await withAuth(['scope:user'], noop)(
    null,
    null,
    {
      auth: {
        isAuthenticated: true,
        scope: ['scope:*'],
      },
    },
    {}
  );
  expect(result).toBe(true);
});

test('resolves if the user has a nested wildcard scope', async () => {
  const result = await withAuth(['scope:user:delete'], noop)(
    null,
    null,
    {
      auth: {
        isAuthenticated: true,
        scope: ['scope:user:*'],
      },
    },
    {}
  );
  expect(result).toBe(true);
});
