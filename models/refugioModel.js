import { pool } from '../config/db.js';

export const crearRefugio = async (nombre_refugio, direccion, correo, contraseña, id_rol) => {
  const [result] = await pool.query(
    "INSERT INTO refugio (nombre_refugio, direccion, correo, contraseña, id_rol) VALUES (?, ?, ?, ?, ?)",
    [nombre_refugio, direccion, correo, contraseña, id_rol]
  );
  return result.insertId;
};

export const buscarRefugioPorCorreo = async (correo) => {
  const [rows] = await pool.query("SELECT * FROM refugio WHERE correo = ?", [correo]);
  return rows[0];
};

export const obtenerRolPorId = async (id_rol) => {
  const [rows] = await pool.query("SELECT nombre FROM roles WHERE id_rol = ?", [id_rol]);
  return rows[0]?.nombre;
};

export const getRefugios = async() => {
    const [rows] = await pool.query('SELECT * FROM refugio');
    return rows;
};

export const getRefugioById = async (id) =>{
    const [rows] = await pool.query(
        `select * from refugio where id_refugio = ?`,
        [id]
    )
    return rows[0]
}
