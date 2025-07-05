import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { BarChart2, CheckCircle, Clock, Target } from "lucide-react";

export default function Dashboard() {
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

  return (
    <main className="flex-1 p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      
      <StatCard title="Total Projects" value="24" icon={<BarChart2 size={24} />} />
      <StatCard title="Tasks Completed" value="85%" icon={<CheckCircle size={24} />} />
      <StatCard title="Avg. Response Time" value="2h 15m" icon={<Clock size={24} />} />

      <div className="col-span-1 md:col-span-2 bg-white shadow rounded p-4">
        <h2 className="text-lg font-bold mb-4">Weekly Tasks</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="tasks" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white shadow rounded p-4">
        <h2 className="text-lg font-bold mb-4">Task Status</h2>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={pieData} dataKey="value" outerRadius={70} label>
              {pieData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white shadow rounded p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Goal Progress</h2>
          <Target size={20} />
        </div>
        <p className="text-gray-600 mt-2">You're 65% towards this month's project goal.</p>
        <div className="w-full bg-gray-200 h-3 rounded mt-4">
          <div className="bg-blue-500 h-3 rounded" style={{ width: "65%" }}></div>
        </div>
      </div>

    </main>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <div className="bg-white shadow rounded p-4 flex items-center justify-between hover:shadow-md transition">
      <div>
        <h2 className="text-gray-500 text-sm">{title}</h2>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      <div className="bg-gray-100 p-2 rounded">
        {icon}
      </div>
    </div>
  );
}
