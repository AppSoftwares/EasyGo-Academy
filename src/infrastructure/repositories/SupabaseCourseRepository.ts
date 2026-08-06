/* Creado por Jesús Pirela */
import { supabase } from '../database/SupabaseClient';
import { Course } from '../../core/entities/Course';
import { ICourseRepository } from '../../core/repositories/ICourseRepository';

export class SupabaseCourseRepository implements ICourseRepository {
  async getAllPublished(): Promise<Course[]> {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('is_published', true);

    if (error) throw new Error(error.message);
    return data as Course[];
  }

  async getById(id: string): Promise<Course | null> {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data as Course;
  }
}
