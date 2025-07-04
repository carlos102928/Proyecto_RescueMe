import { pool } from '../config/db.js';

export const obtenerAuditoria = async () => {
  const [rows] = await pool.query('SELECT * FROM auditoria ORDER BY fecha DESC');
  return rows;
};

export const registrarEventoAuditoria = async (tipo_evento, descripcion, actor, usuario_afectado = null) => {
  const query = `
    INSERT INTO auditoria (tipo_evento, descripcion, actor, usuario_afectado)
    VALUES (?, ?, ?, ?)
  `;
  await pool.query(query, [tipo_evento, descripcion, actor, usuario_afectado]);
};