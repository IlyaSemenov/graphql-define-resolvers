import type { GraphQLResolveInfo } from "graphql"

import type { Resolver } from "./types"

/**
 * Simplified resolver: passes resolver arguments in a single object.
 */
export type SimpleResolver<TResult, TParent, TContext, TArgs> = (ctx: {
  parent: TParent
  args: TArgs
  context: TContext
  info: GraphQLResolveInfo
}) => TResult | Promise<TResult>

export type SimpleResolverForResolver<R> = R extends Resolver<infer TResult, infer TParent, infer TContext, infer TArgs>
  ? SimpleResolver<TResult, TParent, TContext, TArgs>
  : never

/**
 * Create a Resolver from SimpleResolver.
 */
export function fromSimpleResolver<TResult, TParent, TContext, TArgs>(
  resolver: SimpleResolver<TResult, TParent, TContext, TArgs>,
): Resolver<TResult, TParent, TContext, TArgs> {
  return (parent, args, context, info) => resolver({ parent, args, context, info })
}
