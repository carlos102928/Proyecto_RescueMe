import { pool } from '../config/db.js';
import { enviarCorreo } from '../utils/emailService.js';
import { registrarEventoAuditoria } from '../models/auditoriaModel.js';
import { obtenerAdopcionesPorUsuario, cancelarAdopcion } from "../models/adopcionModel.js";

export const registrarAdopcion = async (req, res) => {
  const { correo, id_animal, intenciones } = req.body;

  try {
    // Buscar usuario
    const [usuarios] = await pool.query(
      'SELECT id_usuario, nombre FROM usuarios WHERE correo = ?',
      [correo]
    );

    if (usuarios.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const id_adoptante = usuarios[0].id_usuario;
    const nombre = usuarios[0].nombre;

    // Registrar adopción
    await pool.query(
  'INSERT INTO adopcion (id_adoptante, id_animal, intenciones) VALUES (?, ?, ?)',
      [id_adoptante, id_animal, intenciones]
    );

    // Auditoría
    await registrarEventoAuditoria(
      'Registro',
      `El usuario ${nombre} registró una solicitud de adopción para el animal con ID ${id_animal}`,
      nombre,
      correo
    );

    // Enviar correo al administrador
    const asunto = 'Nueva solicitud de adopción registrada';
    const mensaje = `
      <h2>Solicitud de adopción</h2>
      <p><strong>Adoptante:</strong> ${nombre}</p>
      <p><strong>Correo:</strong> ${correo}</p>
      <p><strong>ID del animal:</strong> ${id_animal}</p>
      <p><strong>Intenciones del usuario:</strong></p>
      <blockquote style="background:#f2f2f2;padding:10px;border-left:4px solid #ccc;">
        ${intenciones}
      </blockquote>
      <p>Por favor, revise la solicitud en la plataforma.</p>
    `;

    await enviarCorreo({
      to: 'carlosmarioescobar118@gmail.com', // Reemplaza con el correo real del administrador
      subject: asunto,
      html: mensaje
    });

    res.status(201).json({ message: 'Adopción registrada y notificada con éxito' });
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
      SELECT a.id_adopcion, a.fecha, a.estado, a.intenciones, u.nombre, a.id_animal, an.animal
      FROM adopcion a
      JOIN usuarios u ON a.id_adoptante = u.id_usuario
      join animales an on a.id_animal = an.id_animal
      where a.estado = "En proceso"
      order by a.fecha desc
    `);
    res.status(200).json(adopciones);
  } catch (error) {
    console.error("Error al obtener adopciones:", error);
    res.status(500).json({ mensaje: "Error al obtener adopciones" });
  }
};


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