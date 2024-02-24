import { BaseResolverCollector, defineMutation, defineQuery } from "./define-resolvers"
import type { SimpleResolverForResolver } from "./simple-resolver"
import { fromSimpleResolver } from "./simple-resolver"
import type {
  AnyResolvers,
  MutationResolver,
  MutationResolverNames,
  QueryResolver,
  QueryResolverNames,
} from "./types"

export function defineSimpleResolvers<Resolvers extends AnyResolvers>() {
  return {
    defineQuery: defineSimpleQuery as
      <N extends QueryResolverNames<Resolvers>>(name: N, resolver: SimpleResolverForResolver<QueryResolver<Resolvers, N>>) => Resolvers,
    defineMutation: defineSimpleMutation as
      <N extends MutationResolverNames<Resolvers>>(name: N, resolver: SimpleResolverForResolver<MutationResolver<Resolvers, N>>) => Resolvers,
    createResolvers: createSimpleResolvers as
      () => SimpleResolverCollector<Resolvers>,
  }
}

export function defineSimpleQuery<Resolvers extends AnyResolvers, N extends QueryResolverNames<Resolvers>>(
  name: N,
  resolver: SimpleResolverForResolver<QueryResolver<Resolvers, N>>,
) {
  return defineQuery<Resolvers, N>(name, fromSimpleResolver(resolver) as QueryResolver<Resolvers, N>)
}

export function defineSimpleMutation<Resolvers extends AnyResolvers, N extends MutationResolverNames<Resolvers>>(
  name: N,
  resolver: SimpleResolverForResolver<MutationResolver<Resolvers, N>>,
) {
  return defineMutation<Resolvers, N>(name, fromSimpleResolver(resolver) as MutationResolver<Resolvers, N>)
}

export function createSimpleResolvers<Resolvers extends AnyResolvers>() {
  return new SimpleResolverCollector<Resolvers>()
}

export class SimpleResolverCollector<Resolvers extends AnyResolvers> extends BaseResolverCollector<Resolvers> {
  defineQuery<N extends QueryResolverNames<Resolvers>>(name: N, resolver: SimpleResolverForResolver<QueryResolver<Resolvers, N>>) {
    this._defineResolver("Query", name, fromSimpleResolver(resolver))
  }

  defineMutation<N extends MutationResolverNames<Resolvers>>(name: N, resolver: SimpleResolverForResolver<MutationResolver<Resolvers, N>>) {
    this._defineResolver("Mutation", name, fromSimpleResolver(resolver))
  }
}
