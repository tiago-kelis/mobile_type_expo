import { Router } from 'express';
import { getAll, create, remove } from '../controllers/specialtyController';
import { authMiddleware, adminOnly } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.get('/',      getAll);
router.post('/',     adminOnly, create);
router.delete('/:id', adminOnly, remove);

export default router;