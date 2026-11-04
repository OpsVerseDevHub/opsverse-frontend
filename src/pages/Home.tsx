import { Link } from "react-router-dom";
import { BarChart2, CheckCircle, Clock } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import Skeleton from "@/components/Skeleton";
import { useProjects } from "@/hooks/useProjects";
import { useTasks } from "@/hooks/useTasks";
import { useMessages } from "@/hooks/useMessages";

const STATUS_COLORS: Record<string, string> = {
  todo: "#94a3b8",
  in_progress: "#3b82f6",
  review: "#f59e0b",
  done: "#16a34a",
};

export default function Home() {
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const { data: tasks, isLoading: tasksLoading } = useTasks();
  const { data: messages, isLoading: messagesLoading } = useMessages(
    projects?.[0]?.id
  );

  const loading = projectsLoading || tasksLoading;

  const totalProjects = projects?.length ?? 0;

  const statusCounts = (tasks ?? []).reduce<Record<string, number>>((acc, t) => {
    acc[t.status] = (acc[t.status] ?? 0) + 1;
    return acc;
  }, {});

  const totalTasks = tasks?.length ?? 0;
  const doneTasks = statusCounts["done"] ?? 0;
  const completionPct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
  const pendingTasks = (statusCounts["todo"] ?? 0) + (statusCounts["in_progress"] ?? 0);

  const pieData = Object.entries(statusCounts).map(([status, value]) => ({
    name: status.replace("_", " "),
    value,
  }));

  const barData = [
    { name: "Todo", tasks: statusCounts["todo"] ?? 0 },
    { name: "In Progress", tasks: statusCounts["in_progress"] ?? 0 },
    { name: "Review", tasks: statusCounts["review"] ?? 0 },
    { name: "Done", tasks: statusCounts["done"] ?? 0 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

      {/* Inbox Preview */}
      <div className="md:col-span-2 lg:col-span-3 bg-white shadow rounded-md p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Inbox Preview</h2>
          <Link to="/inbox" className="text-blue-500 text-sm hover:underline">View All</Link>
        </div>
        <div className="divide-y">
          {messagesLoading ? (
            [1, 2, 3].map((i) => <Skeleton key={i} height="h-10" />)
          ) : !messages?.length ? (
            <p className="text-sm text-gray-400 py-2">No messages. Select a project in Inbox to load.</p>
          ) : (
            messages.slice(0, 3).map((msg) => (
              <div key={msg.id} className="py-2 flex justify-between">
                <div>
                  <p className="font-semibold text-sm">{msg.user_id}</p>
                  <p className="text-gray-600 text-sm truncate max-w-xs">{msg.text}</p>
                </div>
                <span className="text-xs text-gray-400 shrink-0 ml-4">
                  {new Date(Number(msg.timestamp) * 1000).toLocaleTimeString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Stat Cards */}
      {loading ? (
        [1, 2, 3].map((i) => <Skeleton key={i} height="h-24" />)
      ) : (
        <>
          <StatCard title="Total Projects" value={totalProjects} icon={<BarChart2 size={24} />} />
          <StatCard title="Tasks Completed" value={`${completionPct}%`} icon={<CheckCircle size={24} />} />
          <StatCard title="Pending Tasks" value={pendingTasks} icon={<Clock size={24} />} />
        </>
      )}

      {/* Bar Chart */}
      <div className="md:col-span-2 lg:col-span-2 bg-white shadow rounded-md p-4">
        <h2 className="text-lg font-bold mb-4">Tasks by Status</h2>
        {loading ? (
          <Skeleton height="h-48" />
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="tasks" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Pie Chart */}
      <div className="bg-white shadow rounded-md p-4">
        <h2 className="text-lg font-bold mb-4">Status Breakdown</h2>
        {loading ? (
          <Skeleton height="h-48" rounded />
        ) : pieData.length === 0 ? (
          <p className="text-sm text-gray-400 mt-8 text-center">No tasks yet</p>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} dataKey="value" outerRadius={70} label={({ name }) => name}>
                {pieData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={STATUS_COLORS[entry.name.replace(" ", "_")] ?? "#94a3b8"}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <div className="bg-white shadow rounded-md p-4 flex items-center justify-between hover:shadow-md transition">
      <div>
        <h2 className="text-gray-500 text-sm">{title}</h2>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      <div className="bg-gray-100 p-2 rounded-md">{icon}</div>
    </div>
  );
}
