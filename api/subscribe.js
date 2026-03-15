export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, bucket } = req.body;
  if (!email || !bucket) {
    return res.status(400).json({ error: "Missing email or bucket" });
  }

  const apiKey = process.env.REACT_APP_MAILERLITE_API_KEY;

  try {
    const mlRes = await fetch("https://api.mailerlite.com/api/v2/subscribers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-MailerLite-ApiKey": apiKey,
      },
      body: JSON.stringify({
        email,
        fields: { tag: bucket },
      }),
    });

    if (!mlRes.ok) {
      const text = await mlRes.text();
      return res.status(500).json({ error: text });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
