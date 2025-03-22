// server.js
const app = require('./app');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Carregando variáveis de ambiente caso ainda não tenha sido feito
dotenv.config();

// Tratamento de exceções não tratadas
process.on('uncaughtException', (err) => {
  console.error('ERRO NÃO TRATADO! Encerrando o servidor...');
  console.error(err.name, err.message);
  process.exit(1);
});

// Conexão com MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Conectado ao MongoDB'))
.catch(err => {
  console.error('Erro na conexão com MongoDB:', err);
  process.exit(1);
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT} em modo ${process.env.NODE_ENV}`);
});

// Tratamento de rejeições de promessas não tratadas
process.on('unhandledRejection', (err) => {
  console.error('ERRO DE PROMESSA NÃO TRATADA! Encerrando o servidor...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});