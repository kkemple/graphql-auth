export class ContextError extends Error {
  constructor (message = '`auth` property not found on context!') {
    super(message)
    this.message = message
    this.name = 'ContextError'
  }
}

export class AuthorizationError extends Error {
  constructor (message = 'Permission Denied!') {
    super(message)
    this.message = message
    this.name = 'AuthorizationError'
  }
}

function validateScope (required, provided) {
  let hasScope = false

  required.forEach(scope => {
    provided.forEach(function (perm) {
      // user:* -> user:create, user:view:self
      var permRe = new RegExp('^' + perm.replace('*', '.*') + '$')
      if (permRe.exec(scope)) hasScope = true
    })
  })

  return hasScope
}

export default function withAuth (scope, callback) {
  const next = callback || scope
  let requiredScope = callback ? scope : null

  return async function (_, __, context) {
    if (!context.auth) return new ContextError()
    if (!context.auth.isAuthenticated) { return new AuthorizationError('Not Authenticated!') }

    if (requiredScope && typeof requiredScope === 'function') {
      requiredScope = await Promise.resolve().then(() =>
        requiredScope(_, __, context)
      )
    }

    if (
      (requiredScope && requiredScope.length && !context.auth.scope) ||
      (requiredScope && requiredScope.length &&
        !validateScope(requiredScope, context.auth.scope))
    ) {
      return new AuthorizationError()
    }

    return next(_, __, context)
  }
}
