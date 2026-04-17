export enum Role {
  ADMIN = 'ADMIN',
  BRANCH_MANAGER = 'BRANCH_MANAGER',
  EMPLOYEE = 'EMPLOYEE',
  SECRETARY = 'SECRETARY'
}

export enum UserStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  REJECTED = 'REJECTED'
}

export enum BookingType {
  ACADEMIC_FIXED = 'ACADEMIC_FIXED',
  ACADEMIC_EXCEPTIONAL = 'ACADEMIC_EXCEPTIONAL',
  MULTI_PURPOSE = 'MULTI_PURPOSE'
}

export enum BookingStatus {
  PENDING_ADMIN = 'PENDING_ADMIN',
  PENDING_BRANCH_MGR = 'PENDING_BRANCH_MGR',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum RoomType {
  LECTURE = 'LECTURE',
  MULTI_PURPOSE = 'MULTI_PURPOSE'
}

export type AASTSlot = 1 | 2 | 3 | 4 | 5 | 6;

export interface User {
  id: string;
  employee_id: string;
  name: string;
  role: Role;
  can_view_schedule?: boolean;
}
