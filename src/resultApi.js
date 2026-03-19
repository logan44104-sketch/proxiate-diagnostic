// src/resultApi.js
//
// Claude API integration for the Proxiate NRS result page.
// Provides fetchDiagnosis, fetchActionPlan, submitEmailAndUnlock, buildExportString.

import { DIAGNOSIS_SYSTEM_PROMPT, ACTION_PLAN_SYSTEM_PROMPT } from './resultPrompts.js';
import { resolveMechanism } from './config/mechanisms.js';

const CLAUDE_API_URL = '/api/claude';
const CLAUDE_MODEL = 'claude-sonnet-4-20250514';
const MAX_TOKENS = 900;

// ---------------------------------------------------------------------------
// Private helpers
// ---------------------------------------------------------------------------

function buildUserMessage(resolvedMechanism, quizAnswers, callType) {
  if (quizAnswers.crisisFlag === true) return 'crisis: true';
  if (quizAnswers.pregnant === true) return 'pregnant: true';

  const escalate =
    resolvedMechanism.doctorTrigger ||
    resolvedMechanism.resolvedSeverity === 'severe';

  const userProfile = `USER PROFILE
mechanism: ${resolvedMechanism.key}
resolvedSeverity: ${resolvedMechanism.resolvedSeverity}
resolvedAvatar: ${resolvedMechanism.resolvedAvatar?.id ?? 'default'}
interactions: ${(resolvedMechanism.interactions ?? []).join(', ')}
medicalEscalation: ${escalate}
sex: ${quizAnswers.sex ?? 'unknown'}
ageBand: ${quizAnswers.ageBand ?? 'unknown'}
workPattern: ${quizAnswers.workPattern ?? 'unknown'}
crisis: false
pregnant: false`;

  const playbook = `MECHANISM PLAYBOOK
${JSON.stringify(resolvedMechanism, null, 2)}`;

  const task = `TASK: ${callType === 'diagnosis' ? 'diagnosis' : 'actionPlan'}`;

  return [userProfile, playbook, task].join('\n\n');
}

async function callClaudeAPI(systemPrompt, userMessage) {
  const response = await fetch(CLAUDE_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: MAX_TOKENS,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Claude API error ${response.status}: ${body}`);
  }

  const data = await response.json();
  const textBlock = data.content.find((b) => b.type === 'text');
  return textBlock.text.trim();
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function fetchDiagnosis(scoringResult, quizAnswers) {
  const resolvedMechanism = resolveMechanism(scoringResult.primaryMechanism, quizAnswers);
  const userMessage = buildUserMessage(resolvedMechanism, quizAnswers, 'diagnosis');
  return callClaudeAPI(DIAGNOSIS_SYSTEM_PROMPT, userMessage);
}

export async function fetchActionPlan(scoringResult, quizAnswers) {
  const resolvedMechanism = resolveMechanism(scoringResult.primaryMechanism, quizAnswers);
  const userMessage = buildUserMessage(resolvedMechanism, quizAnswers, 'actionPlan');
  return callClaudeAPI(ACTION_PLAN_SYSTEM_PROMPT, userMessage);
}

export async function submitEmailAndUnlock(email, scoringResult, quizAnswers) {
  try {
    const subResponse = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        bucket: `bucket_${scoringResult.primaryMechanism}`,
        sex: quizAnswers.sex,
      }),
    });

    if (!subResponse.ok) {
      throw new Error('Subscription failed. Please try again.');
    }
  } catch (err) {
    return {
      success: false,
      actionPlanText: null,
      error: err.message || 'Subscription failed. Please try again.',
    };
  }

  try {
    const actionPlanText = await fetchActionPlan(scoringResult, quizAnswers);
    return { success: true, actionPlanText, error: null };
  } catch {
    return {
      success: false,
      actionPlanText: null,
      error: 'Your plan could not be generated. Please refresh and try again.',
    };
  }
}

export function buildExportString(diagnosisText, actionPlanText, scoringResult, quizAnswers) {
  const resolved = resolveMechanism(scoringResult.primaryMechanism, quizAnswers);
  const mechanismName = resolved.label ?? resolved.key;
  const severity = resolved.resolvedSeverity ?? 'unknown';

  const planBlock = actionPlanText
    ? actionPlanText
    : '[Action plan not yet generated]';

  return [
    `PRIMARY PATTERN: ${mechanismName}`,
    `SEVERITY: ${severity}`,
    '',
    'DIAGNOSIS',
    diagnosisText,
    '',
    'ACTION PLAN',
    planBlock,
    '',
    'This is a pattern-based interpretation, not a medical diagnosis. Always check with a doctor before making changes to medications or supplements.',
  ].join('\n');
}
