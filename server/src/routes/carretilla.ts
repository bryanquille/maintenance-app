import { Router } from 'express';
import * as carretillaController from '../controllers/index.js';
import { authMiddleware, tecnicoMiddleware, empresaMiddleware } from '../middlewares/index.js';

const router = Router();

router.get('/empresas/:empresaId/carretillas', authMiddleware, empresaMiddleware, carretillaController.getCarretillasByEmpresa);
router.get('/carretillas/:id', authMiddleware, empresaMiddleware, carretillaController.getCarretillaById);
router.post('/empresas/:empresaId/carretillas', authMiddleware, empresaMiddleware, tecnicoMiddleware, carretillaController.createCarretilla);
router.put('/carretillas/:id', authMiddleware, empresaMiddleware, tecnicoMiddleware, carretillaController.updateCarretilla);
router.delete('/carretillas/:id', authMiddleware, empresaMiddleware, tecnicoMiddleware, carretillaController.deleteCarretilla);

export default router;