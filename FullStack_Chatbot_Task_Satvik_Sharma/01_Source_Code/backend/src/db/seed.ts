import { db, initDatabase } from './connection';

initDatabase();

export function seedData(forceReset: boolean = false) {
  if (forceReset) {
    db.exec('DROP TABLE IF EXISTS enquiries');
    initDatabase();
  }

  const existingCount = (db.prepare('SELECT COUNT(*) as count FROM enquiries').get() as { count: number }).count;
  
  if (existingCount > 0 && !forceReset) {
    console.log(`[DB] Database contains ${existingCount} records.`);
    return;
  }

  const sampleEnquiries = [
    {
      name: 'Rohan Deshmukh',
      email: 'rohan.deshmukh@gmail.com',
      phone: '+91 98234 56789',
      user_type: 'Student',
      city: 'Pune',
      category: 'DGCA Pilot Training',
      course_or_service: 'Small Category RPC Certification (5 Days)',
      message: 'Looking to get DGCA certified for aerial mapping. Have 10th pass mark sheet and Indian passport ready.',
      status: 'New',
      priority: 'High',
      source: 'chatbot',
      admin_notes: 'Urgent: Candidate wants to join upcoming weekend batch.',
      created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
    },
    {
      name: 'Pooja Iyer',
      email: 'pooja.iyer@agritech-sol.in',
      phone: '+91 98451 22334',
      user_type: 'Customer',
      city: 'Bengaluru',
      category: 'Commercial Drone Services',
      course_or_service: 'Agricultural Spraying & Crop Health Multispectral',
      message: 'Need 150-acre sugarcane crop spraying service in Mandya district. Quote required for pesticide and micronutrient spray.',
      status: 'Contacted',
      priority: 'High',
      source: 'website_form',
      admin_notes: 'Quotation sent for 150 acres @ ₹450/acre. Awaiting farm coordinator date confirmation.',
      created_at: new Date(Date.now() - 14 * 3600 * 1000).toISOString()
    },
    {
      name: 'Amit Vikram Sharma',
      email: 'amit.v.sharma@buildinfra.org',
      phone: '+91 99100 44556',
      user_type: 'Customer',
      city: 'Gurugram',
      category: 'Commercial Drone Services',
      course_or_service: 'Aerial Surveying & 3D Topographic Mapping',
      message: 'Highways NHAI corridor survey 45 km stretch. Orthomosaic and 3D DEM required with GCP ground control points.',
      status: 'In Progress',
      priority: 'High',
      source: 'website_form',
      admin_notes: 'Technical proposal reviewed. Pilot team scheduled for reconnaissance visit.',
      created_at: new Date(Date.now() - 28 * 3600 * 1000).toISOString()
    },
    {
      name: 'Kavita Sundaram',
      email: 'kavita.s@mitacademy.edu',
      phone: '+91 97654 88990',
      user_type: 'Student',
      city: 'Chennai',
      category: 'College / Student Academy',
      course_or_service: 'Campus Drone Lab Setup & Faculty Development',
      message: 'We want to establish a Centre of Excellence in UAV Engineering at our engineering college for 120 aeronautical students.',
      status: 'Contacted',
      priority: 'Medium',
      source: 'website_form',
      admin_notes: 'MoU draft shared with Principal. Meeting scheduled on Thursday.',
      created_at: new Date(Date.now() - 48 * 3600 * 1000).toISOString()
    },
    {
      name: 'Deepak Verma',
      email: 'deepak.cinematics@mumbaifilms.com',
      phone: '+91 98201 11223',
      user_type: 'Customer',
      city: 'Mumbai',
      category: 'Drone Rentals & Sales',
      course_or_service: 'DJI Inspire 3 / Heavy Lift Cine Drone Rental with DGCA Pilot',
      message: 'Feature film shoot in Goa for 6 days. Need heavy lift cine rig with Ronin 4D / Inspire 3 and experienced pilot.',
      status: 'In Progress',
      priority: 'High',
      source: 'chatbot',
      admin_notes: 'Advance token received. Contract signed for Goa shoot Oct 24-29.',
      created_at: new Date(Date.now() - 72 * 3600 * 1000).toISOString()
    },
    {
      name: 'Aditya Nair',
      email: 'aditya.nair@aeroview.co',
      phone: '+91 94471 99882',
      user_type: 'Student',
      city: 'Kochi',
      category: 'DGCA Pilot Training',
      course_or_service: 'Medium Category Drone Pilot Certification (10 Days)',
      message: 'Already holding Small Category RPC. Want to upgrade to Medium category for industrial logistics payloads up to 25kg+.',
      status: 'In Progress',
      priority: 'Medium',
      source: 'chatbot',
      admin_notes: 'Verified existing RPC credentials on DigitalSky. Batch starting next Monday.',
      created_at: new Date(Date.now() - 96 * 3600 * 1000).toISOString()
    },
    {
      name: 'Sunil Rao',
      email: 'sunil.solarpower@greenfield.in',
      phone: '+91 98860 33441',
      user_type: 'Customer',
      city: 'Hyderabad',
      category: 'Commercial Drone Services',
      course_or_service: 'Thermal Solar Farm Inspection & Defect Analysis',
      message: '50MW solar farm thermographic inspection. Hot spot detection, IEC 62446-3 compliance report needed.',
      status: 'New',
      priority: 'Medium',
      source: 'website_form',
      admin_notes: 'New lead received via web portal. Assign to industrial inspection lead.',
      created_at: new Date(Date.now() - 120 * 3600 * 1000).toISOString()
    },
    {
      name: 'Meera Patel',
      email: 'meera.patel99@gmail.com',
      phone: '+91 97240 55667',
      user_type: 'Other',
      city: 'Ahmedabad',
      category: 'Regulatory & DigitalSky Guidance',
      course_or_service: 'UIN Registration & DigitalSky Flight Permission Filing',
      message: 'Purchased customized survey drone. Need assistance with Type Certificate, UIN marking and Green Zone permission filing.',
      status: 'Closed',
      priority: 'Low',
      source: 'chatbot',
      admin_notes: 'Guidance completed. Client successfully registered drone on DigitalSky portal.',
      created_at: new Date(Date.now() - 160 * 3600 * 1000).toISOString()
    }
  ];

  const insert = db.prepare(`
    INSERT INTO enquiries (
      name, email, phone, user_type, city, category, course_or_service, message,
      status, priority, source, admin_notes, created_at, updated_at
    ) VALUES (
      @name, @email, @phone, @user_type, @city, @category, @course_or_service, @message,
      @status, @priority, @source, @admin_notes, @created_at, @created_at
    )
  `);

  const insertMany = db.transaction((enquiries: typeof sampleEnquiries) => {
    for (const enquiry of enquiries) {
      insert.run(enquiry);
    }
  });

  insertMany(sampleEnquiries);
  console.log(`[DB] Successfully seeded ${sampleEnquiries.length} DroneTV leads with user types and statuses!`);
}

if (require.main === module) {
  seedData(true);
}
