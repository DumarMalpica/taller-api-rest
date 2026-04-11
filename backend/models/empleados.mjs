import mongoose from 'mongoose';

const empleadoSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
    index: true
  },
  nombre: {
    type: String,
    required: true,
    match: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/
  },
  puesto: {
    type: String,
    required: true
  },
  empresa: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Empresa',
    required: true
  }
}, { timestamps: true });

export const Empleado = mongoose.model('Empleado', empleadoSchema);
