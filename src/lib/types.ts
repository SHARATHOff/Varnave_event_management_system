export type UserRole = 'superAdmin' | 'admin' | 'randomly';

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: UserRole;
  avatar?: string;
}

export interface Registration {
  id: string;
  name: string;
  phone: string;
  email:string;
  college: string;
  eventDay: 'Day 1' | 'Day 2';
  eventName: string[];
  paymentStatus: 'pending' | 'success';
  ticketId: string | null;
  createdAt: any; // Can be Date or Firestore Timestamp
  registeredBy: string; // UID of user with 'randomly' role or 'public'
  checkedIn: boolean;
  checkInTime: Date | null;
  foodCheckedIn: boolean;
  foodCheckInTime: Date | null;
}

export interface Ticket {
  id: string;
  assignedTo: string | null; // registrationId
  paymentStatus: 'pending' | 'success';
  checkedIn: boolean;
  checkInTime: Date | null;
}
