"use client";

/**
 * Admin Plans Page
 */

import { Crown, DollarSign, Sparkles, Star, TrendingUp, Users, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/customUI/PageHeader";
import { useListPlansQuery } from "@/redux/api/adminExtendedApi";

const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;

export default function AdminPlansPage() {
  const { data, isLoading } = useListPlansQuery();
  const plans = data?.data ?? [];

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        icon={<Crown className="h-7 w-7 text-white" />}
        title="Plans"
        description="Subscription plan management"
      />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map((p, i) => (
            <Card key={p.id} className="overflow-hidden">
              <div
                className={`h-2 ${
                  i === 0
                    ? "bg-slate-300"
                    : i === 1
                      ? "bg-indigo-500"
                      : "bg-gradient-to-r from-purple-500 to-pink-500"
                }`}
              />
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {i === 0 ? (
                        <Star className="h-5 w-5" />
                      ) : i === 1 ? (
                        <Zap className="h-5 w-5 text-indigo-500" />
                      ) : (
                        <Crown className="h-5 w-5 text-purple-500" />
                      )}
                      {p.name}
                    </CardTitle>
                    <CardDescription>
                      <Badge variant="outline" className="mt-1">
                        {p.code}
                      </Badge>
                    </CardDescription>
                  </div>
                  {!p.active && <Badge variant="secondary">Inactive</Badge>}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-3xl font-bold">
                    {formatPrice(p.priceCents)}
                    <span className="text-sm text-muted-foreground font-normal">
                      /{p.interval}
                    </span>
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                  <div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Users className="h-3 w-3" />
                      Active
                    </div>
                    <p className="text-xl font-bold">{p.activeSubscribers}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <DollarSign className="h-3 w-3" />
                      MRR
                    </div>
                    <p className="text-xl font-bold">
                      {formatPrice(p.monthlyRevenueCents)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
