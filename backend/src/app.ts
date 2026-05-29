console.log('🔄 Iniciando...');
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabase } from './config/database';
import authRoutes         from './routes/auth';
import appointmentRoutes  from './routes/appointments';
import professionalRoutes from './routes/professionals';
import serviceRoutes      from './routes/services';
import specialtyRoutes    from './routes/specialties';
import { seedAdmin } from './config/seedAdmin';
import {
  autoStartAppointments,
  autoFinishAppointments,
} from './controllers/appointmentController';
import professionalPortalRoutes from './routes/professional-portal';

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 3333;

app.use(cors());
app.use(express.json());

app.use('/auth',          authRoutes);
app.use('/appointments',  appointmentRoutes);
app.use('/professionals', professionalRoutes);
app.use('/services',      serviceRoutes);
app.use('/specialties',   specialtyRoutes);

app.use('/professional-portal', professionalPortalRoutes);

app.get('/health', (_, res) => res.json({ ok: true }));


initDatabase()
  .then(async () => {
    await seedAdmin();

    // ✅ único app.listen — scheduler dentro do callback
    app.listen(PORT, () => {
      console.log(`🚀 API rodando em http://localhost:${PORT}`);

      const scheduler = setInterval(async () => {
        await autoStartAppointments();
        await autoFinishAppointments();
      }, 30000);

      console.log('⏰ Auto-scheduler iniciado (30s)');

      process.on('SIGTERM', () => clearInterval(scheduler));
      process.on('SIGINT',  () => clearInterval(scheduler));
    });
  })
  .catch((err) => {
    console.error('❌ Erro ao inicializar banco:', err);
    process.exit(1);
  });

export default app;