import { Router } from 'express';
import {
  createEnquiry,
  getEnquiries,
  getEnquiryById,
  updateEnquiry,
  deleteEnquiry,
  getEnquiryStats,
  exportEnquiriesCsv
} from '../controllers/enquiryController';
import {
  validateCreateEnquiry,
  validateUpdateEnquiry
} from '../middleware/validation';

const router = Router();

// Stats route (must precede :id to prevent param collision)
router.get('/stats', getEnquiryStats);

// CSV Export
router.get('/export/csv', exportEnquiriesCsv);

// Standard CRUD REST Endpoints
router.post('/', validateCreateEnquiry, createEnquiry);
router.get('/', getEnquiries);
router.get('/:id', getEnquiryById);
router.put('/:id', validateUpdateEnquiry, updateEnquiry);
router.patch('/:id', validateUpdateEnquiry, updateEnquiry);
router.delete('/:id', deleteEnquiry);

export default router;
