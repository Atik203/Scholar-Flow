import jwt from "jsonwebtoken";
import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user?: { id?: string } }) {
      // Seed defaults on first sign in
      if (user) {
        token.role = (token.role as string) || "RESEARCHER";
      }

      // Mint a backend JWT for API calls
      const secret = process.env.NEXTAUTH_SECRET ?? "";
      if (secret && token?.sub) {
        const payload = {
          sub: token.sub,
          email: token.email,
          role: (token.role as string) || "RESEARCHER",
        };
        // 1h expiry is fine for Phase 1; refresh handled by NextAuth session
        const backendAccessToken = jwt.sign(payload, secret, {
          expiresIn: "1h",
        });
        (token as { backendAccessToken?: string }).backendAccessToken =
          backendAccessToken;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token && session.user) {
        session.user.id = token.sub as string;
        session.user.role = (token.role as string) || "RESEARCHER";
        session.accessToken = token.backendAccessToken as string | undefined;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
});

export { handler as GET, handler as POST };
