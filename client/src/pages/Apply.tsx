import { useParams } from "wouter";
import { DEMO_JOBS } from "../../../api/trpc/router";
import { useState } from "react";

export default function Apply() {
  const params = useParams();
  const id = (params as any).id as string;
  const job = (DEMO_JOBS as any[]).find(j => j.id === id);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [resume, setResume] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!job) return <div style={{ padding: 32 }}>Unknown role.</div>;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ padding: 32, maxWidth: 840, margin: "40px auto", color: "var(--foreground)", background: "var(--card)", borderRadius: 8 }}>
      <h1>Apply — {job.title}</h1>
      <p style={{ color: "var(--muted-foreground)" }}>{job.company} — {job.location}</p>
      {submitted ? (
        <div style={{ marginTop: 24 }}>
          <strong>Application submitted</strong>
          <p>We received your demo application — thank you.</p>
        </div>
      ) : (
        <form onSubmit={submit} style={{ display: "grid", gap: 12, marginTop: 18 }}>
          <input placeholder="Full name" value={name} onChange={e => setName(e.target.value)} style={{ padding: 12, borderRadius: 8 }} />
          <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{ padding: 12, borderRadius: 8 }} />
          <input placeholder="Resume URL" value={resume} onChange={e => setResume(e.target.value)} style={{ padding: 12, borderRadius: 8 }} />
          <button style={{ padding: "12px 18px", background: "#6b5cff", color: "white", border: "none", borderRadius: 8 }}>Submit Application ✓</button>
        </form>
      )}
    </div>
  );
}
