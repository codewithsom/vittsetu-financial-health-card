import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Building2, LineChart, ShieldCheck, Sparkles, ArrowRight, Landmark, BadgeCheck, TrendingUp, Users, Database, Wallet, FileText, Layers, Quote, ChevronRight } from "lucide-react";
import { msmes, formatINR, bandHex, scoreBand } from "@/data/msmes";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="relative">
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(1200px 500px at 80% -10%, rgba(13,148,136,0.10), transparent 60%), radial-gradient(900px 400px at 0% 0%, rgba(26,58,108,0.10), transparent 60%)",
        }}
      />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-14 pb-10 grid lg:grid-cols-2 gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border border-border bg-white text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5" style={{ color: "#0d9488" }} />
            For banks lending to New-to-Credit MSMEs
          </div>
          <h1 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight leading-[1.05]" style={{ color: "#1a3a6c" }}>
            Say <span style={{ color: "#0d9488" }}>yes</span> to good businesses
            <br />traditional forms say no to.
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-lg">
            The MSME Financial Health Card converts GST, UPI, Account Aggregator and EPFO signals into a single, explainable score — so relationship managers can underwrite faster, and fairer.
          </p>
          <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md">
            <Link
              to="/portfolio"
              className="group inline-flex items-center justify-between px-5 py-3.5 rounded-xl text-white font-medium shadow-sm hover:shadow-md transition-all"
              style={{ background: "#1a3a6c" }}
            >
              <span className="flex items-center gap-2">
                <Landmark className="h-4 w-4" /> Bank Officer
              </span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              to="/onboarding"
              className="group inline-flex items-center justify-between px-5 py-3.5 rounded-xl font-medium border border-border bg-white hover:border-[#0d9488]/40 transition-all"
            >
              <span className="flex items-center gap-2" style={{ color: "#0d9488" }}>
                <Building2 className="h-4 w-4" /> MSME Applicant
              </span>
              <ArrowRight className="h-4 w-4 opacity-70 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          <div className="mt-5 text-xs text-muted-foreground">
            Demo mode · No documents required · Realistic mock data from 6 sample MSMEs
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative"
        >
          <div className="rounded-2xl border border-border bg-white p-6 shadow-[0_1px_2px_rgba(16,24,40,.04),0_20px_50px_-10px_rgba(26,58,108,.18)]">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Sample Score</div>
                <div className="text-sm font-medium" style={{ color: "#1a3a6c" }}>Meera Handloom Weavers · Textile</div>
              </div>
              <div className="text-[10px] px-2 py-0.5 rounded-full font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 uppercase tracking-wider">Live</div>
            </div>
            <div className="mt-4 grid grid-cols-5 gap-2">
              {[
                { l: "Revenue", v: 84 },
                { l: "Cashflow", v: 78 },
                { l: "Compliance", v: 92 },
                { l: "Digital", v: 80 },
                { l: "Debt", v: 86 },
              ].map((d) => (
                <div key={d.l} className="rounded-lg bg-secondary p-2.5">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{d.l}</div>
                  <div className="mt-1 text-lg font-bold" style={{ color: "#1a3a6c" }}>{d.v}</div>
                  <div className="h-1 mt-1 rounded-full bg-white overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${d.v}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                      className="h-full"
                      style={{ background: "#0d9488" }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-end justify-between">
              <div>
                <div className="text-xs text-muted-foreground">Overall Health Score</div>
                <div className="text-4xl font-bold" style={{ color: "#0d9488" }}>84</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Recommended limit</div>
                <div className="text-lg font-semibold" style={{ color: "#1a3a6c" }}>₹27.6 L</div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 grid md:grid-cols-3 gap-4">
        {[
          { icon: LineChart, title: "Signals, not paperwork", body: "24 months of GST filings, UPI receipts and bank flows — no ITRs required." },
          { icon: ShieldCheck, title: "Consent-first", body: "Every data pull uses RBI-licensed Account Aggregator consent, revocable any time." },
          { icon: Sparkles, title: "Explainable score", body: "Every score comes with plain-language reasons the underwriter can defend." },
        ].map((f) => (
          <div key={f.title} className="rounded-xl border border-border bg-white p-5">
            <div className="h-9 w-9 rounded-lg flex items-center justify-center" style={{ background: "#0d94881a" }}>
              <f.icon className="h-4.5 w-4.5" style={{ color: "#0d9488" }} />
            </div>
            <div className="mt-3 font-semibold" style={{ color: "#1a3a6c" }}>{f.title}</div>
            <div className="mt-1 text-sm text-muted-foreground">{f.body}</div>
          </div>
        ))}
      </section>

      {/* Stats strip */}
      <section className="border-y border-border bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { v: "63M", l: "MSMEs in India", s: "80% New-to-Credit today" },
            { v: "₹25L Cr", l: "Credit gap", s: "Formal supply vs demand" },
            { v: "24 mo", l: "GST + UPI history", s: "Powering every score" },
            { v: "<90 s", l: "Average decision time", s: "From consent to sanction" },
          ].map((s) => (
            <div key={s.l}>
              <div className="text-3xl font-bold" style={{ color: "#0d9488" }}>{s.v}</div>
              <div className="text-sm font-medium mt-0.5" style={{ color: "#1a3a6c" }}>{s.l}</div>
              <div className="text-xs text-muted-foreground">{s.s}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border border-border bg-white text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5" style={{ color: "#0d9488" }} /> Four steps, zero paperwork
          </div>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold" style={{ color: "#1a3a6c" }}>How the Health Card is built</h2>
          <p className="mt-2 text-muted-foreground">A consent-based pipeline that turns raw digital exhaust into a defensible credit decision.</p>
        </div>
        <div className="mt-10 grid md:grid-cols-4 gap-4">
          {[
            { n: "01", t: "Consent", d: "MSME grants access via RBI-licensed Account Aggregator — cryptographically signed, revocable." },
            { n: "02", t: "Ingest", d: "We pull 24 months of GST, UPI, bank statements and EPFO records — usually within 90 seconds." },
            { n: "03", t: "Score", d: "Signals feed a 5-dimension model. Each dimension weighted, explained, and versioned." },
            { n: "04", t: "Decide", d: "Underwriter sees the score, the reasons, and a suggested limit — approves, refers, or declines." },
          ].map((s) => (
            <div key={s.n} className="rounded-2xl border border-border bg-white p-5 relative">
              <div className="text-5xl font-bold opacity-10 absolute top-2 right-3" style={{ color: "#0d9488" }}>{s.n}</div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Step {s.n}</div>
              <div className="mt-2 font-semibold text-lg" style={{ color: "#1a3a6c" }}>{s.t}</div>
              <div className="mt-2 text-sm text-muted-foreground">{s.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Data sources */}
      <section className="bg-secondary/40 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-bold" style={{ color: "#1a3a6c" }}>Every signal, one score.</h2>
              <p className="mt-3 text-muted-foreground">We combine four regulator-blessed data rails so the model sees what a physical file never could — real cash movement, compliance rhythm, and digital adoption.</p>
              <div className="mt-6 space-y-3">
                {[
                  { i: Database, t: "GST Network", d: "GSTR-1 & GSTR-3B filings, turnover trend, on-time ratio." },
                  { i: Wallet, t: "UPI / NPCI", d: "Merchant transaction count, value and YoY growth." },
                  { i: Landmark, t: "Account Aggregator", d: "Inflow, outflow, buffer, cheque bounces, active EMIs." },
                  { i: Users, t: "EPFO", d: "Payroll consistency across 22+ monthly challans." },
                ].map((s) => (
                  <div key={s.t} className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: "#0d94881a" }}>
                      <s.i className="h-4.5 w-4.5" style={{ color: "#0d9488" }} />
                    </div>
                    <div>
                      <div className="font-semibold text-sm" style={{ color: "#1a3a6c" }}>{s.t}</div>
                      <div className="text-xs text-muted-foreground">{s.d}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/integrations" className="mt-6 inline-flex items-center gap-1 text-sm font-medium" style={{ color: "#0d9488" }}>
                See all integrations <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { l: "Revenue Stability", w: "25%", i: LineChart },
                { l: "Cash Flow Health", w: "25%", i: Wallet },
                { l: "Compliance", w: "20%", i: FileText },
                { l: "Digital Footprint", w: "15%", i: Layers },
                { l: "Debt Behavior", w: "15%", i: ShieldCheck },
                { l: "Explainable", w: "100%", i: BadgeCheck },
              ].map((d) => (
                <div key={d.l} className="rounded-xl border border-border bg-white p-4">
                  <d.i className="h-4 w-4" style={{ color: "#0d9488" }} />
                  <div className="mt-2 text-sm font-medium" style={{ color: "#1a3a6c" }}>{d.l}</div>
                  <div className="text-xs text-muted-foreground">Weight {d.w}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sample MSMEs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-end justify-between gap-3 flex-wrap">
          <div>
            <h2 className="text-3xl font-bold" style={{ color: "#1a3a6c" }}>See the score in action</h2>
            <p className="mt-1 text-muted-foreground">Six real-shaped MSMEs, six very different stories. Click any card to open the full Health Card.</p>
          </div>
          <Link to="/portfolio" className="text-sm font-medium inline-flex items-center gap-1" style={{ color: "#0d9488" }}>
            View portfolio <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {msmes.slice(0, 6).map((m) => {
            const c = bandHex(m.scores.overall);
            const b = scoreBand(m.scores.overall);
            return (
              <Link key={m.id} to="/dashboard/$id" params={{ id: m.id }}
                className="rounded-2xl border border-border bg-white p-5 hover:shadow-lg transition-shadow group">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold" style={{ color: "#1a3a6c" }}>{m.businessName}</div>
                    <div className="text-xs text-muted-foreground">{m.sector} · {m.city}</div>
                  </div>
                  <div className="text-3xl font-bold tabular-nums" style={{ color: c }}>{m.scores.overall}</div>
                </div>
                <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full" style={{ width: `${m.scores.overall}%`, background: c }} />
                </div>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="font-semibold uppercase tracking-wider" style={{ color: c }}>
                    {b === "strong" ? "Healthy" : b === "moderate" ? "Watchlist" : "High Risk"}
                  </span>
                  <span className="text-muted-foreground">Requested {formatINR(m.requestedAmount)}</span>
                </div>
                <div className="mt-3 text-xs text-muted-foreground line-clamp-2 min-h-[32px]">
                  {m.strengths[0]}
                </div>
                <div className="mt-3 text-xs font-medium inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform" style={{ color: "#0d9488" }}>
                  Open card <ChevronRight className="h-3 w-3" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Who it's for */}
      <section className="bg-secondary/40 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 grid md:grid-cols-2 gap-6">
          {[
            { r: "For bank officers", t: "Underwrite faster, fairer", b: [
              "Portfolio view with sort, filter, and risk bands",
              "Auto-generated underwriting note with reason codes",
              "Explainable score panel — defend every decision",
              "PDF export for credit committee packs",
            ], to: "/portfolio" as const, cta: "Open Portfolio" },
            { r: "For MSME owners", t: "Get seen for what you actually do", b: [
              "No ITR, no CA, no branch visits",
              "See your Financial Health Score in under 2 minutes",
              "Simulator shows exactly how to improve it",
              "Get pre-qualified with participating banks",
            ], to: "/onboarding" as const, cta: "Start Onboarding" },
          ].map((p) => (
            <div key={p.r} className="rounded-2xl border border-border bg-white p-6">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">{p.r}</div>
              <div className="mt-1 text-2xl font-bold" style={{ color: "#1a3a6c" }}>{p.t}</div>
              <ul className="mt-4 space-y-2 text-sm">
                {p.b.map((li) => (
                  <li key={li} className="flex items-start gap-2">
                    <BadgeCheck className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "#0d9488" }} /> {li}
                  </li>
                ))}
              </ul>
              <Link to={p.to} className="mt-5 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-white text-sm font-medium" style={{ background: "#1a3a6c" }}>
                {p.cta} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-3xl font-bold text-center" style={{ color: "#1a3a6c" }}>What early users are saying</h2>
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          {[
            { q: "Cut our NTC onboarding TAT from 11 days to under 30 minutes. The explainability panel is what sold it to our credit committee.", a: "Head of MSME Lending, Tier-1 PSB" },
            { q: "I was rejected by three banks because I don't have audited ITRs. VittSetu looked at my GST and UPI — and I got a ₹8 L working capital line in two days.", a: "Owner, D2C Foods Brand" },
            { q: "The simulator is the killer feature. Our RMs actually use it in customer conversations to show how one late filing hurts the score.", a: "Cluster Manager, Small Finance Bank" },
          ].map((t) => (
            <div key={t.a} className="rounded-2xl border border-border bg-white p-5">
              <Quote className="h-5 w-5" style={{ color: "#0d9488" }} />
              <p className="mt-3 text-sm leading-relaxed">"{t.q}"</p>
              <div className="mt-4 text-xs text-muted-foreground">— {t.a}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-secondary/40 border-t border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
          <h2 className="text-3xl font-bold text-center" style={{ color: "#1a3a6c" }}>Frequently asked</h2>
          <div className="mt-8 space-y-3">
            {[
              { q: "Is this a real credit bureau score?", a: "No — the Financial Health Score is a complementary, behavioural score built from live business signals. It's designed for New-to-Credit MSMEs where a bureau score alone is thin or missing." },
              { q: "How is my data protected?", a: "Every pull goes through an RBI-licensed Account Aggregator with a cryptographically signed consent artefact. Data is scoped to the specific lender and purpose, and you can revoke consent at any time." },
              { q: "Do you share my data with lenders without asking?", a: "Never. A lender only sees your Health Card after you explicitly authorise it. You control which lenders see what, and for how long." },
              { q: "What if my score is low?", a: "The dashboard tells you exactly which factors are dragging you down and the simulator shows how much each fix is worth in points. Most MSMEs move by 8–15 points in a single quarter of clean filings." },
              { q: "Is this a production system?", a: "This is a design-and-analytics prototype built to demonstrate the model. Real deployment would connect to production GSTN, NPCI, AA and EPFO endpoints." },
            ].map((f) => (
              <details key={f.q} className="rounded-xl border border-border bg-white p-4 group">
                <summary className="cursor-pointer text-sm font-semibold flex items-center justify-between" style={{ color: "#1a3a6c" }}>
                  {f.q}
                  <ChevronRight className="h-4 w-4 group-open:rotate-90 transition-transform" />
                </summary>
                <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="rounded-3xl p-10 text-white relative overflow-hidden" style={{ background: "linear-gradient(135deg,#1a3a6c 0%, #0d9488 100%)" }}>
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-white/15 text-white">
              <TrendingUp className="h-3.5 w-3.5" /> Ready when you are
            </div>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold">Turn digital exhaust into credit access.</h2>
            <p className="mt-2 opacity-90">Explore the portfolio view, run a mock onboarding, or ask the assistant anything about the score.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/portfolio" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-sm font-semibold" style={{ color: "#1a3a6c" }}>
                <Landmark className="h-4 w-4" /> Bank Officer view
              </Link>
              <Link to="/onboarding" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-white/40 text-sm font-semibold text-white">
                <Building2 className="h-4 w-4" /> Start an MSME onboarding
              </Link>
              <Link to="/login" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-white/40 text-sm font-semibold text-white">
                Sign in to demo
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
