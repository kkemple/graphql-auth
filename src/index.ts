type Resolver = (parent: any, params: any, context: any, info: any) => any;

function validateScope(required: string[], provided: string[]): boolean {
  let hasScope = false;

  required.forEach((scope: string) => {
    provided.forEach(function(providedScope: string) {
      // user:* -> user:create, user:view:self
      var regex = new RegExp('^' + providedScope.replace('*', '.*') + '$');
      if (regex.exec(scope)) {
        hasScope = true;
      }
    });
  });

  return hasScope;
}

export default function withAuth(scope: any, callback?: any) {
  const next: Resolver = callback ? callback : scope;

  return async function(_: any, __: any, context: any, info: any) {
    // will hold resolved scope, if any
    let finalScope;

    // if no auth object on context in resolver, error out
    if (!context.auth) {
      return new Error('`auth` property not found on context!');
    }

    // if user is not authenticated, error out
    if (!context.auth.isAuthenticated) {
      return new Error('Not authenticated!');
    }

    // determine if we need to check scopes
    const hasScope = !!callback;
    if (hasScope) {
      // check if scope is a function that resolves to required scopes
      if (typeof scope === 'function') {
        // we wrap the function in a promise so whether scope resolver is async or not we can handle it like it is
        finalScope = await Promise.resolve(() => scope(_, __, context, info));
      } else {
        finalScope = scope;
      }

      if (finalScope && finalScope.length) {
        if (
          !context.auth.scope ||
          !validateScope(finalScope, context.auth.scope)
        ) {
          return new Error('Permission denied!');
        }
      }
    }

    return next(_, __, context, info);
  };
}
