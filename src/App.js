// src/App.js
import React, { useState } from "react";
import scoreNRSQuiz  from "./Lib/src/lib/nrsScoring";
import { MECHANISMS, resolveMechanism } from "./config/mechanisms";

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
          "During an active task — eating, working at a desk, standing up",
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
        label:
          "My brain just won't switch off — not anxious exactly, just… on",
      },
      {
        key: "notSleepyYet",
        label:
          "I don't actually feel sleepy yet — I'm lying there wide awake",
      },
      {
        key: "cantGetComfortable",
        label:
          "I can't get physically comfortable — tossing, turning, restless",
      },
      {
        key: "tooHotOrCold",
        label: "The temperature is wrong — too hot or too cold",
      },
      {
        key: "noise",
        label:
          "Noise keeps me alert — traffic, neighbours, housemates, partner snoring",
      },
      {
        key: "screenHooked",
        label:
          "I keep scrolling or watching something — I can't put the screen down",
      },
      {
        key: "painOrDiscomfort",
        label: "Pain or physical discomfort",
      },
      {
        key: "digestiveDiscomfort",
        label:
          "Heartburn, acid reflux, or a full/uncomfortable stomach",
      },
      {
        key: "heartPounding",
        label:
          "My heart is pounding or my body feels physically tense or wired",
      },
      {
        key: "dreadOrLowMood",
        label: "A heavy or low feeling — dread about tomorrow or life in general",
      },
      {
        key: "noneOfThese",
        label: "None of these — I fall asleep fine, my problem is staying asleep or waking unrefreshed",
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
      "Before 9:30 pm and awake before 5:30 am",
      "Around 10 pm and awake around 6 am",
      "Around 11 pm and awake around 7 am",
      "Around midnight and awake around 8 am",
      "After 1 am and awake after 9 am",
      "After 2 am and awake after 10 am or later",
      "No idea — my sleep has never been consistent enough to have a natural pattern",
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
    showWhen: { q10_latency: ["Less than 5 minutes", "5–15 minutes"] },
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
      "Less than 3 months — it's relatively recent",
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
              style={{
                background: selected ? "#1e1a14" : "#141210",
                border: `1px solid ${selected ? "#C4512A" : "#2a2520"}`,
                borderRadius: "7px",
                padding: "11px 16px",
                textAlign: "left",
                cursor: "pointer",
                transition: "all .15s",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  flexShrink: 0,
                  borderRadius: isMultiType ? "4px" : "50%",
                  border: `2px solid ${selected ? "#C4512A" : "#3a3530"}`,
                  background: selected ? "#C4512A" : "transparent",
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
                      background: "#f0ebe3",
                      borderRadius: isMultiType ? "2px" : "50%",
                    }}
                  />
                )}
              </div>
              <span
                style={{
                  fontSize: "14px",
                  color: selected ? "#f0ebe3" : "#b0a89e",
                  lineHeight: "1.4",
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
  const [legendOpen, setLegendOpen] = useState(false);
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
    const payload = { email: emailInput, bucket: `bucket_${primaryMechanism}` };
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

  return (
    <>
      <h1
        style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: "26px",
          marginBottom: "10px",
          color: "#f6efe6",
        }}
      >
        Proxiate – NRS Triage
      </h1>
      <p
        style={{
          fontSize: "12px",
          color: "#8a8278",
          marginBottom: "24px",
        }}
      >
        Your pattern (not a diagnosis)
      </p>

      <div
        style={{
          maxWidth: "660px",
          margin: "0 auto",
          padding: "28px 24px 80px",
          background: "#0f0d0b",
          minHeight: "100vh",
          fontFamily: "'IBM Plex Sans', system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
          color: "#f0ebe3",
        }}
      >

      {result && (
        <div style={{ marginTop: 24 }}>

          {result.type === "hardStopPregnancy" && (
            <div style={{ border: "1px solid #C4512A", borderRadius: 8, padding: 20, marginBottom: 16 }}>
              <h3 style={{ color: "#f0ebe3", marginTop: 0 }}>This quiz wasn't built for pregnancy — here's why</h3>
              <p style={{ color: "#b0a89e" }}>
                Pregnancy changes almost every mechanism this quiz measures. Blood volume increases by
                around 50%, progesterone shifts your sleep architecture, and your iron demands roughly
                double. Any result we gave you would be based on a model that doesn't apply right now
                — that's not helpful, it's noise.
              </p>
              <p style={{ color: "#b0a89e" }}>
                What actually helps: talk to your midwife or GP. Sleep disruption in pregnancy is
                extremely common and there are safe, evidence-based approaches they can guide you through.
              </p>
            </div>
          )}

          {result.showCrisisGate && (
            <>
              <div style={{ border: "1px solid #C4512A", borderRadius: 8, padding: 20, marginBottom: 16, background: "#1a0a08" }}>
                <h3 style={{ color: "#f0ebe3", marginTop: 0 }}>Before you see your results</h3>
                <p style={{ color: "#b0a89e", marginBottom: 12 }}>
                  You mentioned thoughts of self-harm or that life isn't worth living. Please know
                  that support is available right now.
                </p>
                <p style={{ color: "#b0a89e", marginBottom: 8 }}>
                  Call or text <strong style={{ color: "#f0ebe3" }}>988</strong> (Suicide and Crisis Lifeline — free, 24/7)
                </p>
                <p style={{ color: "#b0a89e", marginBottom: 8 }}>
                  Text <strong style={{ color: "#f0ebe3" }}>HOME</strong> to <strong style={{ color: "#f0ebe3" }}>741741</strong> (Crisis Text Line)
                </p>
                <p style={{ color: "#b0a89e", marginBottom: 0 }}>
                  Emergency: call <strong style={{ color: "#f0ebe3" }}>911</strong>
                </p>
                <p style={{ color: "#8a8278", marginTop: 12, marginBottom: 0, fontSize: "13px" }}>
                  You don't have to be in immediate danger to reach out — these lines are there for
                  anyone who's struggling.
                </p>
              </div>
              <hr style={{ border: "none", borderTop: "1px solid #2a2520", margin: "24px 0" }} />
            </>
          )}

          {result.type !== "hardStopPregnancy" && (
            <>
              <style>{`
                .nrs-results-layout { display: flex; gap: 28px; align-items: flex-start; }
                .nrs-sidebar { width: 240px; flex-shrink: 0; position: sticky; top: 24px; }
                .nrs-main { flex: 1; min-width: 0; }
                .nrs-mobile-summary { display: none; margin-bottom: 16px; }
                @media (max-width: 767px) {
                  .nrs-results-layout { flex-direction: column; }
                  .nrs-sidebar { display: none; }
                  .nrs-mobile-summary { display: block; }
                }
              `}</style>

              {caveatedResult && (
                <div style={{ border: "1px solid #5a4a30", borderRadius: 8, padding: 16, marginBottom: 20, background: "#1a1508" }}>
                  <p style={{ color: "#c8b870", margin: 0, fontSize: "14px" }}>
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
                const signalBg = primaryPct >= 70 ? "#C4512A" : primaryPct >= 40 ? "#7a3a20" : primaryPct >= 20 ? "#3a2518" : "#2a2018";

                const sortedScores = Object.entries(result.scores || {})
                  .map(([key, score]) => ({ key, score, pct: Math.round((score / (CAPS[key] || 1)) * 100) }))
                  .sort((a, b) => b.pct - a.pct);

                const barColor = (pct) => {
                  if (pct >= 70) return "#C4512A";
                  if (pct >= 40) return "#888";
                  if (pct >= 20) return "#555";
                  return "#333";
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
                          <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#8a8278", marginBottom: 8 }}>
                            Primary driver
                          </div>
                          <div style={{ background: "#1e1208", border: "1px solid #C4512A", borderRadius: 7, padding: "10px 14px" }}>
                            <div style={{ color: "#C4512A", fontWeight: 600, fontSize: "13px", marginBottom: 6 }}>
                              {MECHANISMS[primaryKey]?.label || primaryKey}
                            </div>
                            <div style={{
                              display: "inline-block",
                              background: signalBg,
                              color: "#f0ebe3",
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
                        <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#8a8278", marginBottom: 10 }}>
                          All signals
                        </div>
                        {sortedScores.map(({ key, pct }) => (
                          <div key={key} style={{ marginBottom: 7 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <span style={{ fontSize: "11px", color: pct < 15 ? "#4a4540" : "#8a8278", width: 84, flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {MECHANISMS[key]?.shortName || key}
                              </span>
                              <div style={{ flex: 1, height: 5, background: "#1e1a14", borderRadius: 3, overflow: "hidden" }}>
                                <div style={{ width: `${pct}%`, height: "100%", background: barColor(pct), borderRadius: 3 }} />
                              </div>
                              <span style={{ fontSize: "10px", color: pct < 15 ? "#4a4540" : "#6a6258", width: 28, textAlign: "right", flexShrink: 0 }}>
                                {pct}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Legend — How to read this */}
                      <div style={{ marginBottom: 20 }}>
                        <button
                          onClick={() => setLegendOpen(o => !o)}
                          style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: "#6a6258", fontSize: "11px", fontFamily: "inherit" }}
                        >
                          How to read this {legendOpen ? "↑" : "↓"}
                        </button>
                        {legendOpen && (
                          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                            {[
                              { color: "#C4512A", tier: "Strong (70%+)",       note: "clear pattern, address first" },
                              { color: "#888",    tier: "Moderate (40–70%)",   note: "real signal, address after primary" },
                              { color: "#555",    tier: "Contributing (20–40%)", note: "present but not dominant" },
                              { color: "#333",    tier: "Noise (under 20%)",   note: "weak signal, may resolve on its own" },
                            ].map(({ color, tier, note }) => (
                              <div key={tier} style={{ display: "flex", alignItems: "flex-start", gap: 7 }}>
                                <div style={{ width: 7, height: 7, borderRadius: "50%", background: color, flexShrink: 0, marginTop: 2 }} />
                                <span style={{ fontSize: "11px", lineHeight: 1.4, color: "#6a6258" }}>
                                  <span style={{ fontWeight: 600, color: "#8a8278" }}>{tier}</span>
                                  {" — "}{note}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Section 3 — Flags */}
                      {visibleFlags.length > 0 && (
                        <div style={{ marginBottom: 20 }}>
                          <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#8a8278", marginBottom: 8 }}>
                            Flags
                          </div>
                          {visibleFlags.map(flag => (
                            <div key={flag} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 6 }}>
                              <div style={{ width: 8, height: 8, borderRadius: "50%", background: FLAG_META[flag].dot, flexShrink: 0, marginTop: 3 }} />
                              <span style={{ fontSize: "12px", color: "#b0a89e", lineHeight: 1.4 }}>{FLAG_META[flag].label}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Footer */}
                      <div style={{ fontSize: "11px", color: "#4a4540", lineHeight: 1.5, borderTop: "1px solid #2a2520", paddingTop: 12 }}>
                        Based on your answers — not a diagnosis.
                      </div>
                    </aside>

                    {/* ── RIGHT / MAIN COLUMN ── */}
                    <div className="nrs-main">

                      {/* Mobile compact summary — hidden on desktop */}
                      <div className="nrs-mobile-summary">
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          {sortedScores.slice(0, 3).map(({ key, pct }, i) => (
                            <div key={key} style={{
                              background: i === 0 ? "#C4512A" : "#2a2520",
                              color: "#f0ebe3",
                              fontSize: "12px",
                              padding: "4px 10px",
                              borderRadius: 4,
                              fontWeight: i === 0 ? 600 : 400,
                            }}>
                              {MECHANISMS[key]?.shortName || key} {pct}%
                            </div>
                          ))}
                        </div>
                      </div>

                      {primary && (
                        <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 16, marginBottom: 16 }}>
                          <h3>{primary.label}</h3>
                          <p>{primary.explanation} Addressing your primary driver often reduces the secondary signals — they're frequently downstream effects rather than independent problems.</p>
                          <h4>What this suggests in your case</h4>
                          <ul>
                            {primary.behaviours.map((b) => (
                              <li key={b}>{b}</li>
                            ))}
                          </ul>
                          <p>
                            <strong>When to talk to your doctor:</strong>{" "}
                            {primary.doctorTrigger}
                          </p>
                        </div>
                      )}

                      {secondary && (
                        <div style={{ border: "1px solid #eee", borderRadius: 8, padding: 16, marginBottom: 16 }}>
                          <h4>Secondary pattern to watch: {secondary.shortName}</h4>
                          <p>{secondary.explanation}</p>
                        </div>
                      )}

                      {/* ── EMAIL CAPTURE ── */}
                      {primaryKey && (
                        <div style={{ border: "1px solid #2a2520", borderRadius: 8, padding: "20px 24px", marginBottom: 16, background: "#110f0c" }}>
                          {emailStatus === "success" ? (
                            <p style={{ color: "#b0a89e", margin: 0 }}>Your plan is on its way.</p>
                          ) : (
                            <>
                              <h3 style={{ color: "#f0ebe3", marginTop: 0, marginBottom: 6, fontSize: "17px" }}>
                                Your personalised action plan is ready
                              </h3>
                              <p style={{ color: "#8a8278", margin: "0 0 16px", fontSize: "14px" }}>
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
                                    background: "#1e1a14",
                                    border: "1px solid #3a3530",
                                    borderRadius: 6,
                                    padding: "10px 14px",
                                    color: "#f0ebe3",
                                    fontSize: "14px",
                                    fontFamily: "inherit",
                                    outline: "none",
                                  }}
                                />
                                <button
                                  onClick={() => handleEmailSubmit(result.primaryMechanism)}
                                  disabled={!emailInput || emailStatus === "submitting"}
                                  style={{
                                    background: emailInput ? "#C4512A" : "#3a2518",
                                    color: "#f0ebe3",
                                    border: "none",
                                    borderRadius: 6,
                                    padding: "10px 18px",
                                    fontSize: "14px",
                                    fontFamily: "inherit",
                                    cursor: emailInput ? "pointer" : "not-allowed",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {emailStatus === "submitting" ? "Sending…" : "Send my plan →"}
                                </button>
                              </div>
                              {emailStatus === "error" && (
                                <p style={{ color: "#e57373", fontSize: "13px", marginTop: 10, marginBottom: 0 }}>
                                  Something went wrong — try again.
                                </p>
                              )}
                              <p style={{ color: "#4a4540", fontSize: "12px", marginTop: 10, marginBottom: 0 }}>
                                No generic advice. No spam.
                              </p>
                            </>
                          )}
                        </div>
                      )}

                      {result.sleep_restriction && (
                        <p style={{ color: "#b0a89e", fontSize: "13px" }}>
                          There is also a strong sleep‑restriction signal (time in bed under 6.5 hours most nights).
                        </p>
                      )}
                    </div>
                  </div>
                );
              })()}
            </>
          )}

          {!result.showCrisisGate && <button onClick={handleRestart} style={{ marginTop: 16 }}>
            Restart quiz
          </button>}
        </div>
      )}

    {!result && (
  <>
    <h2
      style={{
        fontSize: "16px",
        marginBottom: "8px",
        color: "#f0ebe3",
      }}
    >
      {current.label}
    </h2>

    {current.type === "text" ? (
      <textarea
        value={answers[current.key] || ""}
        onChange={(e) => handleSingleChange(current.key, e.target.value)}
        placeholder={current.placeholder || ""}
        rows={4}
        style={{
          marginTop: "14px",
          width: "100%",
          background: "#141210",
          border: "1px solid #2a2520",
          borderRadius: "7px",
          padding: "11px 16px",
          color: "#f0ebe3",
          fontSize: "14px",
          resize: "vertical",
          boxSizing: "border-box",
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

    <div style={{ marginTop: 16 }}>
      {currentIndex > 0 && (
        <button
          onClick={handleBack}
          style={{
            marginRight: 8,
            background: "transparent",
            color: "#b0a89e",
            border: "1px solid #3a3530",
            padding: "8px 16px",
            borderRadius: "4px",
            fontSize: "13px",
            cursor: "pointer",
          }}
        >
          Back
        </button>
      )}
      <button
        onClick={handleNext}
        disabled={!canGoNext()}
        onMouseOver={(e) =>
          (e.currentTarget.style.background = "#ae4825")
        }
        onMouseOut={(e) =>
          (e.currentTarget.style.background = "#C4512A")
        }
        style={{
          background: "#C4512A",
          color: "#f0ebe3",
          border: "none",
          padding: "10px 22px",
          borderRadius: "5px",
          fontSize: "13px",
          fontFamily: "'IBM Plex Sans', sans-serif",
          fontWeight: 500,
          cursor: canGoNext() ? "pointer" : "not-allowed",
          opacity: canGoNext() ? 1 : 0.4,
          letterSpacing: "0.02em",
          transition: "background .15s",
        }}
      >
        {currentIndex === QUESTIONS.length - 1 ? "See your pattern →" : "Next →"}
      </button>
    </div>
  </>
)}

    </div>
  </>
);
}

export default App;
