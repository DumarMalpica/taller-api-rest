import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ state: false, msg: 'Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (payload.exp && Date.now() / 1000 > payload.exp) {
      return res.status(401).json({ state: false, msg: 'Token expirado' });
    }

    req.usuario = payload;
    next();

  } catch (error) {
    return res.status(401).json({ state: false, msg: 'Token inválido: ' + error.message });
  }
};
