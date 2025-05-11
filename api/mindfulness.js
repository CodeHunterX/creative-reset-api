import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  try {
    const { prompt = 'I need a creative reset.' } = req.body || {};

    if (!process.env.OPENAI_API_KEY) {
      console.error('❌ OPENAI_API_KEY not found in env');
      return res.status(500).json({ error: 'OpenAI API key missing' });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are a mindfulness coach for busy creatives (artists, writers, and developers). Offer short, calming guidance to help them reset and refresh their creativity.',
        },
        { role: 'user', content: prompt },
      ],
    });

    const reply = completion.choices[0].message.content;
    return res.status(200).json({ reply });
  } catch (err) {
    console.error('❌ Error during OpenAI call:', err);
    return res.status(500).json({ error: 'Failed to generate prompt' });
  }
}
