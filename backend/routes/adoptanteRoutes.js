import express from "express";
import { obtenerAdoptantes, actualizarRolUsuario, eliminarUsuario } from "../controllers/adoptanteController.js";
const router = express.Router();

router.get("/", obtenerAdoptantes);
router.put('/:id/rol', actualizarRolUsuario);
router.delete('/:id', eliminarUsuario)

export default router;