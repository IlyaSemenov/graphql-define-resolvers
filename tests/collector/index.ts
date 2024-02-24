import { defineSimpleResolvers } from "graphql-define-resolvers"

import type { Resolvers } from "../fixtures"

const { createResolvers } = defineSimpleResolvers<Resolvers>()

export const resolvers = createResolvers()

await Promise.all(Object.values(import.meta.glob("./*/*.ts")).map(m => m()))
