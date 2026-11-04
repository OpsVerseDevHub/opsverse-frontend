import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "@/lib/api";
import { useAuthStore } from "@/state/authStore";
import type { User } from "@/lib/types";

export default function AuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { setAuth, setAccessToken } = useAuthStore();

  useEffect(() => {
    const token = params.get("token");
    const error = params.get("error");

    if (error || !token) {
      navigate("/login?error=github_auth_failed");
      return;
    }

    setAccessToken(token);

    api
      .get<User>("/users/me")
      .then(({ data }) => {
        setAuth(data, token);
        navigate("/");
      })
      .catch(() => {
        navigate("/login?error=github_auth_failed");
      });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-sm text-gray-500">Signing you in…</p>
    </div>
  );
}
