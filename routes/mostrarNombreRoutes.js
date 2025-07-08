import { Router } from 'express';
import { buscarUsuarioPorCorreo, obtenerRolPorId } from '../models/userModel.js';

const router = Router();

router.get('/mi-info', async (req, res) => { 
    const { correo } = req.query;

    if (!correo) {
        return res.status(400).json({ message: 'El parámetro "correo" es requerido.' });
    }

    try {
        const user = await buscarUsuarioPorCorreo(correo);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado con ese correo.' });
        }
        const nombreUsuario = user.nombre; 
        res.json({ nombre: nombreUsuario });
    } catch (error) {
        console.error('Error al obtener la información del usuario:', error);
        res.status(500).json({ error: 'Error en la base de datos o interno del servidor' });
    }
});

export default router;