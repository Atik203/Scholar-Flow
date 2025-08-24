import jwt from "jsonwebtoken";
import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

// Custom adapter to work with our backend
const customAdapter = {
  async createUser(user: any) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/oauth/signin`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile: user,
          account: {
            type: "oauth",
            provider: user.provider || "unknown",
            providerAccountId: user.id || user.sub,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to create user");
    }

    const data = await response.json();
    return data.data.user;
  },

  async getUser(id: string) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${jwt.sign({ sub: id }, process.env.NEXTAUTH_SECRET!, { expiresIn: "1h" })}`,
          },
        }
      );

      if (!response.ok) return null;

      const data = await response.json();
      return data.data.user;
    } catch {
      return null;
    }
  },

  async getUserByEmail(email: string) {
    // This would need a backend endpoint, for now we'll skip
    return null;
  },

  async getUserByAccount({ provider, providerAccountId }: any) {
    // This would need a backend endpoint, for now we'll skip
    return null;
  },

  async updateUser(user: any) {
    return user;
  },

  async deleteUser(userId: string) {
    return null;
  },

  async linkAccount(account: any) {
    return account;
  },

  async unlinkAccount({ provider, providerAccountId }: any) {
    return;
  },

  async createSession({ sessionToken, userId, expires }: any) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/session/create`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionToken,
          userId,
          expires: expires.toISOString(),
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to create session");
    }

    const data = await response.json();
    return data.data.session;
  },

  async getSessionAndUser(sessionToken: string) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/session/get`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionToken }),
        }
      );

      if (!response.ok) return null;

      const data = await response.json();
      const sessionData = data.data.session;

      return {
        session: {
          sessionToken: sessionData.sessionToken,
          userId: sessionData.userId,
          expires: new Date(sessionData.expires),
        },
        user: sessionData.user,
      };
    } catch {
      return null;
    }
  },

  async updateSession({ sessionToken }: any) {
    return null;
  },

  async deleteSession(sessionToken: string) {
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/session/delete`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionToken }),
    });
  },

  async createVerificationToken({ identifier, expires, token }: any) {
    return { identifier, expires, token };
  },

  async useVerificationToken({ identifier, token }: any) {
    return null;
  },
};

const handler = NextAuth({
  // adapter: customAdapter,
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
    async signIn({ user, account, profile }) {
      try {
        // Create user in our backend when they sign in
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/oauth/signin`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              profile: {
                email: user.email,
                name: user.name,
                image: user.image,
                picture: (profile as any)?.picture,
                avatar_url: (profile as any)?.avatar_url,
              },
              account: {
                type: account?.type || "oauth",
                provider: account?.provider || "unknown",
                providerAccountId: account?.providerAccountId || user.id,
                refresh_token: account?.refresh_token,
                access_token: account?.access_token,
                expires_at: account?.expires_at,
                token_type: account?.token_type,
                scope: account?.scope,
                id_token: account?.id_token,
                session_state: account?.session_state,
              },
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          // Update user with backend data
          user.id = data.data.user.id;
          user.role = data.data.user.role;
          return true;
        }

        return false;
      } catch (error) {
        console.error("Sign-in error:", error);
        return false;
      }
    },
    async jwt({ token, user, account }) {
      // Seed defaults on first sign in
      if (user) {
        token.role = (user as any).role || "RESEARCHER";
        token.id = user.id;
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
    async session({ session, token }) {
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
