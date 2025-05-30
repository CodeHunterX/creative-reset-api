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

const prompts = [
  "I need help refocusing my creative energy.",
  "Give me a short visualization to reset my mind.",
  "I feel stuck—help me find a calm center and recharge.",
  "Prompt me with a mindful moment to help me get back into flow.",
  "Offer me a focused breath or mental reset I can do quickly.",
  "Encourage me as a creator who feels burnt out.",
];
    const userPrompt = prompts[Math.floor(Math.random() * prompts.length)];

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'Missing OpenAI API key' });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are a creative mindfulness coach specializing in brief, energizing resets for overwhelmed artists, writers, and software developers. Each message should be 2–4 sentences and offer a unique approach: breathing, visualization, gentle affirmations, or playful perspective shifts. Rotate between methods and speak directly to the user. Assume they’re mid-task and need a quick but meaningful nudge to realign their focus and confidence.',
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
