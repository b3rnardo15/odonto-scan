// app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const dotenv = require('dotenv');
const path = require('path');
const errorHandler = require('./middleware/error');

// Carregando variáveis de ambiente
dotenv.config();

// Inicializando o app Express
const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos da pasta uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Importando rotas
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const caseRoutes = require('./routes/caseRoutes');
const evidenceRoutes = require('./routes/evidenceRoutes');
const patientRoutes = require('./routes/patientRoutes');
const dentalRecordRoutes = require('./routes/dentalRecordRoutes');
const reportRoutes = require('./routes/reportRoutes');

// Rotas base
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/evidences', evidenceRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/dental-records', dentalRecordRoutes);
app.use('/api/reports', reportRoutes);

// Rota de status
app.get('/api/status', (req, res) => {
  res.status(200).json({ 
    status: 'success', 
    message: 'API funcionando corretamente',
    version: '1.0.0'
  });
});

// Middleware de tratamento de erros
app.use(errorHandler);

module.exports = app;