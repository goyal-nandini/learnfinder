import mongoose from 'mongoose';

const savedResourceSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',       // links to User collection
    required: true 
  },
  title: { type: String, required: true },
  type: String,
  link: String,
  difficulty: String,
  why_recommended: String,
  savedFrom: { 
    type: String, 
    enum: ['search', 'path'],  // where user saved it from
    default: 'search' 
  }
}, { timestamps: true });

// prevent same user saving same link twice
savedResourceSchema.index({ userId: 1, link: 1 }, { unique: true });

export default mongoose.model('SavedResource', savedResourceSchema);