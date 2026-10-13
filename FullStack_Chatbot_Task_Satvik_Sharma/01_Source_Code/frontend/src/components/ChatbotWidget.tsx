import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  User, 
  RotateCcw, 
  HelpCircle,
  GraduationCap,
  Briefcase
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ChatMessage, UserType, EnquiryCategory } from '../types';
import { sendChatMessage, submitChatLead } from '../services/api';

interface ChatbotWidgetProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onLeadCaptured?: () => void;
  externalPrompt?: string;
  setExternalPrompt?: (prompt: string) => void;
}

const PREDEFINED_STARTERS = [
  'What services does DroneTV provide?',
  'What courses / training are available?',
  'How can I contact DroneTV?',
  'How can I register?',
  'I am interested in a service.',
  'I am a student.',
  'I want to speak with someone.'
];

export const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({
  isOpen,
  setIsOpen,
  onLeadCaptured,
  externalPrompt,
  setExternalPrompt
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: `👋 **Hello! I'm AeroBot, your DroneTV Support & Lead Assistant.**\n\nI can answer questions regarding DGCA pilot licenses, commercial UAV surveys, agricultural spraying, and connect you directly with certified RPTOs.\n\nSelect one of our frequently asked questions or type your inquiry below!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      quickReplies: PREDEFINED_STARTERS
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Conversational Lead capture state (Part 3 fields)
  const [isCapturingLead, setIsCapturingLead] = useState(false);
  const [leadFormData, setLeadFormData] = useState<{
    name: string;
    phone: string;
    email: string;
    user_type: UserType;
    category: EnquiryCategory;
    course_or_service: string;
    message: string;
  }>({
    name: '',
    phone: '',
    email: '',
    user_type: 'Student',
    category: 'DGCA Pilot Training',
    course_or_service: 'Small Category RPC Certification (5 Days)',
    message: ''
  });
  const [leadFormErrors, setLeadFormErrors] = useState<Record<string, string>>({});
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isCapturingLead]);

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  // Handle external prompts (e.g. clicked from a card)
  useEffect(() => {
    if (externalPrompt && externalPrompt.trim()) {
      setIsOpen(true);
      handleSend(externalPrompt);
      if (setExternalPrompt) setExternalPrompt('');
    }
  }, [externalPrompt]);

  const handleSend = async (messageToSend?: string) => {
    const text = messageToSend || inputText;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await sendChatMessage(text.trim());
      
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: response.data.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickReplies: response.data.quickReplies || PREDEFINED_STARTERS,
        actionPrompt: response.data.actionPrompt
      };

      setMessages((prev) => [...prev, botMsg]);

      // If user message or action prompt indicates lead registration intent
      const isStudentPrompt = /student/i.test(text);
      const isServicePrompt = /service/i.test(text);

      if (
        response.data.actionPrompt?.startsWith('lead_capture') ||
        response.data.isLeadIntent ||
        /register|enroll|callback|call me|speak with someone|interested in a service|student/i.test(text)
      ) {
        setIsCapturingLead(true);
        setLeadFormData((prev) => ({
          ...prev,
          user_type: isStudentPrompt ? 'Student' : isServicePrompt ? 'Customer' : prev.user_type,
          category: isStudentPrompt ? 'DGCA Pilot Training' : isServicePrompt ? 'Commercial Drone Services' : (response.data.category || prev.category),
          course_or_service: isStudentPrompt ? 'Small Category RPC Certification (5 Days)' : isServicePrompt ? 'Aerial Surveying & 3D Topographic Mapping' : prev.course_or_service
        }));
      }

      if (!isOpen) {
        setUnreadCount((c) => c + 1);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          sender: 'bot',
          text: `⚠️ I encountered a temporary connection issue. Please ensure the backend server is running or select an option below.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          quickReplies: PREDEFINED_STARTERS
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'bot',
        text: `🔄 **Chat conversation reset.** Hello again! What can I help you with today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickReplies: PREDEFINED_STARTERS
      }
    ]);
    setIsCapturingLead(false);
    setLeadFormErrors({});
  };

  const validateLeadField = (field: string, value: string) => {
    const errors = { ...leadFormErrors };
    if (field === 'name') {
      if (!value.trim() || value.trim().length < 2) {
        errors.name = 'Full name must be at least 2 characters.';
      } else {
        delete errors.name;
      }
    }
    if (field === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value.trim() || !emailRegex.test(value.trim())) {
        errors.email = 'Valid email is required.';
      } else {
        delete errors.email;
      }
    }
    if (field === 'phone') {
      const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{8,15}$/;
      if (!value.trim() || !phoneRegex.test(value.trim())) {
        errors.phone = 'Valid 10+ digit phone is required.';
      } else {
        delete errors.phone;
      }
    }
    setLeadFormErrors(errors);
  };

  const handleInlineLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    const errors: Record<string, string> = {};
    if (!leadFormData.name.trim() || leadFormData.name.trim().length < 2) {
      errors.name = 'Full name is required.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!leadFormData.email.trim() || !emailRegex.test(leadFormData.email.trim())) {
      errors.email = 'Valid email is required.';
    }
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{8,15}$/;
    if (!leadFormData.phone.trim() || !phoneRegex.test(leadFormData.phone.trim())) {
      errors.phone = 'Valid phone number is required.';
    }

    if (Object.keys(errors).length > 0) {
      setLeadFormErrors(errors);
      return;
    }

    setIsSubmittingLead(true);
    try {
      const result = await submitChatLead({
        name: leadFormData.name,
        email: leadFormData.email,
        phone: leadFormData.phone,
        user_type: leadFormData.user_type,
        category: leadFormData.category,
        course_or_service: leadFormData.course_or_service,
        message: leadFormData.message || `Lead submitted via AeroBot as ${leadFormData.user_type}`
      });

      confetti({
        particleCount: 55,
        spread: 60,
        origin: { y: 0.8 }
      });

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-lead-confirmed-${Date.now()}`,
          sender: 'bot',
          text: `🎉 **Enquiry Registered Successfully!**\n\nThank you, **${result.lead.name}**! Your request (#${result.lead.id}) as a **${result.lead.user_type}** for **${result.lead.course_or_service}** has been received.\n\nOur counselor will contact you on **${result.lead.phone}** shortly.\n\nFeel free to ask any other questions!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          quickReplies: PREDEFINED_STARTERS
        }
      ]);

      setIsCapturingLead(false);
      setLeadFormData({
        name: '',
        phone: '',
        email: '',
        user_type: 'Student',
        category: 'DGCA Pilot Training',
        course_or_service: 'Small Category RPC Certification (5 Days)',
        message: ''
      });

      if (onLeadCaptured) {
        onLeadCaptured();
      }
    } catch (err: any) {
      setLeadFormErrors({ general: err.message || 'Submission failed. Please check inputs.' });
    } finally {
      setIsSubmittingLead(false);
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <div 
        className="chatbot-launcher"
        onClick={() => setIsOpen(!isOpen)}
        title="Open AeroBot AI Assistant"
      >
        <div className="pulse-badge" />
        {unreadCount > 0 && (
          <span 
            style={{
              position: 'absolute',
              top: '-6px',
              left: '-6px',
              background: 'var(--accent-rose)',
              color: '#FFFFFF',
              fontSize: '0.7rem',
              fontWeight: 800,
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid var(--bg-primary)'
            }}
          >
            {unreadCount}
          </span>
        )}
        {isOpen ? <X size={26} /> : <Bot size={28} />}
      </div>

      {/* Expandable Chat Window */}
      {isOpen && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chat-header">
            <div className="chat-bot-info">
              <div className="chat-bot-avatar">
                <Bot size={20} />
              </div>
              <div>
                <div className="chat-bot-title">AeroBot Support & Lead Assistant</div>
                <div className="chat-bot-status">
                  <span className="status-dot"></span>
                  <span>Online • Predefined & Rule-Based Engine</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <button
                type="button"
                className="close-btn"
                onClick={handleResetChat}
                title="Reset conversation"
              >
                <RotateCcw size={14} />
              </button>
              <button
                type="button"
                className="close-btn"
                onClick={() => setIsOpen(false)}
                title="Close chat"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="chat-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`message-row ${msg.sender}`}>
                {msg.sender === 'bot' && (
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    background: 'rgba(0, 210, 255, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-cyan)',
                    flexShrink: 0
                  }}>
                    <Bot size={15} />
                  </div>
                )}

                <div style={{ maxWidth: '85%' }}>
                  <div className="message-bubble">
                    <div style={{ whiteSpace: 'pre-wrap' }}>
                      {msg.text.split('\n').map((line, i) => {
                        const parts = line.split(/(\*\*.*?\*\*)/g);
                        return (
                          <div key={i} style={{ minHeight: line ? 'auto' : '0.5rem' }}>
                            {parts.map((part, pIdx) => {
                              if (part.startsWith('**') && part.endsWith('**')) {
                                return <strong key={pIdx} style={{ color: '#00D2FF' }}>{part.slice(2, -2)}</strong>;
                              }
                              return part;
                            })}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Predefined Quick Replies */}
                  {msg.quickReplies && msg.quickReplies.length > 0 && (
                    <div className="quick-replies-container">
                      {msg.quickReplies.map((reply, rIdx) => (
                        <button
                          key={rIdx}
                          type="button"
                          className="quick-reply-btn"
                          onClick={() => handleSend(reply)}
                        >
                          {reply}
                        </button>
                      ))}
                    </div>
                  )}

                  <div style={{ 
                    fontSize: '0.68rem', 
                    color: 'var(--text-dim)', 
                    marginTop: '0.25rem',
                    textAlign: msg.sender === 'user' ? 'right' : 'left'
                  }}>
                    {msg.timestamp}
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    flexShrink: 0
                  }}>
                    <User size={15} />
                  </div>
                )}
              </div>
            ))}

            {/* Conversational Inline Lead Form (Part 3 Specification) */}
            {isCapturingLead && (
              <div 
                className="glass-card" 
                style={{ 
                  padding: '1rem', 
                  borderRadius: '12px', 
                  border: '1px solid rgba(0, 210, 255, 0.4)',
                  background: 'rgba(16, 26, 48, 0.95)',
                  marginTop: '0.5rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
                  <Sparkles size={16} style={{ color: 'var(--accent-cyan)' }} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFFFFF' }}>
                    Enquiry & Lead Details
                  </span>
                </div>

                <form onSubmit={handleInlineLeadSubmit}>
                  {leadFormErrors.general && (
                    <div style={{ color: 'var(--accent-rose)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
                      {leadFormErrors.general}
                    </div>
                  )}

                  {/* Name */}
                  <div style={{ marginBottom: '0.6rem' }}>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Your Full Name *"
                      value={leadFormData.name}
                      onChange={(e) => {
                        setLeadFormData({ ...leadFormData, name: e.target.value });
                        validateLeadField('name', e.target.value);
                      }}
                      style={{ padding: '0.45rem 0.75rem', fontSize: '0.82rem' }}
                    />
                    {leadFormErrors.name && (
                      <div className="form-error">{leadFormErrors.name}</div>
                    )}
                  </div>

                  {/* Phone & Email */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.6rem' }}>
                    <div>
                      <input
                        type="tel"
                        className="form-input"
                        placeholder="Phone / WhatsApp *"
                        value={leadFormData.phone}
                        onChange={(e) => {
                          setLeadFormData({ ...leadFormData, phone: e.target.value });
                          validateLeadField('phone', e.target.value);
                        }}
                        style={{ padding: '0.45rem 0.75rem', fontSize: '0.82rem' }}
                      />
                      {leadFormErrors.phone && (
                        <div className="form-error">{leadFormErrors.phone}</div>
                      )}
                    </div>
                    <div>
                      <input
                        type="email"
                        className="form-input"
                        placeholder="Email Address *"
                        value={leadFormData.email}
                        onChange={(e) => {
                          setLeadFormData({ ...leadFormData, email: e.target.value });
                          validateLeadField('email', e.target.value);
                        }}
                        style={{ padding: '0.45rem 0.75rem', fontSize: '0.82rem' }}
                      />
                      {leadFormErrors.email && (
                        <div className="form-error">{leadFormErrors.email}</div>
                      )}
                    </div>
                  </div>

                  {/* User Type: Student / Customer / Other (PDF Requirement) */}
                  <div style={{ marginBottom: '0.6rem' }}>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem', display: 'block' }}>
                      User Type:
                    </label>
                    <select
                      className="form-select"
                      value={leadFormData.user_type}
                      onChange={(e) => setLeadFormData({ ...leadFormData, user_type: e.target.value as UserType })}
                      style={{ padding: '0.45rem 0.75rem', fontSize: '0.82rem' }}
                    >
                      <option value="Student">Student (Pilot Training / Academy)</option>
                      <option value="Customer">Customer (Commercial Drone Services)</option>
                      <option value="Other">Other (Enterprise / General)</option>
                    </select>
                  </div>

                  {/* Service or Course of Interest */}
                  <div style={{ marginBottom: '0.6rem' }}>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Service or Course of interest"
                      value={leadFormData.course_or_service}
                      onChange={(e) => setLeadFormData({ ...leadFormData, course_or_service: e.target.value })}
                      style={{ padding: '0.45rem 0.75rem', fontSize: '0.82rem' }}
                    />
                  </div>

                  {/* Message */}
                  <div style={{ marginBottom: '0.75rem' }}>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Message or specific questions..."
                      value={leadFormData.message}
                      onChange={(e) => setLeadFormData({ ...leadFormData, message: e.target.value })}
                      style={{ padding: '0.45rem 0.75rem', fontSize: '0.82rem' }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => setIsCapturingLead(false)}
                      style={{ fontSize: '0.75rem', padding: '0.35rem 0.7rem' }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary btn-sm"
                      disabled={isSubmittingLead}
                      style={{ fontSize: '0.75rem', padding: '0.35rem 0.8rem' }}
                    >
                      {isSubmittingLead ? 'Submitting...' : 'Submit Enquiry'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Loading typing indicator */}
            {isLoading && (
              <div className="message-row bot">
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  background: 'rgba(0, 210, 255, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-cyan)'
                }}>
                  <Bot size={15} />
                </div>
                <div className="message-bubble" style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-cyan)', animation: 'pulse 1s infinite' }}></span>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-cyan)', animation: 'pulse 1s infinite 0.2s' }}></span>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-cyan)', animation: 'pulse 1s infinite 0.4s' }}></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="chat-input-bar">
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask a question or select a predefined query..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSend();
                }
              }}
              disabled={isLoading}
            />
            <button
              type="button"
              className="chat-send-btn"
              onClick={() => handleSend()}
              disabled={!inputText.trim() || isLoading}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
