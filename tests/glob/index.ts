import { mergeResolvers } from "@graphql-tools/merge"
import { defineSimpleResolvers } from "graphql-define-resolvers"

import type { Resolvers } from "../fixtures"

export const { defineQuery, defineMutation, createResolvers } = defineSimpleResolvers<Resolvers>()

export const resolvers = mergeResolvers(
  await Promise.all(
    Object.values(import.meta.glob("./*/*.ts", { import: "default" }))
      .map(m => m() as Promise<Resolvers>),
  ),
)
