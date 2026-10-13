// DroneTV Mongoose / MongoDB Collection Schema
// Author: Satvik Sharma (sharmasatvik159@gmail.com)

const mongoose = require('mongoose');

const EnquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email address']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  user_type: {
    type: String,
    enum: ['Student', 'Customer', 'Other'],
    default: 'Customer'
  },
  city: {
    type: String,
    default: 'Not Specified',
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'DGCA Pilot Training',
      'Commercial Drone Services',
      'Drone Rentals & Sales',
      'College / Student Academy',
      'Regulatory & DigitalSky Guidance',
      'General Enquiry'
    ]
  },
  course_or_service: {
    type: String,
    default: 'General Inquiry'
  },
  message: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'In Progress', 'Closed'],
    default: 'New'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  source: {
    type: String,
    enum: ['chatbot', 'website_form', 'direct_portal'],
    default: 'website_form'
  },
  admin_notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

EnquirySchema.index({ category: 1 });
EnquirySchema.index({ status: 1 });
EnquirySchema.index({ user_type: 1 });
EnquirySchema.index({ created_at: -1 });

module.exports = mongoose.model('Enquiry', EnquirySchema);
