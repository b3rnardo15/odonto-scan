// controllers/caseController.js
const Case = require('../models/Case');

// @desc    Criar novo caso
// @route   POST /api/cases
// @access  Private (Perito, Admin)
exports.createCase = async (req, res) => {
  try {
    req.body.createdBy = req.user.id;
    
    const newCase = await Case.create(req.body);
    
    res.status(201).json({
      success: true,
      data: newCase
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Obter todos os casos
// @route   GET /api/cases
// @access  Private
exports.getCases = async (req, res) => {
  try {
    // Construir a consulta
    let query;
    
    // Cópia do req.query
    const reqQuery = { ...req.query };
    
    // Campos para excluir
    const removeFields = ['select', 'sort', 'page', 'limit'];
    removeFields.forEach(param => delete reqQuery[param]);
    
    // Criar operadores de consulta ($gt, $gte, etc.)
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    
    // Encontrar recursos
    query = Case.find(JSON.parse(queryStr))
      .populate('createdBy', 'name')
      .populate('assignedTo', 'name');
    
    // Campos específicos
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }
    
    // Ordenação
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }
    
    // Paginação
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Case.countDocuments(JSON.parse(queryStr));
    
    query = query.skip(startIndex).limit(limit);
    
    // Executar consulta
    const cases = await query;
    
    // Resultado da paginação
    const pagination = {};
    
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }
    
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }
    
    res.status(200).json({
      success: true,
      count: cases.length,
      pagination,
      data: cases
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Obter caso único
// @route   GET /api/cases/:id
// @access  Private
exports.getCase = async (req, res) => {
  try {
    const caseItem = await Case.findById(req.params.id)
      .populate('createdBy', 'name')
      .populate('assignedTo', 'name')
      .populate('patients')
      .populate('evidences')
      .populate('reports');
    
    if (!caseItem) {
      return res.status(404).json({ message: 'Caso não encontrado' });
    }
    
    res.status(200).json({
      success: true,
      data: caseItem
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Atualizar caso
// @route   PUT /api/cases/:id
// @access  Private (Perito, Admin)
exports.updateCase = async (req, res) => {
  try {
    let caseItem = await Case.findById(req.params.id);
    
    if (!caseItem) {
      return res.status(404).json({ message: 'Caso não encontrado' });
    }
    
    // Verificar se o usuário é o criador do caso ou um admin
    if (caseItem.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: 'Usuário não tem permissão para atualizar este caso' 
      });
    }
    
    caseItem = await Case.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: caseItem
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Excluir caso
// @route   DELETE /api/cases/:id
// @access  Private (Admin)
exports.deleteCase = async (req, res) => {
  try {
    const caseItem = await Case.findById(req.params.id);
    
    if (!caseItem) {
      return res.status(404).json({ message: 'Caso não encontrado' });
    }
    
    // Apenas admin pode excluir casos
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: 'Apenas administradores podem excluir casos' 
      });
    }
    
    await caseItem.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};