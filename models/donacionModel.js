import { pool } from '../config/db.js';

export const crearDonacion = async (valor, medio_pago, id_adoptante, id_refugio) => {
    const [result] = await pool.query(
        'INSERT INTO donaciones (valor, medio_de_pago, id_adoptantes, id_refugio) VALUES (?, ?, ?, ?)',
        [valor, medio_pago, id_adoptante, id_refugio]
    );
    return result;
};

export const obtenerTodasLasDonaciones = async (id_refugio = null) => {
    let query = `
        SELECT
            d.id_donacion,
            d.valor,
            d.medio_de_pago,
            d.fecha_transaccion,
            u.nombre AS nombre_adoptante,
            r.nombre_refugio AS nombre_refugio_donacion
        FROM donaciones d
        JOIN usuarios u ON d.id_adoptantes = u.id_usuario
        JOIN refugio r ON d.id_refugio = r.id_refugio
    `;
    const params = [];

    if (id_refugio) {
        query += ` WHERE d.id_refugio = ?`;
        params.push(id_refugio);
    }
    query += ` ORDER BY d.fecha_transaccion DESC`;

    const [rows] = await pool.query(query, params);
    return rows;
};