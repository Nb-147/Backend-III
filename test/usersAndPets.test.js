import mongoose from 'mongoose';
import supertest from 'supertest';
import { expect } from 'chai';
import app from '../src/app.js';

const requester = supertest(app);

describe('*API Tests*', function () {
    this.timeout(10000);

    before(async () => {
        await mongoose.connect(
            'mongodb+srv://Nico:49809075@cluster0.kqthm.mongodb.net/devDB?retryWrites=true&w=majority',
            { useNewUrlParser: true, useUnifiedTopology: true }
        );
    });

    after(async () => {
        await mongoose.connection.db.dropDatabase();
        await mongoose.disconnect();
    });

    describe('*Authentication Tests*', () => {
        it('POST /api/sessions/register - debería registrar un nuevo usuario', async () => {
            const res = await requester.post('/api/sessions/register').send({
                first_name: 'Test',
                last_name: 'User',
                email: 'testuser@example.com',
                password: 'password123'
            });
            expect(res.status).to.equal(201);
            expect(res.body).to.have.property('status', 'success');
            expect(res.body.payload).to.have.property('email', 'testuser@example.com');
        });

        it('POST /api/sessions/login - debería loguear un usuario existente', async () => {
            const res = await requester.post('/api/sessions/login').send({
                email: 'testuser@example.com',
                password: 'password123'
            });
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('status', 'success');
            expect(res.body).to.have.property('token');
        });
    });

    describe('*Users Router Tests*', () => {
        let userId;

        it('POST /api/users - debería crear un nuevo usuario', async () => {
            const newUser = {
                first_name: 'Juan',
                last_name: 'Pérez',
                email: 'juan.perez@example.com',
                password: 'password123'
            };

            const res = await requester.post('/api/users').send(newUser);
            expect(res.status).to.equal(201);
            expect(res.body).to.have.property('payload');
            expect(res.body.payload).to.have.property('_id');
            expect(res.body.payload.email).to.equal(newUser.email);
            userId = res.body.payload._id;

            const getRes = await requester.get(`/api/users/${userId}`);
            expect(getRes.status).to.equal(200);
            expect(getRes.body.payload.email).to.equal(newUser.email);
        });

        it('POST /api/users - debería devolver error por datos incompletos', async () => {
            const incompleteUser = { first_name: 'Ana' };
            const res = await requester.post('/api/users').send(incompleteUser);
            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('error');
        });

        it('POST /api/users - debería devolver error al intentar crear un usuario con email duplicado', async () => {
            const duplicateUser = {
                first_name: 'Juan',
                last_name: 'Pérez',
                email: 'juan.perez@example.com',
                password: 'password123'
            };
            const res = await requester.post('/api/users').send(duplicateUser);
            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('error');
        });

        it('GET /api/users - debería retornar todos los usuarios con la estructura correcta', async () => {
            const res = await requester.get('/api/users');
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('payload');
            expect(res.body.payload).to.be.an('array');
        });

        it('GET /api/users/:uid - debería retornar un usuario por su ID', async () => {
            const res = await requester.get(`/api/users/${userId}`);
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('payload');
            expect(res.body.payload._id).to.equal(userId);
        });

        it('GET /api/users/:uid - debería devolver error 404 para usuario inexistente', async () => {
            const res = await requester.get('/api/users/invalidUserId');
            expect(res.status).to.equal(500);
            expect(res.body).to.have.property('error');
        });

        it('PUT /api/users/:uid - debería actualizar un usuario existente', async () => {
            const updatedData = { first_name: 'Juan Carlos' };
            const res = await requester.put(`/api/users/${userId}`).send(updatedData);
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('message', 'User updated');

            const getRes = await requester.get(`/api/users/${userId}`);
            expect(getRes.status).to.equal(200);
            expect(getRes.body.payload.first_name).to.equal(updatedData.first_name);
        });

        it('PUT /api/users/:uid - debería devolver error 404 al actualizar un usuario inexistente', async () => {
            const res = await requester.put('/api/users/invalidUserId').send({ first_name: 'Test' });
            expect(res.status).to.equal(500);
            expect(res.body).to.have.property('error');
        });

        it('DELETE /api/users/:uid - debería eliminar un usuario existente', async () => {
            const res = await requester.delete(`/api/users/${userId}`);
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('message', 'User deleted');

            const getRes = await requester.get(`/api/users/${userId}`);
            expect(getRes.status).to.equal(404);
        });

        it('DELETE /api/users/:uid - debería devolver error 404 al eliminar un usuario inexistente', async () => {
            const res = await requester.delete(`/api/users/${userId}`);
            expect(res.status).to.equal(404);
            expect(res.body).to.have.property('error');
        });
    });

    describe('*Pets Router Tests*', () => {
        let petId;

        it('POST /api/pets - debería crear una nueva mascota', async () => {
            const newPet = {
                name: 'Firulais',
                specie: 'Perro',
                birthDate: '2023-01-01'
            };

            const res = await requester.post('/api/pets').send(newPet);
            expect(res.status).to.equal(201);
            expect(res.body).to.have.property('payload');
            expect(res.body.payload).to.have.property('_id');
            petId = res.body.payload._id;
        });

        it('PUT /api/pets/:pid - debería actualizar una mascota existente', async () => {
            const updatedData = { name: 'Firulais Jr.' };
            const res = await requester.put(`/api/pets/${petId}`).send(updatedData);
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('message', 'pet updated');

            const getRes = await requester.get(`/api/pets/${petId}`);
            expect(getRes.status).to.equal(200);
            expect(getRes.body.payload.name).to.equal(updatedData.name);
        });

        it('DELETE /api/pets/:pid - debería eliminar una mascota existente', async () => {
            const res = await requester.delete(`/api/pets/${petId}`);
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('message', 'pet deleted');

            const getRes = await requester.get(`/api/pets/${petId}`);
            expect(getRes.status).to.equal(404);
        });
    });

    describe('*Adoptions Router Tests*', () => {
        let userId, petId;

        before(async () => {
            const userRes = await requester.post('/api/users').send({
                first_name: 'Carlos',
                last_name: 'González',
                email: 'carlos@example.com',
                password: 'password123'
            });
            userId = userRes.body.payload._id;

            const petRes = await requester.post('/api/pets').send({
                name: 'Luna',
                specie: 'Gato',
                birthDate: '2022-01-01'
            });
            petId = petRes.body.payload._id;
        });

        it('POST /api/adoptions/:uid/:pid - debería crear una adopción', async () => {
            const res = await requester.post(`/api/adoptions/${userId}/${petId}`);
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('message', 'Pet adopted');
        });

        it('POST /api/adoptions/:uid/:pid - debería devolver error si la mascota ya está adoptada', async () => {
            const res = await requester.post(`/api/adoptions/${userId}/${petId}`);
            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('error', 'Pet is already adopted');
        });

        it('GET /api/adoptions - debería listar todas las adopciones', async () => {
            const res = await requester.get('/api/adoptions');
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('payload');
            expect(res.body.payload).to.be.an('array');
        });

        it('GET /api/adoptions/:aid - debería retornar una adopción por ID', async () => {
            const allAdoptions = await requester.get('/api/adoptions');
            const adoptionId = allAdoptions.body.payload[0]._id;

            const res = await requester.get(`/api/adoptions/${adoptionId}`);
            expect(res.status).to.equal(200);
            expect(res.body.payload.owner).to.equal(userId);
        });
    });

    describe('*Endpoint Error Tests*', () => {
        it('GET /api/unknown - debería devolver 404 para ruta inexistente', async () => {
            const res = await requester.get('/api/unknown');
            expect(res.status).to.equal(404);
        });

        it('PUT /api/sessions/register - debería devolver error para método no permitido', async () => {
            const res = await requester.put('/api/sessions/register');
            expect(res.status).to.equal(404);
        });
    });
});
