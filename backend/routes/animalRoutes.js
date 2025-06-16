import express from "express";
import {getAnimal, obtenerAnimales, obtenerAnimalPorId, getAnimalesPorRefugio } from "../controllers/animalController.js";

const router = express.Router();

router.get('/', getAnimal)
router.get('/', obtenerAnimales);
router.get('/:id', obtenerAnimalPorId); // GET /animales/:id

router.get('/refugio/:id_refugio', getAnimalesPorRefugio);

export default router;
