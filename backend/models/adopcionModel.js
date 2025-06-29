import { pool } from "../config/db.js";

export const registrarAdopcionEnBD = async (id_adoptante, id_animal) => {
  await pool.query(
    `INSERT INTO adopcion (id_adoptante, id_animal) VALUES (?, ?)`,
    [id_adoptante, id_animal]
  );
};

export const obtenerAdopcionesPorUsuario = async (id_adoptante) => {
  const [rows] = await pool.query(`
    SELECT a.id_adopcion, a.estado, a.fecha, an.animal, an.raza
    FROM adopcion a
    JOIN animales an ON a.id_animal = an.id_animal
    WHERE a.id_adoptante = ?`, [id_adoptante]
  );
  return rows;
};

export const cancelarAdopcion = async (id_adopcion, id_adoptante) => {
  const [result] = await pool.query(`
    DELETE FROM adopcion 
    WHERE id_adopcion = ? AND id_adoptante = ? AND estado = 'En proceso'`, 
    [id_adopcion, id_adoptante]
  );
  return result;
};