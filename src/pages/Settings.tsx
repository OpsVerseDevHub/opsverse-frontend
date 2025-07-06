import { useState } from "react";
import { useTheme } from "../state/themeStore";

export default function Settings() {
  const [notifications, setNotifications] = useState(true);
  const { theme, setTheme } = useTheme();

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* Profile Card */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-md p-6 flex items-center gap-4">
        <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold text-xl">
          U
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Username</h2>
          <p className="text-gray-500 dark:text-gray-300 text-sm">user@example.com</p>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-md p-6 space-y-4">
        <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Preferences</h2>

        {/* Notifications Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-gray-900 dark:text-gray-300">Enable Notifications</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={notifications}
              onChange={() => setNotifications(!notifications)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-blue-500 after:content-[''] after:absolute after:left-[4px] after:top-[4px] after:bg-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5"></div>
          </label>
        </div>

        {/* Dark Mode Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-gray-900 dark:text-gray-300">Dark Mode</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={theme === "dark"}
              onChange={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-blue-500 after:content-[''] after:absolute after:left-[4px] after:top-[4px] after:bg-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5"></div>
          </label>
        </div>
      </div>
    </div>
  );
}
