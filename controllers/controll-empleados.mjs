import { Empleado } from '../models/empleados.mjs';
import { Empresa } from '../models/empresa.mjs';

// Resuelve id numérico de empresa → ObjectId de MongoDB
const resolverEmpresa = async (empresaInput) => {
  const empresa = await Empresa.findOne({ id: Number(empresaInput) });
  if (!empresa) {
    throw new Error(`No existe ninguna empresa con id ${empresaInput}. Debes crear la empresa primero.`);
  }
  return empresa._id;
};

export const getAll = async (req, res) => {
  try {
    const empleados = await Empleado.find({}).populate('empresa', 'id nombre telefono');
    return res.status(200).json({ state: true, data: empleados });
  } catch (error) {
    return res.status(500).json({ state: false, msg: error.message });
  }
};

export const getById = async (req, res) => {
  try {
    const empleado = await Empleado.findOne({ id: req.params.id })
      .populate('empresa', 'id nombre telefono');
    if (!empleado) {
      return res.status(404).json({ state: false, msg: 'Empleado no encontrado' });
    }
    return res.status(200).json({ state: true, data: empleado });
  } catch (error) {
    return res.status(500).json({ state: false, msg: error.message });
  }
};

export const save = async (req, res) => {
  try {
    const body = { ...req.body };

    // Empresa es obligatoria — no se puede crear un empleado sin empresa
    if (!body.empresa) {
      return res.status(400).json({
        state: false,
        msg: 'El campo empresa es obligatorio. Crea primero una empresa y pasa su id numérico aquí.'
      });
    }

    // Convierte el id numérico al ObjectId real de MongoDB
    body.empresa = await resolverEmpresa(body.empresa);

    const empleado = new Empleado(body);
    const resultado = await empleado.save();
    const poblado = await resultado.populate('empresa', 'id nombre telefono');
    return res.status(201).json({ state: true, data: poblado });
  } catch (error) {
    return res.status(400).json({ state: false, msg: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const body = { ...req.body };

    // Si se actualiza empresa, verificar que exista
    if (body.empresa !== undefined) {
      if (!body.empresa) {
        return res.status(400).json({
          state: false,
          msg: 'El campo empresa no puede estar vacío.'
        });
      }
      body.empresa = await resolverEmpresa(body.empresa);
    }

    const empleado = await Empleado.findOneAndUpdate(
      { id: req.params.id },
      body,
      { new: true, runValidators: true }
    ).populate('empresa', 'id nombre telefono');

    if (!empleado) {
      return res.status(404).json({ state: false, msg: 'Empleado no encontrado' });
    }
    return res.status(200).json({ state: true, data: empleado });
  } catch (error) {
    return res.status(400).json({ state: false, msg: error.message });
  }
};

export const remove = async (req, res) => {
  try {
    const empleado = await Empleado.findOneAndDelete({ id: req.params.id });
    if (!empleado) {
      return res.status(404).json({ state: false, msg: 'Empleado no encontrado' });
    }
    return res.status(200).json({ state: true, msg: 'Empleado eliminado correctamente' });
  } catch (error) {
    return res.status(500).json({ state: false, msg: error.message });
  }
};