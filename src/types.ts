import type { GraphQLResolveInfo } from "graphql"

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>

interface ResolverWithResolve<TResult, TParent, TContext, TArgs> {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>
}

export type Resolver<TResult, TParent, TContext, TArgs> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>

export type AnyResolver = Resolver<any, any, any, any>

export type AnyTypeResolvers = Partial<Record<string, AnyResolver>>

export interface AnyResolvers {
  Query?: AnyTypeResolvers
  Mutation?: AnyTypeResolvers
}

export type QueryResolvers<Resolvers extends AnyResolvers> = NonNullable<Resolvers["Query"]>
export type MutationResolvers<Resolvers extends AnyResolvers> = NonNullable<Resolvers["Mutation"]>

export type QueryResolverNames<Resolvers extends AnyResolvers> = Extract<keyof QueryResolvers<Resolvers>, string>
export type MutationResolverNames<Resolvers extends AnyResolvers> = Extract<keyof MutationResolvers<Resolvers>, string>

export type QueryResolver<Resolvers extends AnyResolvers, N extends QueryResolverNames<Resolvers>> = NonNullable<QueryResolvers<Resolvers>[N]>
export type MutationResolver<Resolvers extends AnyResolvers, N extends keyof MutationResolvers<Resolvers>> = NonNullable<MutationResolvers<Resolvers>[N]>
