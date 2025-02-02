import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { type DefaultSession, type NextAuthConfig } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { TypeORMAdapter } from "@auth/typeorm-adapter"
import {AppDataSourceOptions, AppDataSource} from "~/server/data-source";
import CredentialsProvider from "next-auth/providers/credentials";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}


/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 * 
 */


export const authOptions = {
  adapter: TypeORMAdapter(AppDataSourceOptions),
  // TODO: Remove debug
  debug: true,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { username, password } = credentials as { username: string; password: string };

        // Query your database to find the user
        const userRepo = AppDataSource.getRepository("users");
        const accountRepo = AppDataSource.getRepository("accounts");
        const user = await userRepo.findOne({ where: { username } });
        const account = await accountRepo.findOne({ where: { userId: user?.id } });

        if (!user) {
          throw new Error("User not found");
        }

        // Validate password (use bcrypt if hashed)
        if (password !== account?.password) {
          throw new Error("Invalid password");
        }

        return { id: user.id, name: user.name, username: user.username };
      },
    }),
  ],


  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
} satisfies NextAuthConfig;
