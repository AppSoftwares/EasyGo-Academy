/* Creado por Jesús Pirela */
import { Course } from '../entities/Course';

export interface ICourseRepository {
  getAllPublished(): Promise<Course[]>;
  getById(id: string): Promise<Course | null>;
}
