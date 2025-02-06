import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import logger from './utils/logger.js';
import config from './config/config.js';

import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import mockingRoutes from './routes/mocking.router.js';

import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const app = express();
const PORT = config.port;
const connectionString = config.dbUri;

logger.info(`Aplicación ejecutándose en modo: ${config.env}`);

app.use((req, res, next) => {
    logger.http(`Solicitud entrante: ${req.method} ${req.url}`);
    next();
});

app.use(express.json());
app.use(cookieParser());

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation Adoptme',
            version: '1.0.0',
            description: 'API documentation for the project',
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
            },
        ],
    },
    apis: ['./src/docs/*.yaml'],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/api/users', usersRouter);
app.use('/api/pets', petsRouter);
app.use('/api/adoptions', adoptionsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api', mockingRoutes);

app.get('/loggerTest', (req, res) => {
    logger.debug('Mensaje de nivel DEBUG');
    logger.http('Mensaje de nivel HTTP');
    logger.info('Mensaje de nivel INFO');
    logger.warning('Mensaje de nivel WARNING');
    logger.error('Mensaje de nivel ERROR');
    logger.fatal('Mensaje de nivel FATAL');
    res.send('Prueba de logger realizada. Revisa los logs para más detalles.');
});

app.use((err, req, res, next) => {
    logger.error(`Error no manejado: ${err.message}`);
    res.status(500).send('Ocurrió un error inesperado');
});

mongoose.set('strictQuery', false);
mongoose.connect(connectionString)
    .then(() => logger.info('Conexión a MongoDB establecida'))
    .catch(err => logger.fatal(`Error al conectar a MongoDB: ${err.message}`));

app.listen(PORT, () => logger.info(`Servidor escuchando en el puerto ${PORT}`));

export default app;