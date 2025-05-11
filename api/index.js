import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  try {
    // Parse it safely
    const userPrompt = 'I need a quick creative endeavor.';

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'Missing OpenAI API key' });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are a creativity coach who helps artists, writers, and developers break through creative blocks and generate fresh ideas. Respond with short, inspiring, and imaginative suggestions or exercises (2–4 sentences). Your tone should be encouraging, insightful, and gently playful — like a trusted creative partner offering a spark. Vary your approach: sometimes offer metaphors, sometimes quick mental challenges, or unexpected shifts in perspective.',
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
