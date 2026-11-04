import { Link } from "react-router-dom";
import { BarChart2, CheckCircle, Clock, Layers, TrendingUp, Activity } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import { useProjects } from "@/hooks/useProjects";
import { useTasks } from "@/hooks/useTasks";
import { useMessages } from "@/hooks/useMessages";

const STATUS_COLORS: Record<string, string> = {
  todo:        "#64748b",
  in_progress: "#3b82f6",
  review:      "#f59e0b",
  done:        "#10b981",
};

const CHART_TOOLTIP_STYLE = {
  background: "rgba(13,17,23,0.95)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 8,
  color: "#e2e8f0",
  fontSize: 12,
};

export default function Home() {
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const { data: tasks,    isLoading: tasksLoading    } = useTasks();
  const { data: messages, isLoading: messagesLoading } = useMessages(projects?.[0]?.id);

  const loading = projectsLoading || tasksLoading;

  const totalProjects = projects?.length ?? 0;
  const statusCounts  = (tasks ?? []).reduce<Record<string, number>>((acc, t) => {
    acc[t.status] = (acc[t.status] ?? 0) + 1;
    return acc;
  }, {});

  const totalTasks    = tasks?.length ?? 0;
  const doneTasks     = statusCounts["done"] ?? 0;
  const completionPct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
  const pendingTasks  = (statusCounts["todo"] ?? 0) + (statusCounts["in_progress"] ?? 0);

  const pieData = Object.entries(statusCounts).map(([status, value]) => ({
    name: status.replace("_", " "),
    value,
  }));

  const barData = [
    { name: "Todo",     tasks: statusCounts["todo"]        ?? 0 },
    { name: "Progress", tasks: statusCounts["in_progress"] ?? 0 },
    { name: "Review",   tasks: statusCounts["review"]      ?? 0 },
    { name: "Done",     tasks: statusCounts["done"]        ?? 0 },
  ];

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-slate-100">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-0.5">Your ops at a glance</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {loading ? (
          [1,2,3,4].map((i) => (
            <div key={i} className="h-24 rounded-2xl skeleton" />
          ))
        ) : (
          <>
            <StatCard icon={<Layers size={18}/>}      label="Projects"    value={totalProjects}      gradient="gradient-violet" glow="0 0 20px rgba(139,92,246,0.25)" />
            <StatCard icon={<CheckCircle size={18}/>} label="Completion"  value={`${completionPct}%`} gradient="gradient-green"  glow="0 0 20px rgba(16,185,129,0.25)" />
            <StatCard icon={<Clock size={18}/>}       label="Pending"     value={pendingTasks}        gradient="gradient-amber"  glow="0 0 20px rgba(245,158,11,0.25)" />
            <StatCard icon={<TrendingUp size={18}/>}  label="Total Tasks" value={totalTasks}          gradient="gradient-cyan"   glow="0 0 20px rgba(6,182,212,0.25)" />
          </>
        )}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Bar chart */}
        <div
          className="lg:col-span-2 rounded-2xl p-5"
          style={{ background: "rgba(13,17,23,0.6)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-slate-200">Tasks by Status</p>
              <p className="text-xs text-slate-500 mt-0.5">Across all projects</p>
            </div>
            <BarChart2 size={16} className="text-slate-600" />
          </div>
          {loading ? (
            <div className="h-44 skeleton rounded-xl" />
          ) : (
            <ResponsiveContainer width="100%" height={175}>
              <BarChart data={barData} barSize={28}>
                <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={CHART_TOOLTIP_STYLE} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                <Bar dataKey="tasks" radius={[6,6,0,0]}>
                  {barData.map((entry, i) => {
                    const colors = ["#64748b","#3b82f6","#f59e0b","#10b981"];
                    return <Cell key={i} fill={colors[i]} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Pie chart */}
        <div
          className="rounded-2xl p-5"
          style={{ background: "rgba(13,17,23,0.6)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-slate-200">Breakdown</p>
              <p className="text-xs text-slate-500 mt-0.5">Status split</p>
            </div>
            <Activity size={16} className="text-slate-600" />
          </div>
          {loading ? (
            <div className="h-44 skeleton rounded-full mx-auto w-44" />
          ) : pieData.length === 0 ? (
            <div className="h-44 flex items-center justify-center">
              <p className="text-sm text-slate-600">No tasks yet</p>
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" outerRadius={60} innerRadius={30} paddingAngle={3}>
                    {pieData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={STATUS_COLORS[entry.name.replace(" ", "_")] ?? "#64748b"}
                      />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
                {pieData.map((entry) => (
                  <div key={entry.name} className="flex items-center gap-1.5">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ background: STATUS_COLORS[entry.name.replace(" ", "_")] ?? "#64748b" }}
                    />
                    <span className="text-[10px] text-slate-500 capitalize">{entry.name}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Inbox preview */}
      <div
        className="rounded-2xl p-5"
        style={{ background: "rgba(13,17,23,0.6)", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-semibold text-slate-200">Recent Messages</p>
            <p className="text-xs text-slate-500 mt-0.5">From connected Slack channels</p>
          </div>
          <Link
            to="/inbox"
            className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
          >
            View all →
          </Link>
        </div>

        <div className="flex flex-col gap-2">
          {messagesLoading ? (
            [1,2,3].map((i) => <div key={i} className="h-10 skeleton rounded-xl" />)
          ) : !messages?.length ? (
            <p className="text-sm text-slate-600 py-3 text-center">No messages. Connect a Slack channel in Inbox.</p>
          ) : (
            messages.slice(0, 3).map((msg) => (
              <div
                key={msg.id}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-6 h-6 rounded-lg shrink-0 flex items-center justify-center text-[10px] font-bold text-white"
                    style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
                  >
                    {String(msg.user_id)[0]?.toUpperCase() ?? "?"}
                  </div>
                  <p className="text-xs text-slate-300 truncate">{msg.text}</p>
                </div>
                <span className="text-[10px] text-slate-600 shrink-0 ml-3">
                  {new Date(Number(msg.timestamp) * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  icon:     React.ReactNode;
  label:    string;
  value:    string | number;
  gradient: string;
  glow:     string;
}

function StatCard({ icon, label, value, gradient, glow }: StatCardProps) {
  return (
    <div
      className="rounded-2xl p-4 flex items-start justify-between transition-all duration-300 hover:-translate-y-0.5 cursor-default"
      style={{
        background: "rgba(13,17,23,0.6)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = glow; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
    >
      <div>
        <p className="text-xs text-slate-500 mb-1.5">{label}</p>
        <p className="text-2xl font-bold text-slate-100">{value}</p>
      </div>
      <div className={`${gradient} w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0`}>
        {icon}
      </div>
    </div>
  );
}
