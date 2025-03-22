// routes/caseRoutes.js
const express = require('express');
const router = express.Router();
const caseController = require('../controllers/caseController');
const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(protect, caseController.getCases)
  .post(protect, authorize('admin', 'perito'), caseController.createCase);

router
  .route('/:id')
  .get(protect, caseController.getCase)
  .put(protect, authorize('admin', 'perito'), caseController.updateCase)
  .delete(protect, authorize('admin'), caseController.deleteCase);

module.exports = router;