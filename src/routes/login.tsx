import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useApp, DEMO_ACCOUNTS } from "@/lib/app-context";
import { LogIn, Sparkles } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in · MSME Financial Health Card" }] }),
  component: Login,
});

function Login() {
  const { login } = useApp();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const res = login(email, password);
      setLoading(false);
      if (!res.ok) { toast.error(res.error ?? "Sign in failed"); return; }
      toast.success(`Welcome back, ${res.user!.name}`);
      if (res.user!.role === "officer") nav({ to: "/portfolio" });
      else if (res.user!.msmeId) nav({ to: "/dashboard/$id", params: { id: res.user!.msmeId } });
      else nav({ to: "/" });
    }, 400);
  };

  const quick = (em: string, pw: string) => { setEmail(em); setPassword(pw); };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid lg:grid-cols-2 gap-10 items-center">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border border-border bg-white text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5" style={{ color: "#0d9488" }} /> Demo mode · No real backend
        </div>
        <h1 className="mt-4 text-3xl sm:text-4xl font-bold" style={{ color: "#1a3a6c" }}>Welcome back to VittSetu</h1>
        <p className="mt-2 text-muted-foreground max-w-md">Sign in to view your Financial Health Card, portfolio and underwriting workspace.</p>
        <div className="mt-6 rounded-xl border border-border bg-white p-4">
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Try a demo account</div>
          <div className="space-y-2">
            {DEMO_ACCOUNTS.slice(0, 3).map((a) => (
              <button key={a.email} onClick={() => quick(a.email, a.password)}
                className="w-full text-left rounded-lg border border-border p-2.5 hover:border-[#0d9488]/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium" style={{ color: "#1a3a6c" }}>{a.name}</div>
                    <div className="text-xs text-muted-foreground">{a.email} · {a.role === "officer" ? "Bank Officer" : "MSME Owner"}</div>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground">{a.password}</span>
                </div>
              </button>
            ))}
          </div>
          <div className="text-[11px] text-muted-foreground mt-2">Click any account to auto-fill the form.</div>
        </div>
      </div>

      <form onSubmit={submit} className="rounded-2xl border border-border bg-white p-6 shadow-[var(--shadow-card)]">
        <div className="text-sm font-semibold" style={{ color: "#1a3a6c" }}>Sign in</div>
        <div className="mt-4 space-y-3">
          <div>
            <label className="text-xs text-muted-foreground">Email</label>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-3 py-2 rounded-lg border border-border outline-none focus:border-[#0d9488]" placeholder="you@business.in" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Password</label>
            <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-3 py-2 rounded-lg border border-border outline-none focus:border-[#0d9488]" placeholder="••••••••" />
          </div>
          <button disabled={loading} type="submit"
            className="mt-2 w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg text-white font-medium disabled:opacity-60"
            style={{ background: "#1a3a6c" }}>
            <LogIn className="h-4 w-4" /> {loading ? "Signing in…" : "Sign in"}
          </button>
          <div className="text-xs text-center text-muted-foreground">
            No account? <Link to="/signup" className="font-medium" style={{ color: "#0d9488" }}>Create one</Link>
          </div>
        </div>
      </form>
    </div>
  );
}