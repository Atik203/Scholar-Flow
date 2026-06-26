"use client";

import { useState, useEffect } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/redux/auth/useAuth";
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

export default function SecurityDashboardPage() {
  const { user } = useAuth();
  const u = user as Record<string, unknown> | null;
  const twoFa = (u?.twoFactorEnabled as boolean) ?? false;
  const sessions = (u?.activeSessions as number) ?? 1;
  const lastLogin = u?.lastLogin
    ? new Date(u.lastLogin as string).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit",
      })
    : "N/A";

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
            label="Active Sessions"
            value={String(sessions)}
            desc={sessions > 1 ? "Multiple devices signed in" : "Only this device"}
            icon={Laptop}
            color="bg-blue-500"
          />
        </motion.div>
        <motion.div variants={fadeIn}>
          <StatBox
            label="Last Login"
            value={lastLogin}
            desc="Your most recent sign-in"
            icon={Clock}
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
            badge={`${sessions} active`}
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
          />
        </motion.div>
      </motion.div>

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
              <p className="font-medium mt-0.5 capitalize">{lastProvider === "credentials" ? "Password" : lastProvider}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
