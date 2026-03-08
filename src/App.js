import { useState, useRef, useCallback } from "react";

const SYSTEM_PROMPT = `You are a diagnostic interviewer for Proxiate, a sleep and energy diagnostic platform. You identify the root cause of non-restorative sleep in exactly 9 questions, then deliver a result.

## STYLE RULES — CRITICAL
- NEVER label questions with "Question 1:" or "Q1:" or any numbering headers. Just ask naturally.
- NEVER use corporate wellness language. Be direct and warm.
- One question at a time. No preamble.
- Opening (2 sentences max): One sharp line about what this is. Then ask Q1 immediately.
- Example opening: "9 questions to find out exactly why your sleep isn't working. Let's start:"

## QUESTION BUDGET
Exactly 9 questions maximum. Deliver result after Q9. No exceptions.

## INTERNAL SCORING — NEVER MENTION TO USER
Track 6 buckets silently:
- A: Sleep Architecture Collapse
- B: Sleep-Disordered Breathing / OSA — MEDICAL ESCALATION
- C: Circadian Mismatch / Sleep Debt
- D: Medical or Nutritional Cause
- E: Stress, Hyperarousal & Mental Health
- F: Multi-Factor Lifestyle Accumulation
Highest = primary result. Second highest = contributing factor.

## HARD RULES
1. OSA WINS: Snoring / gasping / witnessed apneas / waking with headache or dry mouth → ask "Has anyone witnessed you stop breathing or gasp?" → always route Result B.
2. DEPRESSION FLAG: Low mood / loss of interest / flatness → append mental health referral to result.
3. PREGNANCY: Pregnant → "Please speak with your midwife or GP before we continue." End.
4. THREE-TIER: Every result = (1) free behaviour changes, (2) medical referral if needed, (3) products only if additive.
5. FEMALE IRON/THYROID: Female + fatigue → always flag iron and thyroid worth testing.

## QUESTION FORMAT
For questions with options, include this block EXACTLY at the end of your message:

<<<OPTIONS
{"type":"single","options":["Option A","Option B","Option C","Option D"]}
OPTIONS>>>

For multi-select:
<<<OPTIONS
{"type":"multi","options":["Option A","Option B","Option C","Option D"],"prompt":"Select all that apply"}
OPTIONS>>>

## QUESTIONS

Q1 — No options. Ask: "Before I ask anything about sleep — what does your tiredness actually feel like day to day?"

Q2 — With options. Ask about sleep/wake consistency including weekends.
<<<OPTIONS
{"type":"single","options":["Very consistent — within 30 minutes every day","Mostly consistent — 30–60 min variation","Inconsistent — 1–2 hour variation","Very inconsistent — 2+ hours, especially weekends"]}
OPTIONS>>>

Q3 — With options. Ask directly about snoring or breathing pauses during sleep.
<<<OPTIONS
{"type":"single","options":["Yes — told I snore loudly or stop breathing","Possibly — I snore but nothing serious reported","No — and a partner would know","I sleep alone — not sure"]}
OPTIONS>>>

Q4 — With options. How long until fully alert after waking?
<<<OPTIONS
{"type":"single","options":["Under 15 minutes","Around 30 minutes","About an hour","Over an hour — coffee doesn't fix it"]}
OPTIONS>>>

Q5 — With options. How would they describe sleep quality?
<<<OPTIONS
{"type":"single","options":["Light and restless — wake at every sound","Sleep heavily but wake unrefreshed","Fall asleep fine but wake during the night","Struggle to fall asleep at all"]}
OPTIONS>>>

Q6 — No options. Ask warmly about mood over the past month.

Q7 — With options. Alcohol frequency and proximity to bedtime.
<<<OPTIONS
{"type":"single","options":["Don't drink","Occasionally, not close to bedtime","3–5 nights a week, sometimes within 2 hours of sleep","Most nights — often drink to wind down"]}
OPTIONS>>>

Q8 — With options. Exercise frequency first, then bedroom conditions after they answer.
Exercise options:
<<<OPTIONS
{"type":"single","options":["Daily","3–5 times per week","Once or twice a week","Rarely or never"]}
OPTIONS>>>

Then bedroom:
<<<OPTIONS
{"type":"multi","options":["Cool and dark — well optimised","Warm or humid — often feel hot","Light comes in — street, devices, or morning sun","Noisy — traffic, partner, or early sounds"],"prompt":"Select all that apply"}
OPTIONS>>>

Q9 — No options. Contextual: if female ask about heavy periods and thyroid symptoms. If all lifestyle scores low ask about blood tests. Otherwise ask about medications or sleep aids. Then deliver result.

## RESULT FORMAT
Say: "I have a clear picture. Here's what I'm seeing."

Then use this exact format:

**[RESULT TITLE]**

[2-3 sentences on WHY this is happening physiologically]

**What I'm seeing in your case:**
[One personalised observation from their answers]

**Your protocol — in priority order:**
1. [Free behaviour change]
2. [Free behaviour change]
3. [Medical referral if needed]
4. [Product only if genuinely additive]

**Contributing factor to watch:**
[Secondary bucket 1-2 sentences]

<<<RESULT
{"bucket":"A"}
RESULT>>>

## RESULT MECHANISMS

SLEEP ARCHITECTURE COLLAPSE: Enough time in bed but insufficient deep slow-wave sleep — where physical restoration and memory consolidation happen. Architecturally disrupted sleep feels unrepairing regardless of duration.

SLEEP-DISORDERED BREATHING — SEE YOUR GP: Airway likely obstructing during sleep, causing micro-arousals you don't remember. Deep sleep is nearly impossible to sustain. No lifestyle change fixes this. See your GP this week and request a sleep study referral.

CIRCADIAN MISMATCH: Biological clock and schedule in conflict. Irregular times — especially sleeping in on weekends — creates social jetlag. Cortisol, melatonin, and body temperature rhythms all degrade.

MEDICAL OR NUTRITIONAL CAUSE: Fatigue likely biological — sleep changes alone won't resolve it. Most missed: low ferritin, subclinical hypothyroidism, Vitamin D, B12. Request a comprehensive panel, not a standard CBC.

STRESS AND HYPERAROUSAL: Nervous system not disengaging at night. Brain maintains threat-monitoring during sleep — 8 hours architecturally shallow. Behavioural changes help but are insufficient alone.

MULTI-FACTOR LIFESTYLE: No single cause — several compounding. Most reversible category. Eliminate in order of impact and improvement comes fast.

TONE: Warm, direct, clinical. Smartest friend who knows this field. No hedging. No selling. Diagnose.`;

function parseMessage(raw) {
  const optMatch = raw.match(/<<<OPTIONS\s*([\s\S]*?)\s*OPTIONS>>>/);
  const resultMatch = raw.match(/<<<RESULT\s*([\s\S]*?)\s*RESULT>>>/);
  const text = raw
    .replace(/<<<OPTIONS[\s\S]*?OPTIONS>>>/g, "")
    .replace(/<<<RESULT[\s\S]*?RESULT>>>/g, "")
    .trim();

  let options = null;
  if (optMatch) {
    try { options = JSON.parse(optMatch[1].trim()); } catch(e) { console.log("options parse error", e); }
  }
  let result = null;
  if (resultMatch) {
    try { result = JSON.parse(resultMatch[1].trim()); } catch(e) {}
  }
  return { text, options, result };
}

function isResultMessage(text) {
  return text.includes("Your protocol") || text.includes("What I'm seeing in your case") || text.includes("I have a clear picture");
}

const TypingDots = () => (
  <div style={{ display: "flex", gap: "5px", padding: "4px 0 8px" }}>
    {[0,1,2].map(i => (
      <div key={i} style={{
        width: "7px", height: "7px", borderRadius: "50%",
        background: "#C4512A",
        animation: "dotPulse 1.2s ease-in-out infinite",
        animationDelay: `${i * 0.2}s`,
      }} />
    ))}
  </div>
);

function MessageText({ text }) {
  if (!text) return null;
  return (
    <div style={{ fontSize: "15px", lineHeight: "1.75", color: "#d0c8c0" }}>
      {text.split("\n").map((line, i) => {
        if (!line.trim()) return <div key={i} style={{ height: "6px" }} />;
        if (/^\*\*[^*]+\*\*$/.test(line.trim())) {
          return <p key={i} style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "16px", color: "#f0ebe3",
            margin: "16px 0 6px", fontWeight: "normal"
          }}>{line.replace(/\*\*/g, "")}</p>;
        }
        if (line.includes("**")) {
          return <p key={i} style={{ margin: "5px 0", color: "#d0c8c0" }}
            dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong style="color:#f0ebe3;font-weight:500">$1</strong>') }} />;
        }
        if (/^\d+\./.test(line.trim())) {
          return (
            <div key={i} style={{ display: "flex", gap: "12px", margin: "6px 0" }}>
              <span style={{ color: "#C4512A", fontWeight: 600, minWidth: "16px", paddingTop: "1px" }}>
                {line.match(/^(\d+)/)[1]}.
              </span>
              <span style={{ color: "#d0c8c0" }}>{line.replace(/^\d+\./, "").trim()}</span>
            </div>
          );
        }
        if (line.trim() === "---") return <div key={i} style={{ height: "1px", background: "#2a2520", margin: "14px 0" }} />;
        return <p key={i} style={{ margin: "4px 0", color: "#d0c8c0" }}>{line}</p>;
      })}
    </div>
  );
}

function OptionButtons({ options, onSelect, selectedOption, confirmed, multiSelected, onMultiConfirm }) {
  const isMulti = options.type === "multi";
  return (
    <div style={{ marginTop: "14px" }}>
      {options.prompt && (
        <p style={{ fontSize: "11px", color: "#888078", margin: "0 0 10px", letterSpacing: "0.06em", textTransform: "uppercase" }}>
          {options.prompt}
        </p>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {options.options.map((opt, i) => {
          const isSelected = isMulti
            ? (multiSelected || []).includes(opt)
            : selectedOption === opt;
          return (
            <button key={i} onClick={() => !confirmed && onSelect(opt)}
              style={{
                background: isSelected ? "#1e1a14" : "#141210",
                border: `1px solid ${isSelected ? "#C4512A" : "#2a2520"}`,
                borderRadius: "7px", padding: "11px 16px",
                textAlign: "left", cursor: confirmed ? "default" : "pointer",
                transition: "all .15s", display: "flex", alignItems: "center", gap: "12px",
                opacity: confirmed && !isSelected ? 0.35 : 1,
              }}>
              <div style={{
                width: "16px", height: "16px", flexShrink: 0,
                borderRadius: isMulti ? "4px" : "50%",
                border: `2px solid ${isSelected ? "#C4512A" : "#3a3530"}`,
                background: isSelected ? "#C4512A" : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all .15s",
              }}>
                {isSelected && <div style={{
                  width: isMulti ? "8px" : "7px",
                  height: isMulti ? "8px" : "7px",
                  background: "#f0ebe3",
                  borderRadius: isMulti ? "2px" : "50%",
                }} />}
              </div>
              <span style={{ fontSize: "14px", color: isSelected ? "#f0ebe3" : "#b0a89e", lineHeight: "1.4" }}>{opt}</span>
            </button>
          );
        })}
      </div>
      {isMulti && !confirmed && multiSelected && multiSelected.length > 0 && (
        <button onClick={onMultiConfirm} style={{
          marginTop: "12px", background: "#C4512A", color: "#f0ebe3",
          border: "none", padding: "10px 22px", borderRadius: "5px",
          fontSize: "13px", fontFamily: "'IBM Plex Sans', sans-serif",
          cursor: "pointer", fontWeight: 500,
        }}>
          Confirm →
        </button>
      )}
    </div>
  );
}

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState("intro");
  const [qNum, setQNum] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [multiSelected, setMultiSelected] = useState([]);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const scrollDown = () => setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 80);

  const callAPI = useCallback(async (msgs) => {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "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",
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: msgs,
      }),
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    return data.content?.[0]?.text || "";
  }, []);

  const addAssistantMessage = (raw, prevMsgs) => {
    const parsed = parseMessage(raw);
    const updated = [...prevMsgs, { role: "assistant", ...parsed, confirmed: false, selectedOption: null }];
    const aCount = updated.filter(m => m.role === "assistant").length;
    const isDone = isResultMessage(parsed.text) || !!parsed.result;
    return { updated, aCount, isDone };
  };

  const start = async () => {
    setPhase("chat");
    setLoading(true);
    try {
      const raw = await callAPI([{ role: "user", content: "Begin." }]);
      const { updated, aCount, isDone } = addAssistantMessage(raw, []);
      setMessages(updated);
      setQNum(Math.min(aCount, 9));
      if (isDone) setPhase("result");
    } catch(e) {
      setMessages([{ role: "assistant", text: `Error: ${e.message}. Check your API key.`, options: null, result: null, confirmed: false }]);
    }
    setLoading(false);
    scrollDown();
    setTimeout(() => inputRef.current?.focus(), 200);
  };

  const send = async (content) => {
    if (!content?.trim() || loading) return;
    setInput("");
    setMultiSelected([]);
    const userMsg = { role: "user", content: content.trim() };
    const apiHistory = messages.map(m => ({
      role: m.role,
      content: m.role === "assistant" ? m.text : m.content,
    }));
    const withUser = [...messages, userMsg];
    setMessages(withUser);
    setLoading(true);
    scrollDown();
    try {
      const raw = await callAPI([...apiHistory, { role: "user", content: content.trim() }]);
      const { updated, aCount, isDone } = addAssistantMessage(raw, withUser);
      setMessages(updated);
      setQNum(Math.min(aCount, 9));
      if (isDone) setTimeout(() => setPhase("result"), 400);
    } catch(e) {
      setMessages(p => [...p, { role: "assistant", text: `Error: ${e.message}`, options: null, result: null, confirmed: false }]);
    }
    setLoading(false);
    scrollDown();
    setTimeout(() => inputRef.current?.focus(), 200);
  };

  const handleOptionClick = (msgIndex, opt) => {
    const msg = messages[msgIndex];
    if (!msg || msg.confirmed) return;
    if (msg.options?.type === "multi") {
      setMultiSelected(prev =>
        prev.includes(opt) ? prev.filter(x => x !== opt) : [...prev, opt]
      );
    } else {
      setMessages(prev => prev.map((m, i) =>
        i === msgIndex ? { ...m, selectedOption: opt, confirmed: true } : m
      ));
      send(opt);
    }
  };

  const handleMultiConfirm = (msgIndex) => {
    if (multiSelected.length === 0) return;
    const answer = multiSelected.join(", ");
    setMessages(prev => prev.map((m, i) =>
      i === msgIndex ? { ...m, selectedOption: answer, confirmed: true } : m
    ));
    send(answer);
  };

  const reset = () => {
    setMessages([]); setInput(""); setPhase("intro");
    setQNum(0); setShowConfirm(false); setMultiSelected([]);
  };

  const progress = phase === "result" ? 100 : Math.min(Math.round((qNum / 9) * 100), 94);

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "#0e0b09", fontFamily: "'IBM Plex Sans', sans-serif", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=IBM+Plex+Sans:wght@300;400;500&display=swap');
        @keyframes dotPulse { 0%,100%{opacity:.3;transform:scale(.8)} 50%{opacity:1;transform:scale(1)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes glow { 0%,100%{opacity:.4} 50%{opacity:1} }
        textarea:focus { outline: none; }
        textarea { resize: none; }
        textarea::placeholder { color: #3a3530; }
        button:focus { outline: none; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2a2520; border-radius: 2px; }
        .msg { animation: fadeUp .3s ease forwards; }
        .bar { transition: width .6s cubic-bezier(.4,0,.2,1); }
      `}</style>

      {/* Confirm reset overlay */}
      {showConfirm && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(14,11,9,.94)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#161310", border: "1px solid #2a2520", borderRadius: "10px", padding: "30px 34px", maxWidth: "360px", width: "90%", animation: "fadeUp .2s ease forwards" }}>
            <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: "20px", color: "#f0ebe3", margin: "0 0 10px", fontWeight: "normal" }}>Restart diagnostic?</p>
            <p style={{ color: "#7a7268", fontSize: "13px", lineHeight: 1.65, margin: "0 0 24px" }}>Your progress will be lost.</p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={reset} style={{ background: "#C4512A", color: "#f0ebe3", border: "none", padding: "10px 20px", borderRadius: "5px", fontSize: "13px", fontFamily: "'IBM Plex Sans', sans-serif", cursor: "pointer", fontWeight: 500 }}>Restart</button>
              <button onClick={() => setShowConfirm(false)} style={{ background: "transparent", color: "#7a7268", border: "1px solid #2a2520", padding: "10px 20px", borderRadius: "5px", fontSize: "13px", fontFamily: "'IBM Plex Sans', sans-serif", cursor: "pointer" }}>Keep going</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ padding: "15px 24px", borderBottom: "1px solid #1a1612", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: "17px", color: "#f0ebe3", letterSpacing: "-0.02em" }}>Proxiate</span>
          {phase !== "intro" && <span style={{ fontSize: "10px", color: "#4a4540", letterSpacing: "0.1em", textTransform: "uppercase", paddingLeft: "12px", borderLeft: "1px solid #1e1a16" }}>Sleep Diagnostic</span>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {phase === "chat" && <span style={{ fontSize: "12px", color: "#4a4540" }}>Q{Math.min(qNum, 9)} / 9</span>}
          {phase === "result" && <span style={{ fontSize: "11px", color: "#C4512A", letterSpacing: "0.08em", textTransform: "uppercase" }}>Complete</span>}
          {phase !== "intro" && (
            <button onClick={() => setShowConfirm(true)} style={{ background: "none", border: "none", color: "#3a3530", fontSize: "11px", cursor: "pointer", fontFamily: "'IBM Plex Sans', sans-serif", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Restart
            </button>
          )}
        </div>
      </div>

      {/* Progress bar */}
      {phase !== "intro" && (
        <div style={{ height: "2px", background: "#141210", flexShrink: 0 }}>
          <div className="bar" style={{ height: "100%", background: phase === "result" ? "#C4512A" : "#3a3530", width: `${progress}%` }} />
        </div>
      )}

      {/* Main content */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {phase === "intro" ? (
          <div style={{ maxWidth: "540px", margin: "70px auto", padding: "0 30px", animation: "fadeUp .5s ease forwards" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
              <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#C4512A", animation: "glow 2.5s ease infinite" }} />
              <span style={{ fontSize: "11px", color: "#C4512A", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500 }}>Root Cause Diagnostic</span>
            </div>
            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(26px,5vw,40px)", color: "#f0ebe3", fontWeight: "normal", lineHeight: 1.15, margin: "0 0 18px", letterSpacing: "-0.02em" }}>
              Why are you still tired<br />after 8 hours of sleep?
            </h1>
            <p style={{ color: "#7a7268", fontSize: "15px", lineHeight: 1.75, margin: "0 0 30px", fontWeight: 300 }}>
              A diagnostic conversation — not a generic quiz.<br />Takes about 3 minutes.
            </p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "34px" }}>
              {["9 questions", "6 root cause categories", "Medical escalation included"].map(t => (
                <span key={t} style={{ fontSize: "11px", color: "#4a4540", border: "1px solid #1e1a16", borderRadius: "4px", padding: "4px 10px", letterSpacing: "0.03em" }}>{t}</span>
              ))}
            </div>
            <button onClick={start}
              onMouseOver={e => e.currentTarget.style.background = "#ae4825"}
              onMouseOut={e => e.currentTarget.style.background = "#C4512A"}
              style={{ background: "#C4512A", color: "#f0ebe3", border: "none", padding: "13px 28px", borderRadius: "5px", fontSize: "14px", fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 500, cursor: "pointer", letterSpacing: "0.02em", transition: "background .15s" }}>
              Begin diagnostic →
            </button>
            <p style={{ marginTop: "20px", fontSize: "11px", color: "#2a2520", lineHeight: 1.7 }}>
              Not a medical service · OSA signals always route to GP referral
            </p>
          </div>
        ) : (
          <div style={{ maxWidth: "660px", margin: "0 auto", padding: "28px 24px 80px" }}>
            {messages.map((m, i) => (
              <div key={i} className="msg" style={{ marginBottom: "20px", display: "flex", flexDirection: "column", alignItems: m.role === "user" ? "flex-end" : "flex-start" }}>
                {m.role === "assistant" && (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: "#141210", border: "1px solid #2a2520", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#C4512A" }} />
                    </div>
                    <span style={{ fontSize: "10px", color: "#3a3530", letterSpacing: "0.09em", textTransform: "uppercase" }}>Proxiate</span>
                  </div>
                )}
                <div style={{
                  maxWidth: m.role === "user" ? "72%" : "100%",
                  background: m.role === "user" ? "#161310" : "transparent",
                  border: m.role === "user" ? "1px solid #2a2520" : "none",
                  borderRadius: m.role === "user" ? "12px 12px 3px 12px" : 0,
                  padding: m.role === "user" ? "10px 14px" : 0,
                }}>
                  {m.role === "user"
                    ? <p style={{ margin: 0, color: "#9a9088", fontSize: "14px", lineHeight: 1.6 }}>{m.content}</p>
                    : <>
                        <MessageText text={m.text} />
                        {m.options && (
                          <OptionButtons
                            options={m.options}
                            selectedOption={m.selectedOption}
                            confirmed={m.confirmed}
                            multiSelected={m.options.type === "multi" ? multiSelected : []}
                            onSelect={(opt) => handleOptionClick(i, opt)}
                            onMultiConfirm={() => handleMultiConfirm(i)}
                          />
                        )}
                      </>
                  }
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: "#141210", border: "1px solid #2a2520", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#C4512A" }} />
                </div>
                <TypingDots />
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Text input */}
      {phase === "chat" && (
        <div style={{ borderTop: "1px solid #141210", padding: "14px 24px", background: "#0e0b09", flexShrink: 0 }}>
          <div style={{ maxWidth: "660px", margin: "0 auto", position: "relative" }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
              placeholder="Type your answer… or click an option above"
              rows={2}
              disabled={loading}
              style={{ width: "100%", background: "#121009", border: "1px solid #1e1a16", borderRadius: "7px", color: "#c8c0b8", fontSize: "14px", fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 300, padding: "12px 48px 12px 14px", lineHeight: "1.65", boxSizing: "border-box", transition: "border-color .15s" }}
              onFocus={e => e.target.style.borderColor = "#3a3530"}
              onBlur={e => e.target.style.borderColor = "#1e1a16"}
            />
            <button onClick={() => send(input)} disabled={loading || !input.trim()} style={{ position: "absolute", right: "8px", bottom: "8px", width: "30px", height: "30px", borderRadius: "5px", background: input.trim() && !loading ? "#C4512A" : "#161310", border: "none", cursor: input.trim() && !loading ? "pointer" : "default", color: input.trim() && !loading ? "#f0ebe3" : "#3a3530", fontSize: "16px", transition: "all .15s", display: "flex", alignItems: "center", justifyContent: "center" }}>↑</button>
          </div>
          <p style={{ maxWidth: "660px", margin: "6px auto 0", fontSize: "10px", color: "#1e1a16", textAlign: "center", letterSpacing: "0.05em" }}>ENTER TO SEND · SHIFT+ENTER FOR NEW LINE</p>
        </div>
      )}

      {/* Email capture */}
      {phase === "result" && (
        <div style={{ borderTop: "1px solid #141210", padding: "18px 24px", background: "#0e0b09", flexShrink: 0 }}>
          <div style={{ maxWidth: "660px", margin: "0 auto" }}>
            <p style={{ color: "#5a5248", fontSize: "12px", margin: "0 0 10px" }}>Get your full protocol delivered to your inbox</p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <input placeholder="your@email.com" style={{ background: "#121009", border: "1px solid #1e1a16", borderRadius: "5px", color: "#9a9088", fontSize: "13px", fontFamily: "'IBM Plex Sans', sans-serif", padding: "9px 14px", width: "210px" }} />
              <button style={{ background: "#C4512A", color: "#f0ebe3", border: "none", padding: "9px 18px", borderRadius: "5px", fontSize: "13px", fontFamily: "'IBM Plex Sans', sans-serif", cursor: "pointer", fontWeight: 500 }}>Send protocol →</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
