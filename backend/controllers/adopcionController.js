import { pool } from '../config/db.js';

export const registrarAdopcion = async (req, res) => {
  const { correo, id_animal } = req.body;

  try {
    // Obtener ID del usuario por correo
    const [usuarios] = await pool.query('SELECT id_usuario FROM usuarios WHERE correo = ?', [correo]);
    if (usuarios.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const id_adoptante = usuarios[0].id_usuario;

    // Insertar adopción
    await pool.query('INSERT INTO adopcion (id_adoptante, id_animal) VALUES (?, ?)', [id_adoptante, id_animal]);

    res.status(201).json({ message: 'Adopción registrada con éxito' });
  } catch (error) {
    console.error("Error al registrar adopción:", error);
    res.status(500).json({ message: 'Error al procesar la adopción' });
  }
};

export const actualizarEstadoAdopcion = async (req, res) => {
    const { id_adopcion } = req.params;
    const { estado } = req.body;

    try {
        const [result] = await pool.query(
            'UPDATE adopcion SET estado = ? WHERE id_adopcion = ?',
            [estado, id_adopcion]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: "Adopción no encontrada" });
        }

        res.status(200).json({ mensaje: "Estado actualizado correctamente" });
    } catch (error) {
        console.error("Error al actualizar estado:", error);
        res.status(500).json({ mensaje: "Error del servidor" });
    }
};

export const obtenerAdopciones = async (req, res) => {
  try {
    const [adopciones] = await pool.query(`
      SELECT a.id_adopcion, a.fecha, a.estado, u.nombre, a.id_animal, an.animal
      FROM adopcion a
      JOIN usuarios u ON a.id_adoptante = u.id_usuario
      join animales an on a.id_animal = an.id_animal
      where a.estado = "En proceso"
    `);
    res.status(200).json(adopciones);
  } catch (error) {
    console.error("Error al obtener adopciones:", error);
    res.status(500).json({ mensaje: "Error al obtener adopciones" });
  }
};