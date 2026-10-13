import { Router } from 'express';
import {
  handleChatMessage,
  getKnowledgeBase,
  submitChatLead
} from '../controllers/chatbotController';

const router = Router();

// Chat message resolution
router.post('/message', handleChatMessage);

// Get knowledge base rules
router.get('/knowledge', getKnowledgeBase);

// Direct conversational lead submission
router.post('/lead', submitChatLead);

export default router;
