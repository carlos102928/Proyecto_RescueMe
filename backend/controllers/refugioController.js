import { getRefugios, getRefugioById } from '../models/refugioModel.js';
import { pool } from '../config/db.js';
import bcrypt from 'bcrypt'

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

export const actualizarCampoRefugio = async (req, res) => {
  const { id } = req.params;
  let { campo, valor } = req.body;

  const camposPermitidos = ['nombre_refugio', 'direccion', 'correo', 'contraseña'];
  if (!camposPermitidos.includes(campo)) {
    return res.status(400).json({ message: "Campo no válido para actualizar" });
  }

  try {
    // Si se está actualizando la contraseña, cifrarla
    if (campo === 'contraseña') {
      valor = await bcrypt.hash(valor, 10);
    }

    await pool.query(`UPDATE refugio SET ${campo} = ? WHERE id_refugio = ?`, [valor, id]);
    res.status(200).json({ message: "Campo actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar refugio:", error);
    res.status(500).json({ message: "Error al actualizar el campo" });
  }
};

export const eliminarRefugio = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query("DELETE FROM refugio WHERE id_refugio = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Refugio no encontrado" });
    }

    res.status(200).json({ mensaje: "Refugio eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar refugio:", error);
    res.status(500).json({ mensaje: "Error del servidor al eliminar refugio" });
  }
};