module.exports = async function handler(req, res) {
  console.log("[subscribe] function called", { method: req.method });

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, bucket } = req.body;
  console.log("[subscribe] received", { email, bucket });

  if (!email || !bucket) {
    return res.status(400).json({ error: "Missing email or bucket" });
  }

  const apiKey = process.env.REACT_APP_MAILERLITE_API_KEY;
  const baseUrl = "https://connect.mailerlite.com/api";
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${apiKey}`,
  };

  try {
    // Step 1: Find or create the group
    const groupsRes = await fetch(`${baseUrl}/groups`, { headers });
    const groupsBody = await groupsRes.json();
    console.log("[subscribe] groups response", JSON.stringify(groupsBody));

    let groupId;
    const existingGroup = Array.isArray(groupsBody.data) && groupsBody.data.find(g => g.name === bucket);
    console.log("[subscribe] matched group", JSON.stringify(existingGroup || null));

    if (existingGroup) {
      groupId = String(existingGroup.id);
      console.log("[subscribe] using existing groupId", groupId);
    } else {
      const createRes = await fetch(`${baseUrl}/groups`, {
        method: "POST",
        headers,
        body: JSON.stringify({ name: bucket }),
      });
      const createBody = await createRes.json();
      console.log("[subscribe] group create response", JSON.stringify(createBody));

      if (!createRes.ok) {
        return res.status(500).json({ error: createBody });
      }
      groupId = String(createBody.data.id);
      console.log("[subscribe] created groupId", groupId);
    }

    // Step 2: Subscribe with group assigned in one call
    const subRes = await fetch(`${baseUrl}/subscribers`, {
      method: "POST",
      headers,
      body: JSON.stringify({ email, groups: [groupId] }),
    });
    const subBody = await subRes.json();
    console.log("[subscribe] subscribe response", { status: subRes.status, body: JSON.stringify(subBody) });

    if (!subRes.ok) {
      return res.status(500).json({ error: subBody });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("[subscribe] unexpected error", { message: err.message, stack: err.stack });
    return res.status(500).json({ error: err.message });
  }
};
