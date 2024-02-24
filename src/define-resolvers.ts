import type {
  AnyResolver,
  AnyResolvers,
  MutationResolver,
  MutationResolverNames,
  MutationResolvers,
  QueryResolver,
  QueryResolverNames,
  QueryResolvers,
} from "./types"

export function defineResolvers<Resolvers extends AnyResolvers>() {
  return {
    defineQuery: defineQuery as
      <N extends QueryResolverNames<Resolvers>>(name: N, resolver: QueryResolver<Resolvers, N>) => Resolvers,
    defineMutation: defineMutation as
      <N extends MutationResolverNames<Resolvers>>(name: N, resolver: MutationResolver<Resolvers, N>) => Resolvers,
    createResolvers: createResolvers as
      () => ResolverCollector<Resolvers>,
  }
}

export function defineQuery<Resolvers extends AnyResolvers, N extends QueryResolverNames<Resolvers>>(
  name: N,
  resolver: QueryResolver<Resolvers, N>,
) {
  return {
    Query: {
      [name]: resolver,
    },
  } as Resolvers
}

export function defineMutation<Resolvers extends AnyResolvers, N extends MutationResolverNames<Resolvers>>(
  name: N,
  resolver: MutationResolver<Resolvers, N>,
) {
  return {
    Mutation: {
      [name]: resolver,
    },
  } as Resolvers
}

export function createResolvers<Resolvers extends AnyResolvers>() {
  return new ResolverCollector<Resolvers>()
}

export class BaseResolverCollector<Resolvers extends AnyResolvers> {
  Query = {} as QueryResolvers<Resolvers>
  Mutation = {} as MutationResolvers<Resolvers>

  // TODO: type and publish this?
  protected _defineResolver(type: "Query" | "Mutation", name: string, resolver: AnyResolver) {
    if (this[type][name]) {
      throw new Error(`Duplicate resolver ${type}.${name}`)
    }
    this[type][name] = resolver
  }
}

export class ResolverCollector<Resolvers extends AnyResolvers> extends BaseResolverCollector<Resolvers> {
  defineQuery<N extends QueryResolverNames<Resolvers>>(name: N, resolver: QueryResolver<Resolvers, N>) {
    this._defineResolver("Query", name, resolver)
  }

  defineMutation<N extends MutationResolverNames<Resolvers>>(name: N, resolver: MutationResolver<Resolvers, N>) {
    this._defineResolver("Mutation", name, resolver)
  }
}
