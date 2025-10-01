import jsonwebtoken from "jsonwebtoken";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
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
            Authorization: `Bearer ${jsonwebtoken.sign({ sub: id }, process.env.NEXTAUTH_SECRET!, { expiresIn: "1h" })}`,
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

console.log("🔧 NextAuth Configuration Initializing...");
console.log("🔧 NODE_ENV:", process.env.NODE_ENV);
console.log("🔧 NEXTAUTH_SECRET set:", !!process.env.NEXTAUTH_SECRET);
console.log("🔧 NEXTAUTH_URL:", process.env.NEXTAUTH_URL);

const handler = NextAuth({
  // Enable debug mode in development
  debug: true, // FORCE debug mode to see all NextAuth internals

  // CRITICAL: Add logger to see what's happening
  logger: {
    error(code, metadata) {
      console.error("🚨 NextAuth Error:", code, metadata);
    },
    warn(code) {
      console.warn("⚠️ NextAuth Warning:", code);
    },
    debug(code, metadata) {
      console.log("🐛 NextAuth Debug:", code, metadata);
    },
  },

  // Use JWT strategy for stateless sessions (no database adapter)
  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // 1 hour (matches backend token expiry)
    updateAge: 60 * 5, // Update session every 5 minutes
  },
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60, // 1 hour
      },
    },
  },
  // adapter: customAdapter,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("🔥 AUTHORIZE FUNCTION CALLED");
        console.log("🔥 Credentials received:", {
          email: credentials?.email,
          password: credentials?.password ? "***" : "MISSING",
        });

        if (!credentials?.email || !credentials?.password) {
          console.log("❌ Missing credentials");
          throw new Error("Missing credentials");
        }

        try {
          // Use server-side API URL for backend calls
          const apiUrl =
            process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";
          const signinUrl = `${apiUrl}/auth/signin`;

          console.log("🚀 Attempting signin with URL:", signinUrl);
          console.log("📧 Email:", credentials.email);
          console.log("🔑 Password length:", credentials.password.length);

          const requestBody = {
            email: credentials.email,
            password: credentials.password,
          };
          console.log("📤 Request body:", JSON.stringify(requestBody, null, 2));

          const response = await fetch(signinUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
          });

          console.log("✅ Response status:", response.status);
          console.log("✅ Response ok:", response.ok);

          if (!response.ok) {
            const errorText = await response.text();
            console.log("❌ Error response:", errorText);
            throw new Error(errorText || "Authentication failed");
          }

          const data = await response.json();
          console.log("✅ Response data:", data);
          const user = data.data.user;

          if (user) {
            console.log("✅ User authenticated:", {
              id: user.id,
              email: user.email,
              role: user.role,
            });
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              image: user.image,
              role: user.role,
            };
          }

          console.log("❌ No user in response");
          throw new Error("No user data returned");
        } catch (error) {
          console.error("❌ Authentication error:", error);
          // Return null instead of throwing to allow NextAuth to handle the error
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("🔐 SIGNIN CALLBACK CALLED");
      console.log("🔐 Provider:", account?.provider);
      console.log("🔐 User:", user?.email);

      try {
        // Only handle OAuth providers, not credentials
        if (account?.provider === "credentials") {
          console.log("🔐 Credentials provider - allowing signin");
          return true; // Allow credentials signin to proceed
        }

        // Create user in our backend when they sign in with OAuth
        const apiUrl =
          process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";
        const response = await fetch(`${apiUrl}/auth/oauth/signin`, {
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
        });

        if (response.ok) {
          const data = await response.json();
          // Update user with backend data
          user.id = data.data.user.id;
          user.role = data.data.user.role;
          return true;
        }

        // Handle specific error responses
        if (response.status === 403) {
          const errorData = await response.json().catch(() => ({}));
          console.error(
            "OAuth sign-in blocked:",
            errorData.message || "Account deactivated"
          );
          // NextAuth will handle this as a failed signin
          return false;
        }

        return false;
      } catch (error) {
        console.error("Sign-in error:", error);
        return false;
      }
    },
    async jwt({ token, user, account }) {
      console.log("🔑 JWT CALLBACK CALLED");
      console.log("🔑 User present:", !!user);
      console.log("🔑 Token sub:", token.sub);
      console.log("🔑 Token id:", token.id);

      // Seed defaults on first sign in
      if (user) {
        console.log("🔑 First sign-in, seeding token with user data:", {
          id: user.id,
          email: user.email,
          role: (user as any).role,
        });

        // CRITICAL: Ensure all required fields are set
        token.role = (user as any).role || "RESEARCHER";
        token.id = user.id;
        token.sub = user.id; // CRITICAL: Must set sub for NextAuth to work
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;

        console.log("🔑 ✅ Token seeded successfully:", {
          sub: token.sub,
          id: token.id,
          role: token.role,
        });
      }

      // For subsequent callbacks, ensure sub is aligned if token.id exists
      if (token.id && token.sub !== token.id) {
        console.log("🔑 Aligning token.sub with token.id:", token.id);
        token.sub = token.id as string;
      }

      // Validate token has required fields
      if (!token.sub || !token.email) {
        console.error("🔑 ❌ CRITICAL: Token missing required fields", {
          sub: token.sub,
          email: token.email,
        });
        // Return token anyway to avoid breaking the session
      }

      // Mint a backend JWT for API calls
      const secret = process.env.NEXTAUTH_SECRET ?? "";
      const subject = (token.sub as string) || (token.id as string);
      if (secret && subject) {
        try {
          console.log("🔑 Minting backend JWT for subject:", subject);
          const payload = {
            sub: subject,
            email: token.email,
            role: (token.role as string) || "RESEARCHER",
          };
          // 1h expiry is fine for Phase 1; refresh handled by NextAuth session
          const backendAccessToken = jsonwebtoken.sign(payload, secret, {
            expiresIn: "1h",
          });
          (token as { backendAccessToken?: string }).backendAccessToken =
            backendAccessToken;
          console.log("🔑 ✅ Backend JWT created successfully");
        } catch (error) {
          console.error("🔑 ❌ Failed to create backend JWT:", error);
        }
      } else {
        console.error(
          "🔑 ❌ Cannot create backend JWT - missing secret or subject"
        );
      }

      console.log("🔑 JWT callback returning token");
      return token;
    },
    async session({ session, token }) {
      console.log("👤 SESSION CALLBACK CALLED");
      console.log("👤 Token present:", !!token);
      console.log("👤 Session.user present:", !!session.user);

      if (!token) {
        console.error("👤 ❌ CRITICAL: No token in session callback");
        return session;
      }

      if (!session.user) {
        console.error("👤 ❌ CRITICAL: No session.user in session callback");
        // Try to reconstruct user from token
        session.user = {
          id: token.sub as string,
          email: token.email as string,
          name: token.name as string,
          image: token.picture as string,
          role: (token.role as string) || "RESEARCHER",
        } as any;
        console.log("👤 ⚠️ Reconstructed session.user from token");
      }

      // Populate session with token data
      try {
        console.log("👤 Populating session with token data:", {
          id: token.sub,
          email: token.email,
          role: token.role,
        });

        session.user.id = token.sub as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.picture as string;
        session.user.role = (token.role as string) || "RESEARCHER";
        session.accessToken = token.backendAccessToken as string | undefined;

        console.log("👤 ✅ Session populated successfully:", {
          userId: session.user.id,
          role: session.user.role,
          hasAccessToken: !!session.accessToken,
        });
      } catch (error) {
        console.error("👤 ❌ Error populating session:", error);
      }

      console.log("👤 Session callback returning session");
      return session;
    },
  },
  events: {
    async signOut({ token, session }) {
      // Clear any server-side session data
      console.log("User signed out:", token?.sub || session?.user?.email);
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
});

export { handler as GET, handler as POST };
