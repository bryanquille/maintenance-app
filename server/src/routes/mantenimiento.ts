import { Router } from 'express';
import * as mantenimientoController from '../controllers/index.js';
import { authMiddleware, tecnicoMiddleware } from '../middlewares/index.js';

const router = Router();

router.get('/empresas/:empresaId/mantenimientos', authMiddleware, mantenimientoController.getMantenimientosByEmpresa);
router.get('/carretillas/:carretillaId/mantenimientos', authMiddleware, mantenimientoController.getMantenimientosByCarretilla);
router.get('/mantenimientos/:id', authMiddleware, mantenimientoController.getMantenimientoById);
router.post('/carretillas/:carretillaId/mantenimientos', authMiddleware, tecnicoMiddleware, mantenimientoController.createMantenimiento);
router.put('/mantenimientos/:id', authMiddleware, tecnicoMiddleware, mantenimientoController.updateMantenimiento);
router.delete('/mantenimientos/:id', authMiddleware, tecnicoMiddleware, mantenimientoController.deleteMantenimiento);

export default router;