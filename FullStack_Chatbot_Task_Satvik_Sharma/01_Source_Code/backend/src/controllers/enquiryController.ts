import { Request, Response } from 'express';
import { db } from '../db/connection';
import { Enquiry, EnquiryFilterParams } from '../types/enquiry';

// CREATE: Post new enquiry
export function createEnquiry(req: Request, res: Response): void {
  try {
    const {
      name,
      email,
      phone,
      user_type = 'Customer',
      city,
      category,
      course_or_service,
      message,
      priority,
      source
    } = req.body;

    const stmt = db.prepare(`
      INSERT INTO enquiries (
        name, email, phone, user_type, city, category, course_or_service, message,
        priority, source, status, created_at, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, 'New', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      )
    `);

    const result = stmt.run(
      name,
      email,
      phone,
      user_type,
      city || 'Not Specified',
      category,
      course_or_service || 'General Inquiry',
      message || '',
      priority || 'Medium',
      source || 'website_form'
    );

    const createdEnquiry = db
      .prepare('SELECT * FROM enquiries WHERE id = ?')
      .get(result.lastInsertRowid) as Enquiry;

    res.status(201).json({
      success: true,
      message: 'Enquiry submitted successfully! A DroneTV advisor will connect with you shortly.',
      data: createdEnquiry
    });
  } catch (error: any) {
    console.error('Error creating enquiry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create enquiry. Please check your inputs and try again.'
    });
  }
}

// READ: List enquiries with search, filters, pagination
export function getEnquiries(req: Request, res: Response): void {
  try {
    const {
      search,
      category,
      user_type,
      status,
      priority,
      source,
      sortBy = 'created_at',
      sortOrder = 'DESC',
      page = 1,
      limit = 50
    } = req.query as unknown as EnquiryFilterParams;

    const conditions: string[] = [];
    const params: any[] = [];

    // Search text across name, email, phone, city, notes
    if (search && search.trim() !== '') {
      const searchTerm = `%${search.trim()}%`;
      conditions.push('(name LIKE ? OR email LIKE ? OR phone LIKE ? OR city LIKE ? OR course_or_service LIKE ? OR admin_notes LIKE ?)');
      params.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
    }

    // Filter by Category
    if (category && category !== 'All') {
      conditions.push('category = ?');
      params.push(category);
    }

    // Filter by User Type (Student / Customer / Other)
    if (user_type && user_type !== 'All') {
      conditions.push('user_type = ?');
      params.push(user_type);
    }

    // Filter by Status
    if (status && status !== 'All') {
      conditions.push('status = ?');
      params.push(status);
    }

    // Filter by Priority
    if (priority && priority !== 'All') {
      conditions.push('priority = ?');
      params.push(priority);
    }

    // Filter by Source
    if (source && source !== 'All') {
      conditions.push('source = ?');
      params.push(source);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Validate sort column to prevent SQL injection
    const allowedSortCols = ['id', 'created_at', 'name', 'priority', 'status', 'category', 'user_type'];
    const safeSortBy = allowedSortCols.includes(sortBy) ? sortBy : 'created_at';
    const safeSortOrder = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    // Total count for pagination
    const totalCountRow = db
      .prepare(`SELECT COUNT(*) as total FROM enquiries ${whereClause}`)
      .get(...params) as { total: number };
    const total = totalCountRow.total;

    // Fetch page items
    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.max(1, Math.min(100, Number(limit) || 50));
    const offset = (pageNum - 1) * limitNum;

    const data = db
      .prepare(`
        SELECT * FROM enquiries 
        ${whereClause} 
        ORDER BY ${safeSortBy} ${safeSortOrder} 
        LIMIT ? OFFSET ?
      `)
      .all(...params, limitNum, offset) as Enquiry[];

    res.json({
      success: true,
      data,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error: any) {
    console.error('Error fetching enquiries:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve enquiries from database.'
    });
  }
}

// READ: Get single enquiry
export function getEnquiryById(req: Request, res: Response): void {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid enquiry ID provided.'
      });
      return;
    }

    const enquiry = db.prepare('SELECT * FROM enquiries WHERE id = ?').get(id) as Enquiry | undefined;

    if (!enquiry) {
      res.status(404).json({
        success: false,
        message: `Enquiry with ID ${id} not found.`
      });
      return;
    }

    res.json({
      success: true,
      data: enquiry
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch enquiry.'
    });
  }
}

// UPDATE: Modify status, notes, priority, user_type
export function updateEnquiry(req: Request, res: Response): void {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid enquiry ID provided.'
      });
      return;
    }

    const existing = db.prepare('SELECT * FROM enquiries WHERE id = ?').get(id) as Enquiry | undefined;

    if (!existing) {
      res.status(404).json({
        success: false,
        message: `Enquiry with ID ${id} not found.`
      });
      return;
    }

    const {
      status = existing.status,
      user_type = existing.user_type,
      priority = existing.priority,
      admin_notes = existing.admin_notes,
      category = existing.category,
      course_or_service = existing.course_or_service
    } = req.body;

    db.prepare(`
      UPDATE enquiries 
      SET status = ?, user_type = ?, priority = ?, admin_notes = ?, category = ?, course_or_service = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(status, user_type, priority, admin_notes, category, course_or_service, id);

    const updated = db.prepare('SELECT * FROM enquiries WHERE id = ?').get(id) as Enquiry;

    res.json({
      success: true,
      message: 'Enquiry updated successfully',
      data: updated
    });
  } catch (error: any) {
    console.error('Error updating enquiry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update enquiry.'
    });
  }
}

// DELETE: Remove enquiry
export function deleteEnquiry(req: Request, res: Response): void {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid enquiry ID provided.'
      });
      return;
    }

    const existing = db.prepare('SELECT * FROM enquiries WHERE id = ?').get(id) as Enquiry | undefined;

    if (!existing) {
      res.status(404).json({
        success: false,
        message: `Enquiry with ID ${id} not found.`
      });
      return;
    }

    db.prepare('DELETE FROM enquiries WHERE id = ?').run(id);

    res.json({
      success: true,
      message: `Enquiry #${id} deleted successfully.`,
      deletedId: id
    });
  } catch (error: any) {
    console.error('Error deleting enquiry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete enquiry.'
    });
  }
}

// STATS: Summary analytics for Admin Dashboard
export function getEnquiryStats(req: Request, res: Response): void {
  try {
    const totalCount = (db.prepare('SELECT COUNT(*) as count FROM enquiries').get() as { count: number }).count;
    
    const statusCounts = db.prepare(`
      SELECT status, COUNT(*) as count 
      FROM enquiries 
      GROUP BY status
    `).all() as { status: string; count: number }[];

    const categoryCounts = db.prepare(`
      SELECT category, COUNT(*) as count 
      FROM enquiries 
      GROUP BY category
    `).all() as { category: string; count: number }[];

    const userTypeCounts = db.prepare(`
      SELECT user_type, COUNT(*) as count 
      FROM enquiries 
      GROUP BY user_type
    `).all() as { user_type: string; count: number }[];

    const sourceCounts = db.prepare(`
      SELECT source, COUNT(*) as count 
      FROM enquiries 
      GROUP BY source
    `).all() as { source: string; count: number }[];

    const statusMap: Record<string, number> = {
      'New': 0,
      'Contacted': 0,
      'In Progress': 0,
      'Closed': 0
    };

    statusCounts.forEach((item) => {
      statusMap[item.status] = item.count;
    });

    res.json({
      success: true,
      stats: {
        total: totalCount,
        new: statusMap['New'] || 0,
        contacted: statusMap['Contacted'] || 0,
        inProgress: statusMap['In Progress'] || 0,
        closed: statusMap['Closed'] || 0,
        byCategory: categoryCounts,
        byUserType: userTypeCounts,
        bySource: sourceCounts
      }
    });
  } catch (error: any) {
    console.error('Error getting stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load enquiry analytics.'
    });
  }
}

// CSV EXPORT: Download enquiries as CSV
export function exportEnquiriesCsv(req: Request, res: Response): void {
  try {
    const rows = db.prepare('SELECT * FROM enquiries ORDER BY id DESC').all() as Enquiry[];

    const headers = [
      'ID', 'Name', 'Email', 'Phone', 'User Type', 'City', 'Category', 
      'Course or Service', 'Status', 'Priority', 'Source', 
      'Message', 'Admin Notes', 'Created At'
    ];

    const escapeCsv = (str: any) => {
      if (str === null || str === undefined) return '""';
      const clean = String(str).replace(/"/g, '""');
      return `"${clean}"`;
    };

    const csvLines = [
      headers.join(','),
      ...rows.map(r => [
        r.id,
        escapeCsv(r.name),
        escapeCsv(r.email),
        escapeCsv(r.phone),
        escapeCsv(r.user_type),
        escapeCsv(r.city),
        escapeCsv(r.category),
        escapeCsv(r.course_or_service),
        escapeCsv(r.status),
        escapeCsv(r.priority),
        escapeCsv(r.source),
        escapeCsv(r.message),
        escapeCsv(r.admin_notes),
        escapeCsv(r.created_at)
      ].join(','))
    ];

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="dronetv_leads_export.csv"');
    res.send(csvLines.join('\n'));
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to export CSV.'
    });
  }
}
