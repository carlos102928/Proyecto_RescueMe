import { pool } from '../config/db.js';
import { enviarCorreo } from '../utils/emailService.js';


export const registrarAdopcion = async (req, res) => {
  const { correo, id_animal } = req.body;

  try {
    // Obtener datos del usuario
    const [usuarios] = await pool.query(
      'SELECT id_usuario, nombre, correo FROM usuarios WHERE correo = ?',
      [correo]
    );

    if (!usuarios.length) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const { id_usuario, nombre, correo: correoDestino } = usuarios[0];

    // Insertar adopción
    await pool.query(
      'INSERT INTO adopcion (id_adoptante, id_animal) VALUES (?, ?)',
      [id_usuario, id_animal]
    );

    // Auditoría
    await registrarEventoAuditoria(
      'Registro',
      `El usuario ${nombre} registró una solicitud de adopción para el animal con ID ${id_animal}`,
      nombre,
      correoDestino
    );


    await enviarCorreo({
      to: correoDestino, 
      subject: "Solicitud de adopción recibida",
      html: `<p>Hola <strong>${nombre}</strong>, tu solicitud de adopción ha sido recibida exitosamente. Pronto se hará envió un correo respecto al estado de tu adopción, gracias por escogernos..</p>`
    });

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
    // Actualizar estado
    const [result] = await pool.query(
      'UPDATE adopcion SET estado = ? WHERE id_adopcion = ?',
      [estado, id_adopcion]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Adopción no encontrada" });
    }

    // Obtener información del usuario
    const [rows] = await pool.query(`
      SELECT u.nombre, u.correo, a.estado, an.animal
      FROM adopcion a
      JOIN usuarios u ON a.id_adoptante = u.id_usuario
      JOIN animales an ON a.id_animal = an.id_animal
      WHERE a.id_adopcion = ?
    `, [id_adopcion]);

    if (rows.length === 0) {
      return res.status(404).json({ mensaje: "No se encontró la adopción actualizada para auditoría" });
    }

    const adopcion = rows[0];

    // Auditoría
    await registrarEventoAuditoria(
      'Actualización',
      `El administrador actualizó el estado de adopción del usuario ${adopcion.nombre} a "${adopcion.estado}"`,
      'Administrador',
      adopcion.correo
    );

    // Preparar correo
    const asunto = `Estado de tu adopción: ${estado}`;
    let mensajeHTML = `
      <h2>Hola ${adopcion.nombre},</h2>
      <p>Tu solicitud de adopción para el animal <strong>${adopcion.animal}</strong> ha sido <strong>${estado.toUpperCase()}</strong>.</p>
    `;

    if (estado === 'Aceptado') {
      mensajeHTML += `<p>¡Felicidades! Pronto nos pondremos en contacto contigo para continuar con el proceso</p>`;
    } else if (estado === 'Denegado') {
      mensajeHTML += `<p>Lamentablemente, tu solicitud no ha sido aprobada. Agradecemos tu interés y te invitamos a intentar con otro animal más adelante.</p>`;
    }

    mensajeHTML += `<br><p>Gracias por confiar en <strong>Rescue Me</strong>.</p>`;

    // ✅ Enviar correo
    await enviarCorreo({
      to: adopcion.correo,
      subject: asunto,
      html: mensajeHTML
    });

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

//Bien chatGPT, entonces con estas medidas el código debería de funcionar de manera correcta o debo de implementar más medidas?