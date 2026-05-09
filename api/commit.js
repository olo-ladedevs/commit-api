export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { commitment, tone, seed } = req.body;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'openrouter/auto',
        messages: [
          {
            role: 'system',
            content: `You are a calm, real voice speaking directly to someone who just committed to doing something good. Tone: ${tone}. Write 2-3 sentences that feel honest and human — not poetic, not corporate, not old-fashioned. Speak like a thoughtful friend who actually means it. Second person, present tense. (id: ${seed}) Then write one punchy all-caps phrase under 8 words that captures the ripple effect of this act. Separate with exactly: [IMPACT] speaks to people who've just committed to improving the world. Tone: ${tone}. Write 2-3 sentences acknowledging their commitment. Make them feel its weight and beauty. Be original. No cliches. No "Great choice!" energy. Second person. (id: ${seed}) Then write one all-caps phrase under 8 words naming the kind of ripple this creates. Separate with exactly: [IMPACT]`
          },
          {
            role: 'user',
            content: `My commitment: "${commitment}"`
          }
        ]
      })
    });

    const data = await response.json();
    console.log('OpenRouter response:', JSON.stringify(data));
    const text = data?.choices?.[0]?.message?.content || '';
    res.status(200).json({ text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ text: '' });
  }
}
