# Better Auth + Neon DB + Prisma ORM + NextJS Learning Web App

This NextJS web application showcases how you can use Better Auth with Prisma ORM (through Prisma adapter) in your application.

## Project Set-Up

Create a folder and create new NextJS project in there:

```bash
pnpm create-next-app@latest .
```

Install Prisma and dependencies

```bash
pnpm add -D prisma
pnpm add @prisma/client
```

## Prisma Set-Up

Initialize Prisma in your project:

```bash
pnpm prisma init
```

Now remove ***output   = "../src/generated/prisma"*** from the ***schema.prisma*** so the file looks like this:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Now add the database connection string into the ***.env*** to `DATABASE_URL=`.

Configure the Prisma client generator:

```bash
pnpm prisma generate
```

Create ***prisma.ts*** file in `src/lib` folder and set up the Prisma client like this:

```ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
```

Add prisma generation to script in ***package.json***:
```json
   "scripts": {
      ...
      "postinstall": "prisma generate"
   },
```

## Better-Auth Set-Up

First, install the Better-Auth core package:

```bash
pnpm add better-auth
```

Next, generate a secure secret that Better-Auth will use to sign authentication tokens. This ensures your tokens cannot be messed with.

```bash
pnpm dlx @better-auth/cli@latest secret
```

Copy the generated secret and add it, along with your application's URL, to your ***.env*** file:

`BETTER_AUTH_SECRET=your-generated-secret`

`BETTER_AUTH_URL=http://localhost:3000`

Create ***auth.ts*** file in `src/lib` folder and set up the Better Auth client with the Prisma adapter:

```ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // Change based on you database
  }),
  emailAndPassword: { // This enables e-mail and password provider
    enabled: true,  // For other providers check the documentation
    autoSignIn: false,
  },
  plugins: [nextCookies()], // Allows for server-side authentication
});
```

Add Better-Auth models to your schema

```bash
pnpm dlx @better-auth/cli@latest generate
```

This will add the [following models](https://www.prisma.io/docs/guides/betterauth-nextjs#32-add-better-auth-models-to-your-schema).

Migrate the database:

```bash
pnpm prisma migrate dev --name add-auth-models
```

```bash
pnpm prisma generate
```

Set up the API routes in ***src/app/api/auth/\[...all]/route.ts***:

```ts
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
 
export const { POST, GET } = toNextJsHandler(auth);
```

Next, you'll need a client-side utility to interact with these endpoints from your React components. Create a new file ***src/lib/auth-client.ts***:

```ts
import { createAuthClient } from 'better-auth/react'

export const { signIn, signUp, signOut, useSession } = createAuthClient()
```

## Basic Usage

### Sign Up Action

```ts
"use server";

export async function signUp(values: z.infer<typeof signUpFormSchema>) {
  const { name, email, password } = values;

  const response = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
    },
    asResponse: true,
  });

  if (response.status !== 200) {
    return {
      error: "Něco se pokazilo",
    };
  }

  redirect("/prihlaseni");
}
```

### Sign In Action

```ts
"use server";

export async function signIn(values: z.infer<typeof signInFormSchema>) {
  const { email, password } = values;

  const response = await auth.api.signInEmail({
    body: {
      email,
      password,
    },
    asResponse: true,
  });

  if (!response.ok) {
    console.log(response);
    return {
      error: "Něco se pokazilo při přihlašování",
    };
  }

  redirect("/nastenka");
}
```

### Protected Page

```ts
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/prihlaseni");
  }

  return <h1>Hello User</h1>;
}
```
