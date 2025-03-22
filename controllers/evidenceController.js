// controllers/evidenceController.js
const Evidence = require('../models/Evidence');
const Case = require('../models/Case');
const fs = require('fs');
const path = require('path');
const upload = require('../config/multer');

// @desc    Upload de evidência
// @route   POST /api/evidences
// @access  Private (Perito, Admin)
exports.uploadEvidence = async (req, res) => {
  try {
    // Upload do arquivo é manipulado por middleware multer
    if (!req.file) {
      return res.status(400).json({ message: 'Por favor, forneça um arquivo' });
    }
    
    const { caseId, title, description, category } = req.body;
    
    // Verificar se o caso existe
    const caseItem = await Case.findById(caseId);
    
    if (!caseItem) {
      // Remover o arquivo se o caso não existir
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: 'Caso não encontrado' });
    }
    
    // Criar evidência
    const evidence = await Evidence.create({
      caseId,
      title,
      description,
      category,
      filePath: req.file.path,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      createdBy: req.user.id
    });
    
    // Adicionar a evidência ao caso
    await Case.findByIdAndUpdate(caseId, {
      $push: { evidences: evidence._id }
    });
    
    res.status(201).json({
      success: true,
      data: evidence
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Obter todas as evidências de um caso
// @route   GET /api/evidences/case/:caseId
// @access  Private
exports.getCaseEvidences = async (req, res) => {
  try {
    const evidences = await Evidence.find({ caseId: req.params.caseId })
      .populate('createdBy', 'name');
    
    res.status(200).json({
      success: true,
      count: evidences.length,
      data: evidences
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Obter uma evidência
// @route   GET /api/evidences/:id
// @access  Private
exports.getEvidence = async (req, res) => {
  try {
    const evidence = await Evidence.findById(req.params.id)
      .populate('createdBy', 'name')
      .populate('caseId', 'title');
    
    if (!evidence) {
      return res.status(404).json({ message: 'Evidência não encontrada' });
    }
    
    res.status(200).json({
      success: true,
      data: evidence
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Baixar arquivo de evidência
// @route   GET /api/evidences/:id/download
// @access  Private
exports.downloadEvidence = async (req, res) => {
  try {
    const evidence = await Evidence.findById(req.params.id);
    
    if (!evidence) {
      return res.status(404).json({ message: 'Evidência não encontrada' });
    }
    
    const file = path.resolve(evidence.filePath);
    
    if (!fs.existsSync(file)) {
      return res.status(404).json({ message: 'Arquivo não encontrado' });
    }
    
    res.download(file);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Excluir evidência
// @route   DELETE /api/evidences/:id
// @access  Private (Perito, Admin)
exports.deleteEvidence = async (req, res) => {
  try {
    const evidence = await Evidence.findById(req.params.id);
    
    if (!evidence) {
      return res.status(404).json({ message: 'Evidência não encontrada' });
    }
    
    // Verificar se o usuário é o criador da evidência ou um admin
    if (evidence.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: 'Usuário não tem permissão para excluir esta evidência' 
      });
    }
    
    // Remover o arquivo
    if (fs.existsSync(evidence.filePath)) {
      fs.unlinkSync(evidence.filePath);
    }
    
    // Remover a referência no caso
    await Case.findByIdAndUpdate(evidence.caseId, {
      $pull: { evidences: evidence._id }
    });
    
    // Remover a evidência
    await evidence.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
