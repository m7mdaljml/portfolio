import { useEffect, useState } from "react";
import { Loader2, Users, BarChart3, Clock, Timer } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useLang } from "@/context/language-context";
import {
  getVisitorStats,
  type VisitRecord,
} from "@/services/visitor-tracking";

interface Stats {
  totalUniqueVisitors: number;
  totalVisits: number;
  totalTimeMs: number;
  avgTimeMs: number;
  recentVisits: (VisitRecord & { fingerprint: string })[];
  dailyVisits: Record<string, number>;
  visitorTimes: {
    fingerprint: string;
    totalTimeMs: number;
    sessions: number;
    totalVisits: number;
    lastVisit: string;
  }[];
}

function maskFingerprint(fp: string): string {
  return fp.slice(0, 6) + "..." + fp.slice(-4);
}

function formatDuration(ms: number): string {
  if (!Number.isFinite(ms) || ms <= 0) return "0m";
  const totalSeconds = Math.round(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export default function VisitorStats() {
  const { t } = useLang();
  const visitors = t.admin.visitors;
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getVisitorStats()
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-3 justify-center py-12 text-muted-foreground">
        <Loader2 size={20} className="animate-spin" />
        {visitors.loading}
      </div>
    );
  }

  if (error || !stats) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          {visitors.noData}
        </CardContent>
      </Card>
    );
  }

  const sortedDays = Object.entries(stats.dailyVisits)
    .sort(([a], [b]) => b.localeCompare(a))
    .slice(0, 14);

  const statCards = [
    {
      icon: Users,
      value: stats.totalUniqueVisitors,
      label: visitors.uniqueVisitors,
    },
    {
      icon: BarChart3,
      value: stats.totalVisits,
      label: visitors.totalVisits,
    },
    {
      icon: Clock,
      value: sortedDays.length,
      label: visitors.activeDays,
    },
    {
      icon: Timer,
      value: formatDuration(stats.avgTimeMs),
      label: visitors.avgTime,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Card key={card.label}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-2.5 bg-primary/10 rounded-lg">
                <card.icon className="text-primary" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold">{card.value}</p>
                <p className="text-xs text-muted-foreground">{card.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {stats.visitorTimes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Timer size={18} />
              {visitors.timePerVisitor}
            </CardTitle>
            <CardDescription>{visitors.timePerVisitorDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="text-left py-2 font-medium">
                      {visitors.table.visitor}
                    </th>
                    <th className="text-left py-2 font-medium">
                      {visitors.table.totalTime}
                    </th>
                    <th className="text-left py-2 font-medium">
                      {visitors.table.sessions}
                    </th>
                    <th className="text-left py-2 font-medium">
                      {visitors.table.visits}
                    </th>
                    <th className="text-left py-2 font-medium">
                      {visitors.table.avgTime}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stats.visitorTimes.map((v, i) => (
                    <tr key={i} className="border-b border-border/50">
                      <td className="py-2 font-mono text-xs">
                        {maskFingerprint(v.fingerprint)}
                      </td>
                      <td className="py-2 font-mono text-xs">
                        {formatDuration(v.totalTimeMs)}
                      </td>
                      <td className="py-2 font-mono text-xs">
                        {v.sessions}
                      </td>
                      <td className="py-2 font-mono text-xs">
                        {v.totalVisits}
                      </td>
                      <td className="py-2 font-mono text-xs">
                        {formatDuration(v.sessions > 0 ? v.totalTimeMs / v.sessions : 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {sortedDays.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 size={18} />
              {visitors.dailyTitle}
            </CardTitle>
            <CardDescription>{visitors.dailyDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sortedDays.map(([day, count]) => {
                const maxCount = Math.max(...sortedDays.map(([, c]) => c));
                const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;
                return (
                  <div key={day} className="flex items-center gap-3 text-sm">
                    <span className="w-24 font-mono text-muted-foreground shrink-0">
                      {day}
                    </span>
                    <div className="flex-1 h-5 bg-muted rounded overflow-hidden">
                      <div
                        className="h-full bg-primary/70 rounded transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-8 text-right font-mono font-medium">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {stats.recentVisits.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock size={18} />
              {visitors.recentTitle}
            </CardTitle>
            <CardDescription>{visitors.recentDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="text-left py-2 font-medium">
                      {visitors.table.time}
                    </th>
                    <th className="text-left py-2 font-medium">
                      {visitors.table.visitor}
                    </th>
                    <th className="text-left py-2 font-medium">
                      {visitors.table.path}
                    </th>
                    <th className="text-left py-2 font-medium">
                      {visitors.table.referrer}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentVisits.map((v, i) => (
                    <tr key={i} className="border-b border-border/50">
                      <td className="py-2 font-mono text-xs">
                        {new Date(v.timestamp).toLocaleString()}
                      </td>
                      <td className="py-2 font-mono text-xs">
                        {maskFingerprint(v.fingerprint)}
                      </td>
                      <td className="py-2 font-mono text-xs">{v.path}</td>
                      <td className="py-2 text-xs text-muted-foreground max-w-[200px] truncate">
                        {v.referrer || "\u2014"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}