import express from 'express';
import { generatePets, generateUsers } from '../utils/mocking.js';
import Users from '../dao/Users.dao.js';
import petModel from '../dao/models/Pet.js';

const router = express.Router();
const usersDao = new Users();

router.get('/mockingpets', (req, res) => {
    const pets = generatePets(100);
    res.status(200).json({ pets });
});

router.get('/mockingusers', async (req, res) => {
    try {
        const users = generateUsers(50);
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ message: 'Error generating users', error });
    }
});

router.post('/generateData', async (req, res) => {
    const { users = 0, pets = 0 } = req.body;

    if (!Number.isInteger(users) || !Number.isInteger(pets) || users <= 0 || pets <= 0) {
        return res.status(400).json({
            message: 'Invalid parameters. "users" and "pets" must be positive integers.',
        });
    }

    try {
        const generatedUsers = generateUsers(users);
        const generatedPets = generatePets(pets);

        const userInsertResult = await usersDao.save(generatedUsers);
        const petInsertResult = await petModel.insertMany(generatedPets);

        res.status(201).json({
            message: 'Data generated and inserted successfully',
            usersInserted: userInsertResult.length || 0,
            petsInserted: petInsertResult.length || 0,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error generating and inserting data',
            error: error.message,
        });
    }
});

export default router;