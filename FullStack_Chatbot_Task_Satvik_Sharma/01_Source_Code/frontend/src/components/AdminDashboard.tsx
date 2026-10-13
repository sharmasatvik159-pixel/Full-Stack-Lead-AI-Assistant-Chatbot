import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Download, 
  Plus, 
  RefreshCw, 
  Trash2, 
  Edit3, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  FileText,
  X,
  Save,
  Bot,
  GraduationCap,
  Briefcase,
  Users
} from 'lucide-react';
import { Enquiry, EnquiryStatus, EnquiryPriority, EnquiryCategory, EnquiryStats, UserType } from '../types';
import { 
  fetchEnquiries, 
  fetchEnquiryStats, 
  updateEnquiry, 
  deleteEnquiry, 
  getExportCsvUrl,
  createEnquiry
} from '../services/api';

export const AdminDashboard: React.FC = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [stats, setStats] = useState<EnquiryStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Search (PDF Requirement: Filter by Student / Customer)
  const [searchQuery, setSearchQuery] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');

  // Modals
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [enquiryToDelete, setEnquiryToDelete] = useState<Enquiry | null>(null);
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);

  // Edit modal local form
  const [editNotes, setEditNotes] = useState('');
  const [editStatus, setEditStatus] = useState<EnquiryStatus>('New');
  const [editPriority, setEditPriority] = useState<EnquiryPriority>('Medium');
  const [editUserType, setEditUserType] = useState<UserType>('Student');
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // New lead form
  const [newLeadForm, setNewLeadForm] = useState({
    name: '',
    email: '',
    phone: '',
    user_type: 'Student' as UserType,
    city: '',
    category: 'DGCA Pilot Training' as EnquiryCategory,
    course_or_service: 'Small Category RPC Certification (5 Days)',
    message: '',
    priority: 'Medium' as EnquiryPriority,
    source: 'direct_portal' as any
  });
  const [newLeadError, setNewLeadError] = useState('');

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [listRes, statsRes] = await Promise.all([
        fetchEnquiries({
          search: searchQuery,
          user_type: userTypeFilter,
          category: categoryFilter,
          status: statusFilter,
          priority: priorityFilter,
          source: sourceFilter,
          limit: 100
        }),
        fetchEnquiryStats()
      ]);

      setEnquiries(listRes.data);
      setStats(statsRes.stats);
    } catch (err: any) {
      console.error('Failed to load admin leads:', err);
      setError(err.message || 'Error connecting to backend API');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [userTypeFilter, categoryFilter, statusFilter, priorityFilter, sourceFilter]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleStatusChange = async (enquiryId: number, newStatus: EnquiryStatus) => {
    try {
      await updateEnquiry(enquiryId, { status: newStatus });
      setEnquiries((prev) =>
        prev.map((item) => (item.id === enquiryId ? { ...item, status: newStatus } : item))
      );
      const statsRes = await fetchEnquiryStats();
      setStats(statsRes.stats);
    } catch (err: any) {
      alert(`Failed to update status: ${err.message}`);
    }
  };

  const openEditModal = (item: Enquiry) => {
    setSelectedEnquiry(item);
    setEditNotes(item.admin_notes || '');
    setEditStatus(item.status);
    setEditPriority(item.priority);
    setEditUserType(item.user_type || 'Customer');
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedEnquiry) return;
    setIsSavingEdit(true);
    try {
      const res = await updateEnquiry(selectedEnquiry.id, {
        admin_notes: editNotes,
        status: editStatus,
        priority: editPriority,
        user_type: editUserType
      });

      setEnquiries((prev) =>
        prev.map((item) => (item.id === selectedEnquiry.id ? res.data : item))
      );

      const statsRes = await fetchEnquiryStats();
      setStats(statsRes.stats);
      setIsEditModalOpen(false);
    } catch (err: any) {
      alert(`Save failed: ${err.message}`);
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!enquiryToDelete) return;
    try {
      await deleteEnquiry(enquiryToDelete.id);
      setEnquiries((prev) => prev.filter((item) => item.id !== enquiryToDelete.id));
      const statsRes = await fetchEnquiryStats();
      setStats(statsRes.stats);
      setIsDeleteModalOpen(false);
      setEnquiryToDelete(null);
    } catch (err: any) {
      alert(`Failed to delete enquiry: ${err.message}`);
    }
  };

  const handleAddManualLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadForm.name.trim() || !newLeadForm.email.trim() || !newLeadForm.phone.trim()) {
      setNewLeadError('Name, email, and phone number are required.');
      return;
    }

    try {
      await createEnquiry(newLeadForm);
      setIsAddLeadModalOpen(false);
      setNewLeadForm({
        name: '',
        email: '',
        phone: '',
        user_type: 'Student',
        city: '',
        category: 'DGCA Pilot Training',
        course_or_service: 'Small Category RPC Certification (5 Days)',
        message: '',
        priority: 'Medium',
        source: 'direct_portal'
      });
      loadData();
    } catch (err: any) {
      setNewLeadError(err.message || 'Failed to create manual lead');
    }
  };

  const getPriorityBadgeClass = (priority: EnquiryPriority) => {
    switch (priority) {
      case 'High': return 'badge-rose';
      case 'Medium': return 'badge-amber';
      case 'Low': return 'badge-cyan';
      default: return 'badge-cyan';
    }
  };

  return (
    <div style={{ padding: '2.5rem 0 5rem' }}>
      <div className="container">
        
        {/* Top Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
              <h2 style={{ fontSize: '1.8rem' }}>Enquiry CRM & Admin Dashboard</h2>
              <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>Live SQLite</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Manage student pilot applications, enterprise service leads, and callback requests.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button 
              type="button" 
              className="btn btn-secondary btn-sm"
              onClick={loadData}
              title="Refresh database"
            >
              <RefreshCw size={14} className={isLoading ? 'spin' : ''} />
              <span>Refresh</span>
            </button>

            <a 
              href={getExportCsvUrl()} 
              download="dronetv_leads_export.csv"
              className="btn btn-secondary btn-sm"
            >
              <Download size={14} />
              <span>Export CSV</span>
            </a>

            <button 
              type="button" 
              className="btn btn-primary btn-sm"
              onClick={() => setIsAddLeadModalOpen(true)}
            >
              <Plus size={15} />
              <span>Add Manual Lead</span>
            </button>
          </div>
        </div>

        {/* Analytics KPI Stat Cards (Matching PDF Statuses: New, Contacted, In Progress, Closed) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem'
        }}>
          {/* Total Leads */}
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Enquiries</span>
              <FileText size={18} style={{ color: 'var(--accent-cyan)' }} />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
              {stats?.total ?? 0}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
              Across all channels
            </div>
          </div>

          {/* New */}
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>New Leads</span>
              <AlertCircle size={18} style={{ color: 'var(--accent-amber)' }} />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-amber)', fontFamily: 'var(--font-heading)' }}>
              {stats?.new ?? 0}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
              Pending first contact
            </div>
          </div>

          {/* Contacted */}
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Contacted</span>
              <Phone size={18} style={{ color: 'var(--accent-cyan)' }} />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-cyan)', fontFamily: 'var(--font-heading)' }}>
              {stats?.contacted ?? 0}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
              Initial response given
            </div>
          </div>

          {/* In Progress */}
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>In Progress</span>
              <Clock size={18} style={{ color: 'var(--accent-indigo)' }} />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#818CF8', fontFamily: 'var(--font-heading)' }}>
              {stats?.inProgress ?? 0}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
              Scheduling / proposal
            </div>
          </div>

          {/* Closed */}
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Closed</span>
              <CheckCircle size={18} style={{ color: 'var(--accent-emerald)' }} />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-emerald)', fontFamily: 'var(--font-heading)' }}>
              {stats?.closed ?? 0}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
              Completed / resolved
            </div>
          </div>
        </div>

        {/* Filters and Search Bar Card (With Filter by Student / Customer - PDF Part 6) */}
        <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
            
            {/* Search Input */}
            <div style={{ flex: '1 1 240px', position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              <input
                type="text"
                className="form-input"
                placeholder="Search name, email, phone, city, notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '2.4rem' }}
              />
            </div>

            {/* FILTER BY STUDENT / CUSTOMER (PDF Page 3 requirement) */}
            <div style={{ flex: '0 1 180px' }}>
              <select
                className="form-select"
                value={userTypeFilter}
                onChange={(e) => setUserTypeFilter(e.target.value)}
                style={{ borderColor: userTypeFilter !== 'All' ? 'var(--accent-cyan)' : undefined }}
              >
                <option value="All">Filter: All User Types</option>
                <option value="Student">Filter: Student Only</option>
                <option value="Customer">Filter: Customer Only</option>
                <option value="Other">Filter: Other</option>
              </select>
            </div>

            {/* Category Filter */}
            <div style={{ flex: '0 1 170px' }}>
              <select
                className="form-select"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="All">All Categories</option>
                <option value="DGCA Pilot Training">DGCA Training</option>
                <option value="Commercial Drone Services">Commercial Services</option>
                <option value="Drone Rentals & Sales">Rentals & Sales</option>
                <option value="College / Student Academy">College Academy</option>
                <option value="Regulatory & DigitalSky Guidance">Regulatory</option>
                <option value="General Enquiry">General</option>
              </select>
            </div>

            {/* Status Filter (PDF Page 3 statuses: New, Contacted, In Progress, Closed) */}
            <div style={{ flex: '0 1 150px' }}>
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="In Progress">In Progress</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            {/* Source Filter */}
            <div style={{ flex: '0 1 130px' }}>
              <select
                className="form-select"
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
              >
                <option value="All">All Sources</option>
                <option value="chatbot">AeroBot</option>
                <option value="website_form">Web Form</option>
                <option value="direct_portal">Manual</option>
              </select>
            </div>

            {/* Reset Filters */}
            {(userTypeFilter !== 'All' || categoryFilter !== 'All' || statusFilter !== 'All' || priorityFilter !== 'All' || sourceFilter !== 'All' || searchQuery) && (
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setSearchQuery('');
                  setUserTypeFilter('All');
                  setCategoryFilter('All');
                  setStatusFilter('All');
                  setPriorityFilter('All');
                  setSourceFilter('All');
                }}
              >
                Reset
              </button>
            )}

          </div>
        </div>

        {/* Leads Table Card */}
        <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
          {error && (
            <div style={{ padding: '1rem', background: 'rgba(244, 63, 94, 0.1)', color: '#FB7185', fontSize: '0.85rem' }}>
              {error}
            </div>
          )}

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>ID</th>
                  <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Lead Details</th>
                  <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>User Type</th>
                  <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Program / Service</th>
                  <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Channel</th>
                  <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Status</th>
                  <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Date</th>
                  <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={8} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-dim)' }}>
                      Loading enquiry records from SQLite database...
                    </td>
                  </tr>
                ) : enquiries.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-dim)' }}>
                      No enquiries found matching your active filters.
                    </td>
                  </tr>
                ) : (
                  enquiries.map((item) => (
                    <tr 
                      key={item.id} 
                      style={{ 
                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                        transition: 'background 0.2s'
                      }}
                    >
                      {/* ID */}
                      <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                        #{item.id}
                      </td>

                      {/* Lead info */}
                      <td style={{ padding: '1rem' }}>
                        <div style={{ fontWeight: 600, color: '#FFFFFF', marginBottom: '0.2rem' }}>
                          {item.name}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Mail size={12} /> {item.email}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Phone size={12} /> {item.phone}
                          </span>
                          {item.city && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-dim)' }}>
                              <MapPin size={12} /> {item.city}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* User Type Badge */}
                      <td style={{ padding: '1rem' }}>
                        {item.user_type === 'Student' ? (
                          <span className="badge badge-indigo" style={{ fontSize: '0.7rem' }}>
                            <GraduationCap size={11} /> Student
                          </span>
                        ) : item.user_type === 'Customer' ? (
                          <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>
                            <Briefcase size={11} /> Customer
                          </span>
                        ) : (
                          <span className="badge badge-amber" style={{ fontSize: '0.7rem' }}>
                            <Users size={11} /> Other
                          </span>
                        )}
                      </td>

                      {/* Course / Category */}
                      <td style={{ padding: '1rem' }}>
                        <div style={{ fontWeight: 500, color: '#FFFFFF', maxWidth: '220px', lineHeight: 1.3 }}>
                          {item.course_or_service}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '3px' }}>
                          {item.category}
                        </div>
                      </td>

                      {/* Channel */}
                      <td style={{ padding: '1rem' }}>
                        {item.source === 'chatbot' ? (
                          <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>
                            <Bot size={11} /> AeroBot
                          </span>
                        ) : item.source === 'website_form' ? (
                          <span className="badge badge-indigo" style={{ fontSize: '0.7rem' }}>
                            Web Form
                          </span>
                        ) : (
                          <span className="badge badge-amber" style={{ fontSize: '0.7rem' }}>
                            Manual
                          </span>
                        )}
                      </td>

                      {/* Status Dropdown (PDF Exact: New, Contacted, In Progress, Closed) */}
                      <td style={{ padding: '1rem' }}>
                        <select
                          className="form-select"
                          value={item.status}
                          onChange={(e) => handleStatusChange(item.id, e.target.value as EnquiryStatus)}
                          style={{
                            padding: '0.35rem 0.6rem',
                            fontSize: '0.78rem',
                            width: 'auto',
                            background: 'rgba(16, 26, 48, 0.9)'
                          }}
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </td>

                      {/* Date */}
                      <td style={{ padding: '1rem', fontSize: '0.78rem', color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>
                        {new Date(item.created_at).toLocaleDateString()}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                          <button
                            type="button"
                            className="btn btn-secondary btn-icon"
                            style={{ width: '32px', height: '32px' }}
                            onClick={() => openEditModal(item)}
                            title="View details & edit notes"
                          >
                            <Edit3 size={14} />
                          </button>

                          <button
                            type="button"
                            className="btn btn-danger btn-icon"
                            style={{ width: '32px', height: '32px' }}
                            onClick={() => {
                              setEnquiryToDelete(item);
                              setIsDeleteModalOpen(true);
                            }}
                            title="Delete enquiry"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* MODAL 1: View Details & Edit Notes */}
      {isEditModalOpen && selectedEnquiry && (
        <div className="modal-overlay" onClick={() => setIsEditModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                <Edit3 size={18} style={{ color: 'var(--accent-cyan)' }} />
                <span>Enquiry #{selectedEnquiry.id} Details</span>
              </div>
              <button type="button" className="close-btn" onClick={() => setIsEditModalOpen(false)}>
                <X size={16} />
              </button>
            </div>

            {/* Read-only Lead Details */}
            <div className="glass-card" style={{ padding: '1rem', marginBottom: '1.25rem', background: 'rgba(7, 11, 20, 0.6)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.85rem' }}>
                <div>
                  <span style={{ color: 'var(--text-dim)' }}>Name:</span>
                  <div style={{ fontWeight: 600, color: '#FFFFFF' }}>{selectedEnquiry.name}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-dim)' }}>Contact:</span>
                  <div>
                    <a href={`tel:${selectedEnquiry.phone}`} style={{ color: 'var(--accent-cyan)' }}>{selectedEnquiry.phone}</a>
                  </div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-dim)' }}>Email:</span>
                  <div style={{ color: '#FFFFFF' }}>{selectedEnquiry.email}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-dim)' }}>User Type:</span>
                  <div style={{ fontWeight: 600, color: 'var(--accent-indigo)' }}>{selectedEnquiry.user_type}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-dim)' }}>Program:</span>
                  <div style={{ color: '#FFFFFF' }}>{selectedEnquiry.course_or_service}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-dim)' }}>Source:</span>
                  <div>{selectedEnquiry.source}</div>
                </div>
              </div>

              {selectedEnquiry.message && (
                <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <span style={{ color: 'var(--text-dim)', fontSize: '0.78rem' }}>Client Inquiry Message:</span>
                  <p style={{ fontSize: '0.85rem', color: '#CBD5E1', marginTop: '2px', fontStyle: 'italic' }}>
                    "{selectedEnquiry.message}"
                  </p>
                </div>
              )}
            </div>

            {/* Editable Fields */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as EnquiryStatus)}
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">User Type</label>
                <select
                  className="form-select"
                  value={editUserType}
                  onChange={(e) => setEditUserType(e.target.value as UserType)}
                >
                  <option value="Student">Student</option>
                  <option value="Customer">Customer</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Admin / Counselor Notes</label>
              <textarea
                className="form-textarea"
                placeholder="Log discussion notes, next follow-up date, quote sent..."
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                style={{ minHeight: '90px' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSaveEdit}
                disabled={isSavingEdit}
              >
                <Save size={15} />
                <span>{isSavingEdit ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Delete Confirmation */}
      {isDeleteModalOpen && enquiryToDelete && (
        <div className="modal-overlay" onClick={() => setIsDeleteModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title" style={{ color: 'var(--accent-rose)' }}>
                <Trash2 size={18} />
                <span>Confirm Deletion</span>
              </div>
              <button type="button" className="close-btn" onClick={() => setIsDeleteModalOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
              Are you sure you want to permanently remove enquiry <strong>#{enquiryToDelete.id} ({enquiryToDelete.name})</strong>? This action cannot be undone.
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDeleteConfirm}
              >
                Delete Enquiry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Add Manual Lead */}
      {isAddLeadModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddLeadModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                <Plus size={18} style={{ color: 'var(--accent-cyan)' }} />
                <span>Add Manual Lead to CRM</span>
              </div>
              <button type="button" className="close-btn" onClick={() => setIsAddLeadModalOpen(false)}>
                <X size={16} />
              </button>
            </div>

            {newLeadError && (
              <div style={{ color: 'var(--accent-rose)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                {newLeadError}
              </div>
            )}

            <form onSubmit={handleAddManualLead}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="Lead full name"
                  value={newLeadForm.name}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, name: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input
                    type="email"
                    className="form-input"
                    required
                    placeholder="name@company.com"
                    value={newLeadForm.email}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone *</label>
                  <input
                    type="tel"
                    className="form-input"
                    required
                    placeholder="+91 98765 43210"
                    value={newLeadForm.phone}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, phone: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">User Type *</label>
                  <select
                    className="form-select"
                    value={newLeadForm.user_type}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, user_type: e.target.value as UserType })}
                  >
                    <option value="Student">Student</option>
                    <option value="Customer">Customer</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Pune, Delhi"
                    value={newLeadForm.city}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, city: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={newLeadForm.category}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, category: e.target.value as EnquiryCategory })}
                >
                  <option value="DGCA Pilot Training">DGCA Pilot Training</option>
                  <option value="Commercial Drone Services">Commercial Drone Services</option>
                  <option value="Drone Rentals & Sales">Drone Rentals & Sales</option>
                  <option value="College / Student Academy">College / Student Academy</option>
                  <option value="Regulatory & DigitalSky Guidance">Regulatory & DigitalSky Guidance</option>
                  <option value="General Enquiry">General Enquiry</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Service or Course of Interest</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Small Category RPC Certification"
                  value={newLeadForm.course_or_service}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, course_or_service: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsAddLeadModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Add Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
