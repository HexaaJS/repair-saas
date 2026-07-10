const mongoose = require('mongoose');

const repairSchema = new mongoose.Schema(
  {
    // Référence unique : R-2025-00001
    reference: {
      type: String,
      unique: true,
    },

    // Liens
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
      required: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: true,
    },
    technician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    // Appareil
    device: {
      type: {
        type: String,
        enum: ['smartphone', 'tablette', 'ordinateur', 'console', 'trottinette', 'autre'],
        required: [true, 'Le type d\'appareil est requis'],
      },
      brand: { type: String, trim: true },
      model: { type: String, trim: true },
      serial: { type: String, trim: true },
      password: { type: String, trim: true },
    },

    // Problème
    problemDescription: {
      type: String,
      required: [true, 'La description du problème est requise'],
      trim: true,
    },
    diagnostic: {
      type: String,
      trim: true,
    },

    // Statut
    status: {
      type: String,
      enum: ['reception', 'diagnostic', 'devis', 'en_attente_piece', 'en_cours', 'termine', 'restitue', 'annule'],
      default: 'reception',
    },

    // Prix
    estimatedPrice: { type: Number, default: 0 },
    finalPrice: { type: Number, default: 0 },
    isPaid: { type: Boolean, default: false },

    // Dates clés
    estimatedEndDate: { type: Date },
    completedAt: { type: Date },
    returnedAt: { type: Date },

    // Suivi public (le token pour le lien SMS)
    trackingToken: {
      type: String,
      unique: true,
    },

    // Notes internes
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Génération auto de la référence et du token
repairSchema.pre('save', async function () {
  if (this.isNew) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Repair').countDocuments();
    this.reference = `R-${year}-${String(count + 1).padStart(5, '0')}`;
    this.trackingToken = require('crypto').randomBytes(16).toString('hex');
  }
});

module.exports = mongoose.model('Repair', repairSchema);