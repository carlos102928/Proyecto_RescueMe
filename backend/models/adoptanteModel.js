import { pool } from "../config/db.js";

export const getAdoptantes = async() =>{
    const [rows] = await pool.query("select u.id_usuario, u.nombre, u.correo, r.nombre as rol from usuarios u join roles r on u.id_rol = r.id_rol where u.id_rol = 1", );
    return rows;
};