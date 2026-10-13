import React from 'react';
import { Mail, Phone, MapPin, ShieldCheck, Heart, ExternalLink, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer style={{
      background: '#04070D',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '4rem 0 2.5rem',
      color: 'var(--text-muted)',
      fontSize: '0.88rem'
    }}>
      <div className="container">
        
        {/* Top 4-column Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem'
        }}>
          
          {/* Col 1: About */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #00D2FF 0%, #3A7BD5 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#070B14'
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v4"/>
                  <path d="m4.93 10.93 2.83-2.83"/>
                  <path d="M2 18h4"/>
                  <path d="M20 18h2"/>
                  <path d="m19.07 10.93-2.83-2.83"/>
                  <circle cx="12" cy="14" r="4"/>
                  <path d="M12 18v4"/>
                  <path d="m4.93 17.07 2.83 2.83"/>
                  <path d="m19.07 17.07-2.83 2.83"/>
                </svg>
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF' }}>DroneTV.in</span>
            </div>
            <p style={{ lineHeight: 1.6, color: 'var(--text-dim)', marginBottom: '1.25rem' }}>
              India's comprehensive digital ecosystem portal connecting aspiring drone pilots with DGCA-approved RPTOs, precision agricultural spraying, and enterprise 3D surveying solutions.
            </p>
            <div className="badge badge-cyan" style={{ fontSize: '0.72rem' }}>
              <ShieldCheck size={12} /> DGCA Drone Rules 2021 Compliant
            </div>
          </div>

          {/* Col 2: DGCA Training Programs */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1rem', marginBottom: '1.2rem' }}>DGCA Certifications</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <li><span style={{ color: 'var(--text-muted)' }}>Small Category RPC (up to 25 kg)</span></li>
              <li><span style={{ color: 'var(--text-muted)' }}>Medium Category Drone Pilot (up to 150 kg)</span></li>
              <li><span style={{ color: 'var(--text-muted)' }}>Certified Drone Flight Instructor (CFI)</span></li>
              <li><span style={{ color: 'var(--text-muted)' }}>DigitalSky UIN & Airspace Filing</span></li>
              <li><span style={{ color: 'var(--text-muted)' }}>Class-II Medical Assessment Guidance</span></li>
            </ul>
          </div>

          {/* Col 3: Commercial Services */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1rem', marginBottom: '1.2rem' }}>Commercial Services</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <li><span style={{ color: 'var(--text-muted)' }}>3D Topographic & Orthomosaic Survey</span></li>
              <li><span style={{ color: 'var(--text-muted)' }}>Precision Agricultural Crop Spraying</span></li>
              <li><span style={{ color: 'var(--text-muted)' }}>Solar PV Farm Thermographic Audits</span></li>
              <li><span style={{ color: 'var(--text-muted)' }}>Cine 8K & Heavy Lift Fleet Rentals</span></li>
              <li><span style={{ color: 'var(--text-muted)' }}>College UAV Lab Turnkey Setup</span></li>
            </ul>
          </div>

          {/* Col 4: Contact & Operations */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1rem', marginBottom: '1.2rem' }}>Admissions & Support</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Mail size={15} style={{ color: 'var(--accent-cyan)' }} />
                <span>admissions@dronetv.in</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Phone size={15} style={{ color: 'var(--accent-cyan)' }} />
                <span>+91 98234-DRONE (Toll-Free)</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                <MapPin size={15} style={{ color: 'var(--accent-cyan)', marginTop: '3px' }} />
                <span>Hubs: New Delhi • Bengaluru • Pune • Hyderabad</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar & Candidate Credit */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          paddingTop: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>
            © {new Date().getFullYear()} DroneTV AI Lead Assistant. Built by <strong style={{ color: 'var(--accent-cyan)' }}>Satvik Sharma</strong> (<a href="mailto:sharmasatvik159@gmail.com" style={{ color: 'var(--accent-cyan)' }}>sharmasatvik159@gmail.com</a>).
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.82rem' }}>
            <span style={{ color: 'var(--text-dim)' }}>React.js + TypeScript + Express + SQLite</span>
            <span style={{ color: 'var(--accent-emerald)' }}>● System Operational</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
