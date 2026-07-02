import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, MessageCircle, Send, ThumbsUp, ThumbsDown, X, Minus } from "lucide-react";

type QA = { text: string; followUps: string[] };
const KB: Record<string, QA> = {
  "What is a Financial Health Score?": {
    text: "A Financial Health Score is a 0–100 rating of an MSME's creditworthiness, built entirely from live business signals like GST filings, UPI receipts, bank cashflow and EPFO — no paper documents needed. It lets banks confidently lend to New-to-Credit businesses.",
    followUps: ["How is my score calculated?", "What data do you use?", "How do I improve my score?"],
  },
  "How is my score calculated?": {
    text: "Your score combines 5 weighted factors: Revenue Stability (25%), Cash Flow Health (25%), Compliance (20%), Digital Footprint (15%), and Debt Behavior (15%). Each factor is scored from your GST, UPI, EPFO, and Account Aggregator data.",
    followUps: ["Which factor matters most?", "How often does my score update?", "What if I don't have EPFO?"],
  },
  "What data do you use?": {
    text: "We use four consent-based sources: GST filings, UPI transaction history, RBI-licensed Account Aggregator bank data, and EPFO payroll records. Every pull is authorised by you and revocable at any time.",
    followUps: ["Is my data safe?", "How do I improve my score?", "What happens after a good score?"],
  },
  "How do I improve my score?": {
    text: "File GSTR-1 and GSTR-3B before the due date every month, keep UPI as your primary receipt channel, maintain a positive inflow-outflow buffer, and pay EPFO challans on time. Consistency over 6 months moves the needle the most.",
    followUps: ["Which factor matters most?", "What happens after a good score?", "How often does my score update?"],
  },
  "Which factor matters most?": {
    text: "For most MSMEs, Compliance and Cash Flow Health drive the biggest swings — a single missed GST filing or cheque bounce can move the score by 5–8 points. Revenue Stability compounds over time.",
    followUps: ["How do I improve my score?", "How often does my score update?", "What data do you use?"],
  },
  "How often does my score update?": {
    text: "Scores refresh automatically whenever a new GST filing, UPI batch, or bank statement lands — usually within 24 hours. You'll see the change reflected on your Health Card dashboard.",
    followUps: ["How do I improve my score?", "Is my data safe?", "What happens after a good score?"],
  },
  "What if I don't have EPFO?": {
    text: "EPFO is only 15% of the score and applies mainly to businesses with 20+ employees. If you're smaller, we simply redistribute that weight across your other signals — you won't be penalised.",
    followUps: ["How is my score calculated?", "How do I improve my score?", "What data do you use?"],
  },
  "Is my data safe?": {
    text: "Yes. All data flows through RBI-licensed Account Aggregators using cryptographically signed consent artefacts. Nothing is shared with any lender without your explicit approval, and consent can be revoked instantly.",
    followUps: ["What data do you use?", "What happens after a good score?", "How do I improve my score?"],
  },
  "What happens after a good score?": {
    text: "A score of 70+ unlocks unsecured working capital, overdrafts and invoice discounting from partner banks. You'll see a recommended credit limit on your Health Card and can apply with a single tap.",
    followUps: ["What loan products are available?", "How do I improve my score?", "Is my data safe?"],
  },
  "What loan products are available?": {
    text: "Depending on your band, options include Working Capital Term Loans, Overdraft Facility, Invoice Discounting, and MUDRA loans. The dashboard suggests the products best matched to your cashflow profile.",
    followUps: ["What happens after a good score?", "How do I improve my score?", "What is a Financial Health Score?"],
  },
};

const GREETING: QA = {
  text: "Hi! I'm your VittSetu Assistant 👋 How can I help you today?",
  followUps: [
    "What is a Financial Health Score?",
    "How is my score calculated?",
    "What data do you use?",
    "How do I improve my score?",
  ],
};

type Msg =
  | { id: string; sender: "bot"; text: string; buttons?: string[] }
  | { id: string; sender: "user"; text: string };

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [feedback, setFeedback] = useState<Record<string, "up" | "down" | undefined>>({});
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ id: "m0", sender: "bot", text: GREETING.text, buttons: GREETING.followUps }]);
    }
  }, [open, messages.length]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const sendUserMessage = (text: string) => {
    const userMsg: Msg = { id: `u${Date.now()}`, sender: "user", text };
    setMessages((m) => [...m, userMsg]);
    setTyping(true);
    setTimeout(() => {
      const answer = KB[text];
      let reply: QA;
      if (answer) reply = answer;
      else if (/score/i.test(text)) reply = KB["How is my score calculated?"];
      else if (/loan|credit|product/i.test(text)) reply = KB["What loan products are available?"];
      else if (/safe|privacy|consent|data/i.test(text)) reply = KB["Is my data safe?"];
      else if (/improve|better/i.test(text)) reply = KB["How do I improve my score?"];
      else
        reply = {
          text: "I'm best at answering questions about your Financial Health Score — try one of the topics below!",
          followUps: GREETING.followUps,
        };
      setTyping(false);
      setMessages((m) => [
        ...m,
        { id: `b${Date.now()}`, sender: "bot", text: reply.text, buttons: reply.followUps },
      ]);
    }, 700);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendUserMessage(input.trim());
    setInput("");
  };

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            key="fab"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full text-white shadow-lg flex items-center justify-center"
            style={{ background: "#0d9488", boxShadow: "0 10px 30px -6px rgba(13,148,136,0.5)" }}
            aria-label="Open VittSetu Assistant"
          >
            <motion.span
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full"
              style={{ background: "#0d9488", opacity: 0.35 }}
            />
            <MessageCircle className="h-6 w-6 relative" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ type: "spring", damping: 22, stiffness: 260 }}
            className="fixed bottom-6 right-6 z-50 w-[92vw] max-w-[360px] h-[480px] rounded-2xl bg-white shadow-2xl border border-border flex flex-col overflow-hidden"
          >
            {/* header */}
            <div className="flex items-center justify-between px-4 py-3 text-white" style={{ background: "linear-gradient(135deg,#1a3a6c,#0d9488)" }}>
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold flex items-center gap-1.5">
                    VittSetu Assistant
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  </div>
                  <div className="text-[10px] opacity-80">Online · replies instantly</div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setOpen(false)} className="h-7 w-7 rounded-md hover:bg-white/10 flex items-center justify-center" aria-label="Minimize">
                  <Minus className="h-4 w-4" />
                </button>
                <button onClick={() => setOpen(false)} className="h-7 w-7 rounded-md hover:bg-white/10 flex items-center justify-center" aria-label="Close">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* messages */}
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 bg-secondary/30">
              {messages.map((m) => (
                m.sender === "bot" ? (
                  <div key={m.id} className="flex gap-2 items-start">
                    <div className="h-7 w-7 rounded-full bg-white border border-border flex items-center justify-center shrink-0">
                      <Bot className="h-3.5 w-3.5" style={{ color: "#0d9488" }} />
                    </div>
                    <div className="max-w-[78%]">
                      <div className="rounded-2xl rounded-tl-sm bg-white border border-border px-3 py-2 text-[13px] leading-snug shadow-sm">
                        {m.text}
                      </div>
                      <div className="flex items-center gap-2 mt-1 pl-1 text-[11px] text-muted-foreground">
                        <span>Was this helpful?</span>
                        <button onClick={() => setFeedback((f) => ({ ...f, [m.id]: f[m.id] === "up" ? undefined : "up" }))} className="hover:text-emerald-600">
                          <ThumbsUp className={`h-3 w-3 ${feedback[m.id] === "up" ? "fill-emerald-600 text-emerald-600" : ""}`} />
                        </button>
                        <button onClick={() => setFeedback((f) => ({ ...f, [m.id]: f[m.id] === "down" ? undefined : "down" }))} className="hover:text-red-600">
                          <ThumbsDown className={`h-3 w-3 ${feedback[m.id] === "down" ? "fill-red-600 text-red-600" : ""}`} />
                        </button>
                      </div>
                      {m.buttons && m.buttons.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {m.buttons.map((b) => (
                            <button
                              key={b}
                              onClick={() => sendUserMessage(b)}
                              className="text-[11.5px] px-2.5 py-1.5 rounded-full border bg-white hover:bg-teal-50 transition-colors"
                              style={{ borderColor: "#0d948855", color: "#0d9488" }}
                            >
                              {b}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div key={m.id} className="flex justify-end">
                    <div className="max-w-[78%] rounded-2xl rounded-tr-sm text-white px-3 py-2 text-[13px] leading-snug" style={{ background: "#0d9488" }}>
                      {m.text}
                    </div>
                  </div>
                )
              ))}
              {typing && (
                <div className="flex gap-2 items-center">
                  <div className="h-7 w-7 rounded-full bg-white border border-border flex items-center justify-center">
                    <Bot className="h-3.5 w-3.5" style={{ color: "#0d9488" }} />
                  </div>
                  <div className="rounded-2xl rounded-tl-sm bg-white border border-border px-3 py-2 flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                        className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* input */}
            <form onSubmit={handleSubmit} className="border-t border-border p-2 flex gap-2 bg-white">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a question…"
                className="flex-1 text-sm px-3 py-2 rounded-lg border border-border outline-none focus:border-[#0d9488]"
              />
              <button type="submit" className="h-9 w-9 rounded-lg text-white flex items-center justify-center" style={{ background: "#0d9488" }} aria-label="Send">
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}