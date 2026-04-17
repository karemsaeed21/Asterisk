import { Router } from 'express';
import { login } from '../controllers/authController.js';
import { getAllRooms, getRoomAvailability, createRoom } from '../controllers/roomController.js';
import { createBooking, getMyRequests } from '../controllers/bookingController.js';
import { approveBooking, rejectBookingWithAlternatives, getPendingRequests } from '../controllers/adminController.js';
import { getDailyMorningReport, getVIPNotifications } from '../controllers/reportController.js';
import { getSettings, updateSettings } from '../controllers/settingsController.js';
import { authenticate, requireRole } from '../middleware/authMiddleware.js';
import { Role } from '../types/index.js';

const router = Router();

// Auth Endpoints
router.post('/auth/login', login);

// Room Endpoints
router.get('/rooms', authenticate, getAllRooms);
router.get('/rooms/availability', authenticate, getRoomAvailability);
// Admin can dynamically add rooms
router.post('/rooms', authenticate, requireRole([Role.ADMIN]), createRoom);

// Booking Endpoints
router.post('/bookings', authenticate, createBooking);
router.get('/bookings/my-requests', authenticate, getMyRequests);

// Admin / Approval Endpoints
router.get('/admin/requests/pending', authenticate, requireRole([Role.ADMIN, Role.BRANCH_MANAGER]), getPendingRequests);
router.post('/admin/bookings/:bookingId/approve', authenticate, requireRole([Role.ADMIN, Role.BRANCH_MANAGER]), approveBooking);
router.post('/admin/bookings/:bookingId/reject', authenticate, requireRole([Role.ADMIN, Role.BRANCH_MANAGER]), rejectBookingWithAlternatives);

// Reports & Notifications
router.get('/admin/reports/morning', authenticate, requireRole([Role.ADMIN]), getDailyMorningReport);
router.get('/admin/notifications/vip', authenticate, requireRole([Role.ADMIN]), getVIPNotifications);

// System Settings
router.get('/admin/settings', authenticate, requireRole([Role.ADMIN]), getSettings);
router.put('/admin/settings', authenticate, requireRole([Role.ADMIN]), updateSettings);

export default router;
