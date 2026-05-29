import { Router } from 'express';
import {
  getMyProfile,
  getMyAppointments,
  getMySchedule,
  getMyQueue,
  toggleMyDuty,
  updateMyProfile,
  sendPrescription,
  setDelay,
  updateMySpecialty,
  updateMyServices,
} from '../controllers/professionalPortalController';
import { authMiddleware, professionalOnly } from '../middleware/auth';

const router = Router();
router.use(authMiddleware);
router.use(professionalOnly);

router.get('/me',           getMyProfile);
router.get('/appointments', getMyAppointments);
router.get('/schedule',     getMySchedule);
router.get('/queue',        getMyQueue);        // ✅ fila da especialidade
router.patch('/duty',       toggleMyDuty);
router.put('/profile',      updateMyProfile);
router.post('/prescription', sendPrescription); // ✅ enviar receita
router.post('/delay',       setDelay);          // ✅ setar atraso
router.patch('/specialty', updateMySpecialty);
router.put('/services', updateMyServices);

export default router;