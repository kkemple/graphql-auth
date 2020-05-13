export default withAuth;

declare function withAuth(resolve: GraphqlAuth.Resolver): GraphqlAuth.Resolver;
declare function withAuth(
  scopes: string[],
  resolver: GraphqlAuth.Resolver
): GraphqlAuth.Resolver;
declare function withAuth(
  scopesBuilder: (root: any, args: any, context: any, info: any) => string[],
  resolver: GraphqlAuth.Resolver
): GraphqlAuth.Resolver;

declare namespace GraphqlAuth {
  type Resolver = (root: any, args: any, context: any, info: any) => any;
}
