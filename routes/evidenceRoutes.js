// routes/evidenceRoutes.js
const express = require('express');
const router = express.Router();
const evidenceController = require('../controllers/evidenceController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../config/multer');

router.post(
  '/',
  protect,
  authorize('admin', 'perito'),
  upload.single('file'),
  evidenceController.uploadEvidence
);

router.get('/case/:caseId', protect, evidenceController.getCaseEvidences);

router
  .route('/:id')
  .get(protect, evidenceController.getEvidence)
  .delete(protect, authorize('admin', 'perito'), evidenceController.deleteEvidence);

router.get('/:id/download', protect, evidenceController.downloadEvidence);

module.exports = router;