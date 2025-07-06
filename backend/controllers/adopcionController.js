import { pool } from '../config/db.js';

export const registrarAdopcion = async (req, res) => {
  const { correo, id_animal } = req.body;

  try {
    // Obtener ID y nombre del usuario por correo
    const [usuarios] = await pool.query(
      'SELECT id_usuario, nombre FROM usuarios WHERE correo = ?',
      [correo]
    );

    if (usuarios.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const id_adoptante = usuarios[0].id_usuario;
    const nombre = usuarios[0].nombre;

    // Insertar adopción
    await pool.query(
      'INSERT INTO adopcion (id_adoptante, id_animal) VALUES (?, ?)',
      [id_adoptante, id_animal]
    );

    // Registrar evento de auditoría
    await registrarEventoAuditoria(
      'Registro',
      `El usuario ${nombre} registró una solicitud de adopción para el animal con ID ${id_animal}`,
      nombre,
      correo
    );

    res.status(201).json({ message: 'Adopción registrada con éxito' });
  } catch (error) {
    console.error("Error al registrar adopción:", error);
    res.status(500).json({ message: 'Error al procesar la adopción' });
  }
};
export const actualizarEstadoAdopcion = async (req, res) => {
  const { id_adopcion } = req.params;
  const { estado } = req.body;

  try {
    // Primero actualiza el estado
    const [result] = await pool.query(
      'UPDATE adopcion SET estado = ? WHERE id_adopcion = ?',
      [estado, id_adopcion]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Adopción no encontrada" });
    }

    // Luego, obtenemos información del adoptante afectado para la auditoría
    const [rows] = await pool.query(`
      SELECT u.nombre, u.correo, a.estado
      FROM adopcion a
      JOIN usuarios u ON a.id_adoptante = u.id_usuario
      WHERE a.id_adopcion = ?
    `, [id_adopcion]);

    if (rows.length === 0) {
      return res.status(404).json({ mensaje: "No se encontró la adopción actualizada para auditoría" });
    }

    const adopcion = rows[0];

    // Registramos el evento en la auditoría
    await registrarEventoAuditoria(
      'Actualización',
      `El administrador actualizó el estado de adopción del usuario ${adopcion.nombre} a "${adopcion.estado}"`,
      'Administrador',
      adopcion.correo
    );

    res.status(200).json({ mensaje: "Estado actualizado correctamente" });

  } catch (error) {
    console.error("Error al actualizar estado:", error);
    res.status(500).json({ mensaje: "Error del servidor" });
  }
};


export const obtenerAdopciones = async (req, res) => {
  try {
    const [adopciones] = await pool.query(`
      SELECT a.id_adopcion, a.fecha, a.estado, u.nombre, a.id_animal, an.animal
      FROM adopcion a
      JOIN usuarios u ON a.id_adoptante = u.id_usuario
      join animales an on a.id_animal = an.id_animal
      where a.estado = "En proceso"
    `);
    res.status(200).json(adopciones);
  } catch (error) {
    console.error("Error al obtener adopciones:", error);
    res.status(500).json({ mensaje: "Error al obtener adopciones" });
  }
};

import { obtenerAdopcionesPorUsuario, cancelarAdopcion } from "../models/adopcionModel.js";
import { registrarEventoAuditoria } from '../models/auditoriaModel.js';

export const getAdopcionesUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const adopciones = await obtenerAdopcionesPorUsuario(id);
    res.json(adopciones);
  } catch (error) {
    console.error("Error al obtener adopciones:", error);
    res.status(500).json({ mensaje: "Error al obtener adopciones" });
  }
};

export const eliminarAdopcion = async (req, res) => {
  const { id } = req.params;
  const { id_adoptante } = req.body;

  try {
    const resultado = await cancelarAdopcion(id, id_adoptante);
    if (resultado.affectedRows === 0) {
      return res.status(400).json({ mensaje: "No se pudo eliminar la adopción" });
    }
    res.json({ mensaje: "Adopción cancelada correctamente" });
  } catch (error) {
    console.error("Error al eliminar adopción:", error);
    res.status(500).json({ mensaje: "Error del servidor al cancelar la adopción" });
  }
};