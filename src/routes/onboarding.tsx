import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, ShieldCheck } from "lucide-react";
import { msmes } from "@/data/msmes";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "New MSME Applicant · Financial Health Card" },
      { name: "description", content: "Onboard a New-to-Credit MSME with consent-based access to GST, UPI, AA and EPFO signals." },
    ],
  }),
  component: Onboarding,
});

function Onboarding() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    businessName: "Meera Handloom Weavers",
    pan: "AABCM1234K",
    gstin: "09AABCM1234K1Z5",
    udyam: "UDYAM-UP-08-0012345",
    sector: "Textile",
    years: "7",
  });
  const [consent, setConsent] = useState({ gst: true, upi: true, epfo: true });
  const allConsented = consent.gst && consent.upi && consent.epfo;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allConsented) return;
    setLoading(true);
    // Simulate assessment
    setTimeout(() => {
      // Pick MSME matching business name if present, else random
      const match = msmes.find((m) => m.businessName.toLowerCase() === form.businessName.toLowerCase()) || msmes[0];
      navigate({ to: "/dashboard/$id", params: { id: match.id } });
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-6">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">Step 1 of 1</div>
        <h1 className="mt-1 text-3xl font-bold" style={{ color: "#1a3a6c" }}>
          Onboard a New-to-Credit MSME
        </h1>
        <p className="mt-2 text-muted-foreground">
          Provide the business identifiers below. We'll fetch GST, UPI, bank and EPFO signals via consent — no documents needed.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-sm">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Business Name">
            <input required value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} className="input" />
          </Field>
          <Field label="Sector">
            <select value={form.sector} onChange={(e) => setForm({ ...form, sector: e.target.value })} className="input">
              <option>Textile</option>
              <option>Food Processing</option>
              <option>Retail</option>
              <option>Services</option>
              <option>Manufacturing</option>
              <option>Other</option>
            </select>
          </Field>
          <Field label="PAN">
            <input required value={form.pan} onChange={(e) => setForm({ ...form, pan: e.target.value })} className="input font-mono uppercase" />
          </Field>
          <Field label="GSTIN">
            <input required value={form.gstin} onChange={(e) => setForm({ ...form, gstin: e.target.value })} className="input font-mono uppercase" />
          </Field>
          <Field label="Udyam Registration No.">
            <input required value={form.udyam} onChange={(e) => setForm({ ...form, udyam: e.target.value })} className="input font-mono uppercase" />
          </Field>
          <Field label="Years in Operation">
            <input required type="number" min={0} value={form.years} onChange={(e) => setForm({ ...form, years: e.target.value })} className="input" />
          </Field>
        </div>

        <div className="mt-8">
          <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: "#1a3a6c" }}>
            <ShieldCheck className="h-4 w-4" style={{ color: "#0d9488" }} />
            Data access consent
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Consents are collected under DPDP and RBI's Account Aggregator framework. You can revoke anytime from your AA dashboard.
          </p>
          <div className="mt-3 space-y-2">
            <Consent label="GST filings & returns (last 24 months)" checked={consent.gst} onChange={(v) => setConsent({ ...consent, gst: v })} />
            <Consent label="UPI transaction history & bank statements via Account Aggregator" checked={consent.upi} onChange={(v) => setConsent({ ...consent, upi: v })} />
            <Consent label="EPFO contribution history" checked={consent.epfo} onChange={(v) => setConsent({ ...consent, epfo: v })} />
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            {allConsented ? "All consents captured. Ready to score." : "Grant all consents to proceed."}
          </div>
          <motion.button
            type="submit"
            whileTap={{ scale: 0.97 }}
            disabled={!allConsented || loading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-medium disabled:opacity-50 shadow-sm"
            style={{ background: "#1a3a6c" }}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Analysing signals…
              </>
            ) : (
              "Generate Health Score"
            )}
          </motion.button>
        </div>
      </form>

      <style>{`
        .input {
          width: 100%;
          padding: 0.6rem 0.75rem;
          border-radius: 0.6rem;
          border: 1px solid var(--border);
          background: white;
          font-size: 0.875rem;
          outline: none;
          transition: border-color .15s, box-shadow .15s;
        }
        .input:focus { border-color: #0d9488; box-shadow: 0 0 0 3px rgba(13,148,136,0.12); }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">{label}</div>
      {children}
    </label>
  );
}

function Consent({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-start gap-3 p-3 rounded-lg border border-border cursor-pointer hover:bg-secondary/50 transition-colors">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[#0d9488]" />
      <span className="text-sm text-foreground">{label}</span>
    </label>
  );
}