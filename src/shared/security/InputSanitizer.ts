/* Creado por Jesús Pirela */
/**
 * Capa: Shared - Utilidades de seguridad transversales
 */

export class InputSanitizer {
  /**
   * Sanitiza strings de entrada eliminando espacios en blanco y truncando a longitud máxima.
   * La validación de inyección se delega a las queries parametrizadas (ORM) y validadores de backend.
   */
  static clean(input: string, maxLength: number = 254): string {
    if (typeof input !== 'string') return '';
    return input.trim().substring(0, maxLength);
  }

  /**
   * Validación estricta de Email según estándar
   */
  static validateEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return (
      typeof email === 'string' &&
      email.length >= 3 &&
      email.length <= 254 &&
      emailRegex.test(email)
    );
  }

  /**
   * Validación de contraseña fuerte
   * Mínimo 8 caracteres, al menos una mayúscula, una minúscula y un número
   */
  static isStrongPassword(password: string): boolean {
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
    return typeof password === 'string' && strongRegex.test(password);
  }
}
