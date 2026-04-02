// src/features/auth-login/LoginForm.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setSession } from "../../shared/lib/auth";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log("LOGIN RESPONSE", data);

      if (response.ok) {
        // ✅ Use actual role from backend
        setSession(data.access, data.role);

        navigate("/dashboard", { replace: true });
      } else {
        alert(data?.detail || "Invalid login credentials");
      }
    } catch (error) {
      console.error("Login error", error);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-4 w-80">
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border p-2 rounded"
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 rounded"
        required
      />

      <button className="bg-blue-950 text-white p-2 rounded">
        Login
      </button>
    </form>
  );
};

export default LoginForm;