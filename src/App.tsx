import { Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import InboxPage from "@/pages/Inbox";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import Messages from "@/pages/Messages";
import Reports from "@/pages/Reports";
import Settings from "@/pages/Settings";

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <Home />
          </Layout>
        }
      />

      <Route
        path="/dashboard"
        element={
          <Layout>
            <Dashboard />
          </Layout>
        }
      />

      <Route
        path="/messages"
        element={
          <Layout>
            <Messages />
          </Layout>
        }
      />

      <Route
        path="/reports"
        element={
          <Layout>
            <Reports />
          </Layout>
        }
      />

      <Route
        path="/settings"
        element={
          <Layout>
            <Settings />
          </Layout>
        }
      />

      <Route
        path="/inbox"
        element={
          <Layout>
            <InboxPage />
          </Layout>
        }
      />
    </Routes>
  );
}
