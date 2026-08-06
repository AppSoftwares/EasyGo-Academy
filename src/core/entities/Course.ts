/* Creado por Jesús Pirela */
/**
 * C:/Users/admin/Documents/easygo-academy-pro/src/core/entities/Course.ts
 */

export enum CourseLevel {
  A1 = 'A1',
  A2 = 'A2',
  B1 = 'B1',
  B2 = 'B2',
  C1 = 'C1',
  C2 = 'C2'
}

export interface Course {
  id: string;
  title: string;
  description?: string;
  level: CourseLevel;
  isPublished: boolean;
  createdBy: string;
  createdAt: Date;
}
