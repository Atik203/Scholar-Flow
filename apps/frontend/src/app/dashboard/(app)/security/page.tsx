"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/redux/auth/useAuth";
import { useGetLoginSummaryQuery } from "@/redux/api/loginHistoryApi";
import { Shield, ShieldCheck, ShieldAlert, Smartphone, Laptop, EyeOff, Clock, ArrowRight, Fingerprint, History } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

const fadeIn = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

function StatBox({ label, value, desc, icon: Icon, color }: {
  label: string; value: string; desc: string; icon: React.ElementType; color: string;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground">{label}</span>
          <div className={`h-9 w-9 rounded-lg ${color} flex items-center justify-center text-white`}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{desc}</p>
      </CardContent>
    </Card>
  );
}

function NavLink({ title, desc, icon: Icon, href, color, badge }: {
  title: string; desc: string; icon: React.ElementType; href: string; color: string; badge?: string;
}) {
  return (
    <Link href={href} className="group block">
      <Card className="hover:shadow-md hover:border-primary/40 transition-all duration-200 h-full">
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div className={`h-10 w-10 rounded-lg ${color} flex items-center justify-center text-white group-hover:scale-105 transition-transform`}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">{title}</h3>
                {badge && <Badge variant="secondary" className="text-[10px]">{badge}</Badge>}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{desc}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

const PROVIDER_LABELS: Record<string, string> = {
  credentials: "Password",
  google: "Google",
  github: "GitHub",
};

export default function SecurityDashboardPage() {
  const { user } = useAuth();
  const u = user as Record<string, unknown> | null;
  const twoFa = (u?.twoFactorEnabled as boolean) ?? false;

  const { data: summary, isLoading } = useGetLoginSummaryQuery();

  const lastLogin = summary?.data?.lastLogin;
  const totalLogins = summary?.data?.totalLogins ?? 0;
  const lastLoginStr = lastLogin
    ? new Date(lastLogin.createdAt).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit",
      })
    : "N/A";

  const lastLoginProvider = lastLogin
    ? PROVIDER_LABELS[lastLogin.provider] || lastLogin.provider
    : null;

  const [lastProvider, setLastProvider] = useState<string | null>(null);
  useEffect(() => {
    const match = document.cookie.match(/(?:^|;\s*)sf_last_auth=([^;]*)/);
    setLastProvider(match ? match[1] : null);
  }, []);

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
          <Shield className="h-7 w-7 text-primary" />Security
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account security, authentication, and privacy settings.
        </p>
      </div>

      <motion.div
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.08 } } }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <motion.div variants={fadeIn}>
          <StatBox
            label="Two-Factor Auth"
            value={twoFa ? "Enabled" : "Disabled"}
            desc={twoFa ? "Your account is extra secure" : "Add an extra layer of security"}
            icon={twoFa ? ShieldCheck : ShieldAlert}
            color={twoFa ? "bg-green-500" : "bg-yellow-500"}
          />
        </motion.div>
        <motion.div variants={fadeIn}>
          <StatBox
            label="Login Activity"
            value={isLoading ? "..." : String(totalLogins)}
            desc={totalLogins > 0 ? "Total sign-ins recorded" : "No login data yet"}
            icon={Clock}
            color="bg-blue-500"
          />
        </motion.div>
        <motion.div variants={fadeIn}>
          <StatBox
            label="Last Login"
            value={isLoading ? "..." : lastLoginStr}
            desc={lastLoginProvider ? `via ${lastLoginProvider}` : "Your most recent sign-in"}
            icon={History}
            color="bg-purple-500"
          />
        </motion.div>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.08 } } }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <motion.div variants={fadeIn}>
          <NavLink
            title="Two-Factor Authentication"
            desc="Set up authenticator app or disable 2FA"
            icon={Smartphone}
            href="/dashboard/security/2fa"
            color="bg-green-500"
            badge={twoFa ? "Active" : undefined}
          />
        </motion.div>
        <motion.div variants={fadeIn}>
          <NavLink
            title="Active Sessions"
            desc="View and manage your signed-in devices"
            icon={Laptop}
            href="/dashboard/security/sessions"
            color="bg-blue-500"
          />
        </motion.div>
        <motion.div variants={fadeIn}>
          <NavLink
            title="Privacy Settings"
            desc="Control profile visibility and data sharing"
            icon={EyeOff}
            href="/dashboard/privacy"
            color="bg-purple-500"
          />
        </motion.div>
        <motion.div variants={fadeIn}>
          <NavLink
            title="Login Activity"
            desc="Review your recent sign-in history"
            icon={History}
            href="/dashboard/security/login-history"
            color="bg-orange-500"
            badge={totalLogins > 0 ? `${totalLogins} events` : undefined}
          />
        </motion.div>
      </motion.div>

      {lastLogin && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4 text-purple-500" />
              Latest Sign-In
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 text-sm">
              <Badge variant="secondary" className="text-[11px]">
                {lastLoginProvider || lastLogin.provider}
              </Badge>
              <span className="text-muted-foreground">
                {new Date(lastLogin.createdAt).toLocaleString("en-US", {
                  weekday: "long", month: "long", day: "numeric",
                  year: "numeric", hour: "2-digit", minute: "2-digit",
                })}
              </span>
              {lastLogin.device && (
                <>
                  <span className="text-muted-foreground/40">·</span>
                  <span className="text-muted-foreground">{lastLogin.device}</span>
                </>
              )}
              {lastLogin.ip && (
                <>
                  <span className="text-muted-foreground/40">·</span>
                  <span className="text-muted-foreground text-xs font-mono">{lastLogin.ip}</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Fingerprint className="h-4 w-4 text-primary" />Account Info
          </CardTitle>
          <CardDescription>Basic information about your account.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Email</span>
            <p className="font-medium mt-0.5">{user?.email ?? "—"}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Name</span>
            <p className="font-medium mt-0.5">{user?.name ?? "—"}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Role</span>
            <p className="font-medium mt-0.5 capitalize">{user?.role ?? "—"}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Email Verified</span>
            <p className="font-medium mt-0.5">
              {user?.emailVerified ? (
                <span className="text-green-600">Yes</span>
              ) : (
                <span className="text-yellow-600">No</span>
              )}
            </p>
          </div>
          {lastProvider && (
            <div>
              <span className="text-muted-foreground">Last Login Method</span>
              <p className="font-medium mt-0.5 capitalize">
                {PROVIDER_LABELS[lastProvider] || lastProvider}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
