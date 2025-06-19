import bcrypt from "bcrypt";
import {
  buscarRefugioPorCorreo,
  crearRefugio,
  obtenerRolPorId
} from "../models/refugioModel.js";

export const registerRefugio = async (req, res) => {
  const { nombre_refugio, direccion, correo, contraseña, id_rol } = req.body;

  const refugioExistente = await buscarRefugioPorCorreo(correo);
  if (refugioExistente) {
    return res.status(400).json({ message: "Correo ya registrado" });
  }

  const hash = await bcrypt.hash(contraseña, 10);
  await crearRefugio(nombre_refugio, direccion, correo, hash, id_rol);
  res.status(201).json({ message: "Refugio registrado correctamente" });
};

export const loginRefugio = async (req, res) => {
  const { correo, contraseña } = req.body;

  const refugio = await buscarRefugioPorCorreo(correo);
  if (!refugio) return res.status(404).json({ message: "Refugio no encontrado" });

  const esValido = await bcrypt.compare(contraseña, refugio.contraseña);
  if (!esValido) return res.status(401).json({ message: "Contraseña incorrecta" });

  const rol = await obtenerRolPorId(refugio.id_rol);
  res.status(200).json({ message: "Login exitoso", rol, id_refugio: refugio.id_refugio });
};

export const obtenerRefugioPorCorreoController = async (req, res) => {
  try {
    const { correo } = req.params;
    const refugio = await buscarRefugioPorCorreo(correo); // 👍 uso correcto del modelo

    if (!refugio) {
      return res.status(404).json({ message: "Refugio no encontrado" });
    }

    res.status(200).json(refugio);
  } catch (error) {
    console.error("Error al obtener refugio:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};