import mongoose from 'mongoose';

const empresaSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  nombre: {
    type: String,
    required: true,
    match: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/
  },
  direccion: {
    type: String,
    required: true
  },
  telefono: {
    type: String,
    required: true
  }
}, { timestamps: true });

export const Empresa = mongoose.model('Empresa', empresaSchema);
