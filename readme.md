# GraphQL Auth 

[![Travis Build Status](https://travis-ci.org/kkemple/graphql-auth.svg?branch=master)](https://travis-ci.org/kkemple/graphql-auth)

🔒 Authentication and authorization middleware for GraphQL.

`graphql-auth` is a very simple middleware that easily integrates with any GraphQL server that follows the GraphQL API for resolvers.

## Getting Started

### How It Works
`graphql-auth` exports a single function (middleware) `withAuth`. This function takes two parameters, the first is `scope` (if any) for authorization, and the second is the `callback` to call when auth checking is complete. Let's look at an example:

```javascript
import withAuth from 'graphql-auth';

const resolvers = {
  Query: {
    users: withAuth(['users:view'], (root, args, context) => { ... }),
    ...
  }
}
```

The way this works is `withAuth` looks for a special `auth` property on the `context` of the resolver. It expects the `auth` property to have two properties of its own:
1. `isAuthenticated` to tell if the user is logged in
2. `scope` scope of the logged in user (optional)

This allows you to use any form of authentication already supported by common frameworks like `express` and `hapi`. Here is an example in Hapi.js:

```javascript
import { graphqlHapi } from 'graphql-server-hapi';
import { makeExecutableSchema } from 'graphql-tools';

import typeDefs from './type-defs';
import resolvers from './resolvers';

const register = function(server, options, next) {
  const executableSchema = makeExecutableSchema({
    resolvers,
    typeDefs,
  });

  server.register(
    [
      {
        register: graphqlHapi,
        options: {
          path: '/graphql',
          graphqlOptions: request => ({
            pretty: true,
            schema: executableSchema,
            context: {
              auth: {
                isAuthenticated: request.auth.isAuthenticated,
                scope: request.auth.credentials
                  ? request.auth.credentials.scope
                  : null,
              },
            },
          }),
        },
      },
    ],
    error => {
      if (error) return next(error);
      next();
    },
  );
};

register.attributes = {
  name: 'graphql-api',
  version: '1.0.0',
};

export default register;
```
> For more in depth examples take a look at the [`graphql-auth-examples`](https://github.com/kkemple/graphql-auth-examples) repo.


### Installation
```shell
yarn add graphql-auth
```
### withAuth([scope,] callback)

*Without scope*:

```javascript
import withAuth from 'graphql-auth';

const resolvers = {
  Query: {
    users: withAuth((root, args, context, info) => { ... }),
    ...
  }
}
```

*With scope*:

```javascript
import withAuth from 'graphql-auth';

const resolvers = {
  Query: {
    users: withAuth(['users:view'], (root, args, context, info) => { ... }),
    ...
  }
}
```

*With dynamic scope*:

```javascript
import withAuth from 'graphql-auth';

const resolvers = {
  Query: {
    users: withAuth(
      (root, args, context, info) => { /* return scope based on resolver args */ },
      (root, args, context, info) => { ... }),
    ...
  }
}
```

## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
| [<img src="https://avatars1.githubusercontent.com/u/332115?v=4" width="100px;"/><br /><sub>artgibson</sub>](https://github.com/artgibson)<br />[💻](https://github.com/kkemple/graphql-auth/commits?author=artgibson "Code") | [<img src="https://avatars3.githubusercontent.com/u/1265681?v=4" width="100px;"/><br /><sub>HaNdTriX</sub>](http://henrikwenz.de/)<br />[💻](https://github.com/kkemple/graphql-auth/commits?author=HaNdTriX "Code") [📖](https://github.com/kkemple/graphql-auth/commits?author=HaNdTriX "Documentation") | [<img src="https://avatars1.githubusercontent.com/u/841956?v=4" width="100px;"/><br /><sub>Pascal Birchler</sub>](https://pascalbirchler.com)<br />[💻](https://github.com/kkemple/graphql-auth/commits?author=swissspidy "Code") |
| :---: | :---: | :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!
