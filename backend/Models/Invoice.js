const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema(
  {
    reference: {
      type: String,
      unique: true,
    },
    repair: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Repair',
      required: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: true,
    },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
      required: true,
    },
    items: [
      {
        description: { type: String, required: true },
        quantity: { type: Number, required: true, default: 1 },
        unitPrice: { type: Number, required: true },
        tva: { type: Number, default: 20 },
      },
    ],
    totalHT: { type: Number, default: 0 },
    totalTVA: { type: Number, default: 0 },
    totalTTC: { type: Number, default: 0 },
    paymentMethod: {
      type: String,
      enum: ['cb', 'especes', 'virement', 'cheque', 'autre'],
    },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

invoiceSchema.pre('save', async function () {
  if (this.isNew) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Invoice').countDocuments();
    this.reference = `F-${year}-${String(count + 1).padStart(5, '0')}`;
  }

  // Calcul auto des totaux
  let totalHT = 0;
  let totalTVA = 0;

  this.items.forEach((item) => {
    const lineHT = item.quantity * item.unitPrice;
    const lineTVA = lineHT * (item.tva / 100);
    totalHT += lineHT;
    totalTVA += lineTVA;
  });

  this.totalHT = Math.round(totalHT * 100) / 100;
  this.totalTVA = Math.round(totalTVA * 100) / 100;
  this.totalTTC = Math.round((totalHT + totalTVA) * 100) / 100;
});

module.exports = mongoose.model('Invoice', invoiceSchema);