import {getAdoptantes} from "../models/adoptanteModel.js";

export const obtenerAdoptantes = async (req, res) => {
    try {
        const resultado = await getAdoptantes();
        res.json(resultado);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};