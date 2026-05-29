import { Router } from 'express';
import {
  getByDate,
  getUserAppointments,
  create,
  updateStatus,
  getStats,
  getHistory,
} from '../controllers/appointmentController';
import { authMiddleware, adminOnly } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.get('/date/:date',   getByDate);
router.get('/me',           getUserAppointments);
router.get('/stats',        adminOnly, getStats);
router.get('/history',      adminOnly, getHistory);
router.post('/',            create);

// ✅ sem adminOnly — controller verifica permissão internamente
router.patch('/:id/status', updateStatus);

export default router;