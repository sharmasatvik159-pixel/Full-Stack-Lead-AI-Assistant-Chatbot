import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { EcosystemGrid } from './components/EcosystemGrid';
import { ChatbotWidget } from './components/ChatbotWidget';
import { EnquiryModal } from './components/EnquiryModal';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';
import { EnquiryCategory } from './types';
import { fetchEnquiryStats } from './services/api';

export function App() {
  const [currentView, setCurrentView] = useState<'portal' | 'admin'>('portal');
  
  // Enquiry Modal state
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [enquiryCategory, setEnquiryCategory] = useState<EnquiryCategory>('DGCA Pilot Training');
  const [enquiryCourse, setEnquiryCourse] = useState<string>('');

  // Chatbot state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [externalPrompt, setExternalPrompt] = useState<string>('');

  // Total leads count for Navbar badge
  const [totalLeadsCount, setTotalLeadsCount] = useState<number>(0);

  const loadBadgeStats = async () => {
    try {
      const res = await fetchEnquiryStats();
      setTotalLeadsCount(res.stats.total);
    } catch (err) {
      console.warn('Backend not yet reachable for stats badge');
    }
  };

  useEffect(() => {
    loadBadgeStats();
  }, []);

  const handleOpenEnquiry = (category?: string, courseName?: string) => {
    if (category) {
      setEnquiryCategory(category as EnquiryCategory);
    }
    if (courseName) {
      setEnquiryCourse(courseName);
    } else {
      setEnquiryCourse('');
    }
    setIsEnquiryOpen(true);
  };

  const handleSelectCourse = (category: EnquiryCategory, courseName: string) => {
    setEnquiryCategory(category);
    setEnquiryCourse(courseName);
    setIsEnquiryOpen(true);
  };

  const handleAskChatbot = (question: string) => {
    setExternalPrompt(question);
    setIsChatOpen(true);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        onOpenEnquiry={() => handleOpenEnquiry()}
        onOpenChat={() => setIsChatOpen(true)}
        totalLeads={totalLeadsCount}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1 }}>
        {currentView === 'portal' ? (
          <>
            <HeroSection
              onOpenEnquiry={(cat) => handleOpenEnquiry(cat)}
              onOpenChat={() => setIsChatOpen(true)}
            />
            <EcosystemGrid
              onSelectCourse={handleSelectCourse}
              onAskChatbot={handleAskChatbot}
            />
          </>
        ) : (
          <AdminDashboard />
        )}
      </main>

      {/* Chatbot Floating Widget */}
      <ChatbotWidget
        isOpen={isChatOpen}
        setIsOpen={setIsChatOpen}
        onLeadCaptured={() => {
          loadBadgeStats();
        }}
        externalPrompt={externalPrompt}
        setExternalPrompt={setExternalPrompt}
      />

      {/* Course / Service Enquiry Modal */}
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        initialCategory={enquiryCategory}
        initialCourse={enquiryCourse}
        onSuccess={() => {
          loadBadgeStats();
        }}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
