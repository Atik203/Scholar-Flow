import jwt from "jsonwebtoken";
import type { Account, NextAuthOptions, Profile } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

type BackendUser = {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  role?: string | null;
};

type BackendResponse = {
  success: boolean;
  message?: string;
  data?: {
    user?: BackendUser;
  };
};

const resolvedNextAuthSecret = process.env.NEXTAUTH_SECRET;

if (!resolvedNextAuthSecret) {
  throw new Error(
    "NEXTAUTH_SECRET is required for authentication. Please configure apps/frontend/.env.local and restart the dev server."
  );
}

const nextAuthSecret = resolvedNextAuthSecret;

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

function buildBackendAccessToken(payload: {
  sub?: string | null;
  email?: string | null;
  role?: string | null;
}): string | undefined {
  if (!payload.sub) {
    return undefined;
  }

  try {
    return jwt.sign(
      {
        sub: payload.sub,
        email: payload.email ?? undefined,
        role: payload.role ?? "RESEARCHER",
      },
      nextAuthSecret,
      { expiresIn: "1h" }
    );
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Failed to sign backend access token", error);
    }
    return undefined;
  }
}

async function authenticateWithCredentials(
  email: string,
  password: string
): Promise<BackendUser> {
  const response = await fetch(`${apiBaseUrl}/auth/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    let message = "Invalid email or password";
    try {
      const errorBody = (await response.json()) as BackendResponse;
      message = errorBody.message || message;
    } catch {
      /* noop */
    }
    throw new Error(message);
  }

  const body = (await response.json()) as BackendResponse;
  const user = body?.data?.user;
  if (!user) {
    throw new Error(
      "Authentication succeeded but no user information was returned"
    );
  }
  return user;
}

async function syncOAuthUser(params: {
  user: BackendUser;
  account: Account | null | undefined;
  profile: Profile | undefined;
}): Promise<BackendUser | null> {
  const { user, account, profile } = params;
  if (!account) {
    return null;
  }

  const profileData = profile as Record<string, unknown> | undefined;

  const response = await fetch(`${apiBaseUrl}/auth/oauth/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      profile: {
        email: user.email,
        name: user.name,
        image: user.image,
        picture: profileData?.["picture"],
        avatar_url: profileData?.["avatar_url"],
      },
      account: {
        type: account["type"] ?? "oauth",
        provider: account["provider"] ?? "unknown",
        providerAccountId:
          (account["providerAccountId"] as string | undefined) ?? user.id,
        refresh_token: account["refresh_token"],
        access_token: account["access_token"],
        expires_at: account["expires_at"],
        token_type: account["token_type"],
        scope: account["scope"],
        id_token: account["id_token"],
        session_state: account["session_state"],
      },
    }),
  });

  if (!response.ok) {
    if (process.env.NODE_ENV === "development") {
      console.error(
        "Failed to sync OAuth user with backend",
        await response.text()
      );
    }
    return null;
  }

  const body = (await response.json()) as BackendResponse;
  return body?.data?.user ?? null;
}

export const authOptions: NextAuthOptions = {
  secret: nextAuthSecret,
  session: {
    strategy: "jwt",
    maxAge: 60 * 60,
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;

        if (!email || !password) {
          throw new Error("Please provide both email and password");
        }

        const backendUser = await authenticateWithCredentials(email, password);
        return {
          id: backendUser.id,
          email: backendUser.email,
          name: backendUser.name ?? null,
          image: backendUser.image ?? null,
          role: backendUser.role ?? "RESEARCHER",
        };
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
      if (account?.provider === "credentials") {
        return true;
      }

      const backendUser = await syncOAuthUser({ user, account, profile });
      if (backendUser) {
        user.id = backendUser.id;
        user.role = backendUser.role ?? "RESEARCHER";
        user.email = backendUser.email;
        user.name = backendUser.name ?? null;
        user.image = backendUser.image ?? null;
        return true;
      }

      return false;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.sub = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
        token.role = user.role ?? "RESEARCHER";
      }

      token.backendAccessToken = buildBackendAccessToken({
        sub: token.sub as string | undefined,
        email: token.email as string | undefined,
        role: token.role as string | undefined,
      });

      return token;
    },
    async session({ session, token }) {
      if (token?.sub) {
        session.user = {
          id: token.sub,
          email: (token.email as string) ?? "",
          name: (token.name as string | null | undefined) ?? null,
          image: (token.picture as string | null | undefined) ?? null,
          role: (token.role as string | undefined) ?? "RESEARCHER",
        };
      }

      if (token?.backendAccessToken) {
        session.accessToken = token.backendAccessToken;
      } else {
        delete session.accessToken;
      }

      return session;
    },
  },
  events: {
    async signOut() {
      // Resetting API caches or client state happens on the client via signOut utility
      return;
    },
  },
};
