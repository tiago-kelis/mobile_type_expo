import { Router } from 'express';
import {
  getAll, getActive, create,
  update, toggleActive, remove,
} from '../controllers/serviceController';
import { authMiddleware, adminOnly } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.get('/',          getActive);       // usuário — só ativos
router.get('/all',       adminOnly, getAll); // admin — todos
router.post('/',         adminOnly, create);
router.put('/:id',       adminOnly, update);
router.patch('/:id/active', adminOnly, toggleActive);
router.delete('/:id',    adminOnly, remove);

export default router;