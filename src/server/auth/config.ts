import { type DefaultSession, type NextAuthConfig } from "next-auth";
import { TypeORMAdapter } from "@auth/typeorm-adapter"
import {AppDataSourceOptions} from "~/server/auth/data-source";
import AppDataSource from "~/server/auth/data-source";
import CredentialsProvider from "next-auth/providers/credentials";
import crypto from 'crypto';
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
      tipoimagem: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    // ...other properties
    id?: string;
    role?: string;
    nomecompleto?: string;
    email?: string | null;
    tipoimagem?: string | null;
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
        const account = await accountRepo.findOne({
          where: { usuarioId: user?.id as string },
          order: { id: "DESC" }, // Ordena do maior para o menor
        });

        if (!user) {
          throw new Error("User not found");
        }
        
        // console.log('User: ', user);
        // console.log('Account: ', account);

        //Inicio da validacao da senha
        //Metodo para criptografar a senha digitada na tela
        function createKey(phrase: string): string {
          const salt = '%94a40s';
          const data = phrase + salt;
          const hash = crypto.createHash('sha512');
          hash.update(data, 'utf8');
          const hashed = hash.digest('base64');
          return hashed;
        }

        //Chamada para criptografar a senha
        const i_key = createKey(password);
       
        //console.log('Senha do banco ?', account?.senha);
        //console.log('Senha da tela ?', password);        
        //console.log('senha da tela convertida ?', i_key);

        console.log('User: ', user);
        //console.log('Account: ', account);        
        
        // Modificao do if para confrontar as senhas do banco de dados com a digitada
        // Validate password
        if (i_key !== account?.senha) {
        //if (password !== account?.senha) {
          throw new Error("Invalid password");
        }

        //Fim da validacao da senha     
                
        const userId = user.id as string;
        const userName = user.nomecompleto as string;
        const userRole = user.nivel as string;
        const userEmail = user.email as string;
        const userTipoimagem = user.tipoimagem as string;

        return { 
          id: userId, 
          nomecompleto: userName, 
          role: userRole, 
          email: userEmail,
          tipoimagem: userTipoimagem
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
        token.tipoimagem = user.tipoimagem ?? "";
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
        tipoimagem: (token.tipoimagem as string) ?? "",
        role: (token.role as string) ?? "",
        email: token.email! ?? "",
      },
      
    }
  ),
  },
} satisfies NextAuthConfig;