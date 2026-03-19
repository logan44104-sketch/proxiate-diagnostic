// src/config/mechanisms.js
//
// Each mechanism card has:
//   key            — stable identifier for scoring engine
//   label          — full name shown in results
//   shortName      — compact label for badges / charts
//   tagline        — one-line plain-English summary
//   explanation    — base explanation (may be overridden by avatar variant)
//   severity       — { mild, moderate, severe, critical } variant copy
//   behaviours     — array of concrete first-move actions
//   doctorTrigger  — when to escalate to GP / specialist
//   avatarVariants — optional overrides keyed by demographic signal
//   scoredFrom     — which question keys feed this mechanism (for reference)

export const MECHANISMS = {

  // ═══════════════════════════════════════════════════════════════
  //  1. AIRWAY / BREATHING
  // ═══════════════════════════════════════════════════════════════
  airway: {
    key: "airway",
    label: "Airway & breathing pattern",
    shortName: "Airway",
    tagline: "Something about your breathing is breaking up your sleep from the inside.",
    keyInsight: "The tiredness isn't coming from bad sleep — it's coming from an airway that keeps partially closing while you sleep. Your brain is spending the night managing a breathing problem, not resting. You can't willpower your way out of that.",
    products: [
      {
        name: "Lofta Home Sleep Test (WatchPAT ONE)",
        type: "affiliate",
        url: "AFFILIATE_URL_PLACEHOLDER_LOFTA",
        network: "lofta.com direct or 37x",
        affiliateRate: "up to 10%",
        price: "$189",
        rationale: "FDA-cleared home sleep test with physician review included. Confirms or rules out OSA before investing in CPAP equipment. The only responsible next step for someone with strong airway signals.",
        displayLabel: "Home sleep test — physician reviewed",
        tier: "primary",
        medicalFlag: true,
        note: "Always frame as a screening tool that leads to a doctor conversation — not a diagnosis."
      },
      {
        name: "Hatch Restore 3",
        type: "affiliate",
        url: "AFFILIATE_URL_PLACEHOLDER_HATCH",
        network: "Impact",
        affiliateRate: "4-6%",
        price: "$199",
        rationale: "Side-sleeping positional cues and consistent wind-down routine support airway-friendly sleep habits while awaiting sleep study results.",
        displayLabel: "Sleep routine anchor",
        tier: "secondary",
        medicalFlag: false
      }
    ],

    explanation:
      "Your answers point toward a breathing pattern that fragments your sleep — even though you may not notice it happening. When the airway narrows or gets blocked during sleep, the brain briefly wakes you to restore airflow. These micro-arousals can happen dozens of times per hour, preventing you from reaching and sustaining the deep sleep stages your body needs to repair and recharge. You might never remember waking, but your body keeps the score.",

    severity: {
      mild:
        "Your signals are soft — things like a dry mouth or occasional snoring. It's worth addressing, but probably not urgent.",
      moderate:
        "You're showing several classic airway signs. This is likely a real contributor to how you're feeling, and it's very treatable once identified.",
      severe:
        "Your answers include some serious signals — gasping, choking, or heavy daytime drowsiness. This needs professional attention soon. A sleep study can confirm what's going on and open the door to treatment that often transforms how people feel.",
      critical:
        "Your airway signals are very strong — multiple indicators are pointing in the same direction, and some of them are safety-level concerns. Please prioritise getting an appointment with your doctor and requesting a sleep study referral. This is one of the most treatable conditions in sleep medicine, and people with your pattern often describe treatment as life-changing. Don't sit on this one.",
    },

    behaviours: [
      "Sleep on your side for the next 7 nights — a tennis ball taped inside the back of an old t-shirt can stop you rolling onto your back.",
      "Elevate the head of your bed by 10–15 cm (a wedge pillow works, or blocks under the headboard legs).",
      "If you're often congested, try a saline nasal rinse each evening before bed — cheap, no drugs, and it opens the airway.",
      "Tape your mouth lightly with surgical tape at night (look up 'mouth taping for sleep') — sounds odd, but it encourages nasal breathing and reduces dry mouth and snoring.",
    ],

    doctorTrigger:
      "Book an appointment with your doctor and mention snoring, fatigue, and any gasping or witnessed breathing pauses. Ask about a referral for a sleep study. If you're drowsy while driving, mention that specifically — it changes how urgently they'll act.",

    avatarVariants: {
      male_over45: {
        keyInsight: "The tiredness isn't coming from bad sleep — it's coming from an airway that keeps partially closing while you sleep. Your brain is spending the night managing a breathing problem, not resting. You can't willpower your way out of that.",
        explanation:
          "Your answers point toward a breathing pattern that fragments your sleep. In men over 40, this is very commonly obstructive sleep apnea (OSA) — the airway relaxes and partially collapses during sleep, causing brief awakenings you may not remember. It's extremely common, underdiagnosed, and highly treatable. Many men describe it as life-changing once it's addressed.",
      },
      female_under45: {
        keyInsight: "Sleep apnea in women rarely looks like the textbook version — no loud snoring, no obvious gasping. It shows up as exhaustion, morning headaches, and insomnia. Which means it gets missed for years. Your results suggest this is worth investigating before anything else.",
        explanation:
          "Your answers suggest your breathing may be disrupting your sleep. In younger women, this is often missed because it doesn't always look like 'classic' sleep apnea with loud snoring. It can show up as upper airway resistance syndrome (UARS) — subtle narrowing that fragments sleep without full blockages. Symptoms like fatigue, morning headaches, and brain fog are the main clues rather than dramatic snoring.",
      },
      female_perimenopause: {
        keyInsight: "Sleep apnea in women rarely looks like the textbook version — no loud snoring, no obvious gasping. It shows up as exhaustion, morning headaches, and insomnia. Which means it gets missed for years. Your results suggest this is worth investigating before anything else.",
        explanation:
          "Your answers suggest breathing disruption during sleep. Airway issues become much more common around perimenopause and menopause — falling oestrogen levels reduce muscle tone in the upper airway. If your breathing symptoms are relatively new and coincide with other hormonal changes, that connection is worth mentioning to your doctor.",
        doctorTrigger:
          "Book a GP appointment and mention these specific signals: morning headaches that clear within 30 minutes of getting up, dry mouth on waking, waking to urinate at night, and fatigue that doesn't improve with more sleep. In women, sleep apnea often presents without snoring — these signals are enough to warrant investigation. Ask about a home sleep test referral, or look into direct-to-consumer home sleep tests ($150–300 in the US, no referral required). If you have PCOS, mention it specifically — it increases OSA risk significantly.",
      },
    },

    scoredFrom: ["q3", "q8", "q13.gasping", "q13.orthopnea", "q0b_wake_causes.breathing", "knownConditions.apnea", "knownConditions.asthma"],
  },


  // ═══════════════════════════════════════════════════════════════
  //  2. CIRCADIAN MISMATCH
  // ═══════════════════════════════════════════════════════════════
  circadian: {
    key: "circadian",
    label: "Circadian mismatch pattern",
    shortName: "Circadian",
    tagline: "Your body clock and your alarm clock are fighting each other.",
    keyInsight: "You don't have a sleep problem — you have a timing problem. Your brain isn't broken; it's on a different schedule than your life. Trying harder to sleep earlier won't fix it. Shifting your body clock will.",
    products: [
      {
        name: "Carex Day-Light Elite",
        type: "affiliate",
        url: "AFFILIATE_URL_PLACEHOLDER_CAREX",
        network: "Awin",
        affiliateRate: "verify with Awin before publishing",
        price: "$79-$99",
        rationale: "Delivers the clinically validated 10,000 lux dose needed for actual circadian phase-shifting. Not just a wake light — this is the tool used in the clinical trials that established bright light therapy as a first-line treatment.",
        displayLabel: "Morning light therapy lamp — 10,000 lux",
        tier: "primary",
        medicalFlag: false,
        note: "Morning use only within 60 minutes of waking. Contraindicated in bipolar disorder without psychiatric supervision."
      },
      {
        name: "Hatch Restore 3",
        type: "affiliate",
        url: "AFFILIATE_URL_PLACEHOLDER_HATCH",
        network: "Impact",
        affiliateRate: "4-6%",
        price: "$199",
        rationale: "Best option for users who need both a morning light anchor and a structured wind-down routine. Sunrise simulation + sound library + app-controlled bedtime schedule in one device.",
        displayLabel: "Sunrise alarm + sleep routine",
        tier: "secondary",
        medicalFlag: false
      },
      {
        name: "Philips SmartSleep Wake-Up Light (HF3520)",
        type: "affiliate",
        url: "AFFILIATE_URL_PLACEHOLDER_PHILIPS_SMARTSLEEP",
        network: "Amazon Associates",
        affiliateRate: "standard Amazon rate",
        price: "$69-$99",
        rationale: "Clinically proven sunrise simulation that reduces sleep inertia — the groggy dysphoric state on waking that worsens circadian misalignment. Best for users who need a reliable morning anchor cue.",
        displayLabel: "Sunrise simulation alarm",
        tier: "tertiary",
        medicalFlag: false
      }
    ],

    explanation:
      "Your answers suggest a mismatch between when your body naturally wants to sleep and when life requires you to sleep. This is called circadian misalignment — and it's one of the most common and most fixable causes of non-restorative sleep. When you force sleep at the wrong biological time, you can spend 8 hours in bed and still wake feeling like you got 4, because the sleep stages don't line up with your body's internal rhythm.",

    severity: {
      mild:
        "You have a small drift — maybe an hour or so between your weekday and weekend timing. Small adjustments to light exposure and schedule consistency can close this gap.",
      moderate:
        "There's a meaningful gap between your body's preferred rhythm and your required schedule. This is probably a real contributor to how you feel, and it responds well to structured changes.",
      severe:
        "Your timing is significantly misaligned — either through shift work, a very strong night-owl tendency, or a chaotic schedule. This level of mismatch affects mood, metabolism, and immune function beyond just tiredness.",
      critical:
        "Your body clock and your life are in serious conflict. At this level of misalignment, you're essentially living in a permanent state of jet lag — and that has consequences well beyond tiredness. This is worth discussing with a doctor who understands circadian disorders. If you're doing shift work, push hard for schedule accommodations — the health impacts of chronic circadian disruption are significant.",
    },

    behaviours: [
      "Get bright light (ideally sunlight) within 30 minutes of waking — this is the single most powerful circadian reset signal your body has.",
      "Keep your wake time within a 1-hour window 7 days a week, even on weekends. Yes, even if you went to bed late. The wake time anchors everything else.",
      "Dim lights and reduce screen brightness 60–90 minutes before your target bedtime — your brain interprets bright light as 'daytime' and delays sleep onset.",
      "If you're a strong night owl forced into early mornings, don't fight it by going to bed earlier — go to bed when you're actually sleepy and wake at the same time. The window will gradually shift.",
    ],

    doctorTrigger:
      "If you do shift work or rotating rosters, ask your doctor about shift-work sleep disorder — there are specific strategies and sometimes short-term medication that can help. If your natural rhythm is dramatically delayed (e.g. can't sleep before 3–4 am) despite consistent effort, ask about delayed sleep phase disorder.",

    avatarVariants: {
      age_18_24: {
        explanation:
          "Your answers suggest your body clock and your schedule are out of sync. This is extremely common in your age group — biological changes in adolescence and early adulthood push the body clock later, so wanting to sleep at 1 am and wake at 9 am isn't laziness, it's physiology. But when university or work demands a 7 am alarm, you end up chronically cutting into the tail end of your sleep, which is where a lot of the restorative work happens.",
        behaviours: [
          "Get bright light (ideally sunlight) within 30 minutes of waking — this is the most powerful tool you have for pulling your body clock earlier.",
          "Keep your wake time within a 1-hour window 7 days a week. Sleeping until noon on weekends feels good in the moment but resets your clock to 'late mode' and makes Monday brutal.",
          "Set a phone alarm for 'screens off' 60 minutes before your target bedtime. If scrolling is the problem, charge your phone outside the bedroom.",
          "If you can choose your schedule (e.g. class times, work shifts), lean into your natural rhythm rather than fighting it — a later start you're consistent with beats an early start you can't sustain.",
        ],
      },
      shift_worker: {
        explanation:
          "Your answers reflect the particular challenge of shift work. Rotating or night shifts force your body to sleep during a time it's biologically programmed to be awake, and vice versa. No amount of sleep hygiene can fully override this — it's a structural conflict between your schedule and your biology. But there are evidence-based strategies that make a real difference.",
        behaviours: [
          "Wear blue-light-blocking glasses on your drive home from a night shift — this prevents morning sunlight from telling your brain it's daytime when you're about to sleep.",
          "Make your sleep environment as dark as possible: blackout curtains, eye mask, phone on silent.",
          "If your roster rotates, push for forward rotation (days → evenings → nights) rather than backward — it's easier on your body clock.",
          "On days off, try to keep at least one sleep period that overlaps with your shift-sleep window rather than fully flipping back to a daytime schedule.",
        ],
      },
    },

    scoredFrom: ["q12_bed_worknight", "q12_bed_freenight", "q12_wake", "q12b_chronotype", "q10b_latency_variance"],
  },


  // ═══════════════════════════════════════════════════════════════
  //  3. INSUFFICIENT SLEEP DURATION
  // ═══════════════════════════════════════════════════════════════
  duration: {
    key: "duration",
    label: "Not enough sleep opportunity",
    shortName: "Duration",
    tagline: "You're not giving your body enough hours to do the repair work it needs.",
    keyInsight: "Your body isn't malfunctioning — it's just not getting enough time to finish the job. Deep restorative sleep happens in the later cycles of the night. When those get cut short by an alarm, you miss exactly the stages that make sleep feel like it worked.",
    products: [
      {
        name: "Oura Ring Gen 4",
        type: "affiliate",
        url: "AFFILIATE_URL_PLACEHOLDER_OURA",
        network: "Impact",
        affiliateRate: "$10 flat or 5-10% depending on tier",
        price: "$299-$349 + $5.99/month",
        rationale: "Highest clinical accuracy of any consumer sleep tracker for four-stage sleep staging (Cohen's kappa 0.65 vs PSG). The readiness score directly communicates sleep debt impact in actionable terms — converts abstract 'I should sleep more' into objective data that motivates change.",
        displayLabel: "Sleep tracker — clinical accuracy",
        tier: "primary",
        medicalFlag: false,
        note: "Frame as awareness tool, not a nightly report card. Warn against orthosomnia (sleep tracking anxiety)."
      },
      {
        name: "WHOOP 5.0",
        type: "affiliate",
        url: "AFFILIATE_URL_PLACEHOLDER_WHOOP",
        network: "Impact",
        affiliateRate: "$50 flat",
        price: "$239/year (no hardware cost)",
        rationale: "No upfront hardware cost. Best for users who want the widest recovery metrics alongside sleep. 14-day battery and real-time stress monitoring.",
        displayLabel: "Recovery + sleep tracker",
        tier: "secondary",
        medicalFlag: false
      },
      {
        name: "Fitbit Charge 6",
        type: "affiliate",
        url: "AFFILIATE_URL_PLACEHOLDER_FITBIT",
        network: "Amazon Associates",
        affiliateRate: "standard Amazon rate",
        price: "$99-$140",
        rationale: "Best budget option. No required subscription. Scores 0.55 kappa against PSG — still delivers 80% of the tracking value at a fraction of the cost. Sufficient for users who simply need to see their total sleep time objectively.",
        displayLabel: "Sleep tracker — budget option",
        tier: "tertiary",
        medicalFlag: false
      }
    ],

    explanation:
      "Your answers suggest you may simply not be spending enough time asleep — even if it feels like you're in bed for long enough. When total sleep drops below what your body needs (which for most adults is 7–9 hours of actual sleep), the first thing to go is the deep restorative stages. Your brain triages — it keeps the essential survival sleep but cuts the recovery and memory-consolidation stages. The result is exactly what you're describing: technically sleeping, but waking unrefreshed.",

    severity: {
      mild:
        "You're probably running a small sleep deficit — maybe 30–60 minutes short most nights. That accumulates across a week into a meaningful debt.",
      moderate:
        "You're likely getting significantly less sleep than your body needs. At this level, the effects on focus, mood, and physical recovery are measurable.",
      severe:
        "Your sleep opportunity is very short. This level of restriction affects immune function, emotional regulation, reaction time, and long-term health. It deserves attention as a priority.",
      critical:
        "You're running on severely insufficient sleep. At this level, your cognitive impairment is comparable to being legally drunk — reaction times, decision-making, and emotional regulation are all significantly affected. If you drive or operate machinery, this is a safety issue right now. Finding more sleep time needs to be treated as a health emergency, not a lifestyle goal.",
    },

    behaviours: [
      "Move your bedtime 20 minutes earlier for one week, then another 20 minutes the following week. Gradual shifts stick; dramatic ones don't.",
      "Protect your sleep window the way you'd protect a meeting — it goes in the calendar and other things move around it, not the other way around.",
      "Track your actual lights-off to alarm-off time for 7 days. Many people overestimate their sleep by 45–90 minutes because they count 'time in bed' not 'time asleep'.",
      "If your schedule genuinely doesn't allow more sleep (e.g. long commute + early start + family obligations), that's not a personal failure — it's a structural problem worth problem-solving with a partner, employer, or counsellor.",
    ],

    doctorTrigger:
      "If you're sleeping less than 6 hours most nights and can't change that due to life circumstances, your doctor can help you optimise the sleep you do get and monitor for health impacts.",

    avatarVariants: {
      parent_young_kids: {
        explanation:
          "Your answers suggest you're not getting enough total sleep — and caring for young kids is almost certainly a big part of that. Fragmented, shortened sleep is the norm when you have little ones, and the effects are cumulative. This isn't about 'trying harder' at sleep — it's about survival-mode logistics and protecting whatever sleep you can get.",
        behaviours: [
          "If you have a partner, discuss splitting the night into shifts rather than both of you waking every time — one person covers 9 pm–2 am, the other 2 am–7 am.",
          "Nap when you can, even 20 minutes. The research on 'nap when the baby naps' is solid — it doesn't replace a full night but it reduces the deficit.",
          "Lower your standards for everything else. Seriously. Sleep is more important than a clean kitchen right now.",
          "If the exhaustion is affecting your ability to function safely (driving, caring for your child), that's worth a conversation with your doctor — not because something is 'wrong' with you, but because there may be support options you're not aware of.",
        ],
      },
      overcommitted_professional: {
        explanation:
          "Your answers suggest you're not giving your body enough time to sleep, likely because your schedule is packed. High performers often treat sleep as the flexible variable — the thing that shrinks when everything else expands. But sleep is the foundation that everything else runs on. The irony is that the work you're staying up to finish would take less time and be higher quality if you slept more.",
      },
    },

    scoredFrom: ["q1", "q12_bed_worknight", "q12_wake", "q0c_fatigue_shape"],
  },


  // ═══════════════════════════════════════════════════════════════
  //  4. MIND / STRESS / HYPERAROUSAL
  // ═══════════════════════════════════════════════════════════════
  mind_stress: {
    key: "mind_stress",
    label: "Stress & hyperarousal pattern",
    shortName: "Stress / arousal",
    tagline: "Your nervous system isn't switching off when it's time to sleep.",
    keyInsight: "This isn't a sleep problem — it's a nervous system problem that happens to show up at bedtime. Your brain has learned to treat the night as a threat window. Until it learns otherwise, no amount of sleep hygiene will reliably override it.",
    products: [
      {
        name: "Momentous Sleep Stack (Mag L-Threonate + L-Theanine + Apigenin)",
        type: "affiliate",
        url: "AFFILIATE_URL_PLACEHOLDER_MOMENTOUS_STACK",
        network: "CJ Affiliate",
        affiliateRate: "15% + $35 new customer bonus",
        price: "$75-$90/month",
        rationale: "Three-pathway approach to hyperarousal: magnesium modulates cortisol and supports GABA, L-theanine promotes alpha wave activity without sedation, apigenin acts as a mild GABA-A agonist. NSF certified. Best intersection of evidence, certification, and affiliate economics in this category.",
        displayLabel: "Sleep supplement stack — hyperarousal formula",
        tier: "primary",
        medicalFlag: false,
        note: "Always lead with CBT-I techniques and free behaviour changes. Frame supplements as supporting the conditions for sleep, not making you sleep. L-theanine may interact with blood pressure medications."
      },
      {
        name: "Momentous KSM-66 Ashwagandha",
        type: "affiliate",
        url: "AFFILIATE_URL_PLACEHOLDER_MOMENTOUS_ASHWAGANDHA",
        network: "CJ Affiliate",
        affiliateRate: "15%",
        price: "$35-$45/month",
        rationale: "Multiple RCTs show 600mg/day reduces waking cortisol by 27-32% and shortens sleep latency by 15-35 minutes in stressed individuals. Best evidence-backed single ingredient for stress-driven sleep disruption.",
        displayLabel: "Cortisol support — KSM-66 ashwagandha",
        tier: "secondary",
        medicalFlag: false,
        note: "May interact with thyroid hormone medications. Not for use during pregnancy."
      },
      {
        name: "Calm App",
        type: "affiliate",
        url: "AFFILIATE_URL_PLACEHOLDER_CALM",
        network: "Impact or 37x",
        affiliateRate: "~19-21% via 37x or $2/sub via Impact",
        price: "$70/year",
        rationale: "Guided body scans, breathing exercises, and sleep stories directly address pre-sleep hyperarousal. No tolerance, no dependency risk. Best paired with the supplement stack as the behavioural complement.",
        displayLabel: "Guided sleep & meditation app",
        tier: "tertiary",
        medicalFlag: false
      }
    ],

    explanation:
      "Your answers suggest your nervous system stays in a heightened state when it should be winding down. This isn't a willpower problem — it's a physiological one. Your stress response system (the sympathetic nervous system) is staying active, keeping cortisol elevated, heart rate up, and the brain in a vigilant mode. Deep sleep requires the opposite state. Until your body feels genuinely safe and settled, it won't let you sink into the restorative stages.",

    severity: {
      mild:
        "Your arousal levels are a bit elevated at bedtime — the classic 'takes a while to switch off' pattern. Targeted wind-down strategies should help.",
      moderate:
        "Stress and mental activation are clearly interfering with your sleep. Your body is spending significant time in a state that actively blocks deep rest.",
      severe:
        "Your nervous system appears to be in a chronic state of hypervigilance. This goes beyond normal stress — it may reflect burnout, untreated anxiety, trauma responses, or conditioned insomnia where the bed itself has become a stress trigger.",
      critical:
        "Your stress and arousal signals are extremely strong across multiple indicators. At this level, your nervous system is stuck in a chronic fight-or-flight state that won't resolve with breathing exercises alone. Please talk to your doctor about CBT-i (cognitive behavioural therapy for insomnia) — it's the gold-standard treatment for this pattern and it works better than medication. This is treatable, but it needs professional support.",
    },

    behaviours: [
      "Start a 'brain dump' journal 60–90 minutes before bed — write every open loop, worry, and to-do item on paper. The goal isn't to solve them, it's to signal to your brain that they're captured and can be released.",
      "Try a physiological sigh when you get into bed: two short inhales through the nose, one long exhale through the mouth. This directly activates the parasympathetic nervous system. Do 3–5 rounds.",
      "If you've been lying awake for more than 20 minutes, get up. Go to a dim room, do something low-stimulation (not your phone), and return to bed only when you feel sleepy. This breaks the association between bed and frustration.",
      "Audit your evening for hidden stimulation: intense TV, work emails, social media arguments, news scrolling. Each one tells your brain 'stay alert' at exactly the wrong time.",
    ],

    doctorTrigger:
      "If anxiety, racing thoughts, or an inability to relax have been persistent for more than a few weeks and are affecting your daily life, talk to your doctor about structured support — CBT for insomnia (CBT-i) has the strongest evidence base of any insomnia treatment, including medication.",

    avatarVariants: {
      conditioned_insomnia: {
        explanation:
          "Your answers suggest something specific: you may have developed conditioned insomnia — where the act of going to bed itself has become a trigger for alertness. If you notice that you feel sleepy on the couch but wide awake the moment your head hits the pillow, or you sleep better in hotels or unfamiliar beds, that's the signature. Your brain has learned to associate your bed with wakefulness and frustration. The good news is that this is one of the most treatable sleep problems that exists — CBT-i (cognitive behavioural therapy for insomnia) directly retrains this association and has a very high success rate.",
      },
      adhd_pattern: {
        explanation:
          "Your answers suggest a 'busy brain' pattern that may be connected to ADHD. The ADHD brain often has difficulty transitioning between states — including the transition from 'awake and thinking' to 'shutting down for sleep.' This isn't the same as anxiety-driven racing thoughts, even though it feels similar. The brain isn't worried — it's just... on. Stimulation-seeking, idea-generating, and resistant to the boring process of falling asleep.",
        behaviours: [
          "Try a 'boring podcast' or low-stakes audiobook at low volume — this gives the ADHD brain just enough stimulation to stop seeking its own, while being dull enough to allow sleep onset.",
          "Body-based techniques (progressive muscle relaxation, weighted blankets) often work better than cognitive techniques for ADHD brains because they bypass the busy mind.",
          "Keep a consistent pre-sleep sequence (same steps, same order, every night). The ADHD brain benefits enormously from external structure that automates the wind-down transition.",
          "If you take ADHD medication, discuss timing with your prescriber — stimulant medication too late in the day is an obvious blocker, but some people actually sleep better with a small late-afternoon dose because it reduces the evening hyperactivity.",
        ],
      },
    },

    scoredFrom: ["q5", "q10_latency", "q10b_latency_variance", "q10d_sleep_barriers.mindRacing", "q10d_sleep_barriers.cantSwitchOff", "q10d_sleep_barriers.heartPounding", "q0b_wake_causes.anxiousThoughts", "knownConditions.adhd"],
  },


  // ═══════════════════════════════════════════════════════════════
  //  5. MOOD / DEPRESSION PATTERN
  // ═══════════════════════════════════════════════════════════════
  mood: {
    key: "mood",
    label: "Mood & low-energy pattern",
    shortName: "Mood",
    tagline: "Low mood and poor sleep feed each other in a cycle that's hard to break alone.",
    keyInsight: "The fatigue you're feeling isn't just tiredness — it's what happens when your brain chemistry stops producing the motivation and energy signals that normally drive you. More sleep won't fix that. Addressing the mood is the lever that moves everything else.",
    products: [
      {
        name: "Carex Day-Light Elite",
        type: "affiliate",
        url: "AFFILIATE_URL_PLACEHOLDER_CAREX",
        network: "Awin",
        affiliateRate: "verify with Awin before publishing",
        price: "$79-$99",
        rationale: "Morning bright light therapy at 10,000 lux reduces SAD symptoms by 40-60% and is effective for non-seasonal depression when used in the morning. Simultaneously addresses mood, energy, and the sleep-mood connection. Strongest evidence-backed product for this cluster.",
        displayLabel: "Morning light therapy — mood + sleep",
        tier: "primary",
        medicalFlag: false,
        note: "Never imply this treats depression. Use language like 'supports morning energy and mood-sleep connection.' Always include GP prompt for users with persistent low mood."
      },
      {
        name: "Hatch Restore 3",
        type: "affiliate",
        url: "AFFILIATE_URL_PLACEHOLDER_HATCH",
        network: "Impact",
        affiliateRate: "4-6%",
        price: "$199",
        rationale: "Sunrise simulation reduces sleep inertia — the groggy dysphoric state on waking that is worst in depression. Full bedtime routine with sunset simulation and white noise addresses both ends of the sleep window.",
        displayLabel: "Sunrise alarm + wind-down routine",
        tier: "secondary",
        medicalFlag: false
      },
      {
        name: "Momentous Magnesium Glycinate",
        type: "affiliate",
        url: "AFFILIATE_URL_PLACEHOLDER_MOMENTOUS_MAG",
        network: "CJ Affiliate",
        affiliateRate: "15%",
        price: "$25-$35/month",
        rationale: "Magnesium deficiency is associated with both poor sleep and low mood. 2025 RCT showed secondary mood score improvements alongside sleep improvements. NSF certified. Safe, low-risk first supplement for this cluster.",
        displayLabel: "Magnesium glycinate — sleep + mood support",
        tier: "tertiary",
        medicalFlag: false
      }
    ],

    explanation:
      "Your answers suggest that mood is playing a significant role in your sleep and energy. Depression and persistent low mood don't just make you feel sad — they fundamentally alter sleep architecture, reduce time in restorative deep sleep, and produce a specific kind of fatigue that doesn't improve with more hours in bed. The relationship runs both ways: poor sleep worsens mood, and low mood worsens sleep. Breaking this cycle often requires addressing both sides at once.",

    severity: {
      mild:
        "Your mood signals are present but not dominant. Improving your sleep through other changes may lift your mood as a side effect.",
      moderate:
        "Mood appears to be a meaningful contributor to your fatigue. It's worth addressing directly alongside any sleep-specific changes.",
      severe:
        "Your answers suggest mood is a major factor. This isn't a weakness or something you should push through alone. It's a treatable condition, and getting support for it will likely improve your sleep more than any sleep-specific intervention.",
      critical:
        "Your mood signals are very strong. Please hear this clearly: what you're experiencing is a medical condition, it's extremely common, and it responds well to treatment. Talk to your doctor this week — not next month. If you're having thoughts of self-harm or that life isn't worth living, please reach out to a crisis line or your doctor today. You don't have to feel this way.",
    },

    behaviours: [
      "Get outside within 60 minutes of waking, even for 10 minutes. Morning light + gentle movement is one of the most evidence-backed mood interventions that exists.",
      "Maintain a fixed wake time even when motivation is low. When mood is pulling you toward staying in bed, the wake time becomes the anchor that prevents the sleep-mood spiral from deepening.",
      "Notice whether your energy follows the 'flat line' pattern — the same grey tiredness from waking to sleeping. If it does, that's a signal this is more mood-driven than sleep-driven, and mood-focused support may help more than sleep-focused changes.",
      "Connect with one person each day, even briefly. Isolation and fatigue reinforce each other.",
    ],

    doctorTrigger:
      "If low mood, loss of interest in things you normally enjoy, or feelings of hopelessness have been present most days for more than two weeks, please talk to your doctor. This is one of the most treatable conditions in medicine. If you're having thoughts of self-harm or that life isn't worth living, please reach out to a crisis service or your doctor as a priority.",

    avatarVariants: {
      postnatal: {
        explanation:
          "Your answers suggest mood may be a significant factor in your fatigue — and in the postnatal period, this deserves particular attention. Postnatal depression is extremely common, affecting roughly 1 in 7 new parents, and it often disguises itself as 'just being tired from the baby.' If the tiredness feels heavier than it should, if you feel disconnected from your baby or your partner, or if you've lost interest in things that normally matter to you — that's worth mentioning to your midwife or GP. There's no minimum threshold of 'bad enough' to ask for help.",
      },
      male_pattern: {
        explanation:
          "Your answers suggest mood may be playing a role in your fatigue. In men, depression often doesn't look like the stereotype of sadness and crying — it's more likely to show up as irritability, emotional numbness, loss of motivation, difficulty concentrating, and physical exhaustion that sleep doesn't fix. If this resonates, it's worth knowing that this is a medical condition, not a character flaw, and it responds well to treatment.",
      },
    },

    scoredFrom: ["q5", "q0c_fatigue_shape", "q10d_sleep_barriers.dreadOrLowMood", "q0b.earlyMorningTerminal", "q13.selfHarmThoughts", "knownConditions.depressionAnxiety"],
  },


  // ═══════════════════════════════════════════════════════════════
  //  6. SUBSTANCES
  // ═══════════════════════════════════════════════════════════════
  substances: {
    key: "substances",
    label: "Substance interference pattern",
    shortName: "Substances",
    tagline: "Something you're consuming is sabotaging your sleep from the inside.",
    keyInsight: "The thing helping you fall asleep may be the same thing making your sleep unrestorative. Alcohol, cannabis, and sleep medication all sedate — but sedation and real sleep aren't the same thing. The sleep stages your body needs most are the ones these substances suppress.",
    products: [
      {
        name: "Hatch Restore 3",
        type: "affiliate",
        url: "AFFILIATE_URL_PLACEHOLDER_HATCH",
        network: "Impact",
        affiliateRate: "4-6%",
        price: "$199",
        rationale: "Creating a consistent wind-down routine is the most powerful complement to substance cutoff. Structures the routine habit that replaces the substance cue — same time, same sequence, every night. Sound library, sunset simulation, and app scheduling do the behavioural scaffolding.",
        displayLabel: "Sleep routine anchor — habit replacement",
        tier: "primary",
        medicalFlag: false,
        note: "Sleepio (digital CBT-I) has the strongest clinical evidence for this cluster including RCT evidence showing it reduces alcohol consumption alongside insomnia. No public affiliate program — reference as a free resource separately from product recommendations."
      },
      {
        name: "Momentous Magnesium Glycinate",
        type: "affiliate",
        url: "AFFILIATE_URL_PLACEHOLDER_MOMENTOUS_MAG",
        network: "CJ Affiliate",
        affiliateRate: "15%",
        price: "$25-$35/month",
        rationale: "Supports GABA activity and nervous system regulation during the period of substance reduction. Helps address the rebound anxiety and arousal that often appears when alcohol or cannabis is reduced.",
        displayLabel: "Magnesium glycinate — nervous system support",
        tier: "secondary",
        medicalFlag: false
      },
      {
        name: "Calm App",
        type: "affiliate",
        url: "AFFILIATE_URL_PLACEHOLDER_CALM",
        network: "Impact or 37x",
        affiliateRate: "~19-21% via 37x",
        price: "$70/year",
        rationale: "Replaces the 'switching off' function that substances were serving. Guided body scans and sleep stories give the brain something to do during the transition period. No dependency risk.",
        displayLabel: "Guided sleep app — substance replacement",
        tier: "tertiary",
        medicalFlag: false
      }
    ],

    explanation:
      "Your answers suggest that one or more substances — caffeine, alcohol, cannabis, nicotine, or sleep medication — are disrupting the quality of your sleep. This doesn't mean you have a 'problem' with these substances in the addiction sense. It means their pharmacology is interfering with your sleep architecture in ways you might not notice. Alcohol, for example, helps you fall asleep faster but then fragments the second half of the night and suppresses REM sleep. Caffeine has a half-life of 5–7 hours, meaning a 2 pm coffee still has half its stimulant effect at 9 pm.",

    severity: {
      mild:
        "You're using one substance at a timing that may be affecting your sleep. A simple timing adjustment may be all you need.",
      moderate:
        "Multiple substances or problematic timing are likely contributing to your sleep quality. This is worth a focused experiment.",
      severe:
        "Your substance use pattern is a strong match for disrupted sleep architecture. If you're also relying on a substance to fall asleep, that creates a dependency cycle where the 'solution' is part of the problem.",
      critical:
        "Multiple substances used close to bedtime are very likely disrupting your sleep significantly. If you're relying on a substance to fall asleep and then using caffeine or stimulants to get through the next day, you may be in a cycle that's maintaining or worsening the problem. Please discuss this with your doctor — not because you're in trouble, but because there are supported ways to break this cycle that are much easier than going it alone.",
    },

    behaviours: [
      "Run a 2-week caffeine experiment: keep all caffeine before 10 am and see what changes. This includes tea, pre-workout, energy drinks, and dark chocolate.",
      "If you drink alcohol, try 5 consecutive alcohol-free nights and honestly compare how you feel on waking. Most people are surprised.",
      "Cannabis before bed may feel like it helps you fall asleep, but it suppresses REM sleep significantly. If you use it nightly, try alternating nights for 2 weeks and track the difference.",
      "If you're using sleeping pills or melatonin nightly, don't stop abruptly — but do discuss a gradual taper plan with your doctor, because long-term use often worsens the underlying problem.",
    ],

    doctorTrigger:
      "If you feel unable to sleep without a substance (alcohol, cannabis, or sleeping pills), or if you've tried reducing and experienced rebound insomnia, talk to your doctor about a supported taper and alternative approaches.",

    avatarVariants: {
      age_18_24: {
        behaviours: [
          "Energy drinks are the hidden caffeine bomb — a single can often has more caffeine than a double espresso, and the sugar crash afterwards masks the lingering stimulant effect. Track your intake for a week; you may be surprised.",
          "If you drink on weekends, notice the pattern: alcohol fragments sleep for 1–2 nights after, which means a Saturday night out can affect your sleep through Monday. That's not a hangover — it's disrupted sleep architecture.",
          "Vaping nicotine close to bed is a major sleep disruptor. Nicotine is a stimulant with a short half-life, which means it both delays sleep onset and can cause withdrawal micro-arousals during the night.",
          "If you use cannabis to 'switch off,' try replacing it with a 10-minute body scan or breathing exercise for 7 nights. The goal is to test whether your brain can learn to switch off without it.",
        ],
      },
    },

    scoredFrom: ["q4", "q9", "q10d_sleep_barriers.screenHooked"],
  },


  // ═══════════════════════════════════════════════════════════════
  //  7. ENVIRONMENT & BEHAVIOUR
  // ═══════════════════════════════════════════════════════════════
  environment: {
    key: "environment",
    label: "Environment & behaviour pattern",
    shortName: "Environment",
    tagline: "Your sleep environment or evening habits are working against you.",
    keyInsight: "Your brain needs unbroken continuity to cycle through deep sleep. Every disruption — noise, light, temperature, screens, a partner moving — resets that cycle. You can do everything else right and still wake exhausted if this layer isn't solved.",
    products: [
      {
        name: "Hatch Restore 3",
        type: "affiliate",
        url: "AFFILIATE_URL_PLACEHOLDER_HATCH",
        network: "Impact",
        affiliateRate: "4-6%",
        price: "$199",
        rationale: "Best all-in-one environment solution for users with combined noise and light disruption. Sound library, sunrise simulation, sunset wind-down, and app-controlled routines. Highest-leverage single purchase for the environment cluster.",
        displayLabel: "All-in-one sleep environment device",
        tier: "primary",
        medicalFlag: false
      },
      {
        name: "Eight Sleep Pod 4",
        type: "affiliate",
        url: "AFFILIATE_URL_PLACEHOLDER_EIGHTSLEEP",
        network: "CJ / 37x",
        affiliateRate: "6% (~$120+ per sale on $2K AOV)",
        price: "$1,995-$2,995 + ~$25/month",
        rationale: "Temperature is the highest-leverage single environmental variable for sleep quality. Active thermal regulation cooling the bed surface directly triggers core body temperature drop that initiates sleep onset. Best recommendation for users whose primary disruptor is overheating.",
        displayLabel: "Active temperature control — premium",
        tier: "secondary",
        medicalFlag: false,
        note: "Position as 'if you want to go deep' — not the default first recommendation. High price means lower conversion but highest dollar value per sale of any product across all 10 clusters."
      },
      {
        name: "LectroFan EVO",
        type: "affiliate",
        url: "AFFILIATE_URL_PLACEHOLDER_LECTROFAN",
        network: "Amazon Associates",
        affiliateRate: "standard Amazon rate",
        price: "$49-$60",
        rationale: "22 non-looping digital sounds — the non-looping generation is critical as repeated sound artefacts can themselves cause micro-arousals. Best dedicated white noise device for users whose primary disruptor is noise.",
        displayLabel: "White noise machine — noise disruption",
        tier: "tertiary",
        medicalFlag: false
      }
    ],

    explanation:
      "Your answers suggest that external factors — your bedroom setup, noise, temperature, screen habits, or disruptions from a partner, kids, or pets — are fragmenting your sleep. The brain needs a sustained, uninterrupted window to cycle through all sleep stages. Even brief disturbances that you don't fully wake for can reset the cycle and prevent you from reaching the deepest, most restorative stages.",

    severity: {
      mild:
        "You have one or two environmental factors that are probably worth addressing. These are often the easiest wins in the whole quiz.",
      moderate:
        "Multiple environmental factors are stacking up. Each one alone might be minor, but together they're creating a noisy, fragmented sleep environment.",
      severe:
        "Your sleep environment has significant disruption from multiple sources. Addressing these won't require a doctor — but it may require some honest conversations, practical changes, or creative problem-solving.",
      critical:
        "Your environment is severely disrupted from multiple directions — noise, temperature, screens, kids, and possibly more stacking on top of each other. At this level, no amount of internal sleep optimisation will help until the external disruptions are addressed. This may require difficult practical changes: separate sleeping arrangements, serious noise solutions, or restructuring evening routines. The good news is that environmental problems are the most fixable category in this entire quiz — they just take action, not medication.",
    },

    behaviours: [
      "Run a 7-night 'clean sleep environment' experiment: phone charges outside the bedroom, blackout curtains or an eye mask, earplugs or a white noise machine. Change everything at once, not one at a time.",
      "If your partner snores, this is a couples problem, not just their problem. A conversation about them getting assessed for sleep apnea benefits both of you.",
      "Bedroom temperature matters more than most people think. The ideal is 16–19°C (60–67°F). If you're waking hot, try lighter bedding before turning down the thermostat.",
      "If you can't put your phone down at night, try a physical alarm clock and leave the phone in another room. The first 3 nights will feel strange. By night 7, most people don't want to go back.",
    ],

    doctorTrigger:
      "If you've genuinely optimised your environment for 2–3 weeks and still wake exhausted, that's useful information — it means the problem is likely internal (airway, hormonal, etc.) and worth investigating with your doctor.",

    avatarVariants: {
      parent_young_kids: {
        explanation:
          "Your answers highlight that your sleep environment is disrupted — and with young kids, that's almost unavoidable. Night waking, co-sleeping, monitoring, and the general alertness of parenthood all fragment sleep. Some of this you can't change right now. But some of it you can optimise even within the constraints.",
        behaviours: [
          "If you're co-sleeping, make it as safe and intentional as possible rather than accidental — planned co-sleeping with proper setup leads to better sleep for both parent and child than half-asleep reactive co-sleeping.",
          "Split the night with your partner if possible (one person 'on duty' per shift) so at least one of you gets a protected block of 4–5 hours.",
          "White noise benefits you and the child — it masks household sounds that trigger light-sleep waking in both of you.",
          "Lower your expectations. Optimising sleep with young children is about harm reduction, not perfection. Protect the biggest unbroken block you can and let the rest go.",
        ],
      },
    },

    scoredFrom: ["q14_environment", "q0b_wake_causes.noise", "q10d_sleep_barriers.tooHotOrCold", "q10d_sleep_barriers.noise", "q10d_sleep_barriers.screenHooked"],
  },


  // ═══════════════════════════════════════════════════════════════
  //  8. HORMONAL / METABOLIC
  // ═══════════════════════════════════════════════════════════════
  hormonal: {
    key: "hormonal",
    label: "Hormonal & metabolic pattern",
    shortName: "Hormonal",
    tagline: "A hormonal or metabolic imbalance may be draining the quality from your sleep.",
    keyInsight: "Fatigue that doesn't respond to more sleep is often a blood test away from an explanation. Thyroid dysfunction, low ferritin, blood sugar instability, and declining testosterone all produce sleep that looks fine from the outside but delivers almost no restoration. The fix isn't sleep — it's finding what's depleted.",
    products: [
      {
        name: "Momentous Magnesium Glycinate",
        type: "affiliate",
        url: "AFFILIATE_URL_PLACEHOLDER_MOMENTOUS_MAG",
        network: "CJ Affiliate",
        affiliateRate: "15%",
        price: "$25-$35/month",
        rationale: "Modulates HPA axis activity (cortisol regulation), supports GABA activity, and is a cofactor for melatonin synthesis. 2025 RCT (largest placebo-controlled trial to date) showed significant ISI score reduction vs placebo. NSF certified.",
        displayLabel: "Magnesium glycinate — hormonal sleep support",
        tier: "primary",
        medicalFlag: false,
        note: "Contraindicated in kidney disease. Do not recommend alongside high-dose supplementation without GP guidance."
      },
      {
        name: "Everlywell Women's Health Test",
        type: "affiliate",
        url: "AFFILIATE_URL_PLACEHOLDER_EVERLYWELL_WOMENS",
        network: "Impact",
        affiliateRate: "4.8-9.6%",
        price: "$149-$199",
        rationale: "Tests oestradiol, progesterone, FSH, LH, and DHEA-S from a home finger-prick. CLIA-certified, physician-reviewed results. Removes uncertainty and motivates appropriate medical consultation. Show only to female users.",
        displayLabel: "At-home hormone panel — women",
        tier: "secondary",
        medicalFlag: true,
        showWhen: "sex === 'Female'",
        note: "Frame as 'removes uncertainty and guides your GP conversation' — not a diagnosis tool."
      },
      {
        name: "Everlywell Perimenopause Test",
        type: "affiliate",
        url: "AFFILIATE_URL_PLACEHOLDER_EVERLYWELL_PERI",
        network: "Impact",
        affiliateRate: "4.8-9.6%",
        price: "$149",
        rationale: "Specifically tests the hormonal markers most relevant to perimenopause-driven sleep disruption. Direct evidence for the female_perimenopause avatar variant.",
        displayLabel: "At-home perimenopause test",
        tier: "secondary",
        medicalFlag: true,
        showWhen: "avatarVariant === 'female_perimenopause'",
        note: "Always pair with 'discuss results with your GP' language."
      }
    ],

    explanation:
      "Your answers suggest that a hormonal or metabolic process may be undermining your sleep quality. Thyroid dysfunction, iron deficiency, blood sugar instability, and sex hormone changes can all produce sleep that looks normal from the outside but doesn't deliver the restoration your body needs. These causes are common, usually straightforward to test for, and often very treatable.",

    severity: {
      mild:
        "There are soft signals here — it's worth keeping in mind and mentioning to your doctor at your next routine visit.",
      moderate:
        "Your answers suggest a hormonal or metabolic factor is likely contributing. A targeted blood panel could confirm or rule this out relatively quickly.",
      severe:
        "Multiple indicators point toward a hormonal or metabolic driver. This is worth investigating as a priority — the sooner it's identified, the sooner it can be treated.",
      critical:
        "Your hormonal and metabolic signals are very strong — multiple risk factors and symptoms are converging. Book an appointment with your doctor this week and ask for a comprehensive blood panel: TSH, ferritin, fasting glucose or HbA1c, B12, folate, and sex hormones. Bring your quiz results or a symptom diary. This level of signal almost always has a testable, treatable cause — you just need the right blood work to confirm it.",
    },

    behaviours: [
      "Keep a 10-day log of energy levels, sleep timing, meals, and (if applicable) your menstrual cycle. Patterns in this data are extremely useful for your doctor.",
      "Stabilise blood sugar by including protein and fat with every meal, especially dinner. Large carbohydrate-heavy meals late at night can cause blood sugar swings that fragment sleep.",
      "Maintain a rock-solid wake time — even on weekends. Hormonal rhythms (cortisol, melatonin, growth hormone) are anchored to your wake time, and consistency strengthens all of them.",
      "If you suspect iron deficiency (fatigue, pale inner eyelids, restless legs, heavy periods), ask your doctor specifically for a ferritin test — a standard blood count can miss it.",
    ],

    doctorTrigger:
      "Book an appointment with your doctor and ask for a targeted blood panel: TSH (thyroid), ferritin and iron studies, fasting glucose or HbA1c, vitamin B12 and folate, and (where appropriate) sex hormones. Mention that you have persistent fatigue alongside sleep that doesn't refresh you.",

    avatarVariants: {
      female_perimenopause: {
        keyInsight: "Hormones don't just affect your mood and cycle — they directly control your sleep architecture. Progesterone is a natural sedative. Oestrogen regulates temperature and REM sleep. When these shift — through your cycle, perimenopause, or thyroid changes — sleep quietly falls apart. This isn't in your head and it isn't about trying harder.",
        explanation:
          "Your answers suggest hormonal changes may be driving your sleep disruption. During perimenopause and menopause, falling oestrogen and progesterone levels directly affect sleep architecture — progesterone is actually a natural sedative, and losing it can make sleep lighter, more fragmented, and less restorative. Night sweats, temperature dysregulation, and mood changes compound the problem. This is extremely common and very treatable, but it's often dismissed as 'just part of ageing.'",
        behaviours: [
          "Track your sleep quality alongside your cycle (if still cycling) or alongside hot flush frequency. This data helps your doctor see the hormonal connection clearly.",
          "Layer bedding so you can quickly adjust temperature during the night without fully waking.",
          "Discuss HRT (hormone replacement therapy) with your doctor. For many women in perimenopause, HRT dramatically improves sleep quality, and the risk profile is much more favourable than outdated media coverage suggests.",
          "Magnesium glycinate before bed may help with both sleep onset and muscle tension. Discuss dosage with your doctor or pharmacist.",
        ],
      },
      male_over45: {
        keyInsight: "Fatigue that doesn't respond to more sleep is often a blood test away from an explanation. Thyroid dysfunction, low ferritin, blood sugar instability, and declining testosterone all produce sleep that looks fine from the outside but delivers almost no restoration. The fix isn't sleep — it's finding what's depleted.",
        explanation:
          "Your answers point toward a possible metabolic or hormonal contributor to your fatigue. In men over 40, the most common culprits are thyroid dysfunction, iron deficiency (yes, it affects men too — especially with any GI issues), and in some cases, declining testosterone. Low testosterone doesn't just affect libido — it reduces sleep quality, energy, and recovery. A blood panel can check all of these relatively quickly.",
      },
      female_reproductive_age: {
        keyInsight: "Hormones don't just affect your mood and cycle — they directly control your sleep architecture. Progesterone is a natural sedative. Oestrogen regulates temperature and REM sleep. When these shift — through your cycle, perimenopause, or thyroid changes — sleep quietly falls apart. This isn't in your head and it isn't about trying harder.",
        explanation:
          "Your answers suggest a hormonal or metabolic factor may be at play. In women of reproductive age, iron deficiency is extremely common (especially with heavy periods) and is one of the most underdiagnosed causes of fatigue and poor sleep. Thyroid disorders also peak in this age group. Both are simple to test for and highly treatable. If your fatigue fluctuates with your menstrual cycle, that's an important detail to mention to your doctor.",
      },
    },

    scoredFrom: ["knownConditions.thyroid", "knownConditions.diabetes", "knownConditions.ironDeficiency", "knownConditions.perimenopause", "q0c_fatigue_shape", "q0b_wake_causes.hotOrSweaty", "q6", "q7"],
  },


  // ═══════════════════════════════════════════════════════════════
  //  9. MOVEMENT / PAIN / NOCTURIA
  // ═══════════════════════════════════════════════════════════════
  movement: {
    key: "movement",
    label: "Movement, pain & nocturia pattern",
    shortName: "Movement / pain",
    tagline: "Physical discomfort or restlessness is pulling you out of deep sleep.",
    keyInsight: "Your sleep isn't light because you're a light sleeper — it's light because your body keeps triggering micro-arousals to deal with physical discomfort. You don't remember most of them. But each one resets your sleep cycle and prevents you from reaching the stages where real recovery happens.",
    products: [
      {
        name: "Everlywell At-Home Ferritin Test",
        type: "affiliate",
        url: "AFFILIATE_URL_PLACEHOLDER_EVERLYWELL_FERRITIN",
        network: "Impact",
        affiliateRate: "4.8-9.6%",
        price: "$69",
        rationale: "AASM recommends treating RLS patients with ferritin under 75 ng/mL with oral iron. Iron deficiency is often curative for RLS. Testing before supplementing is the only responsible recommendation — do not suggest iron supplements without knowing ferritin levels first.",
        displayLabel: "At-home ferritin test — restless legs",
        tier: "primary",
        medicalFlag: true,
        note: "Never recommend iron supplementation based on this result alone — that requires physician guidance. Frame strictly as 'the first step before anything else.'"
      },
      {
        name: "Momentous Magnesium Glycinate",
        type: "affiliate",
        url: "AFFILIATE_URL_PLACEHOLDER_MOMENTOUS_MAG",
        network: "CJ Affiliate",
        affiliateRate: "15%",
        price: "$25-$35/month",
        rationale: "For users without confirmed iron deficiency, magnesium modulates NMDA receptors and reduces peripheral neuromuscular excitability. Secondary evidence-based option for restless sensations and muscle tension at night.",
        displayLabel: "Magnesium glycinate — muscle tension support",
        tier: "secondary",
        medicalFlag: false
      },
      {
        name: "Oura Ring Gen 4",
        type: "affiliate",
        url: "AFFILIATE_URL_PLACEHOLDER_OURA",
        network: "Impact",
        affiliateRate: "$10 flat or 5-10%",
        price: "$299-$349 + $5.99/month",
        rationale: "For users whose movement issue is low physical activity rather than RLS — tracks daily steps and exercise and correlates them with sleep quality the following night. Builds the feedback loop between movement and sleep that motivates behaviour change.",
        displayLabel: "Activity + sleep tracker",
        tier: "tertiary",
        medicalFlag: false,
        showWhen: "primaryMovementIssue === 'low_activity'"
      }
    ],

    explanation:
      "Your answers indicate that physical symptoms — restless legs, pain, teeth grinding, or frequent bathroom trips — are fragmenting your sleep. These aren't just annoyances; each one triggers a micro-arousal that resets your sleep cycle. Even if you fall back asleep quickly, you lose the continuity that deep restorative sleep requires. The good news is that most of these have specific, targeted interventions.",

    severity: {
      mild:
        "One physical factor is occasionally disrupting your sleep. Targeted adjustments may resolve it without medical help.",
      moderate:
        "Physical disruptions are a regular feature of your nights. This is worth addressing — these symptoms are very treatable once identified.",
      severe:
        "Multiple physical symptoms are breaking up your sleep frequently. At this level, your doctor should be involved to investigate underlying causes and discuss targeted treatment.",
      critical:
        "Physical symptoms are severely fragmenting your sleep from multiple angles. At this level, self-management isn't enough — you need your doctor to investigate the underlying causes. Restless legs may need iron supplementation or medication. Chronic pain may need a revised management plan. Frequent nocturia needs investigation for underlying conditions. Book an appointment and go through each symptom specifically.",
    },

    behaviours: [
      "If restless legs are the issue: cut caffeine entirely for 2 weeks (RLS and caffeine are strongly linked), and try a gentle 10-minute leg stretch routine before bed.",
      "If pain wakes you: review your mattress and pillow setup. A mattress that's too firm or too soft creates pressure points. A pillow between the knees (side sleepers) or under the knees (back sleepers) can reduce back and hip pain significantly.",
      "If you're waking to urinate 2+ times: reduce fluids in the last 2 hours before bed, and cut evening alcohol (it's a diuretic). If it persists, it's worth a check with your doctor — nocturia can signal prostate issues, diabetes, or heart function changes.",
      "If you grind your teeth: a custom night guard from your dentist protects your teeth, but the grinding itself is often driven by stress or airway issues. Mention it to your doctor as well as your dentist.",
    ],

    doctorTrigger:
      "If restless legs, nocturia, significant pain, or jaw/teeth symptoms are happening most nights, book an appointment with your doctor. Restless legs syndrome has specific treatments (sometimes as simple as iron supplementation). Frequent nocturia needs investigation. Chronic pain management can be optimised for nighttime.",

    avatarVariants: {
      male_over45: {
        behaviours: [
          "If nocturia is your main issue, mention it specifically to your doctor. In men over 40, frequent nighttime urination is often prostate-related and very treatable.",
          "If restless legs are the issue, ask your doctor to check your ferritin (iron stores). Even ferritin levels in the 'normal' range but below 75 can drive RLS symptoms.",
          "Review any blood pressure medications you're taking — some (especially diuretics) can worsen nocturia. Your doctor can often switch to an alternative.",
          "If pain is the issue, consider whether your exercise or physical work routine is contributing. A physiotherapist who understands sleep can help optimise your daytime activity to reduce nighttime pain.",
        ],
      },
    },

    scoredFrom: ["q11", "q0b_wake_causes.pain", "q0b_wake_causes.bathroom", "q10d_sleep_barriers.cantGetComfortable", "q10d_sleep_barriers.painOrDiscomfort", "knownConditions.chronicPain"],
  },


  // ═══════════════════════════════════════════════════════════════
  //  10. SYSTEMIC / POST-VIRAL / RARE
  // ═══════════════════════════════════════════════════════════════
  systemic: {
    key: "systemic",
    label: "Systemic fatigue pattern",
    shortName: "Systemic",
    tagline: "Your fatigue may be driven by something deeper than sleep mechanics.",
    keyInsight: "When fatigue persists regardless of how much you sleep, the problem usually isn't in your sleep — it's in what's driving the fatigue upstream. Sleep is where the body recovers, but if something systemic is constantly creating damage to recover from, sleep can't keep up. More sleep isn't the answer. Finding the source is.",
    products: [
      {
        name: "Everlywell Vitamin D & Inflammation Test",
        type: "affiliate",
        url: "AFFILIATE_URL_PLACEHOLDER_EVERLYWELL_VITD",
        network: "Impact",
        affiliateRate: "4.8-9.6%",
        price: "$49",
        rationale: "Vitamin D deficiency is one of the most common and correctable causes of fatigue and disrupted sleep. Tests 25-hydroxyvitamin D (clinical gold standard) and hs-CRP (systemic inflammation marker). Lowest barrier to entry, highest population prevalence of the deficiency. Best first test for the systemic cluster.",
        displayLabel: "Vitamin D + inflammation test",
        tier: "primary",
        medicalFlag: true,
        note: "Never recommend specific supplement doses based on test output — that requires physician guidance. Do not recommend self-supplementation above 4,000 IU/day."
      },
      {
        name: "Everlywell Thyroid Test",
        type: "affiliate",
        url: "AFFILIATE_URL_PLACEHOLDER_EVERLYWELL_THYROID",
        network: "Impact",
        affiliateRate: "4.8-9.6%",
        price: "$99",
        rationale: "Hypothyroidism is a common systematically underdiagnosed cause of fatigue, poor sleep, and weight changes. Tests TSH, free T3, and free T4 — the standard clinical panel. If fatigue and sleep disruption don't respond to standard sleep hygiene, thyroid is worth ruling out.",
        displayLabel: "At-home thyroid test",
        tier: "secondary",
        medicalFlag: true,
        note: "Thyroid disease requires physician management. Do not suggest treatment. Borderline TSH values require clinical context."
      },
      {
        name: "Everlywell Sleep & Stress Test",
        type: "affiliate",
        url: "AFFILIATE_URL_PLACEHOLDER_EVERLYWELL_SLEEP_STRESS",
        network: "Impact",
        affiliateRate: "4.8-9.6%",
        price: "$149",
        rationale: "Diurnal cortisol profile (4x), DHEA-S, and melatonin. Identifies HPA axis dysregulation patterns — low flat cortisol indicates exhaustion pattern, high evening cortisol indicates hyperarousal. Most relevant for post-viral and autoimmune avatar variants.",
        displayLabel: "Sleep hormone + cortisol panel",
        tier: "tertiary",
        medicalFlag: true,
        showWhen: "flags.includes('post_viral') || knownConditions.autoimmune"
      }
    ],

    explanation:
      "Your answers suggest a pattern where fatigue persists regardless of how much you sleep or how well you manage your sleep habits. This points toward a systemic cause — something affecting your body as a whole rather than your sleep specifically. Post-viral fatigue (including long COVID), ME/CFS-spectrum conditions, autoimmune inflammation, and other whole-body processes can produce exactly this pattern: sleep that should be enough but never restores you.",

    severity: {
      mild:
        "You have some features of systemic fatigue but they're not dominant. It's worth keeping in mind, especially if other improvements don't help as expected.",
      moderate:
        "Your pattern has clear systemic features. It's important to get a thorough medical work-up before attributing this to 'bad sleep habits.'",
      severe:
        "Your answers strongly suggest a systemic driver. This needs medical investigation as a priority. The fatigue you're experiencing is not something you can fix with sleep hygiene alone, and anyone who tells you to 'just sleep better' is missing the point.",
      critical:
        "Your pattern is a very strong match for a systemic or whole-body condition driving your fatigue. This is beyond the scope of sleep advice — you need a thorough medical investigation. Please see your GP and request a comprehensive work-up including bloods, inflammatory markers, and a detailed history of when this started and what makes it worse. If you've already seen a GP who dismissed your symptoms, seek a second opinion. What you're describing is real, it's medical, and it deserves proper investigation.",
    },

    behaviours: [
      "Learn about pacing: spread your energy across the day and week instead of pushing through on good days and crashing on bad ones. The 'boom and bust' cycle worsens systemic fatigue.",
      "Keep a detailed symptom diary for 2 weeks: energy levels (rated 1–10) at morning, midday, and evening, plus any crashes and what preceded them. This is invaluable for your doctor.",
      "Maintain a gentle, consistent sleep-wake schedule even if sleep feels unrefreshing. The structure supports your circadian and immune systems even when it doesn't feel like it's 'working.'",
      "Be very cautious with exercise. If you feel worse 24–48 hours after physical activity (post-exertional malaise), that's an important signal — don't push through it. Mention it to your doctor.",
    ],

    doctorTrigger:
      "See your doctor for a comprehensive work-up. Ask specifically about: full blood count, inflammatory markers (CRP, ESR), thyroid function, liver and kidney function, coeliac screen, and vitamin D. Mention the duration and pattern of your fatigue, especially if it started after a viral illness, and especially if exercise makes you worse in the following days.",

    avatarVariants: {
      post_viral: {
        explanation:
          "Your answers — combined with a fatigue that started after a viral illness — point toward post-viral fatigue. This is a recognised medical condition where the immune system remains dysregulated after an infection (COVID, glandular fever/mono, flu, and others can all trigger it). It's not 'in your head,' it's not deconditioning, and it's not something you can push through. Understanding what it is and learning to manage within your energy limits is the first step.",
        behaviours: [
          "The most important rule: if physical or mental exertion reliably makes you worse 24–48 hours later, respect that signal. This is called post-exertional malaise and it's the hallmark of post-viral fatigue syndromes.",
          "Rest proactively, not reactively. Don't wait until you crash to rest — build rest breaks into your day before you need them.",
          "Maintain basic sleep structure (consistent times, dark room) but don't expect sleep alone to fix the fatigue. The problem is upstream of sleep.",
          "Connect with a doctor who takes post-viral fatigue seriously. If your current doctor dismisses it, seek a second opinion. Online communities (e.g. long COVID support groups) can help you find informed practitioners in your area.",
        ],
      },
      autoimmune: {
        explanation:
          "Your answers suggest your fatigue may be connected to an autoimmune or inflammatory condition. Autoimmune diseases produce a specific kind of bone-deep exhaustion that doesn't respond to sleep — because the fatigue is driven by chronic immune activation, not by poor sleep mechanics. Managing the underlying condition is the primary lever; sleep optimisation helps but won't resolve it alone.",
      },
    },

    scoredFrom: ["q0c_fatigue_shape", "q6", "q7", "q13.weightLossFeverSweats", "q2", "knownConditions.autoimmune", "knownConditions.ironDeficiency"],
  },
};


// ═══════════════════════════════════════════════════════════════
//  AVATAR RESOLUTION HELPER
// ═══════════════════════════════════════════════════════════════
//
//  Use this function to resolve the correct variant for a user
//  based on their demographic signals. Falls back to base copy
//  if no matching variant exists.
//
//  Usage:
//    const card = resolveMechanism("airway", {
//      sex: "Female",
//      ageBand: "35–44",
//      knownConditions: ["perimenopause"],
//      specialCase: "Neither",
//      q7: "A viral illness (COVID, flu, mono, etc.)",
//    });
//
export function resolveMechanism(mechanismKey, userProfile) {
  const base = MECHANISMS[mechanismKey];
  if (!base) return null;

  const variant = pickVariant(mechanismKey, userProfile);

  if (!variant) return base;

  // Merge: variant fields override base fields, but only where present
  return {
    ...base,
    explanation: variant.explanation || base.explanation,
    behaviours: variant.behaviours || base.behaviours,
    // severity and doctorTrigger stay base unless variant specifies them
    severity: variant.severity || base.severity,
    doctorTrigger: variant.doctorTrigger || base.doctorTrigger,
  };
}

function pickVariant(mechanismKey, profile) {
  const mech = MECHANISMS[mechanismKey];
  if (!mech.avatarVariants) return null;

  const { sex, ageBand, knownConditions = {}, specialCase, q7 } = profile;
  const kc = knownConditions || {};
  const age = parseAgeRange(ageBand);
  const isFemale = sex === "Female";
  const isMale = sex === "Male";
  const conditions = new Set(Object.keys(kc).filter(k => kc[k]));
  const hasPerimenopauseSignals =
    ['nightSweats', 'hotFlashes', 'irregularPeriods', 'moodChanges']
      .some(k => profile.q_perimenopause?.[k]);

  // Priority-ordered variant selection per mechanism
  const variants = mech.avatarVariants;

  // Mechanism-specific selection logic
  switch (mechanismKey) {
    case "airway":
      if (isFemale && hasPerimenopauseSignals) return variants.female_perimenopause;
      if (isFemale && age < 45) return variants.female_under45;
      if (isMale && age >= 45) return variants.male_over45;
      break;

    case "circadian":
      if (profile.q12_schedule === "Shift work or rotating roster") return variants.shift_worker;
      if (age <= 24) return variants.age_18_24;
      break;

    case "duration":
      if (specialCase === "Currently pregnant" || profile.specialCase_caregiver === "Yes — and they wake me most nights")
        return variants.parent_young_kids;
      // Could add overcommitted_professional detection via
      // sleep duration + late bedtime + early alarm heuristic
      break;

    case "mind_stress":
      if (conditions.has("adhd")) return variants.adhd_pattern;
      // conditioned_insomnia variant could be triggered by
      // q10c_latency_more free text analysis or specific answer patterns
      break;

    case "mood":
      if (specialCase === "Currently pregnant" || profile.specialCase_caregiver === "Yes — and they wake me most nights")
        return variants.postnatal;
      if (isMale) return variants.male_pattern;
      break;

    case "substances":
      if (age <= 24) return variants.age_18_24;
      break;

    case "environment":
      if (profile.specialCase_caregiver === "Yes — and they wake me most nights") return variants.parent_young_kids;
      break;

    case "hormonal":
      if (isFemale && hasPerimenopauseSignals) return variants.female_perimenopause;
      if (isFemale && age >= 18 && age < 45) return variants.female_reproductive_age;
      if (isMale && age >= 45) return variants.male_over45;
      break;

    case "movement":
      if (isMale && age >= 45) return variants.male_over45;
      break;

    case "systemic":
      if (q7 && q7.includes("viral")) return variants.post_viral;
      if (conditions.has("autoimmune")) return variants.autoimmune;
      break;

    default:
      break;
  }

  return null;
}

function parseAgeRange(ageBand) {
  const map = {
    "18–24": 21, "25–34": 30, "35–44": 40,
    "45–54": 50, "55–64": 60, "65+": 70,
  };
  return map[ageBand] || 35;
}