const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  game: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Games' },
  url: String,
  type: { 
    type: String, 
    enum: ['main', 'gallery'], 
    default: 'gallery' },
});
module.exports = mongoose.model('Media', mediaSchema);