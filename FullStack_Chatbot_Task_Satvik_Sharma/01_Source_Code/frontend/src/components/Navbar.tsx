import React from 'react';
import { Send, Bot, ShieldCheck, PhoneCall, LayoutDashboard, Compass } from 'lucide-react';

interface NavbarProps {
  currentView: 'portal' | 'admin';
  setCurrentView: (view: 'portal' | 'admin') => void;
  onOpenEnquiry: () => void;
  onOpenChat: () => void;
  totalLeads?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  onOpenEnquiry,
  onOpenChat,
  totalLeads = 0
}) => {
  return (
    <header className="navbar">
      <div className="container navbar-inner">
        {/* Brand Logo */}
        <div 
          className="nav-logo" 
          onClick={() => setCurrentView('portal')}
          style={{ cursor: 'pointer' }}
        >
          <div className="nav-logo-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontWeight: 800, fontSize: '1.25rem', color: '#FFFFFF' }}>DroneTV</span>
              <span className="badge badge-cyan" style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem' }}>AI LEAD</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', letterSpacing: '0.04em' }}>DGCA Training & UAV Ecosystem</div>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="nav-links">
          <button 
            type="button"
            className={`nav-link-item ${currentView === 'portal' ? 'active' : ''}`}
            onClick={() => setCurrentView('portal')}
            style={{ background: 'none', border: 'none' }}
          >
            Ecosystem & Training
          </button>
          <button 
            type="button"
            className={`nav-link-item ${currentView === 'admin' ? 'active' : ''}`}
            onClick={() => setCurrentView('admin')}
            style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <LayoutDashboard size={15} />
            Admin Dashboard
            {totalLeads > 0 && (
              <span className="badge badge-indigo" style={{ padding: '0.1rem 0.4rem', fontSize: '0.65rem' }}>
                {totalLeads}
              </span>
            )}
          </button>
        </nav>

        {/* Action CTAs */}
        <div className="nav-actions">
          <button 
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onOpenChat}
            style={{ gap: '0.4rem' }}
          >
            <Bot size={15} style={{ color: 'var(--accent-cyan)' }} />
            <span>AeroBot AI</span>
          </button>

          <button 
            type="button"
            className="btn btn-primary btn-sm"
            onClick={onOpenEnquiry}
          >
            <Send size={14} />
            <span>Enquire Now</span>
          </button>
        </div>
      </div>
    </header>
  );
};
