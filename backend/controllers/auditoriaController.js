import { obtenerAuditoria } from '../models/auditoriaModel.js';

export const getEventosAuditoria = async (req, res) => {
  try {
    console.log("📥 Petición recibida en /api/auditoria");
    const eventos = await obtenerAuditoria();
    res.json(eventos);
  } catch (error) {
    console.error("Error al obtener eventos de auditoría:", error);
    res.status(500).json({ mensaje: "Error al obtener la auditoría" });
  }
};