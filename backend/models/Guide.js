const mongoose = require('mongoose');

const guideSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: true
  },
  contenu: {
    type: String,
    required: true
  },
  images: [{
    type: String,
  }],
  dateCreation: {
    type: Date,
    default: Date.now
  },
  genre: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  averageRating: {
    type: Number,
    default: 0
  },
  ratings: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    note: {
      type: Number,
      min: 1,
      max: 5
    },
    votesCount: {
      type: Number,
      default: 0
    },
  }]
});

// Définir la méthode pour calculer la note moyenne
guideSchema.methods.calculateAverageRating = function() {
  if (this.ratings.length > 0) {
    const sum = this.ratings.reduce((total, rating) => total + rating.note, 0);
    this.averageRating = sum / this.ratings.length;
    this.votesCount = this.ratings.length; // Mettre à jour le champ votesCount
  } else {
    this.averageRating = 0;
    this.votesCount = 0; // Réinitialiser le champ votesCount
  }
  return this.save();
};


const Guide = mongoose.model('Guide', guideSchema);

module.exports = Guide;
