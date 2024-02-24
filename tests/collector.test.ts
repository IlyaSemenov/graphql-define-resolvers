import { expect, test } from "vitest"

import { resolvers } from "./collector"

test("glob", () => {
  expect(Object.keys(resolvers).sort()).toEqual(["Mutation", "Query"])
  expect(Object.keys(resolvers.Mutation).sort()).toEqual(["login", "logout"])

  // @ts-expect-error 2349
  expect(resolvers.Query.whoami(null, null, { userId: 5 }, null)).toEqual({ id: 5, name: "test" })

  // @ts-expect-error 2349
  expect(resolvers.Mutation.login(null, { username: "alice" }, {}, null)).toEqual({ id: 1, name: "alice" })

  // @ts-expect-error 2349
  expect(resolvers.Mutation.logout(null, null, {}, null)).toEqual(null)
})
