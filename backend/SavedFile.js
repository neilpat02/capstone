const mongoose = require('mongoose');

const SavedFileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fileName: { type: String, required: true },
  content: { type: String, required: true }
});

module.exports = mongoose.model('SavedFile', SavedFileSchema);
