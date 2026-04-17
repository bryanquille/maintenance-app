import { Router } from 'express';
import * as empresaController from '../controllers/index.js';
import { authMiddleware, adminMiddleware } from '../middlewares/index.js';

const router = Router();

router.get('/', authMiddleware, empresaController.getAllEmpresas);
router.get('/:id', authMiddleware, empresaController.getEmpresaById);
router.post('/', authMiddleware, adminMiddleware, empresaController.createEmpresa);
router.put('/:id', authMiddleware, adminMiddleware, empresaController.updateEmpresa);
router.delete('/:id', authMiddleware, adminMiddleware, empresaController.deleteEmpresa);

export default router;