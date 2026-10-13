import { Request, Response } from 'express';
import { KNOWLEDGE_BASE, FALLBACK_SUGGESTIONS, PREDEFINED_QUESTIONS, KnowledgeRule } from '../data/chatbotRules';
import { db } from '../db/connection';
import { Enquiry } from '../types/enquiry';

// Normalization helper
function cleanText(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

// Check rule score
function scoreRule(userText: string, rule: KnowledgeRule): number {
  const cleaned = cleanText(userText);
  const words = cleaned.split(' ');
  let score = 0;

  for (const keyword of rule.keywords) {
    const cleanKeyword = cleanText(keyword);
    // Exact phrase match receives highest priority
    if (cleaned === cleanKeyword || cleaned.includes(cleanKeyword)) {
      score += 10;
    } else {
      // Token overlap
      const keyTokens = cleanKeyword.split(' ');
      for (const token of keyTokens) {
        if (token.length > 2 && words.includes(token)) {
          score += 2;
        }
      }
    }
  }

  // Bonus if title matches
  if (cleaned.includes(cleanText(rule.title))) {
    score += 5;
  }

  return score;
}

// Process user message
export function handleChatMessage(req: Request, res: Response): void {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      res.status(400).json({
        success: false,
        message: 'A message string is required.'
      });
      return;
    }

    const trimmed = message.trim();
    const cleaned = cleanText(trimmed);

    // Score knowledge base items
    let bestMatch: KnowledgeRule | null = null;
    let highestScore = 0;

    for (const rule of KNOWLEDGE_BASE) {
      const score = scoreRule(trimmed, rule);
      if (score > highestScore) {
        highestScore = score;
        bestMatch = rule;
      }
    }

    // Determine lead intent
    const isLeadIntent = /(register|enroll|admission|book|quote|quotation|callback|speak with someone|interested in a service)/i.test(trimmed);

    // Minimum threshold for confident match
    if (bestMatch && highestScore >= 2) {
      res.json({
        success: true,
        type: 'match',
        data: {
          id: bestMatch.id,
          title: bestMatch.title,
          category: bestMatch.category,
          response: bestMatch.response,
          quickReplies: bestMatch.quickReplies,
          actionPrompt: bestMatch.actionPrompt,
          isLeadIntent
        }
      });
      return;
    }

    // Graceful fallback for unknown/unmatched questions (PDF Page 3 requirement)
    const fallbackResponse = `👋 **Welcome to AeroBot Support!**\n\nI couldn't find an exact answer to that question, but I can assist you with:\n\n• **DGCA Drone Pilot Training & Certifications** (Small & Medium)\n• **Commercial Drone Services** (3D Surveying, Agri Spraying, Solar Audits)\n• **Eligibility Requirements & DigitalSky Compliance**\n• **Student Drone Academies & Internships**\n• **Direct Counselor Callback & Registration**\n\nPlease select one of the popular questions below or type your inquiry!`;

    res.json({
      success: true,
      type: 'fallback',
      data: {
        title: 'DroneTV Support Overview',
        category: 'Help & FAQ',
        response: fallbackResponse,
        quickReplies: FALLBACK_SUGGESTIONS,
        actionPrompt: 'prompt_options'
      }
    });
  } catch (error: any) {
    console.error('Chatbot error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process chat message.'
    });
  }
}

// Get all knowledge base rules and predefined questions
export function getKnowledgeBase(req: Request, res: Response): void {
  try {
    res.json({
      success: true,
      count: KNOWLEDGE_BASE.length,
      predefinedQuestions: PREDEFINED_QUESTIONS,
      data: KNOWLEDGE_BASE
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve knowledge base.'
    });
  }
}

// Fast-track conversational lead capture from chat
export function submitChatLead(req: Request, res: Response): void {
  try {
    const { 
      name, 
      email, 
      phone, 
      user_type = 'Student', 
      city, 
      category, 
      course_or_service, 
      message 
    } = req.body;

    // Validate inputs
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      res.status(400).json({ success: false, message: 'Name must be at least 2 characters.' });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      res.status(400).json({ success: false, message: 'A valid email address is required.' });
      return;
    }
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{8,15}$/;
    if (!phone || !phoneRegex.test(phone.trim())) {
      res.status(400).json({ success: false, message: 'A valid phone number (minimum 10 digits) is required.' });
      return;
    }

    const safeUserType = ['Student', 'Customer', 'Other'].includes(user_type) ? user_type : 'Student';

    const stmt = db.prepare(`
      INSERT INTO enquiries (
        name, email, phone, user_type, city, category, course_or_service, message,
        priority, source, status, created_at, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?,
        ?, 'High', 'chatbot', 'New', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      )
    `);

    const result = stmt.run(
      name.trim(),
      email.trim().toLowerCase(),
      phone.trim(),
      safeUserType,
      (city || 'Not Specified').trim(),
      category || (safeUserType === 'Student' ? 'DGCA Pilot Training' : 'Commercial Drone Services'),
      course_or_service || 'Chatbot Fast-Track Enquiry',
      message || 'Submitted via AeroBot Conversational Assistant'
    );

    const lead = db.prepare('SELECT * FROM enquiries WHERE id = ?').get(result.lastInsertRowid) as Enquiry;

    res.status(201).json({
      success: true,
      message: `Thank you ${lead.name}! Your enquiry (#${lead.id}) as a ${lead.user_type} has been registered.`,
      lead
    });
  } catch (error: any) {
    console.error('Chat lead submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record chat lead.'
    });
  }
}
