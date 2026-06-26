import express from 'express';
import SavedPath from '../models/SavedPath.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(authMiddleware);


// SAVE a path
router.post('/', async (req, res) => {
    // console.log('hit savedpath route', req.userId);
  const { topic, weeks } = req.body;
  if (!topic || !weeks) return res.status(400).json({ error: 'Topic and weeks required' });

  try {
    // one path per topic per user
    const existing = await SavedPath.findOne({ userId: req.userId, topic });
    if (existing) return res.status(400).json({ error: 'Path already saved' });

    const path = await SavedPath.create({ userId: req.userId, topic, weeks });
    res.status(201).json({ message: 'Path saved', path });
  } catch (err) {
    res.status(500).json({ error: 'Save failed', detail: err.message });
  }
});

// GET all saved paths
router.get('/', async (req, res) => {
  try {
    const paths = await SavedPath.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json({ paths });
  } catch (err) {
    res.status(500).json({ error: 'Fetch failed', detail: err.message });
  }
});

// DELETE a path
router.delete('/:id', async (req, res) => {
  try {
    const path = await SavedPath.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });
    if (!path) return res.status(404).json({ error: 'Path not found' });
    res.json({ message: 'Path removed' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed', detail: err.message });
  }
});

export default router;