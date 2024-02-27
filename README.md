# graphql-define-resolvers

Collect typed GraphQL query/mutation resolvers across multiple modules.

Assumes a GraphQL server project with resolver types generated with
`@graphql-codegen/typescript-resolvers`.

## Install

```sh
npm install graphql-define-resolvers
```

## Use

Create `resolvers/index.ts`:

```ts
import { defineResolvers } from "graphql-define-resolvers"

// Resolver types generated with @graphql-codegen/typescript-resolvers
import type { Resolvers } from "../types"

export const { defineQuery, defineMutation } = defineResolvers<Resolvers>()
```

Define individual resolvers under `resolvers/<module>/<resolver>.ts`:

```ts
import { defineQuery } from ".."
import { db } from "../../db"

export default defineQuery("whoami", async (parent, args, context, info) => {
  const { userId } = context
  return userId ? await db.user.find(userId) : null
})
```

Merge and consume resolvers:

```ts
import { mergeResolvers } from "@graphql-tools/merge"

import whoami from "./resolvers/auth/whoami"
// import ... from "./resolvers/.../..."

const resolvers = mergeResolvers([
  whoami,
  // ...
])

const server = new ApolloServer<ResolverContext>({ typeDefs, resolvers })
```

### Using import.meta.glob

This option is available only when using Vite or similar modern bundler.

Instead of manually importing all modules, use `import.meta.glob` to import them at once:

```ts
import { mergeResolvers } from "@graphql-tools/merge"

const resolvers = mergeResolvers(
  Object.values<Resolvers>(
    import.meta.glob("./resolvers/*/*.ts", { import: "default", eager: true })
  ),
)
```

Beware that eager glob import could easily cause circular import errors (for instance, that will
happen if you put this code in the same module which exports `defineQuery`).

For such cases, use non-eager glob import:

```ts
import { mergeResolvers } from "@graphql-tools/merge"
import { defineSimpleResolvers } from "graphql-define-resolvers"

import type { Resolvers } from "../types"

export const { defineQuery, defineMutation } = defineResolvers<Resolvers>()

// Works, even though the resolvers circularly import defineQuery from this module.
export const resolvers = mergeResolvers(
  await Promise.all(
    Object.values(import.meta.glob("./*/*.ts", { import: "default" }))
      .map(m => m() as Promise<Resolvers>),
  ),
)
```

## Define multiple resolvers

In `resolvers/index.ts`, export `createResolvers` alongside `defineQuery`:

```ts
export const { defineQuery, defineMutation, createResolvers } = defineResolvers<Resolvers>()
```

In resolver modules where you want to define multiple resolvers, use `createResolvers`:

```ts
import { createResolvers } from ".."
import { db } from "../../db"

const resolvers = createResolvers()

// Same API as in standalone defineQuery
resolvers.defineQuery("whoami", async (parent, args, context, info) => {
  const { userId } = context
  return userId ? await db.user.find(userId) : null
})

resolvers.defineMutation("login", async (parent, args, context, info) => {
  // implementation omitted for brevity
})

export default resolvers
```

## Single resolvers collector

Another approach is using a single resolvers collector object for all resolvers.

In `resolvers/index.ts`:

```ts
import { defineSimpleResolvers } from "graphql-define-resolvers"

// Resolver types generated with @graphql-codegen/typescript-resolvers
import type { Resolvers } from "../types"

const { createResolvers } = defineResolvers<Resolvers>()

export const resolvers = createResolvers()
```

Define individual resolvers under `resolvers/<module>/<resolver>.ts`:

```ts
import { resolvers } from ".."
import { db } from "../../db"

resolvers.defineQuery("whoami", async (parent, args, context, info) => {
  const { userId } = context
  return userId ? await db.user.find(userId) : null
})
```

Then import all resolver modules, either manually or with `import.meta.glob` (eager or non-eager
depending on how you organize modules).

For example, you can add this to the end of `resolvers/index.ts`:

```ts
await Promise.all(Object.values(import.meta.glob("./*/*.ts")).map(m => m()))
```

The `resolvers` object created with `createResolvers` implements `Resolvers` and is ready to be
directly consumed by a GraphQL server:

```ts
import { resolvers } from "./resolvers"

const server = new ApolloServer<ResolverContext>({ typeDefs, resolvers })
```

## Simple resolvers

This module provides an alternative way to define resolvers, where they accept not 4 arguments
`parent`, `args`, `context`, `info`, but a single object argument with the same keys: `{ parent,
args, context, info }`.

To opt in, use `defineSimpleResolvers` instead of `defineResolvers`:

```ts
export const { defineQuery, defineMutation, createResolvers } = defineSimpleResolvers<Resolvers>()
```

and then use simplified callbacks:

```ts
export default defineQuery("whoami", ({ context }) => {
  const { userId } = context
  return userId ? await db.user.find(userId) : null
})
```
