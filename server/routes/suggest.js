import express from 'express';
import Groq from 'groq-sdk';

const router = express.Router();
const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post('/', async (req, res) => {
  const { partial } = req.body;
  if (!partial) return res.status(400).json({ error: 'Input required' });

  const prompt = `A user is searching for learning resources and has typed: "${partial}".
Suggest 5 specific, complete topic names they might be looking for.
Return ONLY a JSON array of 5 strings. No markdown. No explanation.
Example output: ["React Hooks", "React with TypeScript", "React Performance Optimization"]`;

  try {
    const completion = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
    });

    const text = completion.choices[0].message.content;
    const cleaned = text.replace(/```json|```/g, '').trim();
    const suggestions = JSON.parse(cleaned);

    res.json({ suggestions });
  } catch (err) {
    res.status(500).json({ error: 'Suggest failed', detail: err.message });
  }
});

export default router;