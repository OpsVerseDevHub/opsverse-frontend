import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/state/authStore";
import api from "@/lib/api";
import { Zap, Github, Eye, EyeOff, ArrowRight } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const { setAuth, setAccessToken } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const form = new URLSearchParams();
      form.append("username", username);
      form.append("password", password);
      const { data } = await api.post("/token", form.toString(), {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      setAccessToken(data.access_token);
      const me = await api.get("/users/me");
      setAuth(me.data, data.access_token);
      navigate("/");
    } catch {
      setError("Invalid credentials. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: "var(--bg-base)" }}
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="orb orb-violet" style={{ width: 700, height: 700, top: -250, left: -200 }} />
        <div className="orb orb-cyan"   style={{ width: 600, height: 600, bottom: -200, right: -150 }} />
        <div className="bg-grid absolute inset-0" />
      </div>

      {/* Card */}
      <div
        className="relative w-full max-w-sm rounded-2xl p-8 animate-slide-up"
        style={{
          background: "var(--bg-modal)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(24px)",
          boxShadow: "0 0 60px rgba(139,92,246,0.1), 0 32px 64px rgba(0,0,0,0.4)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
              boxShadow: "0 0 20px rgba(124,58,237,0.5)",
            }}
          >
            <Zap size={20} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-base gradient-text">OpsVerse</p>
            <p className="text-[10px] text-slate-500 leading-none mt-0.5">Dev Operations Platform</p>
          </div>
        </div>

        <h1 className="text-xl font-semibold text-slate-100 mb-1">Welcome back</h1>
        <p className="text-sm text-slate-500 mb-6">Sign in to your workspace</p>

        {/* GitHub OAuth */}
        <a
          href={`${API_BASE}/auth/github`}
          className="flex items-center justify-center gap-2 w-full h-10 rounded-xl text-sm font-medium text-slate-200 transition-all duration-200 mb-4"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)";
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.15)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)";
          }}
        >
          <Github size={16} />
          Continue with GitHub
        </a>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
          <span className="text-xs text-slate-600">or</span>
          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {error && (
            <div
              className="text-xs text-red-400 px-3 py-2 rounded-lg"
              style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}
            >
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs text-slate-500 mb-1.5 font-medium">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="yourname"
              required
              className="w-full h-10 px-3 rounded-xl text-sm text-slate-100 placeholder-slate-600 outline-none transition-all duration-200"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(139,92,246,0.5)"; e.currentTarget.style.boxShadow = "0 0 0 2px rgba(139,92,246,0.1)"; }}
              onBlur={(e)  => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.boxShadow = "none"; }}
            />
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1.5 font-medium">Password</label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full h-10 px-3 pr-10 rounded-xl text-sm text-slate-100 placeholder-slate-600 outline-none transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(139,92,246,0.5)"; e.currentTarget.style.boxShadow = "0 0 0 2px rgba(139,92,246,0.1)"; }}
                onBlur={(e)  => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.boxShadow = "none"; }}
              />
              <button
                type="button"
                onClick={() => setShowPw((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-neon w-full h-10 rounded-xl text-sm font-medium flex items-center justify-center gap-2 mt-1 disabled:opacity-60"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin-slow" />
            ) : (
              <>Sign in <ArrowRight size={15} /></>
            )}
          </button>
        </form>

        <p className="text-xs text-slate-600 text-center mt-5">
          No account?{" "}
          <Link to="/register" className="text-violet-400 hover:text-violet-300 transition-colors">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
