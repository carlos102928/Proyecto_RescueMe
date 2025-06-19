import { getRefugios, getRefugioById } from '../models/refugioModel.js';

export const obtenerRefugios = async (req, res) => {
    try {
        const resultado = await getRefugios();
        res.json(resultado);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const obtenerRefugiosPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const refugio = await getRefugioById(Number(id));  // 🔄 Usar la función correcta

        if (!refugio) {
            return res.status(404).json({ mensaje: 'Refugio no encontrado' });
        }

        res.status(200).json(refugio);
    } catch (error) {
        console.error('Error al obtener refugio:', error);
        res.status(500).json({ mensaje: 'Error del servidor' });
    }
};