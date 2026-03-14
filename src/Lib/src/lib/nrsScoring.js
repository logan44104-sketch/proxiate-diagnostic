// src/lib/nrsScoring.js

// DOMAIN QUESTION COUNTS — update when adding questions
// airway:      q3, q8, q13(gasping/orthopnea), q_apnea_treatment, q0b_wake_causes(breathing) — cap: 50
// circadian:   q12_bed_worknight, q12_bed_freenight, q12_wake, q12b_chronotype — cap: 40
// duration:    q1, q12_bed_worknight, q12_wake — cap: 30
// substances:  q4, q9 — cap: 30
// environment: q14_environment, q0b_wake_causes(noise) — cap: 30
// hormonal:    q_perimenopause, q_cycle_sleep, knownConditions(thyroid/diabetes/iron) — cap: 50
// mind_stress: q5, q10_latency, q10d_sleep_barriers, q0b_wake_causes(anxiousThoughts) — cap: 40
// mood:        q10d_sleep_barriers(dreadOrLowMood), q0b(earlyMorning), knownConditions(depressionAnxiety) — cap: 30
// movement:    q11, q0b_wake_causes(pain/bathroom), q_nocturia_male — cap: 35
// systemic:    q6, q7, q13(weightLossFeverSweats), knownConditions(autoimmune) — cap: 30

function scoreNRSQuiz(a) {
  const has = (field, key) => !!(a[field]?.[key]);

  const scores = {
    airway: 0,
    circadian: 0,
    duration: 0,
    substances: 0,
    environment: 0,
    hormonal: 0,
    mind_stress: 0,
    mood: 0,
    movement: 0,
    systemic: 0,
  };

  let sleep_restriction = false;
  const red_flags = [];

  // ── Intake priors ──
  if (a.sex === 'Female') {
    scores.hormonal += 5;
  }

  if (['45–54', '55–64', '65+'].includes(a.ageBand)) {
    scores.hormonal += 5;
  }

  if (a.specialCase_caregiver === 'Yes — and they wake me most nights') {
    scores.environment += 25;
  }

  if (a.knownConditions?.apnea) {
    scores.airway += 30;
  }

  if (a.knownConditions?.depressionAnxiety) {
    scores.mind_stress += 20;
  }

  if (a.knownConditions?.chronicPain) {
    scores.movement += 20;
  }

  // PCOS — strong airway prior for women
  if (a.sex === 'Female' && a.knownConditions?.pcos) {
    scores.airway += 12;
    scores.hormonal += 8;
  }

  // Known thyroid disorder
  if (a.knownConditions?.thyroid) {
    scores.hormonal += 20;
  }

  // Known iron deficiency
  if (a.knownConditions?.ironDeficiency) {
    scores.hormonal += 15;
    scores.movement += 8; // RLS connection
  }

  // Known autoimmune condition
  if (a.knownConditions?.autoimmune) {
    scores.systemic += 25;
  }

  // Known PTSD
  if (a.knownConditions?.ptsd) {
    scores.mind_stress += 20;
  }

  // Known diabetes
  if (a.knownConditions?.diabetes) {
    scores.hormonal += 10;
    scores.systemic += 8;
  }

  // Known reflux/GERD — airway and environment signal
  if (a.knownConditions?.reflux) {
    scores.airway += 6;
    scores.environment += 5;
  }

  // Asthma — nocturnal asthma fragments sleep, airway signal
  if (a.knownConditions?.asthma) {
    scores.airway += 8;
  }

  // Heart condition — orthopnea, nocturia, fragmentation
  if (a.knownConditions?.heartCondition) {
    scores.systemic += 10;
    scores.movement += 5;
  }

  // ADHD — sleep onset and circadian dysregulation
  if (a.knownConditions?.adhd) {
    scores.mind_stress += 10;
    scores.circadian += 6;
  }

  // ── q0a — severity / impact ──
  if (a.q0a?.includes('Severely') || a.q0a?.includes('barely getting through')) {
    scores.systemic += 8;
  }

  // ── q0c_fatigue_shape ──
  const fatigueShape = a.q0c_fatigue_shape;
  if (fatigueShape === 'I wake up exhausted and the first few hours are a real struggle — I only start to feel human approaching midday') {
    scores.circadian += 10;
    scores.airway += 6;
  }
  if (fatigueShape === 'Mornings are okay, but I hit a wall by mid-afternoon and I\'m running on fumes for the rest of the day') {
    scores.substances += 6;
    scores.circadian += 6;
  }
  if (fatigueShape === 'I feel a flat, steady tiredness from waking to sleeping — I never really feel properly awake') {
    scores.mood += 10;
    scores.systemic += 8;
    scores.hormonal += 6;
  }
  if (fatigueShape === 'It\'s unpredictable — some hours I\'m okay, then my energy drops off a cliff without warning') {
    scores.hormonal += 8;
    scores.systemic += 6;
  }

  // ── q2 — daytime dozing ──
  if (has('q2', 'driving')) {
    red_flags.push('drivingSleepiness');
  }
  if (has('q2', 'conversation') || has('q2', 'activeTask')) {
    scores.airway += 10;
    scores.systemic += 6;
  }
  if (has('q2', 'sittingReading') || has('q2', 'passenger')) {
    scores.airway += 5;
    scores.circadian += 4;
  }

  // ── q1 — time in bed ──
  if (a.q1 === 'Less than 6 hours') {
    sleep_restriction = true;
    scores.duration += 20;
  }
  if (a.q1 === '6–7 hours') {
    scores.duration += 10;
  }

  // ── q10_latency — sleep onset ──
  const latency = a.q10_latency;
  if (latency === 'More than an hour') {
    scores.mind_stress += 14;
    scores.circadian += 8;
  }
  if (latency === '30–60 minutes') {
    scores.mind_stress += 9;
    scores.circadian += 5;
  }
  if (latency === '15–30 minutes') {
    scores.mind_stress += 5;
  }
  if (latency === 'Less than 5 minutes') {
    // Very fast onset with NRS = strong airway or systemic signal
    scores.airway += 6;
    scores.systemic += 4;
  }

  // ── q10b_latency_variance ──
  if (a.q10b_latency_variance === 'Worse on work/school nights, better on days off or weekends') {
    scores.circadian += 10;
    scores.mind_stress += 6;
  }
  if (a.q10b_latency_variance === 'Worse on Sunday or the night before a big day') {
    scores.mind_stress += 10;
  }
  if (a.q10b_latency_variance === 'It\'s random — some nights I\'m out fast, others I lie there forever') {
    scores.mind_stress += 7;
    scores.systemic += 5;
  }

  // ── q10d_sleep_barriers — why can't fall asleep ──
  if (has('q10d_sleep_barriers', 'mindRacing')) scores.mind_stress += 12;
  if (has('q10d_sleep_barriers', 'cantSwitchOff')) scores.mind_stress += 10;
  if (has('q10d_sleep_barriers', 'heartPounding')) {
    const hasPTSD = a.knownConditions?.ptsd;
    scores.mind_stress += hasPTSD ? 14 : 8;
    scores.airway += hasPTSD ? 2 : 6; // physiological arousal can be apnea-related; attenuated for PTSD (hyperarousal)
  }
  if (has('q10d_sleep_barriers', 'dreadOrLowMood')) {
    scores.mood += 12;
    scores.mind_stress += 6;
  }
  if (has('q10d_sleep_barriers', 'notSleepyYet')) scores.circadian += 10;
  if (has('q10d_sleep_barriers', 'cantGetComfortable')) scores.movement += 8;
  if (has('q10d_sleep_barriers', 'tooHotOrCold')) {
    scores.environment += 8;
    scores.hormonal += 4; // temperature dysregulation signal
  }
  if (has('q10d_sleep_barriers', 'noise')) scores.environment += 8;
  if (has('q10d_sleep_barriers', 'screenHooked')) scores.substances += 6;
  if (has('q10d_sleep_barriers', 'painOrDiscomfort')) scores.movement += 10;
  if (has('q10d_sleep_barriers', 'digestiveDiscomfort')) {
    scores.environment += 6;
    scores.airway += 5; // reflux and airway are linked
  }

  // ── q0b — night waking ──
  const waking = a.q0b;
  if (waking === 'I wake and lie there for 20+ minutes before getting back to sleep') {
    scores.mind_stress += 10;
  }
  if (waking === 'I wake and I\'m wide awake — it can take over an hour to get back to sleep') {
    scores.mind_stress += 14;
    scores.airway += 6;
  }
  if (waking === 'I wake very early (3–5 am) and can\'t get back to sleep at all') {
    scores.mood += 14;
    scores.mind_stress += 8;
  }

  // ── q0b_wake_causes ──
  if (has('q0b_wake_causes', 'breathing')) {
    scores.airway += 18;
    red_flags.push('breathingEvents');
  }
  if (has('q0b_wake_causes', 'heartRacing')) {
    const hasPTSD = a.knownConditions?.ptsd;
    scores.airway += hasPTSD ? 3 : 8; // cardiac arousal on waking attenuated for PTSD (hyperarousal, not apnea)
    scores.mind_stress += hasPTSD ? 12 : 6;
  }
  if (has('q0b_wake_causes', 'bathroom')) scores.movement += 8;
  if (has('q0b_wake_causes', 'pain')) scores.movement += 10;
  if (has('q0b_wake_causes', 'noise')) scores.environment += 8;
  if (has('q0b_wake_causes', 'hotOrSweaty')) {
    scores.environment += 6;
    scores.hormonal += 8; // night sweats = hormonal signal
  }
  if (has('q0b_wake_causes', 'anxiousThoughts')) {
    scores.mind_stress += 10;
    scores.mood += 6;
  }
  if (has('q0b_wake_causes', 'nightmare')) {
    scores.mind_stress += 8;
    if (a.knownConditions?.ptsd) scores.mind_stress += 6; // amplify for PTSD
  }

  // ── q3 — snoring / observed apnea ──
  // Sex-stratified: snoring is less diagnostic in women
  const isFemale = a.sex === 'Female';
  if (a.q3 === 'Yes — regularly or loudly') {
    scores.airway += isFemale ? 8 : 14;
  }
  if (a.q3 === 'Occasionally or mildly') {
    scores.airway += isFemale ? 4 : 7;
  }
  if (a.q3 === 'I sleep alone, so I\'m not sure') {
    scores.airway += 3; // uncertainty bump — can't rule out
  }

  // ── q8 — airway symptom cluster ──
  const airwayClusterCount = ['dryMouth', 'morningHeadache', 'soreThroat', 'nasalCongestion']
    .filter(k => has('q8', k)).length;
  scores.airway += airwayClusterCount * 5;
  // Female cluster bonus — co-occurrence is more diagnostic in women
  if (isFemale && airwayClusterCount >= 2) {
    scores.airway += 10;
  }

  // ── q_apnea_treatment ──
  if (a.q_apnea_treatment === 'Yes — I use CPAP or a dental device most nights') {
    scores.airway += 4; // residual signal even with treatment
  }
  if (a.q_apnea_treatment === 'Yes — but I only use it sometimes') {
    scores.airway += 14;
  }
  if (a.q_apnea_treatment === 'I was diagnosed but haven\'t started treatment yet' ||
      a.q_apnea_treatment === 'I tried treatment but stopped') {
    // Force airway to dominate
    scores.airway += 40;
  }

  // ── q12 circadian block ──
  const bedWorknight = a.q12_bed_worknight;
  if (bedWorknight === 'After 1:30 am') scores.circadian += 14;
  if (bedWorknight === '12:30 – 1:30 am') scores.circadian += 10;
  if (bedWorknight === '11:30 pm – 12:30 am') scores.circadian += 6;

  const freeNight = a.q12_bed_freenight;
  if (freeNight === '3+ hours later') scores.circadian += 14;
  if (freeNight === '2–3 hours later') scores.circadian += 10;
  if (freeNight === '1–2 hours later') scores.circadian += 6;
  if (freeNight === '30–60 minutes later') scores.circadian += 3;

  const chronotype = a.q12b_chronotype;
  if (chronotype === 'Before 9:30 pm and awake before 5:30 am') scores.mood += 4;
  if (chronotype === 'After 2 am and awake after 10 am or later') scores.circadian += 12;
  if (chronotype === 'After 1 am and awake after 9 am') scores.circadian += 8;
  if (chronotype === 'Around midnight and awake around 8 am') scores.circadian += 4;

  // ── Late bedtime + early alarm cross-signal ──
  // Late bedtime + any alarm before 7:30am = confirmed sleep restriction
  // This combination is duration-dominant regardless of chronotype
  const lateBedtime = ['12:30 – 1:30 am', 'After 1:30 am']
    .includes(a.q12_bed_worknight);
  const earlyAlarm = ['Before 5:30 am', '5:30 – 6:30 am', '6:30 – 7:30 am']
    .includes(a.q12_wake);

  if (lateBedtime && earlyAlarm) {
    scores.duration += 15;
    sleep_restriction = true;
  }

  // ── q5 — mind at sleep onset (shown to fast fallers only) ──
  if (a.q5 === 'Racing with worries, stress, or anxiety') {
    scores.mind_stress += 12;
  }
  if (a.q5 === 'Buzzing with ideas or energy (not worry)') {
    scores.mind_stress += 8;
    scores.circadian += 4;
  }
  if (a.q5 === 'Replaying the day or ruminating on things') {
    scores.mind_stress += 9;
    scores.mood += 5;
  }
  if (a.q5 === 'Mostly quiet — I fall asleep easily but still wake unrefreshed') {
    scores.airway += 8; // quiet onset + NRS = airway suspect
    scores.systemic += 6;
  }

  // ── q4 — substance use ──
  // Alcohol and caffeine: timing-aware using q9 as proxy
  if (has('q4', 'alcohol')) {
    const timing = a.q9;
    if (timing === 'Within 2 hours of bed') scores.substances += 18;
    else if (timing === '2–4 hours before bed') scores.substances += 10;
    else scores.substances += 6;
  }
  if (has('q4', 'caffeineAfterMidday')) {
    const timing = a.q9;
    if (timing === 'Within 2 hours of bed') scores.substances += 16;
    else if (timing === '2–4 hours before bed') scores.substances += 10;
    else scores.substances += 7;
  }
  if (has('q4', 'cannabis')) scores.substances += 10;
  if (has('q4', 'nicotine')) scores.substances += 8;
  if (has('q4', 'sedatives')) {
    scores.substances += 6;
    scores.mind_stress += 5; // sedative use signals underlying sleep difficulty
  }
  // Melatonin — signals existing sleep difficulty, not scored as disruptor
  // Antidepressants — confirms underlying mood/anxiety condition
  if (has('q4', 'antidepressants')) {
    scores.mind_stress += 8;
    scores.mood += 6;
    // Note: SSRIs/SNRIs suppress REM but result should address the underlying
    // condition, not label medication as "the problem"
  }
  // Beta-blockers / BP meds — suppress melatonin, direct pharmacological disruption
  if (has('q4', 'bpMeds')) {
    scores.substances += 5;
  }
  // Opioids — severe sleep architecture disruption
  if (has('q4', 'opioids')) {
    scores.substances += 10;
    scores.systemic += 6;
  }

  // ── q9 — timing, substance-specific ──
  const timing = a.q9;
  if (timing && timing !== 'Not applicable — I selected none above') {
    // Cannabis — moderate timing sensitivity
    if (has('q4', 'cannabis')) {
      if (timing === 'Within 2 hours of bed') scores.substances += 8;
      else if (timing === '2–4 hours before bed') scores.substances += 5;
    }

    // Nicotine — lower timing sensitivity, shorter half-life
    if (has('q4', 'nicotine')) {
      if (timing === 'Within 2 hours of bed') scores.substances += 5;
      else if (timing === '2–4 hours before bed') scores.substances += 3;
    }

    // Sedatives — timing matters for dependency signal
    if (has('q4', 'sedatives')) {
      if (timing === 'Within 2 hours of bed') scores.substances += 8;
    }

    // Opioids and bpMeds — timing less relevant, damage is architectural
    // scores already set in q4 block, no additional timing weight needed
  }

  // ── q14_environment ──
  if (has('q14_environment', 'screenInBed')) scores.substances += 6;
  if (has('q14_environment', 'roomTempWrong')) scores.environment += 10;
  if (has('q14_environment', 'noise')) scores.environment += 10;
  if (has('q14_environment', 'kidsWaking')) scores.environment += 20;
  if (has('q14_environment', 'noWindDown')) {
    scores.mind_stress += 6;
    scores.substances += 4;
  }

  // ── q11 — movement/pain/nocturia ──
  if (has('q11', 'legUrge')) {
    scores.movement += 14;
    scores.hormonal += 6; // RLS linked to iron, which is hormonal/metabolic
  }
  if (has('q11', 'painWakes')) scores.movement += 14;
  if (has('q11', 'bruxism')) {
    const hasPTSD = a.knownConditions?.ptsd;
    scores.movement += 8;
    scores.mind_stress += hasPTSD ? 6 : 0; // bruxism is a direct stress/PTSD symptom
    scores.airway += hasPTSD ? 2 : (isFemale ? 9 : 6); // bruxism more diagnostic for airway in women; attenuated for PTSD
  }
  if (has('q11', 'nocturia2Plus')) {
    const isOlderMale = !isFemale && ['45–54', '55–64', '65+'].includes(a.ageBand);
    const isOlderFemale = isFemale && ['45–54', '55–64'].includes(a.ageBand);
    scores.movement += isOlderMale ? 10 : 8;
    scores.airway += isOlderFemale ? 8 : 5; // nocturia more diagnostic for female airway
  }

  // ── q_nocturia_male — male 45+ nocturia severity ──
  if (a.q_nocturia_male === 'It started or noticeably worsened in the past 3 months') {
    scores.movement += 15;
    red_flags.push('nocturia_urgent');
  }
  if (a.q_nocturia_male === 'It started or noticeably worsened in the past 12 months') {
    scores.movement += 10;
    red_flags.push('nocturia_watch');
  }
  if (a.q_nocturia_male === 'It\'s been happening for years — it\'s just normal for me now') {
    scores.movement += 5;
  }
  if (a.q_nocturia_male === 'It seems to come and go — no consistent pattern') {
    scores.movement += 6;
  }

  // ── q_perimenopause ──
  if (has('q_perimenopause', 'nightSweats')) {
    scores.hormonal += 12;
    scores.airway += 6; // night sweats + airway = elevated OSA suspicion
  }
  if (has('q_perimenopause', 'hotFlashes') && has('q_perimenopause', 'nightSweats')) {
    scores.hormonal += 18; // combined signal stronger than additive — cap at 18
  } else if (has('q_perimenopause', 'hotFlashes')) {
    scores.hormonal += 8;
  }
  if (has('q_perimenopause', 'moodChanges')) {
    scores.mood += 6;
    scores.hormonal += 4;
  }
  if (has('q_perimenopause', 'irregularPeriods')) {
    scores.hormonal += 8;
  }

  // Perimenopause age-stratified airway boost
  const isPerimenoAge = isFemale && ['35–44', '45–54', '55–64'].includes(a.ageBand);
  const hasHormonalSignals = has('q_perimenopause', 'nightSweats') ||
    has('q_perimenopause', 'hotFlashes') || has('q_perimenopause', 'irregularPeriods');

  if (isPerimenoAge && hasHormonalSignals) {
    scores.airway += 10;
  }
  // Post-transition unconditional boost (55–64, no active signals)
  if (isFemale && a.ageBand === '55–64' && !hasHormonalSignals) {
    scores.airway += 5;
  }

  // ── q_cycle_sleep ──
  if (a.q_cycle_sleep === 'Yes — it\'s clearly worse in the week before my period') {
    scores.hormonal += 10;
  }
  if (a.q_cycle_sleep === 'Yes — it\'s worse at other times in my cycle') {
    scores.hormonal += 6;
  }
  if (a.q_cycle_sleep === 'I don\'t have a regular cycle / not applicable') {
    scores.hormonal += 4;
  }

  // Female insomnia + airway combo signal
  const hasInsomnia = has('q10d_sleep_barriers', 'mindRacing') ||
    has('q10d_sleep_barriers', 'cantSwitchOff') ||
    has('q10d_sleep_barriers', 'notSleepyYet');
  if (isFemale && hasInsomnia && airwayClusterCount >= 1) {
    scores.airway += 5;
  }

  // ── q6 — duration of problem ──
  if (a.q6 === "Less than 3 months — it's relatively recent") {
    // acute onset — no systemic score
    // situational cause likely, trigger question (q7) will add signal if relevant
  }
  if (a.q6 === '3–6 months') {
    scores.systemic += 3;
  }
  if (a.q6 === '6–12 months') {
    scores.systemic += 5;
    scores.mind_stress += 3;
  }
  if (a.q6 === '1–3 years') {
    scores.systemic += 8;
    scores.mind_stress += 5;
    red_flags.push('chronic_duration');
  }
  if (a.q6 === "More than 3 years — this is just how I am") {
    scores.systemic += 12;
    scores.mind_stress += 8;
    red_flags.push('chronic_duration');
  }

  // ── q7 — trigger (single-select, match by substring) ──
  const trigger = a.q7 || '';
  if (trigger.includes('viral')) {
    scores.systemic += 12;
    red_flags.push('post_viral');
  }
  if (trigger.includes('medication')) {
    scores.substances += 8;
    scores.hormonal += 6;
  }
  if (trigger.includes('stress')) {
    scores.mind_stress += 8;
  }
  if (trigger.includes('schedule')) {
    scores.circadian += 8;
    scores.environment += 6;
  }

  // ── q13 — red flags ──
  if (has('q13', 'gasping') || has('q13', 'orthopnea')) {
    scores.airway += 40;
    red_flags.push('urgent_airway');
  }
  if (has('q13', 'weightLossFeverSweats')) {
    scores.systemic += 30;
    red_flags.push('urgent_systemic');
  }
  if (has('q13', 'selfHarmThoughts')) {
    red_flags.push('crisis');
  }

  // ── Domain caps — prevent over-represented domains from dominating ──
  const CAPS = {
    airway: 50, circadian: 40, duration: 30, substances: 30,
    environment: 30, hormonal: 50, mind_stress: 40, mood: 30,
    movement: 35, systemic: 30,
  };
  Object.keys(scores).forEach(k => {
    if (CAPS[k]) scores[k] = Math.min(scores[k], CAPS[k]);
  });

  // ── Bucket F (multi-factor) detection ──
  // Triggers when 4+ mechanisms each score above 12 with no clear winner
  const significantMechanisms = Object.entries(scores)
    .filter(([_, v]) => v >= 12)
    .sort(([, a], [, b]) => b - a);

  const topScore = significantMechanisms[0]?.[1] || 0;

  // Multi-factor detection — two trigger conditions:

  // Condition 1: Many moderate signals, no clear winner
  // (original intent — 4+ mechanisms all moderately elevated)
  const manyModerate = significantMechanisms.length >= 4 && topScore < 30;

  // Condition 2: Several strong signals competing
  // (new — 3+ mechanisms all at or near their caps)
  const cappedMechanisms = Object.entries(scores).filter(([k, v]) => {
    const cap = CAPS[k] || 30;
    return v >= cap * 0.85; // within 15% of cap
  });
  const multipleStrong = cappedMechanisms.length >= 3;

  const isMultiFactor = manyModerate || multipleStrong;

  // ── Top mechanisms ──
  // Return top 3 mechanisms above threshold
  const topMechanisms = significantMechanisms
    .slice(0, 3)
    .map(([key]) => key);

  // Primary mechanism logic update:
  // If isMultiFactor, label it multiFactor
  // Otherwise use the top scoring mechanism
  const primaryMechanism = isMultiFactor
    ? 'multiFactor'
    : (topMechanisms[0] || 'systemic');

  // ── Final result object ──
  return {
    scores,
    topMechanisms,
    primaryMechanism,
    isMultiFactor,
    sleep_restriction,
    red_flags,
    caveatedResult: false, // set by App.js before scoring
  };
}

export default scoreNRSQuiz;
