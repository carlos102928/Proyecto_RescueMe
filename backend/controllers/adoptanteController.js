import {getAdoptantes} from "../models/adoptanteModel.js";
import {pool} from '../config/db.js'
import { registrarEventoAuditoria } from "../models/auditoriaModel.js";

export const obtenerAdoptantes = async (req, res) => {
    try {
        const resultado = await getAdoptantes();
        res.json(resultado);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const eliminarUsuario = async (req, res) => {
  try {
    const id = req.params.id;

    // Obtener primero el nombre y correo del usuario
    const [rows] = await pool.query('SELECT nombre, correo FROM usuarios WHERE id_usuario = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    const usuario = rows[0]; // { nombre, correo }

    // Eliminar el usuario
    await pool.query('DELETE FROM usuarios WHERE id_usuario = ?', [id]);

    // Registrar en la tabla de auditoría
    await registrarEventoAuditoria(
      'Eliminación',
      `El administrador eliminó al usuario "${usuario.nombre}"`,
      'Administrador',
      usuario.correo
    );

    res.status(200).json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar adoptante:', error);
    res.status(500).json({ mensaje: 'Error del servidor al eliminar adoptante' });
  }
};

export const actualizarRolUsuario = async (req, res) => {
  const { id } = req.params;
  const { nuevoIdRol } = req.body;

  try {
    const [result] = await pool.query(
      "UPDATE usuarios SET id_rol = ? WHERE id_usuario = ?",
      [nuevoIdRol, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    res.status(200).json({ mensaje: "Rol actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar rol:", error);
    res.status(500).json({ mensaje: "Error del servidor al actualizar el rol" });
  }
};