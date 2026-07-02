import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Database, Landmark, Wallet, Users, Network, Layers, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/integrations")({
  head: () => ({
    meta: [
      { title: "Data Sources · MSME Financial Health Card" },
      { name: "description", content: "Live status of GST Network, UPI/NPCI, Account Aggregator, EPFO, ULI and OCEN feeds." },
    ],
  }),
  component: Integrations,
});

const sources = [
  {
    key: "gst", name: "GST Network (GSTN)", icon: Database,
    subtitle: "GSTR-1 · GSTR-3B · turnover trend",
    sync: "2 min ago",
    sample: [
      "GSTR-3B for Oct'25 filed — turnover ₹5.1L",
      "GSTR-1 for Oct'25 filed — 87 B2B invoices",
      "Nil filings in last 24 mo: 0",
    ],
  },
  {
    key: "upi", name: "UPI / NPCI", icon: Wallet,
    subtitle: "Merchant txn count, value, growth",
    sync: "4 min ago",
    sample: [
      "Last 30d: 480 credits · ₹3.8L received",
      "Growth YoY: +22%",
      "QR handles active: 3",
    ],
  },
  {
    key: "aa", name: "Account Aggregator (AA)", icon: Landmark,
    subtitle: "Bank statements, cashflow, EMIs",
    sync: "6 min ago",
    sample: [
      "Current account SB-****4321 linked",
      "Avg monthly inflow ₹4.6L / outflow ₹3.8L",
      "Cheque bounces (12m): 0",
    ],
  },
  {
    key: "epfo", name: "EPFO", icon: Users,
    subtitle: "Employee count, PF challans",
    sync: "12 min ago",
    sample: [
      "Establishment ID DL/34567 active",
      "14 employees contributing",
      "22 consecutive monthly challans paid",
    ],
  },
  {
    key: "uli", name: "ULI — Unified Lending Interface", icon: Network,
    subtitle: "Standardised lending data rails",
    sync: "just now",
    sample: [
      "Consent artefact issued for 90 days",
      "3 lender participants notified",
      "Data fetch latency: 780 ms",
    ],
  },
  {
    key: "ocen", name: "OCEN", icon: Layers,
    subtitle: "Cashflow lending protocol",
    sync: "just now",
    sample: [
      "LSP integration active",
      "Loan agreement template v2.1 in use",
      "TSP settlement rails: OK",
    ],
  },
];

function Integrations() {
  const [syncing, setSyncing] = useState<Record<string, boolean>>({});
  const [syncedAt, setSyncedAt] = useState<Record<string, string>>({});

  const sync = (key: string, name: string) => {
    if (syncing[key]) return;
    setSyncing((s) => ({ ...s, [key]: true }));
    setTimeout(() => {
      setSyncing((s) => ({ ...s, [key]: false }));
      // 10% chance to simulate a failure to demonstrate error toast
      if (Math.random() < 0.12) {
        toast.error(`${name} sync failed`, { description: "Consent expired — please re-authorise the data pull." });
        return;
      }
      setSyncedAt((s) => ({ ...s, [key]: "just now" }));
      toast.success(`${name} synced`);
    }, 1100);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">Data rails</div>
        <h1 className="mt-1 text-3xl font-bold" style={{ color: "#1a3a6c" }}>Alternate-data integrations</h1>
        <p className="mt-2 text-muted-foreground max-w-2xl">
          Every score is derived from these live, consent-based feeds. No manual document uploads.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sources.map((s) => (
          <div key={s.key} className="rounded-2xl border border-border bg-white p-5 shadow-[var(--shadow-card)]">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: "#0d94881a" }}>
                  <s.icon className="h-5 w-5" style={{ color: "#0d9488" }} />
                </div>
                <div>
                  <div className="font-semibold" style={{ color: "#1a3a6c" }}>{s.name}</div>
                  <div className="text-xs text-muted-foreground">{s.subtitle}</div>
                </div>
              </div>
              <button
                onClick={() => sync(s.key, s.name)}
                disabled={syncing[s.key]}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full hover:bg-emerald-100 disabled:opacity-60"
              >
                {syncing[s.key] ? <RefreshCw className="h-3 w-3 animate-spin" /> : <CheckCircle2 className="h-3 w-3" />}
                {syncing[s.key] ? "Syncing" : "Connected"}
              </button>
            </div>
            <div className="mt-4 rounded-lg bg-secondary/50 p-3 border border-border">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">Sample data · synced {syncedAt[s.key] ?? s.sync}</div>
              {syncing[s.key] ? (
                <div className="space-y-1.5">
                  <Skeleton className="h-3 w-11/12" />
                  <Skeleton className="h-3 w-9/12" />
                  <Skeleton className="h-3 w-10/12" />
                </div>
              ) : (
                <ul className="text-xs space-y-1 font-mono text-foreground/80">
                  {s.sample.map((row, i) => (
                    <li key={i} className="truncate">▸ {row}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}