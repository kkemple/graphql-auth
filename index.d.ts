// Type definitions for graphql-auth
// Project: https://github.com/kkemple/graphql-auth
// Definitions by: Andréas `ScreamZ` HANSS <https://github.com/ScreamZ/>

export default withAuth;

declare function withAuth(resolve: GraphqlAuth.Resolver): GraphqlAuth.Resolver;
declare function withAuth(scopes: string[], resolver: GraphqlAuth.Resolver): GraphqlAuth.Resolver;

// Internal scope, avoid collision with other global definitions
declare namespace GraphqlAuth {
  type Resolver = (root: any, args: any, context: any, info: any) => any
}
