import express from 'express';
import { generatePets } from '../utils/mocking.js';

const router = express.Router();

router.get('/mockingpets', (req, res) => {
    const pets = generatePets(100); 
    res.status(200).json({ pets });
});

export default router;
