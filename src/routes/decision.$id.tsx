import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, XCircle, AlertTriangle, Lightbulb, FileDown } from "lucide-react";
import { toast } from "sonner";
import { findMSME, formatINR, recommendedLimit, scoreBand, bandHex } from "@/data/msmes";
import { ScoreGauge } from "@/components/ScoreGauge";

export const Route = createFileRoute("/decision/$id")({
  head: () => ({
    meta: [
      { title: "Loan Decision · MSME Financial Health Card" },
      { name: "description", content: "Explainable underwriting decision with auto-generated note." },
    ],
  }),
  component: Decision,
});

function Decision() {
  const { id } = useParams({ from: "/decision/$id" });
  const m = findMSME(id);
  if (!m) return <div className="max-w-3xl mx-auto py-16 text-center">Not found</div>;

  const band = scoreBand(m.scores.overall);
  const preSelected: "approve" | "refer" | "reject" = band === "strong" ? "approve" : band === "moderate" ? "refer" : "reject";
  const [choice, setChoice] = useState<typeof preSelected>(preSelected);
  const limit = recommendedLimit(m);

  // top 3 contributing factors by score
  const factors = [
    { label: "Compliance history", val: m.scores.compliance, why: "GST + EPFO on-time filings drive institutional trust." },
    { label: "Cash flow health", val: m.scores.cashFlowHealth, why: "AA-derived inflow/outflow ratio and bounce count." },
    { label: "Revenue stability", val: m.scores.revenueStability, why: "12-month GST turnover trend and QoQ growth." },
    { label: "Digital footprint", val: m.scores.digitalFootprint, why: "UPI transaction velocity and YoY growth." },
    { label: "Debt behavior", val: m.scores.debtBehavior, why: "Existing EMI performance and utilisation." },
  ].sort((a, b) => Math.abs(b.val - 50) - Math.abs(a.val - 50)).slice(0, 3);

  const note =
    band === "strong"
      ? `${m.businessName} presents a strong alternate-data profile with a composite health score of ${m.scores.overall}/100. GST filings have been consistent for ${m.gst.monthsFiled} months (${m.gst.filingRegularity}% on-time), monthly AA-verified inflow of ${formatINR(m.aa.avgMonthlyInflow)} exceeds outflow with zero bounces in the observed window, and UPI receipts have grown ${m.upi.growthPct}% YoY. Recommended sanction: ${formatINR(limit)} on a cashflow-based facility.`
      : band === "moderate"
        ? `${m.businessName} shows a mixed alternate-data profile at ${m.scores.overall}/100. GST compliance is acceptable (${m.gst.filingRegularity}% on-time) but ${m.aa.bounceCount} cheque bounce(s) and irregular EPFO patterns warrant human review. Suggest referring for enhanced due diligence with a capped exposure of ${formatINR(limit)}.`
        : `${m.businessName} shows material stress across multiple alternate-data dimensions (score ${m.scores.overall}/100). GST filings lapsed, ${m.aa.bounceCount} bounces recorded, and existing debt behavior is weak. Recommend decline of the current unsecured request; consider secured-only options after 6 months of demonstrated recovery.`;

  const exportPdf = async () => {
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      // header band
      doc.setFillColor(26, 58, 108);
      doc.rect(0, 0, 595, 90, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20); doc.text("Loan Decision Report", 40, 44);
      doc.setFontSize(11); doc.text("VittSetu · MSME Financial Health Card", 40, 66);
      // body
      doc.setTextColor(20, 20, 20);
      doc.setFontSize(16); doc.text(m.businessName, 40, 130);
      doc.setFontSize(10); doc.setTextColor(90, 90, 90);
      doc.text(`${m.sector} · ${m.city} · GSTIN ${m.gstin}`, 40, 148);
      doc.text(`Requested amount: ${formatINR(m.requestedAmount)}`, 40, 164);

      doc.setFontSize(34); doc.setTextColor(bandHex(m.scores.overall) === "#059669" ? 5 : bandHex(m.scores.overall) === "#d97706" ? 217 : 220, bandHex(m.scores.overall) === "#059669" ? 150 : bandHex(m.scores.overall) === "#d97706" ? 119 : 38, bandHex(m.scores.overall) === "#059669" ? 105 : bandHex(m.scores.overall) === "#d97706" ? 6 : 38);
      doc.text(`${m.scores.overall}/100`, 400, 150);
      doc.setFontSize(10); doc.setTextColor(90, 90, 90);
      doc.text(band.toUpperCase(), 400, 168);

      doc.setDrawColor(200, 200, 200); doc.line(40, 195, 555, 195);

      // note
      doc.setTextColor(26, 58, 108); doc.setFontSize(12);
      doc.text("Auto-generated underwriting note", 40, 220);
      doc.setTextColor(30, 30, 30); doc.setFontSize(10.5);
      const lines = doc.splitTextToSize(note, 515);
      doc.text(lines, 40, 240);
      let y = 240 + lines.length * 14 + 12;

      // key stats
      doc.setTextColor(26, 58, 108); doc.setFontSize(12);
      doc.text("Key figures", 40, y); y += 18;
      doc.setTextColor(30, 30, 30); doc.setFontSize(10.5);
      doc.text(`Recommended limit: ${formatINR(limit)}`, 50, y); y += 14;
      doc.text(`Ratio (recommended / requested): ${Math.round((limit / m.requestedAmount) * 100)}%`, 50, y); y += 14;
      doc.text(`Overall score: ${m.scores.overall} · Compliance ${m.scores.compliance} · Cashflow ${m.scores.cashFlowHealth} · Revenue ${m.scores.revenueStability}`, 50, y, { maxWidth: 500 }); y += 24;

      // factors
      doc.setTextColor(26, 58, 108); doc.setFontSize(12);
      doc.text("Top contributing factors", 40, y); y += 18;
      doc.setFontSize(10.5); doc.setTextColor(30, 30, 30);
      factors.forEach((f) => {
        doc.text(`  · ${f.label} — ${f.val}/100`, 50, y); y += 14;
        const w = doc.splitTextToSize(f.why, 480);
        doc.setTextColor(90, 90, 90); doc.text(w, 66, y); y += w.length * 12 + 4;
        doc.setTextColor(30, 30, 30);
      });
      y += 6;

      // decision
      doc.setTextColor(26, 58, 108); doc.setFontSize(12);
      doc.text("Underwriter decision", 40, y); y += 18;
      doc.setFontSize(10.5); doc.setTextColor(30, 30, 30);
      const decLabel = choice === "approve" ? "APPROVE" : choice === "refer" ? "REFER FOR MANUAL REVIEW" : "REJECT";
      doc.text(`Recommendation: ${decLabel}`, 50, y); y += 14;
      doc.text(`Date: ${new Date().toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "2-digit" })}`, 50, y);

      // footer
      doc.setFontSize(9); doc.setTextColor(120, 120, 120);
      doc.text("Generated by VittSetu · Prototype · Confidential — share with your team only", 40, 800);

      doc.save(`${m.businessName.replace(/\s+/g, "_")}_Decision.pdf`);
      toast.success("Underwriting note exported as PDF");
    } catch (e) {
      console.error(e);
      toast.error("Could not export PDF");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <Link to="/dashboard/$id" params={{ id: m.id }} className="text-sm text-muted-foreground hover:text-foreground">← Back to Health Card</Link>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: "#1a3a6c" }}>Loan Decision</h1>
            <div className="text-sm text-muted-foreground">{m.businessName} · Requested {formatINR(m.requestedAmount)}</div>
          </div>
          <button onClick={exportPdf} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-white text-sm font-medium shadow-sm" style={{ background: "#0d9488" }}>
            <FileDown className="h-4 w-4" /> Export underwriting note (PDF)
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-4">
        <div className="rounded-2xl border border-border bg-white p-6 flex flex-col items-center justify-center shadow-[var(--shadow-card)]">
          <ScoreGauge score={m.scores.overall} size={180} />
        </div>
        <div className="lg:col-span-2 rounded-2xl border border-border bg-white p-6 shadow-[var(--shadow-card)]">
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Auto-generated underwriting note</div>
          <p className="text-sm leading-relaxed">{note}</p>
          <div className="mt-4 grid grid-cols-3 gap-3">
            <Stat label="Recommended limit" value={formatINR(limit)} />
            <Stat label="Requested" value={formatINR(m.requestedAmount)} />
            <Stat label="Ratio" value={`${Math.round((limit / m.requestedAmount) * 100)}%`} />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-white p-6 shadow-[var(--shadow-card)] mb-4">
        <div className="flex items-center gap-2 mb-1">
          <Lightbulb className="h-4 w-4" style={{ color: "#0d9488" }} />
          <div className="text-sm font-semibold" style={{ color: "#1a3a6c" }}>Why this score?</div>
        </div>
        <p className="text-xs text-muted-foreground mb-4">The three factors that moved the needle the most for this applicant.</p>
        <div className="grid md:grid-cols-3 gap-3">
          {factors.map((f) => {
            const c = bandHex(f.val);
            return (
              <div key={f.label} className="rounded-xl border border-border p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium" style={{ color: "#1a3a6c" }}>{f.label}</div>
                  <div className="text-lg font-bold" style={{ color: c }}>{f.val}</div>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full" style={{ width: `${f.val}%`, background: c }} />
                </div>
                <div className="mt-2 text-xs text-muted-foreground">{f.why}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-white p-6 shadow-[var(--shadow-card)]">
        <div className="text-sm font-semibold mb-3" style={{ color: "#1a3a6c" }}>Decision (pre-selected based on score)</div>
        <div className="grid sm:grid-cols-3 gap-3">
          <DecisionButton
            active={choice === "approve"} onClick={() => setChoice("approve")}
            icon={<CheckCircle2 className="h-4 w-4" />} label="Approve" color="#059669"
            subtitle={`up to ${formatINR(limit)}`}
          />
          <DecisionButton
            active={choice === "refer"} onClick={() => setChoice("refer")}
            icon={<AlertTriangle className="h-4 w-4" />} label="Refer for Manual Review" color="#d97706"
            subtitle="Enhanced due diligence"
          />
          <DecisionButton
            active={choice === "reject"} onClick={() => setChoice("reject")}
            icon={<XCircle className="h-4 w-4" />} label="Reject" color="#dc2626"
            subtitle="With reason codes"
          />
        </div>
        <div className="mt-5 flex items-center justify-between">
          <div className="text-xs text-muted-foreground">Recorded decision will be attached to the applicant record.</div>
          <button className="px-5 py-2 rounded-lg text-white text-sm font-medium" style={{ background: "#1a3a6c" }}>
            Submit Decision
          </button>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-secondary/40 p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-lg font-semibold" style={{ color: "#1a3a6c" }}>{value}</div>
    </div>
  );
}

function DecisionButton({
  active, onClick, icon, label, subtitle, color,
}: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string; subtitle: string; color: string }) {
  return (
    <button
      onClick={onClick}
      className={`text-left rounded-xl border p-4 transition-all ${active ? "shadow-md" : "hover:border-foreground/30"}`}
      style={active ? { borderColor: color, background: `${color}0f` } : { borderColor: "var(--border)" }}
    >
      <div className="flex items-center gap-2 font-semibold" style={{ color }}>
        {icon} {label}
      </div>
      <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>
    </button>
  );
}