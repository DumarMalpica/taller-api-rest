import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { dbConnection } from './drivers/connect-db.mjs';
import { swaggerSpec } from './swagger.mjs';
import routesAuth from './routes/routes-auth.mjs';
import routesEmpresa from './routes/routes-empresa.mjs';
import routesEmpleados from './routes/routes-empleados.mjs';

dotenv.config();

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

// Conexión a MongoDB Atlas
dbConnection();

// Middlewares globales
app.use(express.json());

// Documentación Swagger
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas
app.use('/api/auth', routesAuth);
app.use('/api/empresas', routesEmpresa);
app.use('/api/empleados', routesEmpleados);

// Health check
app.get('/ping', (req, res) => res.json({ state: true, msg: 'pong' }));

// Inicio del servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Swagger UI disponible en http://localhost:${PORT}/api/docs`);
});
