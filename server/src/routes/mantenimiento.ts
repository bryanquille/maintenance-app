import { Router } from 'express';
import * as mantenimientoController from '../controllers/index.js';
import { authMiddleware, tecnicoMiddleware, empresaMiddleware } from '../middlewares/index.js';

const router = Router();

router.get('/empresas/:empresaId/mantenimientos', authMiddleware, empresaMiddleware, mantenimientoController.getMantenimientosByEmpresa);
router.get('/carretillas/:carretillaId/mantenimientos', authMiddleware, empresaMiddleware, mantenimientoController.getMantenimientosByCarretilla);
router.get('/mantenimientos/:id', authMiddleware, empresaMiddleware, mantenimientoController.getMantenimientoById);
router.post('/carretillas/:carretillaId/mantenimientos', authMiddleware, empresaMiddleware, tecnicoMiddleware, mantenimientoController.createMantenimiento);
router.put('/mantenimientos/:id', authMiddleware, empresaMiddleware, tecnicoMiddleware, mantenimientoController.updateMantenimiento);
router.delete('/mantenimientos/:id', authMiddleware, empresaMiddleware, tecnicoMiddleware, mantenimientoController.deleteMantenimiento);

export default router;