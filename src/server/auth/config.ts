import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { type DefaultSession, type NextAuthConfig } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { TypeORMAdapter } from "@auth/typeorm-adapter"
import {AppDataSourceOptions} from "~/server/data-source";
import AppDataSource from "~/server/data-source";
import CredentialsProvider from "next-auth/providers/credentials";
import { DataSource, type DataSourceOptions } from "typeorm";
import App from "next/app";

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
      role: string;
      nomecompleto: string;
    } & DefaultSession["user"];
  }

  interface User {
    // ...other properties
    id?: string;
    role?: string;
    nomecompleto?: string;
  }
}


export const authOptions = {
  adapter: TypeORMAdapter(AppDataSourceOptions),
  session: {
    strategy: "jwt",
  },
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

        // Extract username and password from the credentials
        const { username, password } = credentials as { username: string; password: string };
        

        // Query database to find the user and password
        const userRepo = AppDataSource.getRepository("cusuario");
        const accountRepo = AppDataSource.getRepository("usuarioSenha");

        // Find user by username 
        const user = await userRepo.findOne({ where: { username } });
        const account = await accountRepo.findOne({ where: { usuarioId: user?.id as string } });

        if (!user) {
          throw new Error("User not found");
        }

        // Validate password
        if (password !== account?.senha) {
          throw new Error("Invalid password");
        }

        const userId = user.id as string;
        const userName = user.nomecompleto as string;
        const userRole = user.nivel as string;

        return { id: userId, nomecompleto: userName, role: userRole };
      },
    }),
  ],


  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.nomecompleto = user.nomecompleto ?? "";
        token.role = user.role ?? "";
      }
      return token;
    },
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.id as string,
        nomecompleto: (token.nomecompleto as string) ?? "",
        role: (token.role as string) ?? "",
      },
    }),
  },
} satisfies NextAuthConfig;
