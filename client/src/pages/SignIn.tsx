import { useState } from "react";
import { useNavigate } from "wouter";

export default function SignIn() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = { name: name || "Demo User", email: "demo@example.com" };
    try {
      localStorage.setItem("manus-runtime-user-info", JSON.stringify(user));
    } catch {}
    navigate("/");
    window.location.reload();
  };

  return (
    <div style={{ padding: 32, maxWidth: 680, margin: "72px auto" }}>
      <h1>Sign in (Demo)</h1>
      <p>
        This demo deploy doesn't have OAuth configured. Use this quick sign-in
        to proceed as a demo user.
      </p>
      <form onSubmit={submit} style={{ display: "grid", gap: 12, marginTop: 18 }}>
        <label>
          Full name
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Your name"
            style={{ display: "block", width: "100%", padding: 12, marginTop: 8 }}
          />
        </label>
        <button style={{ padding: "12px 18px", background: "#2b974b", color: "white", border: "none", borderRadius: 8 }}>
          Sign in (demo)
        </button>
      </form>
    </div>
  );
}
