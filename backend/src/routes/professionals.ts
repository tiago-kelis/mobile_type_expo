import { Router } from 'express';
import {
  getAll,
  getOnDuty,
  getByService,
  create,
  updateServices,
  toggleDuty,
  toggleActive,
  remove,
  approveProfessional,
} from '../controllers/professionalController';
import { authMiddleware, adminOnly } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.get('/',                    getAll);
router.get('/on-duty',             getOnDuty);
router.get('/by-service/:serviceId', getByService); // ✅ novo
router.post('/',                   adminOnly, create);
router.put('/:id/services',        adminOnly, updateServices); // ✅ novo
router.patch('/:id/duty',          adminOnly, toggleDuty);
router.patch('/:id/active',        adminOnly, toggleActive);
router.delete('/:id',              adminOnly, remove);
router.patch('/:id/approve', adminOnly, approveProfessional);

export default router;