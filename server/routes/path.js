import express from 'express';
import Groq from 'groq-sdk';

const router = express.Router();
const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post('/', async (req, res) => {
  const { topic } = req.body;
  if (!topic) return res.status(400).json({ error: 'Topic required' });

  const prompt = `Create a structured 4-week learning path for: "${topic}".
Return a JSON array of 4 objects, one per week. Each object must have:
- week (number)
- focus (what this week covers in one line)
- resources (array of 2 objects, each with: title, type, link)
- goal (what the learner can do by end of this week)

Return ONLY the JSON array. No markdown. No explanation.`;

  try {
    const completion = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
    });

    const text = completion.choices[0].message.content;
    const cleaned = text.replace(/```json|```/g, '').trim();
    const path = JSON.parse(cleaned);

    res.json({ path });
  } catch (err) {
    res.status(500).json({ error: 'Path generation failed', detail: err.message });
  }
});

export default router;