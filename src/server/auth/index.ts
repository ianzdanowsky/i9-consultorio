import NextAuth from "next-auth";
import { cache } from "react";
import {AppDataSourceOptions, AppDataSource} from "~/server/data-source";


import { authOptions } from "./config";

// AppDataSource.initialize().then(() => {
//     console.log("✅ Data Source has been initialized!");
//     }).catch((err) => {
//     console.error("❌ Error during Data Source initialization:", err);
//     }
// );

const { auth: uncachedAuth, handlers, signIn, signOut } = NextAuth(authOptions);

const auth = cache(uncachedAuth);

export { auth, handlers, signIn, signOut };
