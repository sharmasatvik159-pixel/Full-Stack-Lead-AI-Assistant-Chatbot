import React from 'react';
import { 
  Plane, 
  MapPin, 
  Sprout, 
  Search, 
  Video, 
  GraduationCap, 
  Check, 
  ArrowRight, 
  MessageSquare,
  Clock,
  Award
} from 'lucide-react';
import { EnquiryCategory } from '../types';

interface EcosystemGridProps {
  onSelectCourse: (category: EnquiryCategory, courseName: string) => void;
  onAskChatbot: (question: string) => void;
}

interface ServiceCardData {
  id: string;
  category: EnquiryCategory;
  title: string;
  badge: string;
  durationOrType: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
  suggestedPrompt: string;
}

const SERVICES: ServiceCardData[] = [
  {
    id: 'dgca-small',
    category: 'DGCA Pilot Training',
    title: 'Small Category Remote Pilot Certificate (RPC)',
    badge: 'Most Popular',
    durationOrType: '5 Days • 100% DGCA Compliant',
    description: 'Govt. authorized 5-day intensive pilot training program. Master flight simulators, dual-control flying, and DGCA regulations.',
    features: [
      'Eligibility: 18+ yrs, 10th pass, Passport/Aadhaar',
      'Classroom Ground Theory & Air Regulations',
      'Flight Simulator & Solo Flying Practice',
      'DGCA Class-II Medical Guidance & DigitalSky setup'
    ],
    icon: <Plane size={24} style={{ color: 'var(--accent-cyan)' }} />,
    suggestedPrompt: 'Tell me about the 5-day DGCA Small Category Pilot Training syllabus and fees'
  },
  {
    id: 'dgca-medium',
    category: 'DGCA Pilot Training',
    title: 'Medium Category Drone Pilot Certification',
    badge: 'Advanced Fleet',
    durationOrType: '10–15 Days • Heavy Lift Drones',
    description: 'Specialized flight qualification for multirotor UAVs weighing 25 kg to 150 kg, ideal for heavy agricultural and cargo operations.',
    features: [
      'Heavy-lift drone dynamics & payload stability',
      'Fail-safe systems, emergency RTL & battery telemetry',
      'High-capacity agricultural & industrial flight drills',
      'Govt. DigitalSky certification endorsement'
    ],
    icon: <Award size={24} style={{ color: 'var(--accent-indigo)' }} />,
    suggestedPrompt: 'What are the requirements for Medium Category Drone Pilot Training?'
  },
  {
    id: 'survey-mapping',
    category: 'Commercial Drone Services',
    title: 'Aerial Surveying & 3D Topographic GIS Mapping',
    badge: 'Enterprise Service',
    durationOrType: 'Sub-Centimeter Accuracy • RTK/PPK',
    description: 'Turnkey photogrammetry and LiDAR surveying for infrastructure, smart cities, cadastral land titling, and mining quarries.',
    features: [
      'High-resolution Orthomosaic, DEM & DSM models',
      '3D Point Clouds & Volumetric stockyard analysis',
      'Sub-centimeter RTK/PPK GNSS geo-referencing',
      'Fully DGCA compliant flight authorization filing'
    ],
    icon: <MapPin size={24} style={{ color: 'var(--accent-emerald)' }} />,
    suggestedPrompt: 'How can DroneTV assist with highway 3D topographic drone survey?'
  },
  {
    id: 'agri-spraying',
    category: 'Commercial Drone Services',
    title: 'Precision Agricultural Drone Spraying & NDVI',
    badge: 'Kisan Drone',
    durationOrType: 'Up to 30 Acres/Day • 90% Water Saved',
    description: 'Deploy advanced 10L–30L agricultural spraying drones for pesticide, micronutrient spraying, and multispectral crop stress scouting.',
    features: [
      'Rapid uniform foliar spray without soil compaction',
      'Zero chemical exposure to farm workforce',
      'Multispectral NDVI health & pest detection maps',
      'On-demand fleet deployment or turnkey purchase'
    ],
    icon: <Sprout size={24} style={{ color: '#34D399' }} />,
    suggestedPrompt: 'What are the rates and capacity for agricultural drone spraying?'
  },
  {
    id: 'industrial-inspection',
    category: 'Commercial Drone Services',
    title: 'Industrial & Solar Asset Thermographic Audits',
    badge: 'Zero Downtime',
    durationOrType: 'Radiometric Thermal • IEC 62446-3',
    description: 'Safe, non-destructive aerial audits of high-voltage transmission lines, utility-scale solar farms, wind turbine blades, and flare stacks.',
    features: [
      'FLIR Radiometric Thermal hot-spot detection',
      '30x Optical Zoom for micro-crack detection',
      'Detailed geo-tagged anomaly report with GPS stamps',
      'Eliminates hazardous rope-climbing operations'
    ],
    icon: <Search size={24} style={{ color: 'var(--accent-amber)' }} />,
    suggestedPrompt: 'How does thermal drone inspection work for solar plants?'
  },
  {
    id: 'college-drone-lab',
    category: 'College / Student Academy',
    title: 'Campus Drone Academy & UAV Centre of Excellence',
    badge: 'Academic MoU',
    durationOrType: 'Turnkey Setup • College Bootcamps',
    description: 'Establish state-of-the-art drone assembly, testing, and simulation laboratories in engineering institutions and universities.',
    features: [
      'Turnkey flight test cages & simulator workstations',
      'Hands-on PX4 / ArduPilot flight controller coding',
      'DGCA mapped credit courses for aeronautical students',
      'Direct industry placement pipeline for students'
    ],
    icon: <GraduationCap size={24} style={{ color: '#818CF8' }} />,
    suggestedPrompt: 'We want to setup a drone lab in our engineering college, what is the procedure?'
  }
];

export const EcosystemGrid: React.FC<EcosystemGridProps> = ({
  onSelectCourse,
  onAskChatbot
}) => {
  return (
    <section style={{ padding: '3rem 0 5rem' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div className="badge badge-indigo" style={{ marginBottom: '0.75rem' }}>
            Drone Ecosystem Solutions
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', marginBottom: '0.75rem' }}>
            Comprehensive Training & Commercial UAV Services
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto', fontSize: '0.95rem' }}>
            Whether you are a student aspiring to become a certified drone pilot, or an enterprise seeking high-accuracy aerial mapping, DroneTV covers every flight altitude.
          </p>
        </div>

        {/* Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '1.75rem'
        }}>
          {SERVICES.map((item) => (
            <div 
              key={item.id} 
              className="glass-card" 
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative'
              }}
            >
              <div>
                {/* Header row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {item.icon}
                  </div>
                  <span className="badge badge-cyan">{item.badge}</span>
                </div>

                {/* Title */}
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', lineHeight: 1.3 }}>
                  {item.title}
                </h3>

                {/* Duration/Type pill */}
                <div style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '0.4rem', 
                  fontSize: '0.8rem', 
                  color: 'var(--accent-cyan)', 
                  marginBottom: '1rem',
                  fontWeight: 600
                }}>
                  <Clock size={14} />
                  <span>{item.durationOrType}</span>
                </div>

                {/* Description */}
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: 1.55 }}>
                  {item.description}
                </p>

                {/* Bullet Features */}
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                  {item.features.map((feature, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.82rem', color: '#CBD5E1' }}>
                      <Check size={14} style={{ color: 'var(--accent-emerald)', marginTop: '3px', flexShrink: 0 }} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '0.75rem', 
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                paddingTop: '1.25rem',
                marginTop: '0.5rem'
              }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => onAskChatbot(item.suggestedPrompt)}
                  style={{ fontSize: '0.8rem', padding: '0.5rem 0.6rem' }}
                >
                  <MessageSquare size={13} style={{ color: 'var(--accent-cyan)' }} />
                  <span>Ask AeroBot</span>
                </button>

                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => onSelectCourse(item.category, item.title)}
                  style={{ fontSize: '0.8rem', padding: '0.5rem 0.6rem' }}
                >
                  <span>Enquire Now</span>
                  <ArrowRight size={13} />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
