# Copilot Instructions for Proxiate

You are helping build **Proxiate**, a non‑diagnostic sleep and energy triage tool.
The codebase is a React single‑page app with a questionnaire and scoring logic.

## Core product constraints

- Proxiate is **not** a diagnostic tool.
- Never claim to diagnose any condition.
- Frame outputs as **patterns, mechanisms, and triage signals**, not diagnoses.
- Always preserve wording that emphasizes:
  - “Your pattern (not a diagnosis)”
  - Red‑flag messaging: “triage flag to seek medical review promptly”.

## Clinical / domain framing

- When relevant, align reasoning with major sleep/energy frameworks:
  - ICSD‑3, AASM, and standard non‑restorative sleep (NRS) concepts.
- Focus on:
  - Mechanisms and clusters (e.g. mind‑stress, circadian, sleep restriction).
  - Red flags and “when to talk to your doctor”.
  - Clear triage‑style messaging, not treatment protocols.

## Frontend structure

- `App.js`:
  - Renders the question flow for the NRS triage quiz.
  - Tracks `step`, `answers`, `result`.
  - Calls `scoreNRSQuiz(answers)` from `./Lib/src/lib/nrsScoring`.
  - After scoring, `result` includes:
    - `clusters`: numeric scores by mechanism key.
    - `top3`: an array of up to 3 mechanism keys, highest scoring first.
    - `sleep_restriction`: boolean flag.
    - `red_flags`: array of red‑flag strings.

- `config/mechanisms.js`:
  - Exports `MECHANISMS`, an object keyed by mechanism code (e.g. `mind_stress`).
  - Each entry includes:
    - `label`
    - `shortName`
    - `explanation`
    - `behaviours` (string array)
    - `doctorTrigger` (string)

## UI behaviour requirements

When modifying UI around results:

- For the primary mechanism (`result.top3[0]`):
  - Show a card with:
    - `label`
    - `explanation`
    - A bullet list of `behaviours`
    - A line starting with “When to talk to your doctor:” followed by `doctorTrigger`.
- For the secondary mechanism (`result.top3[1]`, if present):
  - Show a smaller card:
    - Heading: “Secondary pattern to watch: {shortName}”
    - `explanation`.

- Always keep or improve the explicit non‑diagnostic framing.
- Keep red‑flag copy close to:
  - “Red‑flag signals present: … This is a triage flag to seek medical review promptly, **not a diagnosis**.”

## Coding style / expectations

- Prefer small, focused React components and clear state.
- Avoid introducing extra dependencies unless necessary.
- When changing JSX:
  - Ensure all braces and tags are balanced.
  - Avoid rendering raw JSON unless specifically requested.
- When working with `top3`:
  - Assume it is an array of mechanism keys.
  - If you create or modify scoring, always guarantee `top3` is defined
    (e.g. build it from sorted `clusters` keys).

## How to respond

When I ask for changes:

- Read the existing file context first (especially `App.js`, `nrsScoring.js`, and `config/mechanisms.js`).
- Preserve existing behaviour unless I explicitly ask to change it.
- Explain briefly *what* you changed and *why*, then show the relevant code diff
  or replacement blocks.
- Favour clarity and correctness over terse one‑liners.
