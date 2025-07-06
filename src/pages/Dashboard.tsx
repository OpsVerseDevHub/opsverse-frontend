import { useEffect, useState } from "react";
import { BarChart2, CheckCircle, Clock } from "lucide-react";
import Skeleton from "../components/Skeleton";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from "recharts";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const barData = [
    { name: "Mon", tasks: 12 },
    { name: "Tue", tasks: 18 },
    { name: "Wed", tasks: 9 },
    { name: "Thu", tasks: 15 },
    { name: "Fri", tasks: 22 },
    { name: "Sat", tasks: 5 },
  ];
  const pieData = [
    { name: "Completed", value: 70 },
    { name: "Pending", value: 30 },
  ];
  const COLORS = ["#16a34a", "#facc15"];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      
      {loading ? (
        <>
          <Skeleton height="h-24" />
          <Skeleton height="h-24" />
          <Skeleton height="h-24" />
        </>
      ) : (
        <>
          <StatCard title="Total Projects" value="24" icon={<BarChart2 size={24} />} />
          <StatCard title="Tasks Completed" value="85%" icon={<CheckCircle size={24} />} />
          <StatCard title="Avg. Response Time" value="2h 15m" icon={<Clock size={24} />} />
        </>
      )}

      <div className="lg:col-span-2 bg-white shadow rounded-md p-4">
        <h2 className="text-lg font-bold mb-4">Weekly Tasks</h2>
        {loading ? (
          <Skeleton height="h-48" />
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="tasks" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="bg-white shadow rounded-md p-4">
        <h2 className="text-lg font-bold mb-4">Task Status</h2>
        {loading ? (
          <Skeleton height="h-48" rounded />
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} dataKey="value" outerRadius={70} label>
                {pieData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
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

