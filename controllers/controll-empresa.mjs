import { Empresa } from '../models/empresa.mjs';

export const getAll = async (req, res) => {
  try {
    const empresas = await Empresa.find({});
    return res.status(200).json({ state: true, data: empresas });
  } catch (error) {
    return res.status(500).json({ state: false, msg: error.message });
  }
};

export const getById = async (req, res) => {
  try {
    const empresa = await Empresa.findOne({ id: req.params.id });
    if (!empresa) {
      return res.status(404).json({ state: false, msg: 'Empresa no encontrada' });
    }
    return res.status(200).json({ state: true, data: empresa });
  } catch (error) {
    return res.status(500).json({ state: false, msg: error.message });
  }
};

export const save = async (req, res) => {
  try {
    const empresa = new Empresa(req.body);
    const resultado = await empresa.save();
    return res.status(201).json({ state: true, data: resultado });
  } catch (error) {
    return res.status(400).json({ state: false, msg: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const empresa = await Empresa.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!empresa) {
      return res.status(404).json({ state: false, msg: 'Empresa no encontrada' });
    }
    return res.status(200).json({ state: true, data: empresa });
  } catch (error) {
    return res.status(400).json({ state: false, msg: error.message });
  }
};

export const remove = async (req, res) => {
  try {
    const empresa = await Empresa.findOneAndDelete({ id: req.params.id });
    if (!empresa) {
      return res.status(404).json({ state: false, msg: 'Empresa no encontrada' });
    }
    return res.status(200).json({ state: true, msg: 'Empresa eliminada correctamente' });
  } catch (error) {
    return res.status(500).json({ state: false, msg: error.message });
  }
};
