import { Router } from 'express';
import * as carretillaController from '../controllers/index.js';
import { authMiddleware, tecnicoMiddleware } from '../middlewares/index.js';

const router = Router();

router.get('/empresas/:empresaId/carretillas', authMiddleware, carretillaController.getCarretillasByEmpresa);
router.get('/carretillas/:id', authMiddleware, carretillaController.getCarretillaById);
router.post('/empresas/:empresaId/carretillas', authMiddleware, tecnicoMiddleware, carretillaController.createCarretilla);
router.put('/carretillas/:id', authMiddleware, tecnicoMiddleware, carretillaController.updateCarretilla);
router.delete('/carretillas/:id', authMiddleware, tecnicoMiddleware, carretillaController.deleteCarretilla);

export default router;