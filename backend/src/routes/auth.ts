import { Router } from 'express';
import { login, register, registerProfessional } from '../controllers/authController';

const router = Router();

router.post('/login',    login);
router.post('/register', register);
router.post('/register-professional', registerProfessional);

export default router;