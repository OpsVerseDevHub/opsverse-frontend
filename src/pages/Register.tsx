import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuthStore } from "@/state/authStore";
import api from "@/lib/api";
import type { LoginResponse, User } from "@/lib/types";
import { Zap, Eye, EyeOff, ArrowRight } from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const inputStyle = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await axios.post(`${BASE_URL}/users`, { username, email, password, role: "developer" });

      const form = new URLSearchParams();
      form.append("username", username);
      form.append("password", password);
      const { data } = await axios.post<LoginResponse>(`${BASE_URL}/token`, form, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      useAuthStore.getState().setAccessToken(data.access_token);
      const { data: user } = await api.get<User>("/users/me");
      setAuth(user, data.access_token);
      navigate("/");
    } catch (err: any) {
      setError(err?.response?.data?.detail ?? "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: "var(--bg-base)" }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="orb orb-cyan"   style={{ width: 700, height: 700, top: -250, right: -200 }} />
        <div className="orb orb-violet" style={{ width: 600, height: 600, bottom: -200, left: -150 }} />
        <div className="bg-grid absolute inset-0" />
      </div>

      <div
        className="relative w-full max-w-sm rounded-2xl p-8 animate-slide-up"
        style={{
          background: "var(--bg-modal)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(24px)",
          boxShadow: "0 0 60px rgba(6,182,212,0.08), 0 32px 64px rgba(0,0,0,0.4)",
        }}
      >
        <div className="flex items-center gap-3 mb-8">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "linear-gradient(135deg, #0891b2, #06b6d4)", boxShadow: "0 0 20px rgba(6,182,212,0.4)" }}
          >
            <Zap size={20} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-base gradient-text">OpsVerse</p>
            <p className="text-[10px] text-slate-500 leading-none mt-0.5">Dev Operations Platform</p>
          </div>
        </div>

        <h1 className="text-xl font-semibold text-slate-100 mb-1">Create account</h1>
        <p className="text-sm text-slate-500 mb-6">Get started in seconds</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {error && (
            <div
              className="text-xs text-red-400 px-3 py-2 rounded-lg"
              style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}
            >
              {error}
            </div>
          )}

          {[
            { label: "Username", type: "text",     value: username, setter: setUsername, placeholder: "yourname" },
            { label: "Email",    type: "email",    value: email,    setter: setEmail,    placeholder: "you@example.com" },
          ].map(({ label, type, value, setter, placeholder }) => (
            <div key={label}>
              <label className="block text-xs text-slate-500 mb-1.5 font-medium">{label}</label>
              <input
                type={type}
                value={value}
                onChange={(e) => setter(e.target.value)}
                placeholder={placeholder}
                required
                autoFocus={label === "Username"}
                className="w-full h-10 px-3 rounded-xl text-sm text-slate-100 placeholder-slate-600 outline-none transition-all duration-200"
                style={inputStyle}
                onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(6,182,212,0.5)"; e.currentTarget.style.boxShadow = "0 0 0 2px rgba(6,182,212,0.1)"; }}
                onBlur={(e)  => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.boxShadow = "none"; }}
              />
            </div>
          ))}

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
                style={inputStyle}
                onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(6,182,212,0.5)"; e.currentTarget.style.boxShadow = "0 0 0 2px rgba(6,182,212,0.1)"; }}
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
            className="w-full h-10 rounded-xl text-sm font-medium flex items-center justify-center gap-2 mt-1 transition-all duration-200 text-white disabled:opacity-60"
            style={{
              background: "linear-gradient(135deg, #0891b2, #06b6d4)",
              boxShadow: loading ? "none" : "0 0 20px rgba(6,182,212,0.3)",
            }}
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin-slow" />
            ) : (
              <>Create account <ArrowRight size={15} /></>
            )}
          </button>
        </form>

        <p className="text-xs text-slate-600 text-center mt-5">
          Already have an account?{" "}
          <Link to="/login" className="text-cyan-400 hover:text-cyan-300 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
