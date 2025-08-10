import { DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultUser;
    accessToken?: string;
  }

  interface User {
    role: string;
  }
}