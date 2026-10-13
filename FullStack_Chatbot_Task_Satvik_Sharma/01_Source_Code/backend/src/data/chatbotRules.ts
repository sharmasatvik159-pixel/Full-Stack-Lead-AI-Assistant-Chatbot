export interface KnowledgeRule {
  id: string;
  category: string;
  keywords: string[];
  title: string;
  response: string;
  quickReplies: string[];
  actionPrompt?: string;
}

export const KNOWLEDGE_BASE: KnowledgeRule[] = [
  // 1. EXACT QUESTION 1: What services does DroneTV provide?
  {
    id: 'services_overview',
    category: 'Commercial Drone Services',
    keywords: [
      'what services does dronetv provide', 'what services', 'services provided', 
      'services offered', 'commercial services', 'drone services'
    ],
    title: 'Commercial Drone Services Overview',
    response: `🛰️ **DroneTV Commercial Drone Services:**\n\n1. **Aerial Surveying & 3D GIS Mapping:** High-precision topographical surveys, DEM/DSM contour maps, RTK/PPK GNSS, sub-centimeter volumetric analysis for mining & highways.\n2. **Agricultural Spraying & Crop Health:** 10L to 30L precision crop spraying (25–30 acres/day), 90% water conservation, and multispectral NDVI crop health scouting.\n3. **Industrial & Infrastructure Inspection:** FLIR Radiometric thermal audits for solar PV farms, wind turbine blades, high-voltage transmission lines, and telecom towers.\n4. **Fleet Rental & Cinematography:** 8K heavy-lift camera rigs (DJI Inspire 3, Matrice 350 RTK) with DGCA-certified commercial pilots.\n\nWould you like a customized service quote or feasibility assessment for your site?`,
    quickReplies: [
      'I am interested in a service.',
      'What courses / training are available?',
      'How can I register?',
      'How can I contact DroneTV?'
    ],
    actionPrompt: 'lead_capture:service'
  },

  // 2. EXACT QUESTION 2: What courses / training are available?
  {
    id: 'courses_overview',
    category: 'DGCA Pilot Training',
    keywords: [
      'what courses / training are available', 'what courses', 'training are available', 
      'courses available', 'pilot training', 'training courses', 'dgca courses'
    ],
    title: 'DGCA Pilot Courses & Training Programs',
    response: `🚁 **Available DGCA Drone Pilot Training Programs:**\n\n1. **Small Category Remote Pilot Certificate (RPC):**\n   • Weight class: Up to 25 kg multirotor\n   • Duration: 5 Days (Ground Theory + Simulator + Dual & Solo Flying)\n   • Eligibility: 18+ years, 10th pass, Passport/Aadhaar, DGCA Medical Certificate\n\n2. **Medium Category Drone Pilot Certification:**\n   • Weight class: 25 kg to 150 kg (Essential for Heavy Agricultural Spraying & Cargo Logistics)\n   • Duration: 10 to 15 Days advanced flight training\n\n3. **Drone Flight Instructor (CFI) Certification:**\n   • Master training for prospective RPTO instructors\n\n4. **College UAV Lab & Student Academy:**\n   • Campus drone bootcamps and PX4/ArduPilot flight controller engineering\n\nAll courses provide Govt. of India DGCA authorized RPC valid for 10 years on DigitalSky.`,
    quickReplies: [
      'How can I register?',
      'I am a student.',
      'Eligibility Prerequisites',
      'What services does DroneTV provide?'
    ],
    actionPrompt: 'lead_capture:training'
  },

  // 3. EXACT QUESTION 3: How can I contact DroneTV?
  {
    id: 'contact_dronetv',
    category: 'General Enquiry',
    keywords: [
      'how can i contact dronetv', 'contact dronetv', 'contact us', 'phone number', 
      'email address', 'helpline', 'reach out', 'office address'
    ],
    title: 'Contact DroneTV Support & Admissions',
    response: `📞 **How to Contact DroneTV:**\n\n• **Admissions & Student Helpline:** admissions@dronetv.in\n• **Enterprise Solutions Desk:** services@dronetv.in / support@dronetv.in\n• **Direct Hotline:** +91 98234-DRONE (+91 98234 37663)\n• **Operating Hours:** Mon – Sat, 9:00 AM – 7:00 PM IST\n• **Regional Presence:** Training centers & operational hubs in New Delhi, Bengaluru, Pune, Hyderabad, and Chennai.\n\nYou can also click "I want to speak with someone" below and our counselor will call you back within 30 minutes!`,
    quickReplies: [
      'I want to speak with someone.',
      'How can I register?',
      'What services does DroneTV provide?',
      'What courses / training are available?'
    ],
    actionPrompt: 'lead_capture:callback'
  },

  // 4. EXACT QUESTION 4: How can I register?
  {
    id: 'how_to_register',
    category: 'DGCA Pilot Training',
    keywords: [
      'how can i register', 'how to register', 'register', 'enrollment process', 
      'admission steps', 'apply now', 'how do i join'
    ],
    title: 'Registration & Enrollment Process',
    response: `📝 **Step-by-Step Registration Process:**\n\n1. **Submit Enquiry:** Fill out the registration form with your Name, Email, Phone, and User Type (Student / Customer).\n2. **Document Verification:** Upload or share your 10th marksheet, Govt. ID (Aadhaar/Passport), and complete your DGCA Class-II medical fitness check.\n3. **DigitalSky Setup:** Create your pilot profile on the Govt. DigitalSky platform (our counselors assist you free of cost).\n4. **Batch Scheduling:** Choose your preferred training RPTO location and upcoming weekend or weekday batch.\n5. **Flight Training:** Complete 5-day on-field theory, simulation, and flying to receive your official Remote Pilot Certificate!\n\nWould you like to register right now?`,
    quickReplies: [
      'I am a student.',
      'I am interested in a service.',
      'I want to speak with someone.',
      'Eligibility Prerequisites'
    ],
    actionPrompt: 'lead_capture:registration'
  },

  // 5. EXACT QUESTION 5: I am interested in a service.
  {
    id: 'interested_in_service',
    category: 'Commercial Drone Services',
    keywords: [
      'i am interested in a service', 'interested in service', 'need a service', 
      'book a service', 'hire drone', 'commercial requirement', 'enterprise service'
    ],
    title: 'Commercial Drone Service Enquiry',
    response: `💼 **Commercial Drone Service Deployment:**\n\nWe would love to assist your enterprise with commercial drone operations. Please tell us which service aligns with your project:\n\n• **Survey & 3D GIS Mapping** (Highways, Mining, Smart Cities)\n• **Agricultural Spraying & Crop Scouting** (Fertilizer/Pesticide spraying)\n• **Solar Farm & Wind Turbine Inspection** (Radiometric Thermal FLIR audits)\n• **Fleet & Cine Rental** (DJI Inspire 3 / Matrice with certified pilot)\n\nPlease share your requirements below so our technical operations lead can prepare an instant feasibility report and quote for you!`,
    quickReplies: [
      'I want to speak with someone.',
      'What services does DroneTV provide?',
      'How can I contact DroneTV?'
    ],
    actionPrompt: 'lead_capture:customer'
  },

  // 6. EXACT QUESTION 6: I am a student.
  {
    id: 'student_enquiry',
    category: 'College / Student Academy',
    keywords: [
      'i am a student', 'student', 'college student', 'student discount', 
      'student training', 'internship', 'engineering student'
    ],
    title: 'Student Pilot Training & Drone Academy',
    response: `🎓 **Welcome, Student Pilot!**\n\nDrone aviation is one of India's fastest-growing deep-tech industries. Here is what we offer for students:\n\n• **DGCA Remote Pilot Certificate (RPC):** Minimum age 18 yrs, 10th standard pass. Get certified to fly commercially and unlock jobs with GIS companies, agritech firms, and media houses.\n• **Student Discounts & Flexible Batches:** Weekend cohorts tailored for college engineering students.\n• **Hands-on UAV Engineering Labs:** Learn drone assembly, soldering, telemetry tuning, and PX4/ArduPilot autonomous mission planning.\n• **Internship & Placement Pipeline:** Direct connections to enterprise drone service providers across India.\n\nLet's get you registered for the next student batch!`,
    quickReplies: [
      'How can I register?',
      'What courses / training are available?',
      'Eligibility Prerequisites',
      'I want to speak with someone.'
    ],
    actionPrompt: 'lead_capture:student'
  },

  // 7. EXACT QUESTION 7: I want to speak with someone.
  {
    id: 'speak_with_someone',
    category: 'General Enquiry',
    keywords: [
      'i want to speak with someone', 'speak with someone', 'talk to human', 
      'speak with counselor', 'call back', 'talk to advisor', 'callback request'
    ],
    title: 'Request Direct Counselor Callback',
    response: `🤝 **Connect with a DroneTV Senior Counselor:**\n\nOur DGCA-certified flight instructors and enterprise project managers are ready to assist you.\n\n• **Direct Phone Line:** +91 98234-DRONE\n• **Admissions Email:** admissions@dronetv.in\n• **Callback Time:** Within 30 minutes during working hours (9:00 AM – 7:00 PM IST)\n\nPlease confirm your Name and Phone Number below to trigger an immediate priority callback!`,
    quickReplies: [
      'How can I register?',
      'What services does DroneTV provide?',
      'What courses / training are available?'
    ],
    actionPrompt: 'lead_capture:speak'
  },

  // Additional Supporting Knowledge Topics
  {
    id: 'eligibility_rules',
    category: 'DGCA Pilot Training',
    keywords: [
      'eligibility', 'prerequisite', 'medical', 'age limit', 'qualification', 
      'documents', 'criteria', 'pass', '10th'
    ],
    title: 'DGCA Drone Pilot Eligibility Criteria',
    response: `📋 **Eligibility Requirements for DGCA Drone Pilot Training:**\n\n1. **Age:** Must be at least 18 years old and under 65 years.\n2. **Education:** Minimum Class 10 passed from a recognized board (with basic English comprehension).\n3. **Identity Proof:** Valid Indian Passport or Aadhaar Card.\n4. **Medical Fitness:** DGCA Class-II Medical Assessment by a registered medical practitioner (MBBS or DGCA empaneled doctor).\n5. **DigitalSky Profile:** Registered account on the Govt. of India DigitalSky portal.`,
    quickReplies: [
      'How can I register?',
      'What courses / training are available?',
      'I am a student.',
      'I want to speak with someone.'
    ]
  },
  {
    id: 'digitalsky_regulations',
    category: 'Regulatory & DigitalSky Guidance',
    keywords: [
      'digitalsky', 'rules', 'permission', 'green zone', 'yellow zone', 
      'red zone', 'uin', 'dan', 'npnt', 'law', 'legal', 'fine'
    ],
    title: 'DigitalSky & Indian Drone Rules 2021 Overview',
    response: `🇮🇳 **Indian Drone Rules & Airspace Guidelines:**\n\n- **Airspace Zones:**\n  • **Green Zone:** Up to 400 ft altitude. No prior flight permission needed for verified pilots with UIN!\n  • **Yellow Zone:** Controlled airspace (near airports/defense borders). Prior ATC/DGCA permission required via DigitalSky.\n  • **Red Zone:** Strictly prohibited (Vital installations, Rashtrapati Bhavan, international borders).\n- **UIN (Unique Identification Number):** Mandatory digital registration tag for every drone operated commercially in India.\n- **Penalties:** Flying unregistered or uncertified UAVs in restricted airspace carries fines up to ₹1,00,000 under the Aircraft Act.`,
    quickReplies: [
      'What courses / training are available?',
      'What services does DroneTV provide?',
      'How can I contact DroneTV?'
    ]
  }
];

// The exact 7 predefined questions from PDF Page 2
export const PREDEFINED_QUESTIONS = [
  'What services does DroneTV provide?',
  'What courses / training are available?',
  'How can I contact DroneTV?',
  'How can I register?',
  'I am interested in a service.',
  'I am a student.',
  'I want to speak with someone.'
];

export const FALLBACK_SUGGESTIONS = [
  'What services does DroneTV provide?',
  'What courses / training are available?',
  'How can I register?',
  'I am a student.',
  'I am interested in a service.',
  'I want to speak with someone.'
];
