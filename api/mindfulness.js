import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Parse request body
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const bodyString = Buffer.concat(chunks).toString();
    const body = JSON.parse(bodyString);
    const prompt = body.prompt || 'I need a creative reset.';

    // OpenAI call
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are a mindfulness coach for busy creatives (artists, writers, developers). Offer short, calming guidance to help them reset and refresh their creativity.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const reply = completion.choices[0].message.content.trim();
    return res.status(200).json({ reply });
  } catch (error) {
    console.error('Function error:', error);
    return res.status(500).json({ error: 'Something went wrong inside the API.' });
  }
}
