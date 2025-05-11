import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  try {
    // Read the raw body
    let body = '';
    for await (const chunk of req) {
      body += chunk;
    }

    // Parse it safely
    const parsed = JSON.parse(body);
    const userPrompt = parsed.prompt || 'I need a creative reset.';

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'Missing OpenAI API key' });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are a mindfulness coach for busy creatives (artists, writers, and developers). Offer short, calming guidance to help them reset and refresh their creativity.',
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    });

    return res.status(200).json({
      reply: completion.choices[0].message.content.trim(),
    });
  } catch (err) {
    console.error('❌ Error during OpenAI call:', err);
    return res.status(500).json({ error: 'Invalid JSON or OpenAI error' });
  }
}
