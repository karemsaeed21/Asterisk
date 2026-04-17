import { Router } from 'express';
import { login, signup } from '../controllers/authController.js';
import { getAllRooms, getRoomAvailability, createRoom } from '../controllers/roomController.js';
import { createBooking, getMyRequests } from '../controllers/bookingController.js';
import { approveBooking, rejectBookingWithAlternatives, getPendingRequests, createFixedSchedule, deleteFixedSchedule, getFixedSchedules, getDailySchedule, updateBookingData, deleteBooking } from '../controllers/adminController.js';
import { getDailyMorningReport, getVIPNotifications } from '../controllers/reportController.js';
import { getSettings, updateSettings, getPublicSettings } from '../controllers/settingsController.js';
import { getAllUsers, updateUserOverride, createDelegation, revokeDelegation, getPendingUsers, approveUser, rejectUser } from '../controllers/userController.js';
import { authenticate, requireRole } from '../middleware/authMiddleware.js';
import { Role } from '../types/index.js';

const router = Router();

// Shared/Public Shared Data (Authenticated)
router.get('/settings/public', authenticate, getPublicSettings);

// Auth Endpoints
router.post('/auth/login', login);
router.post('/auth/signup', signup);

// Room Endpoints
router.get('/rooms', authenticate, getAllRooms);
router.get('/rooms/availability', authenticate, requireRole([Role.ADMIN, Role.BRANCH_MANAGER, Role.SECRETARY]), getRoomAvailability);
// Admin can dynamically add rooms
router.post('/rooms', authenticate, requireRole([Role.ADMIN, Role.BRANCH_MANAGER]), createRoom);

// Booking Endpoints
router.post('/bookings', authenticate, createBooking);
router.get('/bookings/my-requests', authenticate, getMyRequests);

// Admin / Approval Endpoints
router.get('/admin/requests/pending', authenticate, requireRole([Role.ADMIN, Role.BRANCH_MANAGER]), getPendingRequests);
router.post('/admin/bookings/:bookingId/approve', authenticate, requireRole([Role.ADMIN, Role.BRANCH_MANAGER]), approveBooking);
router.post('/admin/bookings/:bookingId/reject', authenticate, requireRole([Role.ADMIN, Role.BRANCH_MANAGER]), rejectBookingWithAlternatives);
router.put('/admin/bookings/:bookingId', authenticate, requireRole([Role.ADMIN, Role.BRANCH_MANAGER]), updateBookingData);
router.delete('/admin/bookings/:bookingId', authenticate, requireRole([Role.ADMIN, Role.BRANCH_MANAGER]), deleteBooking);

// Admin Fixed Schedules
router.post('/admin/schedules/fixed', authenticate, requireRole([Role.ADMIN, Role.BRANCH_MANAGER]), createFixedSchedule);
router.delete('/admin/schedules/fixed', authenticate, requireRole([Role.ADMIN, Role.BRANCH_MANAGER]), deleteFixedSchedule);
router.get('/admin/schedules/fixed', authenticate, requireRole([Role.ADMIN, Role.BRANCH_MANAGER]), getFixedSchedules);

// Global Schedule Grid
router.get('/admin/schedules/daily', authenticate, requireRole([Role.ADMIN, Role.BRANCH_MANAGER]), getDailySchedule);

// Reports & Notifications
router.get('/admin/reports/morning', authenticate, requireRole([Role.ADMIN, Role.BRANCH_MANAGER]), getDailyMorningReport);
router.get('/admin/notifications/vip', authenticate, requireRole([Role.ADMIN, Role.BRANCH_MANAGER]), getVIPNotifications);

// System Settings
router.get('/admin/settings', authenticate, requireRole([Role.ADMIN, Role.BRANCH_MANAGER]), getSettings);
router.put('/admin/settings', authenticate, requireRole([Role.ADMIN, Role.BRANCH_MANAGER]), updateSettings);

// User Management (Admin Only)
router.get('/admin/users', authenticate, requireRole([Role.ADMIN, Role.BRANCH_MANAGER]), getAllUsers);
router.get('/admin/users/pending', authenticate, requireRole([Role.ADMIN, Role.BRANCH_MANAGER]), getPendingUsers);
router.put('/admin/users/:userId/overrides', authenticate, requireRole([Role.ADMIN, Role.BRANCH_MANAGER]), updateUserOverride);
router.post('/admin/users/:userId/approve', authenticate, requireRole([Role.ADMIN, Role.BRANCH_MANAGER]), approveUser);
router.delete('/admin/users/:userId/reject', authenticate, requireRole([Role.ADMIN, Role.BRANCH_MANAGER]), rejectUser);

// Delegation (Self-service or Admin managed)
router.post('/delegations', authenticate, createDelegation);
router.patch('/delegations/:delegationId/revoke', authenticate, revokeDelegation);

export default router;
