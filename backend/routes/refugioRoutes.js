import express from 'express';
import { actualizarCampoRefugio, obtenerRefugios, obtenerRefugiosPorId } from '../controllers/refugioController.js';
const router = express.Router();

router.get('/', obtenerRefugios);

router.get('/:id', obtenerRefugiosPorId);
router.put('/actualizar/:id', actualizarCampoRefugio);
export default router;