export type Sector =
  | "Textile"
  | "Food Processing"
  | "Retail"
  | "Services"
  | "Manufacturing";

export interface MSMEProfile {
  id: string;
  businessName: string;
  owner: string;
  pan: string;
  gstin: string;
  udyam: string;
  sector: Sector;
  yearsInOperation: number;
  city: string;
  requestedAmount: number; // INR
  gst: {
    filingRegularity: number; // 0-100
    monthsFiled: number;
    revenueTrend: { month: string; revenue: number }[];
    qoqGrowthPct: number;
  };
  upi: {
    monthlyTxnCount: number;
    monthlyTxnValue: number;
    growthPct: number;
    trend: { month: string; count: number; value: number }[];
  };
  aa: {
    avgMonthlyInflow: number;
    avgMonthlyOutflow: number;
    bounceCount: number;
    existingEmis: number;
    repaymentScore: number; // 0-100
  };
  epfo: {
    contributing: boolean;
    employees: number;
    monthsConsistent: number;
  };
  scores: {
    revenueStability: number;
    cashFlowHealth: number;
    compliance: number;
    digitalFootprint: number;
    debtBehavior: number;
    overall: number;
  };
  strengths: string[];
  risks: string[];
  insights: {
    revenueStability: string[];
    cashFlowHealth: string[];
    compliance: string[];
    digitalFootprint: string[];
    debtBehavior: string[];
  };
}

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const lastN = (n: number) => {
  const now = new Date();
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    out.push(months[d.getMonth()]);
  }
  return out;
};

const trendline = (start: number, growthPct: number, n = 12, jitter = 0.06) => {
  const labels = lastN(n);
  const g = growthPct / 100 / n;
  return labels.map((m, i) => ({
    month: m,
    revenue: Math.round(start * (1 + g * i) * (1 + (Math.random() - 0.5) * jitter)),
  }));
};

const upiTrend = (baseCount: number, baseVal: number, growthPct: number, n = 12) => {
  const labels = lastN(n);
  const g = growthPct / 100 / n;
  return labels.map((m, i) => ({
    month: m,
    count: Math.round(baseCount * (1 + g * i) * (0.94 + Math.random() * 0.12)),
    value: Math.round(baseVal * (1 + g * i) * (0.94 + Math.random() * 0.12)),
  }));
};

export const msmes: MSMEProfile[] = [
  {
    id: "msme-001",
    businessName: "Meera Handloom Weavers",
    owner: "Meera Devi",
    pan: "AABCM1234K",
    gstin: "09AABCM1234K1Z5",
    udyam: "UDYAM-UP-08-0012345",
    sector: "Textile",
    yearsInOperation: 7,
    city: "Varanasi, UP",
    requestedAmount: 1500000,
    gst: {
      filingRegularity: 96,
      monthsFiled: 24,
      revenueTrend: trendline(420000, 14, 12),
      qoqGrowthPct: 12,
    },
    upi: {
      monthlyTxnCount: 480,
      monthlyTxnValue: 380000,
      growthPct: 22,
      trend: upiTrend(400, 320000, 22, 12),
    },
    aa: {
      avgMonthlyInflow: 460000,
      avgMonthlyOutflow: 380000,
      bounceCount: 0,
      existingEmis: 1,
      repaymentScore: 88,
    },
    epfo: { contributing: true, employees: 14, monthsConsistent: 22 },
    scores: {
      revenueStability: 84,
      cashFlowHealth: 78,
      compliance: 92,
      digitalFootprint: 80,
      debtBehavior: 86,
      overall: 84,
    },
    strengths: [
      "24 months of continuous GSTR-3B filings, zero late fees",
      "Revenue grew 12% QoQ across last 4 quarters",
      "EPFO contributions consistent for 22 months across 14 employees",
      "Zero cheque bounces in last 12 months",
    ],
    risks: [
      "Concentrated buyer base — top 3 clients drive 68% revenue",
      "Seasonal dip observed each Sep–Oct",
    ],
    insights: {
      revenueStability: [
        "GST turnover of ₹52L in last FY, up from ₹41L a year ago",
        "Filings consistent for 24 months — no gaps or nil returns",
      ],
      cashFlowHealth: [
        "Avg monthly bank inflow ₹4.6L, outflow ₹3.8L — healthy buffer",
        "Zero cheque bounces across 12-month AA window",
      ],
      compliance: [
        "GSTR-1 and GSTR-3B both filed on time in 23 of 24 months",
        "EPFO PF challans paid before 15th every month",
      ],
      digitalFootprint: [
        "UPI acceptance grew 22% YoY — now 62% of daily receipts",
        "480 avg monthly UPI txns across 3 QR codes",
      ],
      debtBehavior: [
        "One active MUDRA loan — 24/24 EMIs paid on time",
        "DPD-30+ count in bureau: 0",
      ],
    },
  },
  {
    id: "msme-002",
    businessName: "Annapurna Foods Pvt Ltd",
    owner: "Rakesh Patel",
    pan: "AADCA5678L",
    gstin: "24AADCA5678L1Z9",
    udyam: "UDYAM-GJ-02-0045678",
    sector: "Food Processing",
    yearsInOperation: 4,
    city: "Rajkot, GJ",
    requestedAmount: 2500000,
    gst: {
      filingRegularity: 78,
      monthsFiled: 18,
      revenueTrend: trendline(680000, 8, 12),
      qoqGrowthPct: 5,
    },
    upi: {
      monthlyTxnCount: 260,
      monthlyTxnValue: 210000,
      growthPct: 9,
      trend: upiTrend(240, 200000, 9, 12),
    },
    aa: {
      avgMonthlyInflow: 710000,
      avgMonthlyOutflow: 640000,
      bounceCount: 2,
      existingEmis: 2,
      repaymentScore: 64,
    },
    epfo: { contributing: true, employees: 22, monthsConsistent: 14 },
    scores: {
      revenueStability: 66,
      cashFlowHealth: 58,
      compliance: 62,
      digitalFootprint: 60,
      debtBehavior: 64,
      overall: 62,
    },
    strengths: [
      "Steady GST turnover of ₹78L annually",
      "22 employees on payroll with EPFO contributions",
    ],
    risks: [
      "2 cheque bounces in last 6 months",
      "GST filings delayed 4 times in last 12 months",
      "Working capital cycle stretched to 74 days",
    ],
    insights: {
      revenueStability: [
        "Revenue growing at 5% QoQ — below sector median of 9%",
        "3 nil-return months in last 18 — inventory-driven",
      ],
      cashFlowHealth: [
        "Inflow ₹7.1L / outflow ₹6.4L — thin operating buffer",
        "2 cheque bounces flagged in AA data — worth a closer look",
      ],
      compliance: [
        "4 GSTR-3B filings delayed beyond due date in last 12 months",
        "EPFO on track since Sep last year",
      ],
      digitalFootprint: [
        "UPI adoption growing but still <30% of monthly receipts",
        "Digital footprint improving quarter-on-quarter",
      ],
      debtBehavior: [
        "Two live loans, both current, but 1 DPD-15 incident",
        "Utilisation on CC facility averaging 88%",
      ],
    },
  },
  {
    id: "msme-003",
    businessName: "Sunrise Kirana Mart",
    owner: "Sunita Sharma",
    pan: "AAKPS9012M",
    gstin: "07AAKPS9012M1Z2",
    udyam: "UDYAM-DL-04-0078901",
    sector: "Retail",
    yearsInOperation: 3,
    city: "Delhi",
    requestedAmount: 500000,
    gst: {
      filingRegularity: 88,
      monthsFiled: 20,
      revenueTrend: trendline(180000, 28, 12),
      qoqGrowthPct: 18,
    },
    upi: {
      monthlyTxnCount: 1240,
      monthlyTxnValue: 165000,
      growthPct: 44,
      trend: upiTrend(900, 130000, 44, 12),
    },
    aa: {
      avgMonthlyInflow: 210000,
      avgMonthlyOutflow: 165000,
      bounceCount: 0,
      existingEmis: 0,
      repaymentScore: 74,
    },
    epfo: { contributing: false, employees: 3, monthsConsistent: 0 },
    scores: {
      revenueStability: 74,
      cashFlowHealth: 76,
      compliance: 72,
      digitalFootprint: 92,
      debtBehavior: 70,
      overall: 77,
    },
    strengths: [
      "1,240 avg monthly UPI transactions — 92 percentile for retail",
      "Revenue up 18% QoQ, 44% YoY on digital receipts",
      "Zero missed payments across bank statement window",
    ],
    risks: [
      "No formal credit history — first-time borrower",
      "Below EPFO threshold — payroll not formalised",
    ],
    insights: {
      revenueStability: [
        "GST turnover doubled from ₹11L to ₹22L over 20 months",
        "Strong Diwali quarter uplift 3 years running",
      ],
      cashFlowHealth: [
        "Daily UPI settlement smooths cash cycle — buffer maintained",
        "Zero bounces, no overdraft utilisation",
      ],
      compliance: [
        "GSTR filings regular, 88% on-time rate",
        "PAN, GSTIN, Udyam all active and matched",
      ],
      digitalFootprint: [
        "UPI txn count grew 44% YoY — top decile for the sector",
        "Multi-QR presence across 2 storefronts",
      ],
      debtBehavior: [
        "New-to-Credit — no bureau history, no negatives either",
        "Alternate-data-derived repayment score: 74/100",
      ],
    },
  },
  {
    id: "msme-004",
    businessName: "TechBridge IT Services",
    owner: "Arvind Menon",
    pan: "AAECT3456N",
    gstin: "29AAECT3456N1Z7",
    udyam: "UDYAM-KA-03-0034567",
    sector: "Services",
    yearsInOperation: 6,
    city: "Bengaluru, KA",
    requestedAmount: 3500000,
    gst: {
      filingRegularity: 98,
      monthsFiled: 36,
      revenueTrend: trendline(950000, 18, 12),
      qoqGrowthPct: 14,
    },
    upi: {
      monthlyTxnCount: 90,
      monthlyTxnValue: 480000,
      growthPct: 12,
      trend: upiTrend(80, 420000, 12, 12),
    },
    aa: {
      avgMonthlyInflow: 1080000,
      avgMonthlyOutflow: 870000,
      bounceCount: 0,
      existingEmis: 1,
      repaymentScore: 94,
    },
    epfo: { contributing: true, employees: 28, monthsConsistent: 36 },
    scores: {
      revenueStability: 90,
      cashFlowHealth: 88,
      compliance: 96,
      digitalFootprint: 74,
      debtBehavior: 92,
      overall: 88,
    },
    strengths: [
      "3 years of unbroken GST + EPFO compliance",
      "Enterprise clients with predictable monthly billing cycles",
      "Repayment score 94/100 — no delinquencies ever recorded",
    ],
    risks: [
      "Client concentration — 1 buyer = 41% of revenue",
    ],
    insights: {
      revenueStability: [
        "GST turnover ₹1.14 Cr last FY — up 18% YoY",
        "36 months of continuous filings, zero nil returns",
      ],
      cashFlowHealth: [
        "Avg inflow ₹10.8L, outflow ₹8.7L — comfortable buffer",
        "Salary outflow to EPFO-registered payroll: ₹4.2L / mo",
      ],
      compliance: [
        "GSTR-1, GSTR-3B, TDS all filed on time for 36 months",
        "EPFO contributions across 28 employees, no defaults",
      ],
      digitalFootprint: [
        "Lower UPI count typical for B2B services",
        "NEFT/RTGS dominant — captured via AA feed",
      ],
      debtBehavior: [
        "One term loan, 32/32 EMIs paid on time",
        "Bureau score 782 — but ULI adds behavioural depth",
      ],
    },
  },
  {
    id: "msme-005",
    businessName: "Bharat Metal Works",
    owner: "Suresh Kumar",
    pan: "AAFBM7890P",
    gstin: "27AAFBM7890P1Z4",
    udyam: "UDYAM-MH-05-0056789",
    sector: "Manufacturing",
    yearsInOperation: 9,
    city: "Pune, MH",
    requestedAmount: 4000000,
    gst: {
      filingRegularity: 54,
      monthsFiled: 14,
      revenueTrend: trendline(820000, -8, 12, 0.14),
      qoqGrowthPct: -6,
    },
    upi: {
      monthlyTxnCount: 120,
      monthlyTxnValue: 95000,
      growthPct: -4,
      trend: upiTrend(140, 110000, -4, 12),
    },
    aa: {
      avgMonthlyInflow: 780000,
      avgMonthlyOutflow: 820000,
      bounceCount: 5,
      existingEmis: 3,
      repaymentScore: 42,
    },
    epfo: { contributing: false, employees: 18, monthsConsistent: 4 },
    scores: {
      revenueStability: 44,
      cashFlowHealth: 32,
      compliance: 38,
      digitalFootprint: 40,
      debtBehavior: 34,
      overall: 38,
    },
    strengths: [
      "9 years operating history in tier-1 manufacturing cluster",
    ],
    risks: [
      "GST filings lapsed 6 months — active default risk",
      "5 cheque bounces in last 12 months",
      "Outflow exceeding inflow — negative net cash flow",
      "EPFO contributions stopped 8 months ago",
      "3 live EMIs, 1 currently DPD-60",
    ],
    insights: {
      revenueStability: [
        "Revenue contracted 8% YoY — sector headwinds visible",
        "6 nil-return months in last 20 — worrying pattern",
      ],
      cashFlowHealth: [
        "Outflow exceeding inflow — cash burn ₹40k/mo",
        "5 bounces in bank statement — 3 in last quarter alone",
      ],
      compliance: [
        "GSTR-3B not filed for last 6 months",
        "EPFO contributions stopped since Jan — payroll strain",
      ],
      digitalFootprint: [
        "UPI usage declining month-on-month",
        "No POS integration; digital receipts falling",
      ],
      debtBehavior: [
        "1 active loan DPD-60, another DPD-30 last quarter",
        "Utilisation on CC facility at 96% — no headroom",
      ],
    },
  },
  {
    id: "msme-006",
    businessName: "GreenLeaf Organic Farms",
    owner: "Priya Nair",
    pan: "AAGCG2345Q",
    gstin: "32AAGCG2345Q1Z6",
    udyam: "UDYAM-KL-01-0023456",
    sector: "Food Processing",
    yearsInOperation: 5,
    city: "Kochi, KL",
    requestedAmount: 1200000,
    gst: {
      filingRegularity: 90,
      monthsFiled: 22,
      revenueTrend: trendline(340000, 16, 12),
      qoqGrowthPct: 10,
    },
    upi: {
      monthlyTxnCount: 620,
      monthlyTxnValue: 240000,
      growthPct: 28,
      trend: upiTrend(500, 200000, 28, 12),
    },
    aa: {
      avgMonthlyInflow: 380000,
      avgMonthlyOutflow: 310000,
      bounceCount: 0,
      existingEmis: 1,
      repaymentScore: 82,
    },
    epfo: { contributing: true, employees: 9, monthsConsistent: 16 },
    scores: {
      revenueStability: 78,
      cashFlowHealth: 76,
      compliance: 84,
      digitalFootprint: 82,
      debtBehavior: 80,
      overall: 80,
    },
    strengths: [
      "Direct-to-consumer channel driving 28% UPI growth",
      "GST filings on time 20 of 22 months",
      "EPFO consistent for 16 months",
    ],
    risks: [
      "Monsoon seasonality creates Jun–Aug revenue dip",
    ],
    insights: {
      revenueStability: [
        "Revenue up 16% YoY — D2C channel offsetting wholesale dip",
        "22 months of continuous filings",
      ],
      cashFlowHealth: [
        "Inflow ₹3.8L / outflow ₹3.1L — comfortable margin",
        "Zero bounces across the AA window",
      ],
      compliance: [
        "GST on-time rate 90%, EPFO on-time 100%",
        "Organic certification renewals current",
      ],
      digitalFootprint: [
        "UPI txn count grew 28% YoY",
        "Instagram + WhatsApp catalogue driving repeat customers",
      ],
      debtBehavior: [
        "1 KCC-adjacent loan, current, 18/18 EMIs on time",
      ],
    },
  },
];

export const scoreBand = (score: number): "strong" | "moderate" | "weak" => {
  if (score >= 70) return "strong";
  if (score >= 40) return "moderate";
  return "weak";
};

export const bandColor = (score: number) => {
  const b = scoreBand(score);
  return b === "strong"
    ? "text-emerald-600 bg-emerald-50 border-emerald-200"
    : b === "moderate"
      ? "text-amber-600 bg-amber-50 border-amber-200"
      : "text-red-600 bg-red-50 border-red-200";
};

export const bandHex = (score: number) => {
  const b = scoreBand(score);
  return b === "strong" ? "#059669" : b === "moderate" ? "#d97706" : "#dc2626";
};

export const recommendedLimit = (m: MSMEProfile) => {
  const b = scoreBand(m.scores.overall);
  if (b === "strong") return Math.round(m.aa.avgMonthlyInflow * 6);
  if (b === "moderate") return Math.round(m.aa.avgMonthlyInflow * 3);
  return Math.round(m.aa.avgMonthlyInflow * 1);
};

export const suggestedProducts = (m: MSMEProfile): string[] => {
  const b = scoreBand(m.scores.overall);
  if (b === "strong")
    return ["Working Capital Term Loan", "Overdraft Facility", "Invoice Discounting"];
  if (b === "moderate")
    return ["Secured MUDRA (Tarun)", "Cashflow-based Term Loan (12 mo)"];
  return ["Refer for enhanced due diligence", "Collateral-backed loan only"];
};

export const findMSME = (id: string) => msmes.find((m) => m.id === id);
export const formatINR = (n: number) => {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}k`;
  return `₹${n}`;
};