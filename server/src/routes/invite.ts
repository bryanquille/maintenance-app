import { Router } from 'express';
import * as inviteController from '../controllers/index.js';
import { authMiddleware, adminMiddleware } from '../middlewares/index.js';

const router = Router();

router.post('/', authMiddleware, adminMiddleware, inviteController.createInvite);
router.get('/', authMiddleware, adminMiddleware, inviteController.getAllInvites);
router.get('/:id', authMiddleware, adminMiddleware, inviteController.getInviteById);
router.delete('/:id', authMiddleware, adminMiddleware, inviteController.deleteInvite);

export default router;