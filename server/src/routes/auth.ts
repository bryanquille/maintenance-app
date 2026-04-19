import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import * as authController from '../controllers/index.js';
import { authMiddleware } from '../middlewares/index.js';

const router = Router();

const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, error: 'Demasiados intentos de inicio de sesión. Intenta en 15 minutos' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/register', authController.register);
router.post('/login', loginRateLimit, authController.login);
router.get('/me', authMiddleware, authController.getMe);

export default router;