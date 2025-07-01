import { pool } from "../config/db.js";

export const registrarEvento = async (tipo, descripcion, usuarioAfectado, actor) => {
  await pool.query(
    "INSERT INTO auditoria (tipo_evento, descripcion, usuario_afectado, actor) VALUES (?, ?, ?, ?)",
    [tipo, descripcion, usuarioAfectado, actor]
  );
};