import { pool } from "../config/db.js"

export const getAnimales = async () => {
    const [rows] = await pool.query('select a.id_animal, a.animal, a.raza, a.imagen_url, r.nombre_refugio from animales a join refugio r on a.id_refugio = r.id_refugio where a.estado = "Sin Adoptar"; ');
    return rows;
};

export const getAnimalById = async (id) => {
  const [rows] = await pool.query(
    `SELECT a.id_animal, a.animal, a.raza, a.imagen_url, r.nombre_refugio
     FROM animales a
     JOIN refugio r ON a.id_refugio = r.id_refugio
     WHERE a.id_animal = ?`,
    [id]
  );
  return rows[0];
};