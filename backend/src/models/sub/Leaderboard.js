const mongoose = require('mongoose');

const leaderboardSchema = new mongoose.Schema({
  volunteerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pontos: { type: Number, required: true },
  mesAno: { type: String, required: true }, 
}, { timestamps: true });

module.exports = mongoose.model('Leaderboard', leaderboardSchema);
