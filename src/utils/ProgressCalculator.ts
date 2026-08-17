/**
 * =====================================================================
 * LÓGICA DE PROGRESO DEL ESTUDIANTE — EasyGo Academy
 * =====================================================================
 * Traducido de ProgressCalculator.kt
 */

export enum LevelCode {
  A1 = 'A1',
  A2 = 'A2',
  B1 = 'B1',
  B2 = 'B2',
  C1 = 'C1'
}

export interface LevelProgressSnapshot {
  levelId: string;
  totalLessons: number;
  completedLessons: number;
  totalExercises: number;
  completedExercises: number;
  startedAt: number; // epoch millis
}

export interface ProgressResult {
  percentComplete: number;
  lessonsRemaining: number;
  estimatedDaysRemaining: number;
  estimatedFinishDateMillis: number;
  onTrackForPlannedDuration: boolean;
}

const MILLIS_PER_DAY = 24 * 60 * 60 * 1000;
const AVG_DAYS_PER_MONTH = 30.44;

export const ProgressCalculator = {

  plannedDurationMonths(levelCode: LevelCode): number | null {
    switch (levelCode) {
      case LevelCode.A1: return 2.5;
      case LevelCode.A2: return 2.5;
      case LevelCode.B1: return 3.0;
      case LevelCode.B2: return 3.0;
      case LevelCode.C1: return null;
      default: return null;
    }
  },

  calculatePercent(snapshot: LevelProgressSnapshot): number {
    if (snapshot.totalLessons === 0) return 0;

    const lessonRatio = snapshot.completedLessons / snapshot.totalLessons;
    const exerciseRatio = snapshot.totalExercises > 0
      ? snapshot.completedExercises / snapshot.totalExercises
      : 0;

    const weighted = (lessonRatio * 0.7) + (exerciseRatio * 0.3);
    return Math.min(100, Math.max(0, Math.round(weighted * 100)));
  },

  calculateEstimate(
    snapshot: LevelProgressSnapshot,
    plannedDurationMonths: number | null,
    nowMillis: number = Date.now()
  ): ProgressResult {
    const percent = this.calculatePercent(snapshot);
    const lessonsRemaining = Math.max(0, snapshot.totalLessons - snapshot.completedLessons);

    const daysElapsed = Math.max(0, (nowMillis - snapshot.startedAt) / MILLIS_PER_DAY);

    let estimatedDaysRemaining: number;
    let onTrack = true;

    if (snapshot.completedLessons < 1 || daysElapsed < 1) {
      const plannedDays = plannedDurationMonths ? plannedDurationMonths * AVG_DAYS_PER_MONTH : 0;
      estimatedDaysRemaining = Math.round(plannedDays);
    } else {
      const paceLessonsPerDay = snapshot.completedLessons / daysElapsed;
      estimatedDaysRemaining = paceLessonsPerDay > 0
        ? Math.round(lessonsRemaining / paceLessonsPerDay)
        : 0;

      if (plannedDurationMonths !== null) {
        const plannedDays = plannedDurationMonths * AVG_DAYS_PER_MONTH;
        const totalProjectedDays = daysElapsed + estimatedDaysRemaining;
        onTrack = totalProjectedDays <= plannedDays;
      }
    }

    const estimatedFinishDateMillis = nowMillis + (estimatedDaysRemaining * MILLIS_PER_DAY);

    return {
      percentComplete: percent,
      lessonsRemaining,
      estimatedDaysRemaining,
      estimatedFinishDateMillis,
      onTrackForPlannedDuration: onTrack
    };
  }
};
