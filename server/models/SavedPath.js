import mongoose from 'mongoose';

const weekSchema = new mongoose.Schema({
  week: Number,
  focus: String,
  goal: String,
  resources: [
    {
      title: { type: String },
      type:  { type: String },
      link: { type: String }
    }
  ]
});

const savedPathSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  topic: { type: String, required: true },
  weeks: [weekSchema],
}, { timestamps: true });

export default mongoose.model('SavedPath', savedPathSchema);