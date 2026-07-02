import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useApp, type Role } from "@/lib/app-context";
import { UserPlus } from "lucide-react";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Create account · MSME Financial Health Card" }] }),
  component: Signup,
});

function Signup() {
  const { signup } = useApp();
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("msme");
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setLoading(true);
    setTimeout(() => {
      const res = signup(email, password, name, role);
      setLoading(false);
      if (!res.ok) { toast.error(res.error ?? "Signup failed"); return; }
      toast.success("Account created — welcome!");
      nav({ to: role === "officer" ? "/portfolio" : "/onboarding" });
    }, 500);
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold" style={{ color: "#1a3a6c" }}>Create your account</h1>
      <p className="mt-1 text-sm text-muted-foreground">Prototype only — data lives in your browser.</p>
      <form onSubmit={submit} className="mt-6 rounded-2xl border border-border bg-white p-6 shadow-[var(--shadow-card)] space-y-3">
        <div>
          <label className="text-xs text-muted-foreground">Full name</label>
          <input required value={name} onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full px-3 py-2 rounded-lg border border-border outline-none focus:border-[#0d9488]" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Email</label>
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full px-3 py-2 rounded-lg border border-border outline-none focus:border-[#0d9488]" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Password</label>
          <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full px-3 py-2 rounded-lg border border-border outline-none focus:border-[#0d9488]" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground">I am a</label>
          <div className="mt-1 grid grid-cols-2 gap-2">
            {(["msme", "officer"] as Role[]).map((r) => (
              <button type="button" key={r} onClick={() => setRole(r)}
                className={`px-3 py-2 rounded-lg border text-sm ${role === r ? "text-white" : "bg-white text-foreground"}`}
                style={role === r ? { background: "#0d9488", borderColor: "#0d9488" } : { borderColor: "var(--border)" }}>
                {r === "msme" ? "MSME Owner" : "Bank Officer"}
              </button>
            ))}
          </div>
        </div>
        <button disabled={loading} type="submit"
          className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg text-white font-medium disabled:opacity-60"
          style={{ background: "#1a3a6c" }}>
          <UserPlus className="h-4 w-4" /> {loading ? "Creating…" : "Create account"}
        </button>
        <div className="text-xs text-center text-muted-foreground">
          Already have an account? <Link to="/login" className="font-medium" style={{ color: "#0d9488" }}>Sign in</Link>
        </div>
      </form>
    </div>
  );
}