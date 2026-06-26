import express from 'express';
import SavedResource from '../models/SavedResource.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// protect ALL routes in this file with one line
router.use(authMiddleware);

// SAVE a resource
router.post('/', async (req, res) => {
  const { title, type, link, difficulty, why_recommended, savedFrom } = req.body;

  if (!title || !link) 
    return res.status(400).json({ error: 'Title and link are required' });

  try {
    const resource = await SavedResource.create({
      userId: req.userId,   // comes from authMiddleware
      title,
      type,
      link,
      difficulty,
      why_recommended,
      savedFrom
    });

    res.status(201).json({ message: 'Resource saved', resource });
  } catch (err) {
    // duplicate save attempt
    if (err.code === 11000) 
      return res.status(400).json({ error: 'Already saved' });
    
    res.status(500).json({ error: 'Save failed', detail: err.message });
  }
});

// GET all saved resources for logged-in user
router.get('/', async (req, res) => {
  try {
    const resources = await SavedResource.find({ userId: req.userId })
                                         .sort({ createdAt: -1 }); // newest first
    res.json({ resources });
  } catch (err) {
    res.status(500).json({ error: 'Fetch failed', detail: err.message });
  }
});

// DELETE a saved resource
router.delete('/:id', async (req, res) => {
  try {
    const resource = await SavedResource.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId    // IMPORTANT — user can only delete their own
    });

    if (!resource) 
      return res.status(404).json({ error: 'Resource not found' });

    res.json({ message: 'Resource removed' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed', detail: err.message });
  }
});

export default router;