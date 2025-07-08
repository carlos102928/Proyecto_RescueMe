import bcrypt from "bcrypt";
import {
    buscarUsuarioPorCorreo,
    crearUsuario,
    obtenerRolPorId
} from "../models/userModel.js";

import { registrarEvento } from "../utils/auditoria.js";

export const register = async (req, res) => {
  try {
    const { nombre, correo, contraseña, id_rol } = req.body;

    const userExistente = await buscarUsuarioPorCorreo(correo);
    if (userExistente) {
      return res.status(400).json({ message: "Correo ya registrado" });
    }

    const hash = await bcrypt.hash(contraseña, 10);
    const idUsuario = await crearUsuario(nombre, correo, hash, id_rol);

    await registrarEvento(
      "Creación",
      `Se registró un nuevo usuario con ID ${idUsuario} y correo ${correo}`,
      idUsuario,
      "Sistema"
    );

    res.status(201).json({ message: "Usuario creado correctamente" });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(500).json({ message: "Error al registrar usuario" });
  }
};

export const login = async (req, res) =>{
    const {correo, contraseña} = req.body
    const user = await buscarUsuarioPorCorreo(correo);
    if (!user) return res.status(404).json({message: "Usuario no encontrado"});
    const esValido = await bcrypt.compare(contraseña, user.contraseña);
    if (!esValido) return res.status(401).json ({message: "Contraseña incorrecta"});
    const rol = await obtenerRolPorId(user.id_rol);
    res.status(200).json({message:'Login exitoso', rol, id_usuario: user.id_usuario});
};
