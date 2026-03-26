export const soloAdmin = (req, res, next) => {
    if (!req.usuario) {
        return res.status(401).json({ state: false, msg: 'No autenticado' });
    }
    if (req.usuario.role !== 'admin') {
        return res.status(403).json({
            state: false,
            msg: 'Acceso denegado: se requiere rol administrador'
        });
    }
    next();
};