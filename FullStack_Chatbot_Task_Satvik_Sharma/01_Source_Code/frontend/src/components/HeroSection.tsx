import React from 'react';
import { Bot, Send, Award, CheckCircle, Shield, TrendingUp, Sparkles, Navigation } from 'lucide-react';

interface HeroSectionProps {
  onOpenEnquiry: (category?: string) => void;
  onOpenChat: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenEnquiry, onOpenChat }) => {
  return (
    <section style={{ padding: '4rem 0 3rem', position: 'relative', overflow: 'hidden' }}>
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        
        {/* Top Tagline Badge */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <div className="badge badge-cyan" style={{ padding: '0.45rem 1rem', fontSize: '0.82rem', gap: '0.5rem' }}>
            <Sparkles size={14} />
            <span>Govt. DGCA Approved Training Hub • 24/7 AeroBot AI Lead Assistant</span>
          </div>
        </div>

        {/* Main Headline */}
        <div style={{ textAlign: 'center', maxWidth: '860px', margin: '0 auto' }}>
          <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.6rem)', lineHeight: 1.15, marginBottom: '1.25rem' }}>
            Accelerating India's Drone Future with <span className="gradient-text">DGCA Pilot Training</span> & <span className="gradient-text">Smart UAV Solutions</span>
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '720px', margin: '0 auto 2.2rem', lineHeight: 1.6 }}>
            Connect with verified Remote Pilot Training Organisations (RPTOs), deploy commercial surveying & agricultural drones, or get instant advisory through our intelligent lead assistant.
          </p>

          {/* Action CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
            <button 
              type="button" 
              className="btn btn-primary"
              onClick={onOpenChat}
              style={{ padding: '0.85rem 1.8rem', fontSize: '1rem' }}
            >
              <Bot size={18} />
              <span>Ask AeroBot AI Assistant</span>
            </button>

            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => onOpenEnquiry('DGCA Pilot Training')}
              style={{ padding: '0.85rem 1.8rem', fontSize: '1rem' }}
            >
              <Send size={16} />
              <span>Submit Course / Service Enquiry</span>
            </button>
          </div>
        </div>

        {/* Key Metrics / Highlights Bar */}
        <div 
          className="glass-card" 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '1.5rem',
            padding: '1.75rem 2rem',
            marginTop: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ 
              width: '46px', 
              height: '46px', 
              borderRadius: '12px', 
              background: 'rgba(0, 210, 255, 0.12)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: 'var(--accent-cyan)' 
            }}>
              <Award size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', fontFamily: 'var(--font-heading)' }}>5,000+</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>DGCA Pilots Trained</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ 
              width: '46px', 
              height: '46px', 
              borderRadius: '12px', 
              background: 'rgba(16, 185, 129, 0.12)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: 'var(--accent-emerald)' 
            }}>
              <CheckCircle size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', fontFamily: 'var(--font-heading)' }}>98.4%</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>First-Attempt Pass Rate</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ 
              width: '46px', 
              height: '46px', 
              borderRadius: '12px', 
              background: 'rgba(99, 102, 241, 0.12)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: 'var(--accent-indigo)' 
            }}>
              <Shield size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', fontFamily: 'var(--font-heading)' }}>45+ RPTOs</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Verified Training Centers</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ 
              width: '46px', 
              height: '46px', 
              borderRadius: '12px', 
              background: 'rgba(245, 158, 11, 0.12)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: 'var(--accent-amber)' 
            }}>
              <TrendingUp size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', fontFamily: 'var(--font-heading)' }}>24/7 AI</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Rule-Based Lead Engine</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
