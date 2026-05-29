##### mobile 
npx expo install @react-native-async-storage/async-storage
npx expo install expo-notifications
npx expo install expo-device
npm install axios


###### Backend
cd backend
npm init -y
npm install express mysql2 jsonwebtoken bcryptjs cors dotenv
npm install -D typescript ts-node-dev @types/express @types/node @types/jsonwebtoken @types/bcryptjs @types/cors



smartBarbearia/
│
├── assets/
│   └── login.png
│
├── backend/                              ← NOVO (API Node.js + MySQL)
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts              ← NOVO: conexão MySQL
│   │   ├── controllers/
│   │   │   ├── authController.ts        ← NOVO
│   │   │   ├── appointmentController.ts ← NOVO
│   │   │   ├── professionalController.ts← NOVO
│   │   │   └── serviceController.ts     ← NOVO
│   │   ├── middleware/
│   │   │   └── auth.ts                  ← NOVO: JWT
│   │   ├── routes/
│   │   │   ├── auth.ts                  ← NOVO
│   │   │   ├── appointments.ts          ← NOVO
│   │   │   ├── professionals.ts         ← NOVO
│   │   │   └── services.ts              ← NOVO
│   │   └── app.ts                       ← NOVO: Express
│   ├── package.json                     ← NOVO
│   └── tsconfig.json                    ← NOVO
│
├── src/
│   ├── @types/
│   │   └── png.d.ts
│   │
│   ├── api/                             ← NOVO (substitui src/database/)
│   │   ├── client.ts                    ← NOVO: axios + interceptors
│   │   ├── auth.ts                      ← NOVO
│   │   ├── appointments.ts              ← NOVO
│   │   ├── professionals.ts             ← NOVO
│   │   └── services.ts                  ← NOVO
│   │
│   ├── contexts/                        ← NOVO
│   │   ├── AuthContext.tsx              ← NOVO: usuário logado global
│   │   └── ThemeContext.tsx             ← NOVO: dark/light global
│   │
│   ├── hooks/                           ← NOVO
│   │   ├── useNotifications.ts          ← NOVO: expo-notifications
│   │   └── useQueue.ts                  ← NOVO: polling da fila
│   │
│   ├── theme/                           ← NOVO
│   │   ├── dark.ts                      ← NOVO: tokens dark
│   │   ├── light.ts                     ← NOVO: tokens light
│   │   └── index.ts                     ← NOVO: export + tipos
│   │
│   ├── pages/
│   │   ├── adminDashboard/
│   │   │   ├── index.tsx                ← MODIFICADO
│   │   │   └── styles.ts                ← MODIFICADO
│   │   ├── adminProfessionals/          ← NOVO
│   │   │   ├── index.tsx                ← NOVO
│   │   │   └── styles.ts                ← NOVO
│   │   ├── adminServices/               ← NOVO
│   │   │   ├── index.tsx                ← NOVO
│   │   │   └── styles.ts                ← NOVO
│   │   ├── appointments/
│   │   │   ├── index.tsx                ← MODIFICADO
│   │   │   └── styles.ts                ← MODIFICADO
│   │   ├── dashboard/
│   │   │   ├── index.tsx                ← MODIFICADO
│   │   │   └── styles.ts                ← MODIFICADO
│   │   ├── home/
│   │   │   ├── index.tsx                ← MODIFICADO
│   │   │   └── styles.ts                ← MODIFICADO
│   │   ├── login/
│   │   │   ├── index.tsx                ← MODIFICADO
│   │   │   └── styles.ts                ← MODIFICADO
│   │   └── user/
│   │       ├── index.tsx                ← MODIFICADO
│   │       └── styles.ts                ← MODIFICADO
│   │
│   └── routers/
│       ├── index.tsx                    ← MODIFICADO
│       └── types.ts                     ← MODIFICADO
│
├── src/database/                        ← REMOVIDO
│
├── App.tsx                              ← MODIFICADO
└── index.ts



########### Zerar o banco e tabelas

USE smartclinica;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE appointments;
TRUNCATE TABLE professional_services;
TRUNCATE TABLE professionals;
TRUNCATE TABLE services;
TRUNCATE TABLE specialties;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;