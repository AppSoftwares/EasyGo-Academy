/* Creado por Jesús Pirela */
/**
 * Seguridad: Invalidación de sesiones
 */
import api from '../../services/api';

export class KillSwitch {
  /**
   * Invalida todas las sesiones de un usuario a través del backend.
   */
  static async invalidateUserSessions(userId: string): Promise<boolean> {
    try {
      await api.post(`/users/${userId}/invalidate-sessions`);
      console.log(`[AUDIT] KillSwitch activado contra usuario ${userId} a las ${new Date().toISOString()}`);
      return true;
    } catch (error) {
      console.error('Error al activar KillSwitch:', error);
      return false;
    }
  }
}
