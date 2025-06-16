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
            `SELECT a.id_animal, a.animal, a.raza, a.estado, a.imagen_url, v.tipo_vacuna 
             FROM animales a 
             JOIN vacunas v ON a.id_vacunas = v.id_vacuna 
             WHERE a.id_refugio = ?`, 
            [id_refugio]
        );

        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener animales del refugio' });
    }
};