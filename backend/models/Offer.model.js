const { Schema, model } = require('mongoose');

const OfferSchema = new Schema(
  {
    title: { type: String, required: true },
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    offerType: {
      type: String,
      enum: ['precio', 'si_llevas', 'especial'],
      required: true,
    },
    // Oferta de precio
    offerPrice: { type: Number },
    // Oferta si llevas X vale Y
    buyX: { type: Number },
    payY: { type: Number },
    // Oferta especial (texto)
    offerText: { type: String },
    // Fechas
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Offer = model('Offer', OfferSchema);
module.exports = Offer;
