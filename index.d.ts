// Type definitions for graphql-auth
// Project: https://github.com/kkemple/graphql-auth
// Definitions by: Andréas `ScreamZ` HANSS <https://github.com/ScreamZ/>

export = withAuth;

declare function withAuth(resolve: Resolver): Resolver;
declare function withAuth(scopes: string[], resolver: Resolver): Resolver;

type Resolver = (root: any, args: any, context: any, info: any) => any

declare namespace withAuth { }
