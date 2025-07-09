import express from "express";
import { obtenerAdoptantes, actualizarRolUsuario, eliminarUsuario, obtenerPerfilAdoptante, actualizarCampoAdoptante} from "../controllers/adoptanteController.js";
const router = express.Router();

router.get("/", obtenerAdoptantes);
router.put('/:id/rol', actualizarRolUsuario);
router.delete('/:id', eliminarUsuario);
router.get('/perfil', obtenerPerfilAdoptante);
router.put('/actualizar-campo', actualizarCampoAdoptante);

export default router;