import express from "express";
import { obtenerAdoptantes } from "../controllers/adoptanteController.js";
const router = express.Router();

router.get("/adoptantes", obtenerAdoptantes);

export default router;