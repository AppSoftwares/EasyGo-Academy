/* Creado por Jesús Pirela */
/**
 * C:/Users/admin/Documents/easygo-academy-pro/src/core/entities/User.ts
 * Dominio: Entidad pura de Usuario
 */

export enum UserRole {
  USER = 'ROLE_USER',
  TEACHER = 'ROLE_TEACHER',
  ADMIN = 'ROLE_ADMIN',
  SUPERADMIN = 'ROLE_SUPERADMIN'
}

export enum SubscriptionTier {
  FREE = 'FREE',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  ANNUAL = 'ANNUAL'
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  subscriptionStatus: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  subscriptionTier: SubscriptionTier;
  timezone: string;
  createdAt: Date;
}
