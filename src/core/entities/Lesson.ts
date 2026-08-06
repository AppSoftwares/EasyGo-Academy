/* Creado por Jesús Pirela */
/**
 * C:/Users/admin/Documents/easygo-academy-pro/src/core/entities/Lesson.ts
 */

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  contentUrl?: string;
  order: number;
  createdAt: Date;
}
