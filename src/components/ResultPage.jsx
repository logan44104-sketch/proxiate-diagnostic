import { useState, useEffect } from 'react';
import { fetchDiagnosis, submitEmailAndUnlock, buildExportString } from '../resultApi';
import { resolveMechanism } from '../config/mechanisms';
import './ResultPage.css';

export default function ResultPage({ scoringResult, quizAnswers }) {
  const [diagnosisText, setDiagnosisText]     = useState(null);
  const [diagnosisLoading, setDiagnosisLoading] = useState(false);
  const [diagnosisError, setDiagnosisError]   = useState(null);
  const [retryCount, setRetryCount]           = useState(0);

  const [email, setEmail]               = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError]     = useState(null);

  const [actionPlanText, setActionPlanText] = useState(null);
  const [exportCopied, setExportCopied]     = useState(false);

  // ── Call 1: fetch diagnosis on mount (and on retry) ──────────────────────
  useEffect(() => {
    let cancelled = false;
    setDiagnosisLoading(true);
    setDiagnosisError(null);

    fetchDiagnosis(scoringResult, quizAnswers)
      .then((text) => {
        if (!cancelled) setDiagnosisText(text);
      })
      .catch(() => {
        if (!cancelled)
          setDiagnosisError('We had trouble generating your results. Please refresh and try again.');
      })
      .finally(() => {
        if (!cancelled) setDiagnosisLoading(false);
      });

    return () => { cancelled = true; };
  }, [retryCount]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Email submit ──────────────────────────────────────────────────────────
  async function handleEmailSubmit(e) {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setEmailError('Please enter a valid email address');
      return;
    }
    setEmailLoading(true);
    setEmailError(null);

    const result = await submitEmailAndUnlock(email, scoringResult, quizAnswers);

    if (result.success) {
      setEmailSubmitted(true);
      setActionPlanText(result.actionPlanText);
    } else {
      setEmailError(result.error);
    }
    setEmailLoading(false);
  }

  // ── Copy export ───────────────────────────────────────────────────────────
  function handleCopyExport() {
    const str = buildExportString(diagnosisText, actionPlanText, scoringResult, quizAnswers);
    navigator.clipboard.writeText(str).then(() => {
      setExportCopied(true);
      setTimeout(() => setExportCopied(false), 2000);
    });
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  function renderParagraphs(text) {
    return text.split(/\n\n+/).map((chunk, i) => (
      <p key={i}>{chunk}</p>
    ));
  }

  const mechanismName = resolveMechanism(scoringResult.primaryMechanism, quizAnswers)?.label
    ?? scoringResult.primaryMechanism;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* BLOCK 1 — Diagnosis */}
      <div className="result-diagnosis">
        {diagnosisLoading && (
          <div className="result-loading">
            <div className="result-spinner" />
            Analysing your results…
          </div>
        )}

        {diagnosisError && !diagnosisLoading && (
          <div className="result-error">
            {diagnosisError}
            <button onClick={() => setRetryCount((n) => n + 1)} style={{ marginLeft: '1rem' }}>
              Retry
            </button>
          </div>
        )}

        {diagnosisText && (
          <>
            <h2>{mechanismName}</h2>
            <div className="result-diagnosis-text">
              {renderParagraphs(diagnosisText)}
            </div>
          </>
        )}
      </div>

      {/* BLOCK 2 — Email gate */}
      {diagnosisText && !emailSubmitted && (
        <div className="result-email-gate">
          <h2>Your action plan is ready</h2>
          <p>Enter your email to unlock your ranked recommendations and next steps.</p>
          <form onSubmit={handleEmailSubmit} noValidate>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              disabled={emailLoading}
            />
            <button type="submit" disabled={emailLoading}>
              {emailLoading ? 'One moment…' : 'Unlock my plan'}
            </button>
            {emailError && (
              <div className="result-email-error">{emailError}</div>
            )}
          </form>
          <p className="result-email-legal">No spam. Unsubscribe any time.</p>
        </div>
      )}

      {/* BLOCK 3 — Action plan */}
      {emailSubmitted && (
        <div className="result-action-plan">
          {!actionPlanText && (
            <div className="result-loading">
              <div className="result-spinner" />
              Building your plan…
            </div>
          )}
          {actionPlanText && (
            <>
              <h2>Your Action Plan</h2>
              {renderParagraphs(actionPlanText)}
            </>
          )}
        </div>
      )}

      {/* BLOCK 4 — Export */}
      {emailSubmitted && actionPlanText && (
        <div className="result-export">
          <h3>Take this further</h3>
          <p>
            Copy your full results below and paste them into ChatGPT or Claude to ask
            follow-up questions.
          </p>
          <button
            className={`result-export-btn${exportCopied ? ' result-export-btn--copied' : ''}`}
            onClick={handleCopyExport}
          >
            {exportCopied ? 'Copied!' : 'Copy results to clipboard'}
          </button>
        </div>
      )}
    </>
  );
}
