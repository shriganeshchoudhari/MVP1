export type UserRole = 'RELATIONSHIP_MANAGER' | 'CREDIT_MANAGER' | 'CCPA' | 'ADMIN';

export interface UserCredentials {
  userId: string;
  password: string;
  otp?: string;
  businessGroup?: string;
  businessSegment?: string;
}

export interface UserSession {
  userId: string;
  token?: string;
  role: UserRole;
  businessGroup: string;
  businessSegment: string;
  authenticatedAt: string;
}
