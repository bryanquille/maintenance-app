import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import config from './config/index.js';
import authRoutes from './routes/auth.js';
import empresaRoutes from './routes/empresa.js';
import carretillaRoutes from './routes/carretilla.js';
import mantenimientoRoutes from './routes/mantenimiento.js';
import { errorMiddleware, notFoundMiddleware } from './middlewares/index.js';

const app = express();

app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/empresas', empresaRoutes);
app.use('/api', carretillaRoutes);
app.use('/api', mantenimientoRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

const startServer = async () => {
  try {
    await mongoose.connect(config.mongodbUri);
    console.log('Conectado a MongoDB');

    app.listen(config.port, () => {
      console.log(`Servidor corriendo en puerto ${config.port}`);
    });
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
    process.exit(1);
  }
};

startServer();