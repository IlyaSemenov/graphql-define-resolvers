import { defineSimpleResolvers } from "graphql-define-resolvers"
import { expect, test } from "vitest"

import type { Resolvers } from "./fixtures"

const { defineQuery, defineMutation, createResolvers } = defineSimpleResolvers<Resolvers>()

test("defineQuery", () => {
  const resolvers = defineQuery("whoami", ({ context }) => {
    return context.userId ? { id: context.userId, name: "test" } : null
  })

  // @ts-expect-error 2349
  expect(resolvers.Query.whoami(null, null, { userId: 5 }, null)).toEqual({ id: 5, name: "test" })
})

test("defineMutation", () => {
  const resolvers = defineMutation("login", ({ args }) => {
    return { id: 1, name: args.username }
  })

  // @ts-expect-error 2349
  expect(resolvers.Mutation.login(null, { username: "alice" }, {}, null)).toEqual({ id: 1, name: "alice" })
})

test("createResolvers", () => {
  const resolvers = createResolvers()

  resolvers.defineQuery("whoami", ({ context }) => {
    return context.userId ? { id: context.userId, name: "test" } : null
  })

  resolvers.defineMutation("login", ({ args }) => {
    return { id: 1, name: args.username }
  })

  resolvers.defineMutation("logout", () => null)

  expect(Object.keys(resolvers).sort()).toEqual(["Mutation", "Query"])
  expect(Object.keys(resolvers.Mutation).sort()).toEqual(["login", "logout"])

  // @ts-expect-error 2349
  expect(resolvers.Query.whoami(null, null, { userId: 5 }, null)).toEqual({ id: 5, name: "test" })

  // @ts-expect-error 2349
  expect(resolvers.Mutation.login(null, { username: "alice" }, {}, null)).toEqual({ id: 1, name: "alice" })

  // @ts-expect-error 2349
  expect(resolvers.Mutation.logout(null, null, {}, null)).toEqual(null)
})
