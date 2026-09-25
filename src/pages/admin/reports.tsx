import { useEffect, useState } from "react";
import {
  Loader2,
  Mail,
  GitBranch,
  MousePointerClick,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  getAnalyticsData,
  type MessageRecord,
} from "@/services/site-analytics";
import { useLang } from "@/context/language-context";

interface AnalyticsData {
  messageTotal: number;
  recentMessages: MessageRecord[];
  projectClickTotal: number;
  projectClicks: Record<string, number>;
}

export default function Reports() {
  const { t } = useLang();
  const reports = t.admin.reports;
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnalyticsData()
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-3 justify-center py-12 text-muted-foreground">
        <Loader2 size={20} className="animate-spin" />
        {reports.title}...
      </div>
    );
  }

  const sortedProjects = Object.entries(data?.projectClicks ?? {}).sort(
    ([, a], [, b]) => b - a,
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail size={18} />
            {reports.messages.title}
          </CardTitle>
          <CardDescription>{reports.messages.desc}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-2.5 bg-primary/10 rounded-lg">
              <Mail className="text-primary" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold">{data?.messageTotal ?? 0}</p>
              <p className="text-xs text-muted-foreground">
                {reports.messages.total}
              </p>
            </div>
          </div>
          {data && data.recentMessages.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="text-left py-2 font-medium">
                      {reports.messages.table.time}
                    </th>
                    <th className="text-left py-2 font-medium">
                      {reports.messages.table.name}
                    </th>
                    <th className="text-left py-2 font-medium">
                      {reports.messages.table.email}
                    </th>
                    <th className="text-left py-2 font-medium">
                      {reports.messages.table.topic}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentMessages.map((m, i) => (
                    <tr key={i} className="border-b border-border/50">
                      <td className="py-2 font-mono text-xs whitespace-nowrap">
                        {new Date(m.timestamp).toLocaleString()}
                      </td>
                      <td className="py-2 text-xs">{m.name}</td>
                      <td className="py-2 text-xs">{m.email}</td>
                      <td className="py-2 text-xs text-muted-foreground">
                        {m.topic}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground py-4">
              {reports.messages.empty}
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch size={18} />
            {reports.projectClicks.title}
          </CardTitle>
          <CardDescription>{reports.projectClicks.desc}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-2.5 bg-primary/10 rounded-lg">
              <MousePointerClick className="text-primary" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold">{data?.projectClickTotal ?? 0}</p>
              <p className="text-xs text-muted-foreground">
                {reports.projectClicks.total}
              </p>
            </div>
          </div>
          {sortedProjects.length > 0 ? (
            <div className="space-y-2">
              {sortedProjects.map(([project, clicks]) => {
                const maxClicks = Math.max(
                  ...sortedProjects.map(([, c]) => c),
                );
                const pct = maxClicks > 0 ? (clicks / maxClicks) * 100 : 0;
                return (
                  <div
                    key={project}
                    className="flex items-center gap-3 text-sm"
                  >
                    <span className="font-mono text-xs font-medium min-w-0 flex-1 truncate">
                      {project}
                    </span>
                    <div className="flex-1 h-5 bg-muted rounded overflow-hidden">
                      <div
                        className="h-full bg-primary/70 rounded transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-8 text-right font-mono font-medium">
                      {clicks}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground py-4">
              {reports.projectClicks.empty}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}