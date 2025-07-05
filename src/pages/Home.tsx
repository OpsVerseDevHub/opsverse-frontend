import { useEffect, useState } from "react";
import { BarChart2, CheckCircle, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import Loader from "../components/Loader";

interface Message {
  id: string;
  user: string;
  text: string;
  timestamp: string;
}

const mockMessages: Message[] = [
  { id: "1", user: "Alice", text: "Slack integration tested!", timestamp: "Today 10:30 AM" },
  { id: "2", user: "Bob", text: "Project update submitted.", timestamp: "Today 11:15 AM" },
  { id: "3", user: "Charlie", text: "Review pending from team.", timestamp: "Today 12:00 PM" },
];

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

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    setTimeout(() => {
      setMessages(mockMessages);
    }, 800); // Simulate network delay
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      
      {/* Inbox Preview */}
      <div className="lg:col-span-3 bg-white shadow rounded-md p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Inbox Preview</h2>
          <Link to="/messages" className="text-blue-500 text-sm hover:underline">View All</Link>
        </div>

        <div className="divide-y">
          {messages.length === 0 ? (
            <div className="h-24 flex justify-center items-center">
              <Loader />
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="py-2 flex justify-between animate-slide-up">
                <div>
                  <p className="font-semibold">{msg.user}</p>
                  <p className="text-gray-600 text-sm truncate">{msg.text}</p>
                </div>
                <span className="text-xs text-gray-400">{msg.timestamp}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard title="Total Projects" value="24" icon={<BarChart2 size={24} />} />
        <StatCard title="Tasks Completed" value="85%" icon={<CheckCircle size={24} />} />
        <StatCard title="Avg. Response Time" value="2h 15m" icon={<Clock size={24} />} />
      </div>

      {/* Charts */}
      <div className="lg:col-span-2 bg-white shadow rounded-md p-4">
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

      <div className="bg-white shadow rounded-md p-4">
        <h2 className="text-lg font-bold mb-4">Task Status</h2>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={pieData} dataKey="value" outerRadius={70} label>
              {pieData.map((_, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <div className="bg-white shadow rounded-md p-4 flex items-center justify-between hover:shadow-md transition">
      <div>
        <h2 className="text-gray-500 text-sm">{title}</h2>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      <div className="bg-gray-100 p-2 rounded-md">
        {icon}
      </div>
    </div>
  );
}
