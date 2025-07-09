import {getAdoptantes} from "../models/adoptanteModel.js";
import {pool} from '../config/db.js'
import { registrarEventoAuditoria } from "../models/auditoriaModel.js";
import { buscarUsuarioPorCorreo, actualizarUsuarioPorCorreo} from '../models/userModel.js'
import bcrypt from "bcrypt"
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


export const obtenerPerfilAdoptante = async (req, res) => {
    const { correo } = req.query;

    if (!correo) {
        return res.status(400).json({ mensaje: "Se requiere el correo del usuario." });
    }

    try {
        const usuario = await buscarUsuarioPorCorreo(correo);
        if (!usuario) {
            return res.status(404).json({ mensaje: "Usuario no encontrado." });
        }

        res.json(usuario);
    } catch (error) {
        console.error("Error al obtener perfil:", error);
        res.status(500).json({ mensaje: "Error interno del servidor." });
    }
};

export const actualizarCampoAdoptante = async (req, res) => {
  const { correoActual, campo, valor } = req.body;

  if (!correoActual || !campo || valor == null) {
    return res.status(400).json({ mensaje: "Datos incompletos para la actualización." });
  }

  try {
    let campoValido;
    let valorProcesado = valor;

    if (campo === "nombre" || campo === "correo") {
      campoValido = true;
    } else if (campo === "contraseña") {
      campoValido = true;
      const salt = await bcrypt.genSalt(10);
      valorProcesado = await bcrypt.hash(valor, salt);
    }

    if (!campoValido) {
      return res.status(400).json({ mensaje: "Campo no permitido para actualización." });
    }

    const [result] = await pool.query(
      `UPDATE usuarios SET ${campo === 'contraseña' ? 'contraseña' : campo} = ? WHERE correo = ?`,
      [valorProcesado, correoActual]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Usuario no encontrado para actualizar." });
    }

    res.json({ mensaje: `Campo ${campo} actualizado correctamente.` });
  } catch (error) {
    console.error("Error al actualizar campo:", error);
    res.status(500).json({ mensaje: "Error interno del servidor." });
  }
};


