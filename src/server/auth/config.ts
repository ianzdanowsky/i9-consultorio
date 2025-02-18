import { type DefaultSession, type NextAuthConfig } from "next-auth";
import { TypeORMAdapter } from "@auth/typeorm-adapter"
import {AppDataSourceOptions} from "~/server/data-source";
import AppDataSource from "~/server/data-source";
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
      role: string;
      nomecompleto: string;
      email: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    // ...other properties
    id?: string;
    role?: string;
    nomecompleto?: string;
    email?: string | null;
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
        const user = await userRepo.findOne({ where: { email: username } });
        const account = await accountRepo.findOne({ where: { usuarioId: user?.id as string } });

        if (!user) {
          throw new Error("User not found");
        }
        
        console.log('User: ', user);
        console.log('Account: ', account);

        // Validate password
        if (password !== account?.senha) {
          throw new Error("Invalid password");
        }
        
        console.log("User found: ", user);
        
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
        email: token.email! ?? "",
      },
    }),
  },
} satisfies NextAuthConfig;
