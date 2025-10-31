import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * available in the `jwt` and `session` callbacks.
   */
  interface User extends DefaultUser {
    role: string;
  }

  /**
   * The shape of the session object returned to the client,
   * available via `useSession` and `getSession`.
   */
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"]; // Keep the default properties
  }
}

// Extend the built-in JWT type
declare module "next-auth/jwt" {
  /**
   * The shape of the token object returned by the `jwt` callback.
   */
  interface JWT extends DefaultJWT {
    id: string;
    role: string;
  }
}
