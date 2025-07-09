import express from 'express';
import { actualizarCampoRefugio, obtenerRefugios, obtenerRefugiosPorId, eliminarRefugio, obtenerRefugioPorCorreo } from '../controllers/refugioController.js';
const router = express.Router();

router.get('/', obtenerRefugios);
router.get('/mi-info', obtenerRefugioPorCorreo);
router.get('/:id', obtenerRefugiosPorId);
router.put('/actualizar/:id', actualizarCampoRefugio);
router.delete('/:id', eliminarRefugio);
export default router;