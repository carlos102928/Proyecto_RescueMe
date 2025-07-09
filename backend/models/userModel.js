import { pool } from "../config/db.js";

export const crearUsuario = async(nombre, correo, contraseña, id_rol) =>{
    const [result] = await pool.query(
        "insert into usuarios (nombre, correo, contraseña, id_rol) values (?, ?, ?, ?)",
        [nombre, correo, contraseña, id_rol]);
        return result.insertId;
};

export const buscarUsuarioPorCorreo = async(correo) =>{
    const [rows] = await pool.query(
        "select * from usuarios where correo = ?", [correo]
    );
    return rows[0];
};


export const obtenerRolPorId = async (id_rol) =>{
    const [rows] = await pool.query(
        "select nombre from roles where id_rol = ?",
        [id_rol]
    );
    return rows[0]?.nombre;
};

export const actualizarUsuarioPorCorreo = async (correo, campos) => {
  const camposValidos = ['nombre', 'correo', 'contraseña'];
  const entradas = Object.entries(campos).filter(([clave]) => camposValidos.includes(clave));

  if (entradas.length === 0) return { affectedRows: 0 };

  const columnas = entradas.map(([clave]) => `${clave} = ?`).join(', ');
  const valores = entradas.map(([_, valor]) => valor);

  const [result] = await pool.query(
    `UPDATE usuarios SET ${columnas} WHERE correo = ?`,
    [...valores, correo]
  );

  return result;
};
