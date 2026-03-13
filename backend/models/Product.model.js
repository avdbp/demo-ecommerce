const { Schema, model } = require('mongoose');

const ProductSchema = new Schema(
  {
    nombre: String,
    descripcion: String,
    precio: Number,
    categoria: {
      type: String,
      enum: ['plantas', 'ramos'],
    },
    imagen: String,
    aidescripcion: String,
    favorito: { type: Boolean, default: false },
    ubicacion: [{ type: String, enum: ['interior', 'exterior'] }],
  },
  { timestamps: true }
);

const Product = model('Product', ProductSchema);

module.exports = Product;
