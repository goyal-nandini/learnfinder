import express from 'express';
import Groq from 'groq-sdk';

const router = express.Router();
const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post('/', async (req, res) => {
  const { topic } = req.body;
  if (!topic) return res.status(400).json({ error: 'Topic is required' });

  const prompt = `For the topic "${topic}", return a JSON array of 8 learning resources.
Each object must have: title, type (video/article/course/book), link, difficulty (beginner/intermediate/advanced), why_recommended (one line).
Return ONLY the JSON array. No markdown, no explanation.`;
    // const prompt = `For the topic "${topic}", return a JSON array of 8 learning resources.
    // Each object must have exactly these fields:
    // - title: string
    // - type: one of video/article/course/book
    // - link: a plain URL string only, example: https://www.youtube.com (NO html, NO attributes, just the raw URL)
    // - difficulty: one of beginner/intermediate/advanced
    // - why_recommended: one sentence string

    // Return ONLY the JSON array. No markdown. No explanation. No HTML.`;

  try {
    const completion = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',  // free, fast, very capable
      messages: [{ role: 'user', content: prompt }],
    });

    const text = completion.choices[0].message.content;
    const cleaned = text.replace(/```json|```/g, '').trim();
    const resources = JSON.parse(cleaned);

    res.json({ resources });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Groq API failed', detail: err.message });
  }
});

export default router;