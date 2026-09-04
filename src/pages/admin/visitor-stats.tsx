import { useEffect, useState } from "react";
import { Loader2, Users, BarChart3, Clock } from "lucide-react";
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
  recentVisits: (VisitRecord & { fingerprint: string })[];
  dailyVisits: Record<string, number>;
}

function maskFingerprint(fp: string): string {
  return fp.slice(0, 6) + "..." + fp.slice(-4);
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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2.5 bg-primary/10 rounded-lg">
              <Users className="text-primary" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalUniqueVisitors}</p>
              <p className="text-xs text-muted-foreground">
                {visitors.uniqueVisitors}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2.5 bg-primary/10 rounded-lg">
              <BarChart3 className="text-primary" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalVisits}</p>
              <p className="text-xs text-muted-foreground">
                {visitors.totalVisits}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2.5 bg-primary/10 rounded-lg">
              <Clock className="text-primary" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold">{sortedDays.length}</p>
              <p className="text-xs text-muted-foreground">
                {visitors.activeDays}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

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
