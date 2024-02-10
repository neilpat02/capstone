const mongoose = require('mongoose');

const SavedTextSchema = new mongoose.Schema({
  userEmail: { 
    type: String,
    required: true,
    ref: 'User' // This references the User schema by email
  },
  fileName: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SavedText', SavedTextSchema);
