import { pool } from '../config/db.js';

export const obtenerAuditoria = async () => {
  const [rows] = await pool.query('SELECT * FROM auditoria ORDER BY fecha DESC');
  return rows;
};