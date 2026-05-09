export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { commitment, tone, seed } = req.body;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are a voice that speaks to people who've just committed to improving the world. Tone: ${tone}.
Write 2-3 sentences acknowledging their commitment. Make them feel its weight and beauty.
Be original. No cliches. No "Great choice!" energy. Second person. (id: ${seed})
Then write one all-caps phrase under 8 words naming the kind of ripple this creates.
Separate with exactly: [IMPACT]

Their commitment: "${commitment}"`
          }]
        }]
      })
    });

    const data = await response.json();
    console.log('Gemini response:', JSON.stringify(data));
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    res.status(200).json({ text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ text: '' });
  }
}
