// utils/pdfGenerator.js
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * Gera um documento PDF para um laudo pericial
 * @param {Object} report - Objeto do laudo
 * @param {Object} caseData - Objeto do caso
 * @param {Object} user - Objeto do usuário criador
 * @returns {Promise<String>} - Caminho do arquivo PDF gerado
 */
const generatePDF = (report, caseData, user) => {
  return new Promise((resolve, reject) => {
    try {
      // Criar nome do arquivo
      const filename = `laudo_${report._id}_${Date.now()}.pdf`;
      const outputPath = path.join('uploads', 'reports', filename);
      
      // Garantir que o diretório existe
      if (!fs.existsSync(path.join('uploads', 'reports'))) {
        fs.mkdirSync(path.join('uploads', 'reports'), { recursive: true });
      }
      
      // Criar PDF
      const doc = new PDFDocument({ margin: 50 