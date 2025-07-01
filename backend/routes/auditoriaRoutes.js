import express from 'express';
import { getEventosAuditoria } from '../controllers/auditoriaController.js';

const router = express.Router();

router.get('/', getEventosAuditoria);

export default router;