import { type DefaultSession, type NextAuthConfig } from "next-auth";
import { TypeORMAdapter } from "@auth/typeorm-adapter"
import {AppDataSourceOptions} from "~/server/auth/data-source";
import AppDataSource from "~/server/auth/data-source";
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
  // debug: true,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {

        // Extract username and password from the credentials
        const { email, password } = credentials as { email: string; password: string };
        
        // console.log('Email: ', email);
        // console.log('Password: ', password);

        // const AppDataSource = new DataSource(AppDataSourceOptions);

        // Query database to find the user and password
        const userRepo = AppDataSource.getRepository("cusuario");
        const accountRepo = AppDataSource.getRepository("usuarioSenha");

        // console.log('UserRepo: ', userRepo);
        // console.log('AccountRepo: ', accountRepo);

        // Find user by username 
        const user = await userRepo.findOneBy({ email: email });
        const account = await accountRepo.findOne({ where: { usuarioId: user?.id as string } });

        if (!user) {
          throw new Error("User not found");
        }
        
        // console.log('User: ', user);
        // console.log('Account: ', account);

        // Validate password
        if (password !== account?.senha) {
          throw new Error("Invalid password");
        }
                
        const userId = user.id as string;
        const userName = user.nomecompleto as string;
        const userRole = user.nivel as string;
        const userEmail = user.email as string;

        return { 
          id: userId, 
          nomecompleto: userName, 
          role: userRole, 
          email: userEmail
        }; 
      },
    }),
  ],


  callbacks: {
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth
    },
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
      
    }
  ),
  },
} satisfies NextAuthConfig;
