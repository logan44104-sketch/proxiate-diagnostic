// src/App.js
import React, { useState } from "react";
import scoreNRSQuiz  from "./Lib/src/lib/nrsScoring";
import { MECHANISMS, resolveMechanism } from "./config/mechanisms";
import "./App.css";

const QUESTIONS = [
  // ═══════════════════════════════════════════
  //  DEMOGRAPHICS / SCREENING
  // ═══════════════════════════════════════════
  {
    key: "ageBand",
    label: "Which age range are you in?",
    type: "single",
    options: ["18–24", "25–34", "35–44", "45–54", "55–64", "65+"],
  },
  {
    key: "sex",
    label: "What sex were you assigned at birth?",
    type: "single",
    options: ["Male", "Female"],
  },
  {
    key: "q_door",
    label: "What's your biggest sleep frustration right now?",
    type: "single",
    options: [
      "I can't fall asleep when I want to",
      "I fall asleep fine but wake up during the night",
      "I sleep enough hours but wake up feeling exhausted",
      "I'm tired all day no matter what I do",
      "I can't stay awake when I need to",
    ],
  },
  {
    key: "workPattern",
    label: "Which of these best describes your typical weekly schedule?",
    type: "single",
    options: [
      "Standard hours — roughly 9–5, Monday to Friday",
      "Early start — I'm up before 6am most days (trades, hospitality, logistics)",
      "Shift work — rotating shifts, night shifts, or irregular rosters",
      "Flexible or self-directed — I set my own hours (self-employed, freelance, entrepreneur)",
      "Student — mix of classes, study, and part-time work",
      "Home-based carer — primary carer for children, family, or dependants",
      "Retired or no fixed schedule",
    ],
  },
  {
    key: "specialCase_pregnancy",
    label: "Are you currently pregnant?",
    type: "single",
    options: ["No", "Yes, I'm currently pregnant"],
    showWhen: { sex: "Female", ageBand: ["18–24", "25–34", "35–44"] },
  },
  {
    key: "specialCase_caregiver",
    label: "Are you currently the main carer for a baby or toddler who regularly wakes at night?",
    type: "single",
    options: ["No", "Yes — and they wake me most nights"],
  },
  {
    key: "knownConditions",
    label: "Have you ever been told by a doctor that you have any of these?",
    type: "multi",
    options: [
      { key: "apnea", label: "Sleep apnea" },
      { key: "asthma", label: "Asthma or a breathing condition" },
      { key: "heartCondition", label: "Heart condition (e.g. heart failure, atrial fibrillation)" },
      { key: "reflux", label: "Acid reflux or GERD" },
      { key: "thyroid", label: "Thyroid disorder" },
      { key: "diabetes", label: "Diabetes or pre-diabetes" },
      { key: "ironDeficiency", label: "Iron deficiency or anaemia" },
      { key: "pcos", label: "Polycystic ovary syndrome (PCOS)", showWhen: { sex: "Female" } },
      { key: "autoimmune", label: "Autoimmune condition (e.g. lupus, RA, fibromyalgia, MS)" },
      { key: "adhd", label: "ADHD" },
      { key: "depressionAnxiety", label: "Depression or anxiety" },
      { key: "ptsd", label: "PTSD or trauma-related condition" },
      { key: "chronicPain", label: "Chronic pain condition" },
      { key: "noneOfThese", label: "None of these" },
    ],
  },
  {
    key: "q_apnea_treatment",
    label: "Are you currently being treated for your sleep apnea?",
    type: "single",
    options: [
      "Yes — I use CPAP or a dental device most nights",
      "Yes — but I only use it sometimes",
      "I was diagnosed but haven't started treatment yet",
      "I tried treatment but stopped",
    ],
    showWhen: { knownConditions: { includes: "apnea" } },
  },
  {
    key: "q_perimenopause",
    label: "In the past few months, have any of these been part of your experience?",
    type: "multi",
    options: [
      { key: "hotFlashes", label: "Hot flashes or sudden waves of heat during the day" },
      { key: "nightSweats", label: "Night sweats that wake you or soak through your clothes" },
      { key: "moodChanges", label: "Noticeably more irritable, anxious, or low in mood than usual" },
      { key: "irregularPeriods", label: "Periods becoming irregular, much heavier, or stopping altogether" },
      { key: "noneOfThese", label: "None of these" },
    ],
    showWhen: { sex: "Female", ageBand: ["35–44", "45–54", "55–64"] },
  },
  {
    key: "q_cycle_sleep",
    label: "Does your sleep quality noticeably change at different points in your menstrual cycle?",
    type: "single",
    options: [
      "Yes — it's clearly worse in the week before my period",
      "Yes — it's worse at other times in my cycle",
      "It varies but I haven't connected it to my cycle",
      "I don't have a regular cycle / not applicable",
      "No — no connection I can see",
    ],
    showWhen: { sex: "Female", ageBand: ["18–24", "25–34", "35–44"], specialCase_pregnancy: "No" },
  },

  // ═══════════════════════════════════════════
  //  NRS CORE
  // ═══════════════════════════════════════════
  {
    key: "q0a",
    label:
      "Thinking about the last month — how much has your poor sleep or tiredness got in the way of your normal life?",
    type: "single",
    options: [
      "A little — I notice it but I push through most things fine",
      "Moderately — it takes real effort to get through work or daily tasks",
      "A lot — my performance, relationships, or mood have clearly suffered",
      "Severely — I've had to cut back on work, cancel plans, or change how I live",
      "I'm barely getting through each day",
    ],
  },
  // ─── Fatigue shape (the 6-option single select you already have) ───
  {
    key: "q0c_fatigue_shape",
    label: "Which of these sounds most like your experience?",
    type: "single",
    options: [
      "I wake up groggy, but within about an hour I feel mostly fine",
      "I wake up exhausted and the first few hours are a real struggle — I only start to feel human approaching midday",
      "Mornings are okay, but I hit a wall by mid-afternoon and I'm running on fumes for the rest of the day",
      "I feel a flat, steady tiredness from waking to sleeping — I never really feel properly awake",
      "It's unpredictable — some hours I'm okay, then my energy drops off a cliff without warning",
      "None of these really fit",
    ],
  },

  // ─── "Tell us more" — appears for EVERYONE, optional ───
  // Show this in a separate "Your story" section after the
  // core NRS block, visually distinct from the scored questions.
  {
    key: "q0d_tell_us_more",
    label:
      "Want to tell us more? This is optional, but it helps us build a better picture — especially if your experience is a mix of patterns, or if something else is going on that the options above didn't capture.",
    type: "text",
    required: false,
    placeholder:
      "e.g. \"I'm mostly the afternoon crash, but on bad days it starts from the moment I wake up\" or \"I feel physically rested but my brain just won't switch on\"",
  },

  // ─── "None of these" follow-up — only shows if they picked the last option ───
  {
    key: "q0c_fatigue_shape_other",
    label:
      "Since none of the patterns above fit — can you describe what your tiredness actually looks like across a typical day?",
    type: "text",
    required: true,
    showWhen: { key: "q0c_fatigue_shape", value: "None of these really fit" },
    placeholder:
      "e.g. \"I feel wired but exhausted at the same time\" or \"I only crash hard the day after I exercise\"",
  },
  // ═══════════════════════════════════════════
  //  DAYTIME IMPACT
  // ═══════════════════════════════════════════
  {
    key: "q2",
    label:
      "In the past month, have you caught yourself dozing off or struggling to stay awake in any of these situations?",
    type: "multi",
    options: [
      {
        key: "sittingReading",
        label: "Sitting and reading, or watching TV",
      },
      {
        key: "passenger",
        label: "As a passenger in a car for an hour or more",
      },
      {
        key: "conversation",
        label: "During a conversation or a meeting",
      },
      {
        key: "driving",
        label: "While driving or stopped in traffic",
      },
      {
        key: "activeTask",
        label:
          "During an active task — eating, working, standing up",
      },
      {
        key: "noneOfThese",
        label: "No — I feel tired but I don't actually doze off or fight to stay awake",
      },
    ],
  },
  // ═══════════════════════════════════════════
  //  SLEEP ARCHITECTURE / DURATION
  // ═══════════════════════════════════════════
  {
    key: "q1",
    label:
      "On a typical work or school night, roughly how many hours do you spend in bed trying to sleep (lights off to alarm)?",
    type: "single",
    options: [
      "Less than 6 hours",
      "6–7 hours",
      "7–8 hours",
      "More than 8 hours",
    ],
  },
  // ─── Sleep onset latency block ───
  {
    key: "q10_latency",
    label:
      "Once the lights are off and your head's on the pillow, how long does it usually take you to fall asleep?",
    type: "single",
    options: [
      "Less than 5 minutes",
      "5–15 minutes",
      "15–30 minutes",
      "30–60 minutes",
      "More than an hour",
    ],
  },
  {
    key: "q10b_latency_variance",
    label:
      "Is your time to fall asleep fairly consistent, or does it change depending on the night?",
    type: "single",
    options: [
      "Pretty consistent — about the same most nights",
      "Worse on work/school nights, better on days off or weekends",
      "Worse on Sunday or the night before a big day",
      "It's random — some nights I'm out fast, others I lie there forever",
    ],
  },
  {
    key: "q10c_latency_more",
    label:
      "Anything else about falling asleep you want us to know? This is optional — but it helps if your pattern is more complicated than the options above.",
    type: "text",
    required: false,
    placeholder:
      'e.g. "I fall asleep fine on the couch but as soon as I get into bed I\'m wide awake" or "I can only fall asleep with a podcast on"',
  },
  {
    key: "q10d_sleep_barriers",
    label:
      "When you're struggling to fall asleep, which of these tend to be part of the problem? Pick all that apply.",
    type: "multi",
    showWhen: { q10_latency: ["15–30 minutes", "30–60 minutes", "More than an hour"] },
    options: [
      {
        key: "mindRacing",
        label: "My mind is racing — worries, stress, things I need to do",
      },
      {
        key: "cantSwitchOff",
        label: "My brain just won't switch off — not anxious exactly, just… on",
      },
      {
        key: "notSleepyYet",
        label: "I don't actually feel sleepy yet — lying there wide awake",
      },
      {
        key: "dreadOrLowMood",
        label: "I feel a sense of dread or low mood about the next day",
      },
      {
        key: "painOrDiscomfort",
        label: "Physical discomfort — pain, temperature, restless legs",
      },
      {
        key: "wakeBackQuickly",
        label: "I wake up briefly but fall back quickly",
      },
      {
        key: "heartPounding",
        label: "My heart is pounding or racing",
      },
      {
        key: "anxiousNoReason",
        label: "I feel anxious or on edge for no obvious reason",
      },
      {
        key: "hungerBathroom",
        label: "Hunger or needing the bathroom",
      },
      {
        key: "noise",
        label: "Noise or light waking me",
      },
      {
        key: "partnerWaking",
        label: "My partner or someone else waking me",
      },
      {
        key: "nothingSpecific",
        label: "Nothing specific — I just lie awake",
      },
    ],
  },

  // ─── Night waking block ───
  {
    key: "q0b",
    label:
      "When you wake during the night, what typically happens?",
    type: "single",
    options: [
      "I rarely wake during the night",
      "I wake briefly but fall back asleep within a few minutes",
      "I wake and lie there for 20+ minutes before getting back to sleep",
      "I wake and I'm wide awake — it can take over an hour to get back to sleep",
      "I wake very early (3–5 am) and can't get back to sleep at all",
      "It depends on the night — sometimes I'm fine, other times I'm awake for ages",
    ],
  },

  // ─── Only shown if they selected options 2–5 above ───
  {
    key: "q0b_wake_causes",
    label:
      "What seems to wake you up, or what do you notice when it happens? Pick all that apply.",
    type: "multi",
    showWhen: {
      key: "q0b",
      notValue: "I rarely wake during the night",
    },
    options: [
      {
        key: "noIdea",
        label: "No obvious reason — I just find myself awake",
      },
      { key: "bathroom", label: "Needing the bathroom" },
      { key: "pain", label: "Pain or physical discomfort" },
      { key: "noise", label: "Noise, partner, or kids" },
      {
        key: "breathing",
        label: "Difficulty breathing, choking, or gasping",
      },
      { key: "hotOrSweaty", label: "Feeling too hot or sweating" },
      {
        key: "anxiousThoughts",
        label: "Mind switches on — worries or racing thoughts",
      },
      { key: "nightmare", label: "A nightmare or vivid/disturbing dream" },
      {
        key: "heartRacing",
        label: "Heart pounding or a jolt of adrenaline",
      },
    ],
  },

  // ═══════════════════════════════════════════
  //  AIRWAY / BREATHING
  // ═══════════════════════════════════════════
  {
    key: "q3",
    label:
      "Has a bed partner, family member, or roommate told you that you snore or seem to stop breathing while you sleep?",
    type: "single",
    options: [
      "Yes — regularly or loudly",
      "Occasionally or mildly",
      "No — and someone would know",
      "I sleep alone, so I'm not sure",
    ],
  },
  {
    key: "q8",
    label:
      "Do any of these happen to you at least a few times a week?",
    type: "multi",
    options: [
      { key: "dryMouth", label: "Waking up with a dry mouth" },
      { key: "morningHeadache", label: "Headaches in the morning" },
      { key: "soreThroat", label: "Sore or scratchy throat on waking" },
      {
        key: "nasalCongestion",
        label: "Blocked nose or mouth-breathing at night",
      },
      { key: "noneOfThese", label: "None of these" },
    ],
  },

  // ═══════════════════════════════════════════
  //  CIRCADIAN / SCHEDULE
  // ═══════════════════════════════════════════
  // ─── Circadian / schedule block ───

  {
    key: "q12_bed_worknight",
    label:
      "On a typical work or school night, what time do you actually "
      + "try to go to sleep — not when you get into bed, but when "
      + "you put the phone down and close your eyes?",
    type: "single",
    options: [
      "Before 9:30 pm",
      "9:30 – 10:30 pm",
      "10:30 – 11:30 pm",
      "11:30 pm – 12:30 am",
      "12:30 – 1:30 am",
      "After 1:30 am",
    ],
  },

  {
    key: "q12_bed_freenight",
    label:
      "On nights where you don't have to get up early the next day "
      + "(weekends, days off), what time do you usually try to go to sleep?",
    type: "single",
    options: [
      "About the same as work nights",
      "30–60 minutes later",
      "1–2 hours later",
      "2–3 hours later",
      "3+ hours later",
      "It's completely random — no pattern",
    ],
  },

  {
    key: "q12_wake",
    label:
      "On work or school days, what time does your alarm go off "
      + "(or what time do you have to be up)?",
    type: "single",
    options: [
      "Before 5:30 am",
      "5:30 – 6:30 am",
      "6:30 – 7:30 am",
      "7:30 – 8:30 am",
      "After 8:30 am",
      "I don't have a fixed wake time",
    ],
  },

  {
    key: "q12b_chronotype",
    label: "Left to your own body clock — no alarm, no obligations — when do you naturally fall asleep and wake up?",
    type: "single",
    options: [
      "Asleep before 9:30 pm, awake before 5:30 am",
      "Asleep around 10 pm, awake around 6 am",
      "Asleep around 11 pm, awake around 7 am",
      "Asleep around midnight, awake around 8 am",
      "Asleep after 1 am, awake after 9 am",
      "Asleep after 2 am, awake after 10 am or later",
      "No idea — my sleep has never been consistent enough to know",
    ],
  },

  // ═══════════════════════════════════════════
  //  MIND / STRESS / MOOD
  // ═══════════════════════════════════════════
  {
    key: "q5",
    label:
      "When you first try to fall asleep, what is your mind usually doing?",
    type: "single",
    showWhen: { q10_latency: ["5–15 minutes", "15–30 minutes", "30–60 minutes", "More than an hour"] },
    options: [
      "Racing with worries, stress, or anxiety",
      "Buzzing with ideas or energy (not worry)",
      "Replaying the day or ruminating on things",
      "Mostly quiet — I fall asleep easily but still wake unrefreshed",
    ],
  },

  // ═══════════════════════════════════════════
  //  SUBSTANCES
  // ═══════════════════════════════════════════
  {
    key: "q4",
    label:
      "In the past month, which of these have you used regularly — most weeks?",
    type: "multi",
    options: [
      { key: "alcohol", label: "Alcohol (most nights or several times a week)" },
      { key: "caffeineAfterMidday", label: "Caffeine after midday (coffee, tea, energy drinks, pre-workout)" },
      { key: "cannabis", label: "Cannabis" },
      { key: "nicotine", label: "Nicotine or vaping" },
      { key: "sedatives", label: "Sleeping pills or sedatives (prescribed or over-the-counter)" },
      { key: "melatonin", label: "Melatonin (taken most nights)" },
      { key: "antidepressants", label: "Antidepressants, anxiety medication, or mood stabilisers" },
      { key: "bpMeds", label: "Blood pressure medication, beta-blockers, or steroids" },
      { key: "opioids", label: "Opioids or strong pain medication" },
      { key: "noneOfThese", label: "None of these" },
    ],
  },
  {
    key: "q9",
    label:
      "If you use any of the above, how close to bedtime is your last dose or drink usually?",
    type: "single",
    showWhen: { q4: { notIncludes: "noneOfThese" } },
    options: [
      "Within 2 hours of bed",
      "2–4 hours before bed",
      "More than 4 hours before bed",
      "Not applicable — I selected none above",
    ],
  },

  // ═══════════════════════════════════════════
  //  ENVIRONMENT / BEHAVIOUR
  // ═══════════════════════════════════════════
  {
    key: "q14_environment",
    label:
      "Which of these are part of a typical night for you?",
    type: "multi",
    options: [
      { key: "screenInBed", label: "Using my phone or a screen in bed" },
      {
        key: "roomTempWrong",
        label: "Bedroom feels too warm or too cold",
      },
      {
        key: "noise",
        label:
          "Noise that disturbs my sleep (traffic, partner snoring, pets)",
      },
      {
        key: "kidsWaking",
        label: "A child or dependent waking me during the night",
      },
      {
        key: "noWindDown",
        label: "No consistent wind-down routine before bed",
      },
      { key: "noneOfThese", label: "None of these" },
    ],
  },

  // ═══════════════════════════════════════════
  //  MOVEMENT / PAIN / NOCTURIA
  // ═══════════════════════════════════════════
  {
    key: "q11",
    label:
      "Do any of these show up at night for you, at least a few times a week?",
    type: "multi",
    options: [
      {
        key: "legUrge",
        label:
          "A strong urge to move your legs, or a creepy-crawly feeling in them",
      },
      { key: "painWakes", label: "Pain that wakes you from sleep" },
      {
        key: "nocturia2Plus",
        label: "Needing to get up to urinate 2 or more times",
      },
      {
        key: "bruxism",
        label:
          "Grinding your teeth, or waking with a tight or sore jaw",
      },
      { key: "noneOfThese", label: "None of these" },
    ],
  },
  {
    key: "q_nocturia_male",
    label: "How long has the frequent night-time urination been going on?",
    type: "single",
    options: [
      "It's been happening for years — it's just normal for me now",
      "It started or noticeably worsened in the past 12 months",
      "It started or noticeably worsened in the past 3 months",
      "It seems to come and go — no consistent pattern",
    ],
    showWhen: { sex: "Male", ageBand: ["45–54", "55–64", "65+"], q11: { includes: "nocturia2Plus" } },
  },

  // ═══════════════════════════════════════════
  //  CONTEXT / TIMELINE
  // ═══════════════════════════════════════════
  {
    key: "q6",
    label: "How long have you been dealing with this?",
    type: "single",
    options: [
      "Less than 3 months — it's fairly recent",
      "3–6 months",
      "6–12 months",
      "1–3 years",
      "More than 3 years — this is just how I am",
    ],
  },
  {
    key: "q7",
    label:
      "Can you remember what seemed to start or worsen this?",
    type: "single",
    options: [
      "A viral illness (COVID, flu, mono, etc.)",
      "A major life event, loss, or period of stress",
      "A new medication or stopping one",
      "A change in schedule (new job, baby, shift work)",
      "It came on gradually — no clear trigger",
    ],
  },

  // ═══════════════════════════════════════════
  //  RED FLAGS — "SEE YOUR DOCTOR" SIGNALS
  // ═══════════════════════════════════════════
  {
    key: "q13",
    label:
      "Do any of these more serious signals apply to you right now?",
    type: "multi",
    options: [
      {
        key: "gasping",
        label: "Waking up gasping for air or choking",
      },
      {
        key: "orthopnea",
        label:
          "Needing to prop yourself up with extra pillows just to breathe at night",
      },
      {
        key: "weightLossFeverSweats",
        label:
          "Unexplained weight loss together with fevers or drenching night sweats",
      },
      {
        key: "selfHarmThoughts",
        label:
          "Thoughts of self-harm or that life is not worth living",
      },
      { key: "noneOfThese", label: "None of these" },
    ],
  },
];


function OptionButtons({ current, answers, onSingle, onMulti }) {
  const isMulti = current.type === "multi";

  const visibleOptions = current.options.filter(opt => {
    if (!opt.showWhen) return true;
    return Object.entries(opt.showWhen).every(([field, condition]) => {
      if (typeof condition === 'string') return answers[field] === condition;
      if (Array.isArray(condition)) return condition.includes(answers[field]);
      return true;
    });
  });

  const optionsArray = isMulti
    ? visibleOptions.map((opt) => opt.label)
    : visibleOptions;

  const isSelected = (optLabel) => {
    if (!isMulti) return answers[current.key] === optLabel;
    const opt = current.options.find((o) => o.label === optLabel);
    return opt ? !!answers[current.key]?.[opt.key] : false;
  };

  return (
    <div style={{ marginTop: "14px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {optionsArray.map((optLabel, i) => {
          const selected = isSelected(optLabel);
          const isMultiType = isMulti;

          return (
            <button
              key={i}
              onClick={() => {
                if (!isMultiType) {
                  onSingle(current.key, optLabel);
                } else {
                  const opt = current.options.find((o) => o.label === optLabel);
                  onMulti(current.key, opt.key);
                }
              }}
              className={`prox-option${selected ? " selected" : ""}`}
            >
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  flexShrink: 0,
                  borderRadius: isMultiType ? "4px" : "50%",
                  border: `2px solid ${selected ? "var(--prox-terra)" : "var(--prox-pale)"}`,
                  background: selected ? "var(--prox-terra)" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all .15s",
                }}
              >
                {selected && (
                  <div
                    style={{
                      width: isMultiType ? "8px" : "7px",
                      height: isMultiType ? "8px" : "7px",
                      background: "var(--prox-stone)",
                      borderRadius: isMultiType ? "2px" : "50%",
                    }}
                  />
                )}
              </div>
              <span
                style={{
                  fontSize: "15px",
                  color: "var(--prox-forest)",
                  lineHeight: "1.4",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {optLabel}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ...existing code (imports, QUESTIONS array)...

function App() {
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [result, setResult] = useState(null);
  const [caveatedResult, setCaveatedResult] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [emailStatus, setEmailStatus] = useState("idle"); // idle | submitting | success | error

  const current = QUESTIONS[currentIndex];

  const handleAnswer = (key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleSingleChange = (key, value) => {
    handleAnswer(key, value);
  };

  const handleMultiToggle = (key, optionKey) => {
    setAnswers((prev) => {
      const prevValue = prev[key] || {};
      let nextValue;
      if (optionKey === "noneOfThese") {
        // Selecting "none" clears all other selections
        nextValue = { noneOfThese: !prevValue.noneOfThese };
      } else if (prevValue.noneOfThese) {
        // Selecting anything else while "none" is checked: uncheck "none", toggle the new key
        nextValue = { [optionKey]: true };
      } else {
        nextValue = { ...prevValue, [optionKey]: !prevValue[optionKey] };
      }
      return { ...prev, [key]: nextValue };
    });
  };

  const canGoNext = () => {
    const answer = answers[current.key];

    if (current.type === "text") {
      return current.required === false || !!answer?.trim();
    }

    if (current.type === "multi") {
      return !!answer && Object.values(answer).some(Boolean);
    }

    return answer != null;
  };

  const shouldShow = (question) => {
    if (!question.showWhen) return true;
    const sw = question.showWhen;

    // Legacy format: { key, value, notValue }
    if (sw.key !== undefined) {
      const answer = answers[sw.key];
      if (sw.value !== undefined) return answer === sw.value;
      if (sw.notValue !== undefined) return answer !== sw.notValue;
      return true;
    }

    // New format: each property in showWhen is a question key
    // All conditions must pass (AND logic)
    return Object.entries(sw).every(([field, condition]) => {
      const answer = answers[field];
      // Array of strings: answer must be one of them (OR logic)
      if (Array.isArray(condition)) return condition.includes(answer);
      // String: exact match
      if (typeof condition === "string") return answer === condition;
      // Object: { includes: "key" } or { notIncludes: "key" }
      if (condition && typeof condition === "object") {
        if (condition.includes !== undefined) return !!(answer?.[condition.includes]);
        if (condition.notIncludes !== undefined) return !(answer?.[condition.notIncludes]);
      }
      return true;
    });
  };

  const handleNext = () => {
    // Hard stop: pregnancy
    if (
      current.key === "specialCase_pregnancy" &&
      answers.specialCase_pregnancy === "Yes, I'm currently pregnant"
    ) {
      setResult({ type: "hardStopPregnancy" });
      return;
    }

    let next = currentIndex + 1;
    while (next < QUESTIONS.length && !shouldShow(QUESTIONS[next])) next++;
    if (next < QUESTIONS.length) {
      setCurrentIndex(next);
    } else {
      // Evaluate caveat flag before scoring
      let caveat = false;
      if (answers.specialCase_caregiver === "Yes — and they wake me most nights") caveat = true;
      const kc = answers.knownConditions || {};
      const kcSelected = Object.keys(kc).filter((k) => k !== "noneOfThese" && kc[k]);
      if (kcSelected.length >= 3 || kc.apnea || kc.autoimmune || kc.ptsd) caveat = true;
      setCaveatedResult(caveat);

      const scoreResult = scoreNRSQuiz(answers);
      console.log('[NRS result]', scoreResult);
      // Crisis: soft gate — show resources above result, don't block it
      const showCrisisGate = !!(answers.q13?.selfHarmThoughts);
      setResult({ ...scoreResult, showCrisisGate });
    }
  };

  const handleBack = () => {
    let prev = currentIndex - 1;
    while (prev >= 0 && !shouldShow(QUESTIONS[prev])) prev--;
    if (prev >= 0) setCurrentIndex(prev);
  };

  const handleRestart = () => {
    setAnswers({});
    setCurrentIndex(0);
    setResult(null);
    setCaveatedResult(false);
    setEmailInput("");
    setEmailStatus("idle");
  };

  const handleEmailSubmit = async (primaryMechanism) => {
    setEmailStatus("submitting");
    const payload = { email: emailInput, bucket: `bucket_${primaryMechanism}`, sex: answers.sex };
    console.log("[subscribe] fetching", "/api/subscribe", payload);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("non-2xx");
      setEmailStatus("success");
    } catch {
      setEmailStatus("error");
    }
  };

  const visibleQuestions = QUESTIONS.filter((_, i) => {
    // count how many questions are visible up to and including current
    let count = 0;
    for (let j = 0; j <= i; j++) {
      if (shouldShow(QUESTIONS[j])) count++;
    }
    return shouldShow(QUESTIONS[i]);
  });
  const totalVisible = visibleQuestions.length;
  const currentVisible = visibleQuestions.filter((_, i) =>
    QUESTIONS.indexOf(visibleQuestions[i]) <= currentIndex
  ).length;
  const progressPct = totalVisible > 0 ? Math.round((currentVisible / totalVisible) * 100) : 0;

  return (
    <>
      <div
        style={{
          width: "100%",
          background: "#FFFFFF",
          padding: "18px 32px",
          borderBottom: "1px solid #E8E3DC",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxSizing: "border-box",
        }}
      >
        <span
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "22px",
            fontWeight: 400,
            color: "#1A1A1A",
            letterSpacing: "0px",
          }}
        >
          Proxiate
        </span>
        <span
          style={{
            color: "#D0C9BE",
            margin: "0 14px",
            fontWeight: 400,
            fontSize: "16px",
          }}
        >
          |
        </span>
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "12px",
            fontWeight: 500,
            color: "#9A9A9A",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Sleep Pattern Quiz
        </span>
      </div>

      <div
        style={{
          maxWidth: "660px",
          margin: "0 auto",
          padding: "28px 24px 80px",
          background: "var(--prox-stone)",
          minHeight: "100vh",
          fontFamily: "'DM Sans', system-ui, sans-serif",
          color: "var(--prox-body)",
        }}
      >

      {result && (
        <div style={{ marginTop: 24 }}>

          {result.type === "hardStopPregnancy" && (
            <div style={{ border: "0.5px solid var(--prox-pale)", borderRadius: 8, padding: 20, marginBottom: 16, background: "var(--prox-surface)" }}>
              <h3 style={{ color: "var(--prox-forest)", marginTop: 0 }}>This quiz wasn't built for pregnancy — here's why</h3>
              <p style={{ color: "var(--prox-muted)" }}>
                Pregnancy changes almost every mechanism this quiz measures. Blood volume increases by
                around 50%, progesterone shifts your sleep architecture, and your iron demands roughly
                double. Any result we gave you would be based on a model that doesn't apply right now
                — that's not helpful, it's noise.
              </p>
              <p style={{ color: "var(--prox-muted)" }}>
                What actually helps: talk to your midwife or GP. Sleep disruption in pregnancy is
                extremely common and there are safe, evidence-based approaches they can guide you through.
              </p>
            </div>
          )}

          {result.showCrisisGate && (
            <>
              <div style={{ border: "1.5px solid var(--prox-terra)", borderRadius: 8, padding: 20, marginBottom: 16, background: "var(--prox-surface)" }}>
                <h3 style={{ color: "var(--prox-forest)", marginTop: 0 }}>Before you see your results</h3>
                <p style={{ color: "var(--prox-muted)", marginBottom: 12 }}>
                  You mentioned thoughts of self-harm or that life isn't worth living. Please know
                  that support is available right now.
                </p>
                <p style={{ color: "var(--prox-muted)", marginBottom: 8 }}>
                  Call or text <strong style={{ color: "var(--prox-forest)" }}>988</strong> (Suicide and Crisis Lifeline — free, 24/7)
                </p>
                <p style={{ color: "var(--prox-muted)", marginBottom: 8 }}>
                  Text <strong style={{ color: "var(--prox-forest)" }}>HOME</strong> to <strong style={{ color: "var(--prox-forest)" }}>741741</strong> (Crisis Text Line)
                </p>
                <p style={{ color: "var(--prox-muted)", marginBottom: 0 }}>
                  Emergency: call <strong style={{ color: "var(--prox-forest)" }}>911</strong>
                </p>
                <p style={{ color: "var(--prox-muted)", marginTop: 12, marginBottom: 0, fontSize: "13px" }}>
                  You don't have to be in immediate danger to reach out — these lines are there for
                  anyone who's struggling.
                </p>
              </div>
              <hr style={{ border: "none", borderTop: "0.5px solid var(--prox-pale)", margin: "24px 0" }} />
            </>
          )}

          {result.type !== "hardStopPregnancy" && (
            <>
              {caveatedResult && (
                <div style={{ border: "0.5px solid var(--prox-bronze)", borderRadius: 8, padding: 16, marginBottom: 20, background: "var(--prox-surface)" }}>
                  <p style={{ color: "var(--prox-bronze)", margin: 0, fontSize: "14px" }}>
                    <strong>Important context:</strong> Based on your answers, one or more underlying
                    health conditions or caregiving demands are likely affecting your sleep. The pattern
                    below is a starting point — but we'd recommend discussing these results with your
                    GP before acting on them.
                  </p>
                </div>
              )}

              {(() => {
                const CAPS = { airway: 50, circadian: 40, duration: 30, substances: 30, environment: 30, hormonal: 50, mind_stress: 40, mood: 30, movement: 35, systemic: 30 };
                const primaryKey = result.topMechanisms?.[0];
                const secondaryKey = result.topMechanisms?.[1];
                const primary = primaryKey ? resolveMechanism(primaryKey, answers) : null;
                const secondary = secondaryKey ? resolveMechanism(secondaryKey, answers) : null;

                const primaryScore = primaryKey ? (result.scores?.[primaryKey] || 0) : 0;
                const primaryCap = primaryKey ? (CAPS[primaryKey] || 1) : 1;
                const primaryPct = Math.round((primaryScore / primaryCap) * 100);
                const signalStrength = primaryPct >= 70 ? "Strong signal — address first" : primaryPct >= 40 ? "Moderate signal" : primaryPct >= 20 ? "Contributing factor" : "Minor signal";
                const signalBg = primaryPct >= 70 ? "var(--prox-terra)" : primaryPct >= 40 ? "var(--prox-bronze)" : "var(--prox-muted)";

                const sortedScores = Object.entries(result.scores || {})
                  .map(([key, score]) => ({ key, score, pct: Math.min(Math.round((score / (CAPS[key] || 1)) * 100), 100) }))
                  .sort((a, b) => b.pct - a.pct);

                const barColor = (pct) => {
                  if (pct >= 70) return "var(--prox-terra)";
                  if (pct >= 40) return "var(--prox-bronze)";
                  if (pct >= 20) return "var(--prox-muted)";
                  return "var(--prox-pale)";
                };

                const FLAG_META = {
                  urgent_airway:     { dot: "#e53e3e", label: "Airway: urgent — see a doctor" },
                  breathingEvents:   { dot: "#e53e3e", label: "Breathing events during sleep" },
                  drivingSleepiness: { dot: "#dd6b20", label: "Safety: drowsy driving risk" },
                  nocturia_urgent:   { dot: "#dd6b20", label: "Nocturia: recent onset" },
                  nocturia_watch:    { dot: "#ecc94b", label: "Nocturia: worth monitoring" },
                  post_viral:        { dot: "#718096", label: "Post-viral pattern" },
                  chronic_duration:  { dot: "#718096", label: "Ongoing 1+ year" },
                };

                const visibleFlags = (result.red_flags || []).filter(f => f !== "crisis" && FLAG_META[f]);

                return (
                  <div className="nrs-results-layout">

                    {/* ── LEFT SIDEBAR ── */}
                    <aside className="nrs-sidebar">

                      {/* Section 1 — Primary driver badge */}
                      {primaryKey && (
                        <div style={{ marginBottom: 20 }}>
                          <div className="prox-label">Primary driver</div>
                          <div style={{ background: "var(--prox-surface)", border: "0.5px solid var(--prox-pale)", borderRadius: 8, padding: "10px 14px" }}>
                            <div style={{ color: "var(--prox-terra)", fontWeight: 700, fontFamily: "'Inter', sans-serif", fontSize: "13px", marginBottom: 6 }}>
                              {MECHANISMS[primaryKey]?.label || primaryKey}
                            </div>
                            <div style={{
                              display: "inline-block",
                              background: signalBg,
                              color: "var(--prox-stone)",
                              fontSize: "11px",
                              padding: "2px 8px",
                              borderRadius: 4,
                              fontWeight: 500,
                            }}>
                              {signalStrength}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Section 2 — All signals bar chart */}
                      <div style={{ marginBottom: 20 }}>
                        <div className="prox-label">All signals</div>
                        {sortedScores.map(({ key, pct }) => (
                          <div key={key} style={{ marginBottom: 7 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <span style={{ fontSize: "11px", color: pct < 15 ? "var(--prox-pale)" : "var(--prox-muted)", width: 84, flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {MECHANISMS[key]?.shortName || key}
                              </span>
                              <div style={{ flex: 1, height: 5, background: "var(--prox-pale)", borderRadius: 3, overflow: "hidden" }}>
                                <div style={{ width: `${pct}%`, height: "100%", background: barColor(pct), borderRadius: 3 }} />
                              </div>
                              <span className="nrs-score-label" style={{ fontSize: "10px", color: pct < 15 ? "var(--prox-pale)" : "var(--prox-muted)", width: 52, textAlign: "right", flexShrink: 0, fontFamily: "'DM Mono', monospace", whiteSpace: "nowrap" }}>
                                {pct} / 100
                              </span>
                              <span className="nrs-bar-signal" style={{ fontSize: "10px", color: barColor(pct), flexShrink: 0, whiteSpace: "nowrap" }}>
                                {pct >= 70 ? "Strong signal" : pct >= 40 ? "Moderate signal" : "Mild signal"}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>



                      {/* Section 3 — Flags */}
                      {visibleFlags.length > 0 && (
                        <div style={{ marginBottom: 20 }}>
                          <div className="prox-label">Flags</div>
                          {visibleFlags.map(flag => (
                            <div key={flag} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 6 }}>
                              <div style={{ width: 8, height: 8, borderRadius: "50%", background: FLAG_META[flag].dot, flexShrink: 0, marginTop: 3 }} />
                              <span style={{ fontSize: "12px", color: "var(--prox-muted)", lineHeight: 1.4 }}>{FLAG_META[flag].label}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Footer */}
                      <div style={{ fontSize: "11px", color: "var(--prox-muted)", lineHeight: 1.5, borderTop: "0.5px solid var(--prox-pale)", paddingTop: 12 }}>
                        Your personal sleep pattern — based on your answers
                      </div>
                    </aside>

                    {/* ── RIGHT / MAIN COLUMN ── */}
                    <div className="nrs-main">

                      {/* Mobile compact summary — hidden on desktop */}
                      <div className="nrs-mobile-summary">
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          {sortedScores.slice(0, 3).map(({ key, pct }, i) => (
                            <div key={key} style={{
                              background: i === 0 ? "var(--prox-terra)" : "var(--prox-pale)",
                              color: i === 0 ? "var(--prox-stone)" : "var(--prox-forest)",
                              fontSize: "12px",
                              padding: "4px 10px",
                              borderRadius: 20,
                              fontFamily: "'DM Sans', sans-serif",
                              fontWeight: i === 0 ? 700 : 400,
                            }}>
                              {MECHANISMS[key]?.shortName || key} {pct} out of 100
                            </div>
                          ))}
                        </div>
                      </div>

                      {primary && (
                        <div style={{ border: "0.5px solid var(--prox-pale)", borderRadius: 8, padding: 16, marginBottom: 16, background: "var(--prox-surface)" }}>
                          <h3 style={{ color: "var(--prox-forest)" }}>{primary.label}</h3>
                          <p style={{ color: "var(--prox-body)" }}>{primary.explanation} Addressing your primary driver often reduces the secondary signals — they're frequently downstream effects rather than independent problems.</p>
                          <h4 style={{ color: "var(--prox-forest)" }}>What this suggests in your case</h4>
                          <ul style={{ color: "var(--prox-body)" }}>
                            {primary.behaviours.map((b) => (
                              <li key={b}>{b}</li>
                            ))}
                          </ul>
                          <p style={{ color: "var(--prox-body)" }}>
                            <strong>When to talk to your doctor:</strong>{" "}
                            {primary.doctorTrigger}
                          </p>
                        </div>
                      )}

                      {secondary && (
                        <div style={{ border: "0.5px solid var(--prox-pale)", borderRadius: 8, padding: 16, marginBottom: 16, background: "var(--prox-surface)" }}>
                          <h4 style={{ color: "var(--prox-forest)" }}>Secondary pattern to watch: {secondary.shortName}</h4>
                          <p style={{ color: "var(--prox-body)" }}>{secondary.explanation}</p>
                        </div>
                      )}

                      {/* ── EMAIL CAPTURE ── */}
                      {primaryKey && (
                        <div style={{ border: "0.5px solid var(--prox-pale)", borderRadius: 8, padding: "20px 24px", marginBottom: 16, background: "var(--prox-surface)" }}>
                          {emailStatus === "success" ? (
                            <p style={{ color: "var(--prox-muted)", margin: 0 }}>Your plan is on its way.</p>
                          ) : (
                            <>
                              <h3 style={{ color: "var(--prox-forest)", marginTop: 0, marginBottom: 6, fontSize: "17px" }}>
                                Your personalised action plan is ready
                              </h3>
                              <p style={{ color: "var(--prox-muted)", margin: "0 0 16px", fontSize: "14px" }}>
                                Specific fixes for this root cause — nothing else.
                              </p>
                              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                <input
                                  type="email"
                                  placeholder="Your email"
                                  value={emailInput}
                                  onChange={e => setEmailInput(e.target.value)}
                                  onKeyDown={e => e.key === "Enter" && emailInput && handleEmailSubmit(result.primaryMechanism)}
                                  style={{
                                    flex: 1,
                                    minWidth: 180,
                                    background: "var(--prox-stone)",
                                    border: "0.5px solid var(--prox-pale)",
                                    borderRadius: 8,
                                    padding: "10px 14px",
                                    color: "var(--prox-forest)",
                                    fontSize: "14px",
                                    fontFamily: "'DM Sans', sans-serif",
                                    outline: "none",
                                  }}
                                />
                                <button
                                  onClick={() => handleEmailSubmit(result.primaryMechanism)}
                                  disabled={!emailInput || emailStatus === "submitting"}
                                  style={{
                                    background: "var(--prox-forest)",
                                    color: "var(--prox-stone)",
                                    border: "none",
                                    borderRadius: 8,
                                    padding: "10px 18px",
                                    fontSize: "14px",
                                    fontFamily: "'DM Sans', sans-serif",
                                    fontWeight: 500,
                                    cursor: emailInput ? "pointer" : "not-allowed",
                                    opacity: emailInput ? 1 : 0.4,
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {emailStatus === "submitting" ? "Sending…" : "Send my plan →"}
                                </button>
                              </div>
                              {emailStatus === "error" && (
                                <p style={{ color: "var(--prox-terra)", fontSize: "13px", marginTop: 10, marginBottom: 0 }}>
                                  Something went wrong — try again.
                                </p>
                              )}
                              <p style={{ color: "var(--prox-muted)", fontSize: "12px", marginTop: 10, marginBottom: 0 }}>
                                No generic advice. No spam.
                              </p>
                            </>
                          )}
                        </div>
                      )}

                      {result.sleep_restriction && (
                        <p style={{ color: "var(--prox-muted)", fontSize: "13px" }}>
                          There is also a strong sleep‑restriction signal (time in bed under 6.5 hours most nights).
                        </p>
                      )}
                    </div>
                  </div>
                );
              })()}
            </>
          )}

          {!result.showCrisisGate && (
            <button
              onClick={handleRestart}
              style={{
                marginTop: 16,
                background: "transparent",
                color: "var(--prox-muted)",
                border: "0.5px solid var(--prox-pale)",
                padding: "8px 16px",
                borderRadius: "8px",
                fontSize: "13px",
                fontFamily: "'DM Sans', sans-serif",
                cursor: "pointer",
              }}
            >
              Restart quiz
            </button>
          )}
        </div>
      )}

    {!result && (
  <div className="prox-card">
    {/* Progress bar */}
    <div className="prox-progress-track">
      <div className="prox-progress-fill" style={{ width: `${progressPct}%` }} />
    </div>

    <h2 className="prox-question">{current.label}</h2>

    {current.type === "text" ? (
      <textarea
        value={answers[current.key] || ""}
        onChange={(e) => handleSingleChange(current.key, e.target.value)}
        placeholder={current.placeholder || ""}
        rows={4}
        style={{
          marginTop: "14px",
          width: "100%",
          background: "var(--prox-stone)",
          border: "0.5px solid var(--prox-pale)",
          borderRadius: "8px",
          padding: "11px 16px",
          color: "var(--prox-forest)",
          fontSize: "14px",
          fontFamily: "'DM Sans', sans-serif",
          resize: "vertical",
          boxSizing: "border-box",
          outline: "none",
        }}
      />
    ) : (
      <OptionButtons
        current={current}
        answers={answers}
        onSingle={handleSingleChange}
        onMulti={handleMultiToggle}
      />
    )}

    <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
      {currentIndex > 0 && (
        <button
          onClick={handleBack}
          style={{
            background: "transparent",
            color: "var(--prox-muted)",
            border: "0.5px solid var(--prox-pale)",
            padding: "8px 16px",
            borderRadius: "8px",
            fontSize: "13px",
            fontFamily: "'DM Sans', sans-serif",
            cursor: "pointer",
          }}
        >
          Back
        </button>
      )}
      <button
        onClick={handleNext}
        disabled={!canGoNext()}
        className="prox-cta"
        style={{ marginTop: 0, flex: 1 }}
      >
        {currentIndex === QUESTIONS.length - 1 ? "See your pattern →" : "Continue →"}
      </button>
    </div>
  </div>
)}

    </div>
  </>
);
}

export default App;
