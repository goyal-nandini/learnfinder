import express from 'express';
import Groq from 'groq-sdk';

const router = express.Router();
const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post('/', async (req, res) => {
  const { title, type, difficulty } = req.body;
  if (!title) return res.status(400).json({ error: 'Title required' });

  const prompt = `Given this learning resource:
Title: "${title}"
Type: "${type}"
Difficulty: "${difficulty}"

Return a JSON object with exactly these fields:
- what_you_learn (one sentence: what skill/concept this teaches)
- best_for (one sentence: who should use this resource)
- time_commitment (estimated hours to complete, example: "10 hours", "2-3 hours")
- prerequisite (one skill needed before starting, or "None")

Return ONLY the JSON object. No markdown. No explanation.`;

  try {
    const completion = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
    });

    const text = completion.choices[0].message.content;
    const cleaned = text.replace(/```json|```/g, '').trim();
    const summary = JSON.parse(cleaned);

    res.json({ summary });
  } catch (err) {
    res.status(500).json({ error: 'Summarize failed', detail: err.message });
  }
});

export default router;