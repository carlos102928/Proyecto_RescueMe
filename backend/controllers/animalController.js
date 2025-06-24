import { pool } from '../config/db.js';
import { getAnimales, getAnimalById } from "../models/animalModel.js";

export const obtenerAnimales = async (req, res) =>{
    getAnimales((err, resultados) =>{
        if (err) return res.status(500).json({error: err.message});
        res.json(resultados);
    });
};

export const getAnimal = async (req, res) =>{
 const animales = await getAnimales()
 res.status(200).json({ message: 'anmimales encontrados', animales})
}


export const obtenerAnimalPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const animal = await getAnimalById(Number(id));
    console.log('Resultado obtenido:', animal);

    if (!animal) {
      return res.status(404).json({ mensaje: "Animal no encontrado" });
    }

    res.json({ animal });
  } catch (error) {
    console.error("Error al obtener animal:", error);
    res.status(500).json({ mensaje: "Error del servidor" });
  }
};

export const getAnimalesPorRefugio = async (req, res) => {
  const { id_refugio } = req.params;

  try {
    const [rows] = await pool.query(
      `SELECT id_animal, animal, raza, imagen_url, id_vacunas, estado FROM animales WHERE id_refugio = ?`,
      [id_refugio]
    );
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener animales:", error);
    res.status(500).json({ mensaje: 'Error en el servidor al obtener los animales' });
  }
};


export const insertarAnimal = async (req, res) => {
  const { animal, raza, id_vacunas, imagen_url, id_refugio } = req.body;

  try {
    await pool.query(
      'INSERT INTO animales (animal, raza, id_vacunas, imagen_url, id_refugio) VALUES (?, ?, ?, ?, ?)',
      [animal, raza, id_vacunas, imagen_url, id_refugio]
    );

    res.status(201).json({ message: 'Animal registrado correctamente' });
  } catch (error) {
    console.error('Error al insertar animal:', error);
    res.status(500).json({ message: 'Error al registrar animal' });
  }
};

export const eliminarAnimal = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query("DELETE FROM animales WHERE id_animal = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Animal no encontrado" });
    }

    res.status(200).json({ mensaje: "Animal eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar animal:", error);
    res.status(500).json({ mensaje: "Error del servidor al eliminar animal" });
  }
};