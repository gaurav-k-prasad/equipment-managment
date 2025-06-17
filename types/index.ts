
import type { Timestamp } from "firebase/firestore";

export type UserRole = "admin" | "user";

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
  createdAt?: Timestamp; // Optional: consider adding for consistency
  updatedAt?: Timestamp; // Optional: consider adding for consistency
}

export interface Equipment {
  id: string;
  name: string;
  category: string;
  status: "Available" | "In Use" | "Maintenance" | "Retired";
  serialNumber: string;
  purchaseDate: Timestamp | null;
  warrantyExpiryDate: Timestamp | null;
  assignedTo?: string;
  location?: string;
  notes?: string;
  trackingNumber?: string;
  trackingStatus?: string;
  imageUrl?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
