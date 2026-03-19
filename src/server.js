require("dotenv").config();
const express = require("express");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "build")));

const MAILERLITE_API_KEY = process.env.REACT_APP_MAILERLITE_API_KEY;

const GROUP_IDS = {
  bucket_airway:      "182134540768117804",
  bucket_circadian:   "182134550377269213",
  bucket_duration:    "181972929144161866",
  bucket_environment: "182134569578792517",
  bucket_hormonal:    "182134598894880249",
  bucket_mind_stress: "181973218063550289",
  bucket_mood:        "182134606460356529",
  bucket_movement:    "181972633683756744",
  bucket_substances:  "182134563170944222",
  bucket_systemic:    "182134618849281140",
  sex_male:           "182135079166805053",
  sex_female:         "182134584265147601",
};

app.post("/api/subscribe", async (req, res) => {
  console.log("subscribe endpoint hit", req.body);

  const { email, bucket, sex, top_pattern, pattern_score, second_pattern } = req.body;

  const groups = [GROUP_IDS[bucket]].filter(Boolean);

  if (bucket === "bucket_airway" || bucket === "bucket_hormonal") {
    const sexLower = (sex || "").toLowerCase();
    if (sexLower === "male"   && GROUP_IDS.sex_male)   groups.push(GROUP_IDS.sex_male);
    if (sexLower === "female" && GROUP_IDS.sex_female) groups.push(GROUP_IDS.sex_female);
  }

  try {
    const response = await fetch("https://connect.mailerlite.com/api/subscribers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${MAILERLITE_API_KEY}`
      },
      body: JSON.stringify({ email, groups, fields: { top_pattern, pattern_score, second_pattern } })
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("MailerLite error", response.status, errorBody);
      return res.status(500).json({ error: "Subscribe failed" });
    }
    res.json({ success: true });
  } catch (err) {
    console.error("Subscribe fetch threw:", err);
    res.status(500).json({ error: "Subscribe failed" });
  }
});

app.post("/api/claude", async (req, res) => {
  const apiKey = process.env.REACT_APP_ANTHROPIC_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Anthropic API key not configured" });
  }

  try {
    const { model, max_tokens, system, messages } = req.body;

    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({ model, max_tokens, system, messages }),
    });

    const upstreamBody = await upstream.json();

    if (!upstream.ok) {
      return res.status(upstream.status).json(upstreamBody);
    }

    res.json(upstreamBody);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/{*path}", (_req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(3001, () => console.log("Server running on port 3001"));
