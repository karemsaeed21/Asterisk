export const UserStatus = {
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
  REJECTED: 'REJECTED'
} as const;

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];

export const Role = {
  ADMIN: 'ADMIN',
  BRANCH_MANAGER: 'BRANCH_MANAGER',
  EMPLOYEE: 'EMPLOYEE',
  SECRETARY: 'SECRETARY'
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export interface User {
  id: string; // Document ID often maps to employee_id
  employee_id: string;
  name: string;
  role?: Role;
  status: UserStatus;
  passwordHash: string;
  createdAt: string; 
  updatedAt: string;
}

export interface UserPermissionOverrides {
  id: string;
  userId: string; // Reference to User.id
  can_view_schedule?: boolean;
  can_approve_requests?: boolean;
  can_manage_rooms?: boolean;
  updatedAt: string;
}

export const DelegationStatus = {
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
  EXPIRED: 'EXPIRED',
  REVOKED: 'REVOKED'
} as const;

export type DelegationStatus = (typeof DelegationStatus)[keyof typeof DelegationStatus];

export interface Delegation {
  id: string;
  delegatorId: string;
  substituteId: string;
  startDate: string; // ISO Date String
  endDate: string; // ISO Date String
  status: DelegationStatus;
  createdAt: string;
}

export const RoomType = {
  LECTURE: 'LECTURE',
  MULTI_PURPOSE: 'MULTI_PURPOSE'
} as const;

export type RoomType = (typeof RoomType)[keyof typeof RoomType];

export interface Room {
  id: string;
  name: string;
  type: RoomType;
  capacity?: number;
  isActive: boolean;
}

export const BookingType = {
  ACADEMIC_FIXED: 'ACADEMIC_FIXED',
  ACADEMIC_EXCEPTIONAL: 'ACADEMIC_EXCEPTIONAL',
  MULTI_PURPOSE: 'MULTI_PURPOSE'
} as const;

export type BookingType = (typeof BookingType)[keyof typeof BookingType];

export const BookingStatus = {
  PENDING_ADMIN: 'PENDING_ADMIN',
  PENDING_BRANCH_MGR: 'PENDING_BRANCH_MGR',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED'
} as const;

export type BookingStatus = (typeof BookingStatus)[keyof typeof BookingStatus];

export const AASTSlot = {
  SLOT_1_0830: 1,
  SLOT_2_1030: 2,
  SLOT_3_1230: 3,
  SLOT_4_1430: 4,
  SLOT_5_1630: 5,
  SLOT_6_1830: 6
} as const;

export type AASTSlot = (typeof AASTSlot)[keyof typeof AASTSlot];

export interface MultiPurposeDetails {
  eventManagerName: string;
  eventManagerTitle: string;
  mobileNumber: string;
  purpose: string;
  needsMics: boolean;
  micQuantity?: number;
  needsLaptop: boolean;
  needsVideoConference: boolean;
}

export interface BookingRejection {
  reason: string;
  alternativeTimeSlot?: AASTSlot;
  alternativeDate?: string;
  alternativeRoomId?: string;
  rejectedBy: string; // User ID
  rejectedAt: string;
}

export interface Booking {
  id: string;
  roomId: string;
  requesterId: string;
  type: BookingType;
  date: string; // YYYY-MM-DD
  slotId: AASTSlot;
  status: BookingStatus;
  rejectionDetails?: BookingRejection;
  multiPurposeDetails?: MultiPurposeDetails;
  createdAt: string;
  updatedAt: string;
}
