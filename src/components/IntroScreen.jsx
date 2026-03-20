// src/components/IntroScreen.jsx
import React from "react";

export default function IntroScreen({ onStart }) {
  return (
    <div
      style={{
        background: "var(--prox-surface)",
        border: "1px solid var(--prox-pale)",
        borderRadius: "14px",
        overflow: "hidden",
      }}
    >
      {/* Progress bar — 0% fill on intro */}
      <div
        style={{
          height: "3px",
          background: "var(--prox-pale)",
        }}
      >
        <div style={{ width: "0%", height: "100%", background: "var(--prox-terra)" }} />
      </div>

      <div style={{ padding: "28px" }}>
        {/* Hero */}
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 700,
            fontSize: "21px",
            color: "var(--prox-forest)",
            lineHeight: 1.35,
            margin: "0 0 20px",
          }}
        >
          Most tiredness has a specific cause. Most people never find it.
        </p>

        {/* Body */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            marginBottom: "24px",
          }}
        >
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 400,
              fontSize: "15px",
              color: "var(--prox-body)",
              lineHeight: 1.65,
              margin: 0,
            }}
          >
            Restorative sleep can be disrupted in{" "}
            <strong style={{ color: "var(--prox-forest)" }}>11 distinct ways</strong>. This
            diagnostic identifies which ones are most likely driving yours.
          </p>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 400,
              fontSize: "15px",
              color: "var(--prox-body)",
              lineHeight: 1.65,
              margin: 0,
            }}
          >
            The questions adapt as you go, branching based on your answers.
          </p>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 400,
              fontSize: "15px",
              color: "var(--prox-body)",
              lineHeight: 1.65,
              margin: 0,
            }}
          >
            By the end, you'll know what's standing between you and genuinely restorative sleep —
            and the best next steps to take.
          </p>
        </div>

        {/* Divider */}
        <hr
          style={{
            border: "none",
            borderTop: "1px solid var(--prox-pale)",
            margin: "0 0 16px",
          }}
        />

        {/* Meta row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "24px",
            flexWrap: "wrap",
          }}
        >
          {["25–36 questions", "~5 minutes", "Your result at the end"].map((item) => (
            <span
              key={item}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "13px",
                color: "var(--prox-muted)",
              }}
            >
              <span
                style={{
                  width: "5px",
                  height: "5px",
                  borderRadius: "50%",
                  background: "var(--prox-terra)",
                  flexShrink: 0,
                }}
              />
              {item}
            </span>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={onStart}
          style={{
            width: "100%",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "15px",
            fontWeight: 500,
            color: "#FFFFFF",
            background: "var(--prox-forest)",
            border: "none",
            borderRadius: "8px",
            padding: "14px",
            cursor: "pointer",
          }}
        >
          Find my pattern →
        </button>

        {/* Trust note */}
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "12px",
            color: "var(--prox-muted)",
            opacity: 0.7,
            textAlign: "center",
            margin: "12px 0 0",
          }}
        >
          No sign-up · Your results, right away
        </p>
      </div>
    </div>
  );
}
