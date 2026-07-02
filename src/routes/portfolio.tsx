import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { msmes, formatINR, bandHex, scoreBand } from "@/data/msmes";
import { Search } from "lucide-react";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio · MSME Financial Health Card" },
      { name: "description", content: "Bank officer view of MSME applicants with sortable, filterable health scores." },
    ],
  }),
  component: Portfolio,
});

type SortKey = "score" | "amount" | "name";

function Portfolio() {
  const [sector, setSector] = useState<string>("all");
  const [band, setBand] = useState<string>("all");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<SortKey>("score");
  const [dir, setDir] = useState<"asc" | "desc">("desc");

  const rows = useMemo(() => {
    let r = msmes.slice();
    if (sector !== "all") r = r.filter((m) => m.sector === sector);
    if (band !== "all") r = r.filter((m) => scoreBand(m.scores.overall) === band);
    if (q) r = r.filter((m) => m.businessName.toLowerCase().includes(q.toLowerCase()) || m.gstin.toLowerCase().includes(q.toLowerCase()));
    r.sort((a, b) => {
      const va = sort === "score" ? a.scores.overall : sort === "amount" ? a.requestedAmount : a.businessName;
      const vb = sort === "score" ? b.scores.overall : sort === "amount" ? b.requestedAmount : b.businessName;
      if (va < vb) return dir === "asc" ? -1 : 1;
      if (va > vb) return dir === "asc" ? 1 : -1;
      return 0;
    });
    return r;
  }, [sector, band, q, sort, dir]);

  const toggleSort = (k: SortKey) => {
    if (sort === k) setDir(dir === "asc" ? "desc" : "asc");
    else { setSort(k); setDir("desc"); }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Bank Officer View</div>
          <h1 className="mt-1 text-3xl font-bold" style={{ color: "#1a3a6c" }}>MSME Applicant Portfolio</h1>
          <p className="mt-1 text-sm text-muted-foreground">{rows.length} applicants matching your filters</p>
        </div>
        <Link to="/onboarding" className="px-4 py-2 rounded-lg text-white text-sm font-medium" style={{ background: "#0d9488" }}>
          + New Applicant
        </Link>
      </div>

      <div className="rounded-2xl border border-border bg-white p-4 shadow-[var(--shadow-card)] mb-4 grid sm:grid-cols-4 gap-3">
        <div className="relative sm:col-span-2">
          <Search className="h-4 w-4 absolute left-3 top-2.5 text-muted-foreground" />
          <input
            value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Search by business name or GSTIN…"
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-border bg-white outline-none focus:border-[#0d9488]"
          />
        </div>
        <select value={sector} onChange={(e) => setSector(e.target.value)} className="text-sm rounded-lg border border-border bg-white px-3 py-2">
          <option value="all">All sectors</option>
          <option>Textile</option>
          <option>Food Processing</option>
          <option>Retail</option>
          <option>Services</option>
          <option>Manufacturing</option>
        </select>
        <select value={band} onChange={(e) => setBand(e.target.value)} className="text-sm rounded-lg border border-border bg-white px-3 py-2">
          <option value="all">All risk bands</option>
          <option value="strong">Healthy (70+)</option>
          <option value="moderate">Watchlist (40–70)</option>
          <option value="weak">High risk (&lt;40)</option>
        </select>
      </div>

      <div className="rounded-2xl border border-border bg-white overflow-hidden shadow-[var(--shadow-card)]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
                <Th onClick={() => toggleSort("name")} active={sort === "name"} dir={dir}>Business</Th>
                <th className="text-left px-4 py-3">Sector</th>
                <Th onClick={() => toggleSort("score")} active={sort === "score"} dir={dir}>Score</Th>
                <th className="text-left px-4 py-3">Risk Band</th>
                <Th onClick={() => toggleSort("amount")} active={sort === "amount"} dir={dir}>Requested</Th>
                <th className="text-left px-4 py-3">Filings</th>
                <th className="text-right px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((m) => {
                const b = scoreBand(m.scores.overall);
                const color = bandHex(m.scores.overall);
                return (
                  <tr key={m.id} className="border-t border-border hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium" style={{ color: "#1a3a6c" }}>{m.businessName}</div>
                      <div className="text-xs text-muted-foreground">{m.owner} · {m.city}</div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{m.sector}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div className="h-full" style={{ width: `${m.scores.overall}%`, background: color }} />
                        </div>
                        <span className="font-semibold tabular-nums" style={{ color }}>{m.scores.overall}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="text-[11px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full border"
                        style={{ color, borderColor: color, background: `${color}12` }}
                      >
                        {b === "strong" ? "Healthy" : b === "moderate" ? "Watchlist" : "High Risk"}
                      </span>
                    </td>
                    <td className="px-4 py-3 tabular-nums">{formatINR(m.requestedAmount)}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{m.gst.monthsFiled} mo · {m.gst.filingRegularity}%</td>
                    <td className="px-4 py-3 text-right">
                      <Link to="/dashboard/$id" params={{ id: m.id }} className="text-xs font-medium hover:underline" style={{ color: "#0d9488" }}>
                        Open Card →
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {rows.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-10 text-center text-muted-foreground text-sm">No applicants match those filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Th({ onClick, active, dir, children }: { onClick: () => void; active: boolean; dir: string; children: React.ReactNode }) {
  return (
    <th className="text-left px-4 py-3 cursor-pointer select-none" onClick={onClick}>
      <span className="inline-flex items-center gap-1">
        {children}
        {active && <span className="text-[10px]">{dir === "asc" ? "▲" : "▼"}</span>}
      </span>
    </th>
  );
}