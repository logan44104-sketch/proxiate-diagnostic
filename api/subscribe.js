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
  const headers = {
    "Content-Type": "application/json",
    "X-MailerLite-ApiKey": apiKey,
  };

  try {
    // Step 1: Subscribe the email
    const subRes = await fetch("https://api.mailerlite.com/api/v2/subscribers", {
      method: "POST",
      headers,
      body: JSON.stringify({ email }),
    });
    const subBody = await subRes.json();
    console.log("[subscribe] MailerLite subscribe response", { status: subRes.status, body: subBody });

    if (!subRes.ok) {
      return res.status(500).json({ error: subBody });
    }

    // Step 2: Find or create a group named after the bucket
    const groupsRes = await fetch("https://api.mailerlite.com/api/v2/groups", { headers });
    const groupsBody = await groupsRes.json();
    console.log("[subscribe] MailerLite groups fetch response", { status: groupsRes.status, body: groupsBody });

    let groupId;
    const existingGroup = Array.isArray(groupsBody) && groupsBody.find(g => g.name === bucket);
    if (existingGroup) {
      groupId = existingGroup.id;
      console.log("[subscribe] using existing group", { groupId });
    } else {
      // Create the group
      const createRes = await fetch("https://api.mailerlite.com/api/v2/groups", {
        method: "POST",
        headers,
        body: JSON.stringify({ name: bucket }),
      });
      const createBody = await createRes.json();
      console.log("[subscribe] MailerLite group create response", { status: createRes.status, body: createBody });

      if (!createRes.ok) {
        return res.status(500).json({ error: createBody });
      }
      groupId = createBody.id;
    }

    // Step 3: Add subscriber to the group
    const addRes = await fetch(
      `https://api.mailerlite.com/api/v2/groups/${groupId}/subscribers`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({ email }),
      }
    );
    const addBody = await addRes.json();
    console.log("[subscribe] MailerLite add-to-group response", { status: addRes.status, body: addBody });

    if (!addRes.ok) {
      return res.status(500).json({ error: addBody });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("[subscribe] unexpected error", { message: err.message, stack: err.stack });
    return res.status(500).json({ error: err.message });
  }
}
