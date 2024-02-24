// Resemble what @graphql-codegen/typescript-resolvers generates

import type { Resolver } from "graphql-define-resolvers"

export interface ResolverContext {
  userId?: number
}

export type Resolvers<ContextType = ResolverContext> = {
  Mutation?: MutationResolvers<ContextType>
  Query?: QueryResolvers<ContextType>
}

export type QueryResolvers<ContextType = ResolverContext> = {
  whoami?: Resolver<User | null, null, ContextType, null>
}

export type MutationResolvers<ContextType = ResolverContext> = {
  login?: Resolver<User, null, ContextType, { username: string, password: string }>
  logout?: Resolver<null, null, ContextType, null>
}

export interface User {
  id: number
  name: string
}
