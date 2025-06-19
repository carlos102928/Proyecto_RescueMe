import express from "express";
import {getAnimal, obtenerAnimales, obtenerAnimalPorId, getAnimalesPorRefugio, insertarAnimal } from "../controllers/animalController.js";

const router = express.Router();

router.get('/', getAnimal)
router.get('/', obtenerAnimales);
router.get('/:id', obtenerAnimalPorId);
router.post('/crear', insertarAnimal)
router.get('/refugio/:id_refugio', getAnimalesPorRefugio);

export default router;
