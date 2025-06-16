import { pool } from '../config/db.js';

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