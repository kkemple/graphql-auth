/* eslint-env jest */
import withAuth, {ContextError, AuthorizationError} from './index'

const noop = () => true

test('returns an ContextError if auth context is missing', async () => {
  const result = await withAuth(noop)(null, null, {})
  expect(result).toBeInstanceOf(ContextError)
})

test('returns an AuthorizationError if the user is not authenticated', async () => {
  const result = await withAuth(noop)(null, null, {
    auth: {
      isAuthenticated: false
    }
  })
  expect(result).toBeInstanceOf(AuthorizationError)
})

test('returns an AuthorizationError if the user has not the right scope', async () => {
  const result = await withAuth(['scope:user'], noop)(null, null, {
    auth: {
      isAuthenticated: true,
      scope: [
        'scope:post'
      ]
    }
  })
  expect(result).toBeInstanceOf(AuthorizationError)
})

test('resolves if the user is authenticated (without scope)', async () => {
  const result = await withAuth(noop)(null, null, {
    auth: {
      isAuthenticated: true,
      scope: []
    }
  })
  expect(result).toBe(true)
})

test('resolves if the user is authenticated (with scope)', async () => {
  const result = await withAuth(['scope:user'], noop)(null, null, {
    auth: {
      isAuthenticated: true,
      scope: [
        'scope:user',
        'scope:post'
      ]
    }
  })
  expect(result).toBe(true)
})

test('resolves if the user is has a wildcard scope', async () => {
  const result = await withAuth(['scope:user'], noop)(null, null, {
    auth: {
      isAuthenticated: true,
      scope: [
        'scope:*'
      ]
    }
  })
  expect(result).toBe(true)
})

test('resolves if the user is has a nested wildcard scope', async () => {
  const result = await withAuth(['scope:user:delete'], noop)(null, null, {
    auth: {
      isAuthenticated: true,
      scope: [
        'scope:user:*'
      ]
    }
  })
  expect(result).toBe(true)
})
