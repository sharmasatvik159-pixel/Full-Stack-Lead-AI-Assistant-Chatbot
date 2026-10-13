import React, { useState, useEffect } from 'react';
import { 
  X, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  GraduationCap,
  Briefcase
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { EnquiryCategory, CreateEnquiryInput, UserType } from '../types';
import { createEnquiry } from '../services/api';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: EnquiryCategory;
  initialCourse?: string;
  onSuccess?: () => void;
}

const CATEGORY_COURSE_OPTIONS: Record<EnquiryCategory, string[]> = {
  'DGCA Pilot Training': [
    'Small Category RPC Certification (5 Days)',
    'Medium Category Drone Pilot Certification (10 Days)',
    'DGCA Certified Drone Flight Instructor (CFI)',
    'Night Flying & Advanced Simulator Endorsement',
    'Drone Surveying & GIS Mapping Specialist Course'
  ],
  'Commercial Drone Services': [
    'Aerial Surveying & 3D Topographic Mapping',
    'Agricultural Spraying & Crop Health Multispectral',
    'Thermal Solar Farm Inspection & Defect Analysis',
    'Highways & Infrastructure LiDAR Survey',
    'Transmission Line & Telecom Tower Audits'
  ],
  'Drone Rentals & Sales': [
    'DJI Inspire 3 / Cine 8K Drone Rental with Pilot',
    'DJI Matrice 350 RTK Industrial Survey Drone Rental',
    'Heavy-Lift Agricultural Drone Purchase / Leasing',
    'Customized FPV Fleet for Film Production'
  ],
  'College / Student Academy': [
    'Campus Drone Lab Setup & Faculty Development',
    '3-Day Student Hands-on UAV Engineering Bootcamp',
    'UAV Aerodynamics & Autonomous Waypoint Coding',
    'College Drone Club Sponsorship & MoU'
  ],
  'Regulatory & DigitalSky Guidance': [
    'UIN Registration & DigitalSky Flight Permission Filing',
    'Type Certification (TC) Consultation for Drone OEMs',
    'DGCA RPTO Establishment Consultation',
    'Airspace Clearance in Yellow/Red Zones'
  ],
  'General Enquiry': [
    'General Consultation with DroneTV Advisory Desk',
    'Corporate Drone Program Consultation',
    'Media / Press / Partnership'
  ]
};

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  isOpen,
  onClose,
  initialCategory = 'DGCA Pilot Training',
  initialCourse = '',
  onSuccess
}) => {
  const [formData, setFormData] = useState<CreateEnquiryInput>({
    name: '',
    email: '',
    phone: '',
    user_type: 'Student',
    city: '',
    category: initialCategory,
    course_or_service: initialCourse || CATEGORY_COURSE_OPTIONS[initialCategory][0],
    message: '',
    source: 'website_form',
    priority: 'Medium'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<any | null>(null);

  useEffect(() => {
    if (initialCategory) {
      setFormData((prev) => ({
        ...prev,
        category: initialCategory,
        course_or_service: initialCourse || CATEGORY_COURSE_OPTIONS[initialCategory][0]
      }));
    }
  }, [initialCategory, initialCourse]);

  if (!isOpen) return null;

  const validateField = (field: string, value: string) => {
    const newErrors = { ...errors };

    if (field === 'name') {
      if (!value.trim() || value.trim().length < 2) {
        newErrors.name = 'Please enter your full name (minimum 2 characters).';
      } else {
        delete newErrors.name;
      }
    }

    if (field === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value.trim() || !emailRegex.test(value.trim())) {
        newErrors.email = 'Please enter a valid email address (e.g. name@example.com).';
      } else {
        delete newErrors.email;
      }
    }

    if (field === 'phone') {
      const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{8,15}$/;
      if (!value.trim() || !phoneRegex.test(value.trim())) {
        newErrors.phone = 'Please enter a valid phone or WhatsApp number (minimum 10 digits).';
      } else {
        delete newErrors.phone;
      }
    }

    setErrors(newErrors);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCat = e.target.value as EnquiryCategory;
    setFormData({
      ...formData,
      category: newCat,
      course_or_service: CATEGORY_COURSE_OPTIONS[newCat] ? CATEGORY_COURSE_OPTIONS[newCat][0] : 'General Inquiry'
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    const formErrors: Record<string, string> = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      formErrors.name = 'Full name is required.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      formErrors.email = 'Valid email address is required.';
    }
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{8,15}$/;
    if (!formData.phone.trim() || !phoneRegex.test(formData.phone.trim())) {
      formErrors.phone = 'Valid phone number is required.';
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createEnquiry(formData);
      setSubmitSuccess(res.data);

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setErrors({ submit: err.message || 'Submission failed. Please check inputs.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      user_type: 'Student',
      city: '',
      category: 'DGCA Pilot Training',
      course_or_service: CATEGORY_COURSE_OPTIONS['DGCA Pilot Training'][0],
      message: '',
      source: 'website_form',
      priority: 'Medium'
    });
    setErrors({});
    setSubmitSuccess(null);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title">
            <Sparkles size={20} style={{ color: 'var(--accent-cyan)' }} />
            <span>Course & Service Enquiry</span>
          </div>
          <button type="button" className="close-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {submitSuccess ? (
          /* Success Screen */
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.15)',
              color: 'var(--accent-emerald)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem'
            }}>
              <CheckCircle2 size={36} />
            </div>

            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#FFFFFF' }}>
              Enquiry Submitted Successfully!
            </h3>
            
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '1.5rem', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
              Thank you, <strong style={{ color: '#FFFFFF' }}>{submitSuccess.name}</strong>. Your enquiry has been received by DroneTV.
            </p>

            <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.75rem', textAlign: 'left', background: 'rgba(7, 11, 20, 0.7)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.85rem' }}>
                <div>
                  <span style={{ color: 'var(--text-dim)' }}>Reference ID:</span>
                  <div style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>#{submitSuccess.id}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-dim)' }}>User Type:</span>
                  <div><span className="badge badge-indigo">{submitSuccess.user_type}</span></div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-dim)' }}>Program:</span>
                  <div style={{ fontWeight: 600, color: '#FFFFFF' }}>{submitSuccess.course_or_service}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-dim)' }}>Status:</span>
                  <div><span className="badge badge-amber">{submitSuccess.status}</span></div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleResetForm}
              >
                Submit Another Enquiry
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={onClose}
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          /* Enquiry Form */
          <form onSubmit={handleSubmit}>
            {errors.submit && (
              <div style={{
                background: 'rgba(244, 63, 94, 0.15)',
                border: '1px solid rgba(244, 63, 94, 0.4)',
                borderRadius: '8px',
                padding: '0.75rem 1rem',
                color: '#FB7185',
                fontSize: '0.85rem',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <AlertCircle size={16} />
                <span>{errors.submit}</span>
              </div>
            )}

            {/* Name */}
            <div className="form-group">
              <label className="form-label">
                Full Name <span className="required">*</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Satvik Sharma"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  validateField('name', e.target.value);
                }}
              />
              {errors.name && <div className="form-error">{errors.name}</div>}
            </div>

            {/* Email & Phone */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">
                  Email Address <span className="required">*</span>
                </label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    validateField('email', e.target.value);
                  }}
                />
                {errors.email && <div className="form-error">{errors.email}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Phone / WhatsApp <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value });
                    validateField('phone', e.target.value);
                  }}
                />
                {errors.phone && <div className="form-error">{errors.phone}</div>}
              </div>
            </div>

            {/* User Type (Student / Customer / Other) & City */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">
                  User Type <span className="required">*</span>
                </label>
                <select
                  className="form-select"
                  value={formData.user_type}
                  onChange={(e) => setFormData({ ...formData, user_type: e.target.value as UserType })}
                >
                  <option value="Student">Student (Pilot Certification)</option>
                  <option value="Customer">Customer (Commercial Services)</option>
                  <option value="Other">Other (Enterprise / Agency)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">City / State</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Pune, Bengaluru"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
            </div>

            {/* Category */}
            <div className="form-group">
              <label className="form-label">
                Interest Category <span className="required">*</span>
              </label>
              <select
                className="form-select"
                value={formData.category}
                onChange={handleCategoryChange}
              >
                <option value="DGCA Pilot Training">DGCA Pilot Training</option>
                <option value="Commercial Drone Services">Commercial Drone Services</option>
                <option value="Drone Rentals & Sales">Drone Rentals & Sales</option>
                <option value="College / Student Academy">College / Student Academy</option>
                <option value="Regulatory & DigitalSky Guidance">Regulatory & DigitalSky Guidance</option>
                <option value="General Enquiry">General Enquiry</option>
              </select>
            </div>

            {/* Specific Course / Service */}
            <div className="form-group">
              <label className="form-label">Service or Course of Interest</label>
              <select
                className="form-select"
                value={formData.course_or_service}
                onChange={(e) => setFormData({ ...formData, course_or_service: e.target.value })}
              >
                {CATEGORY_COURSE_OPTIONS[formData.category]?.map((opt, idx) => (
                  <option key={idx} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Message */}
            <div className="form-group">
              <label className="form-label">Message / Project Requirements</label>
              <textarea
                className="form-textarea"
                placeholder="Mention batch preferences, project timeline, location..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>

            {/* Submit buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                <Send size={15} />
                <span>{isSubmitting ? 'Submitting Enquiry...' : 'Submit Enquiry'}</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
