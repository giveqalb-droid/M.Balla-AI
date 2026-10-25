export interface StudentProfile {
  id: string;
  name: string;
  deskNumber: number;
  averageGrade: number;
  status: 'SOUTIEN' | 'STANDARD' | 'MAITRISE';
  learningStyle: 'Visuel' | 'Auditif' | 'Kinesthésique';
  attentionScore: number; // sur 100
  historicalGrades: number[]; // 6 dernières semaines
  syntheticTrajectory: {
    predictedGradeNextMonth: number;
    riskFactor: 'Faible' | 'Modéré' | 'Élevé';
    recommendedRemediation: string;
    cognitiveBias: string;
  };
}

export class SynthesisAIPedagogicalEngine {
  /**
   * Simule et calcule la trajectoire d'apprentissage d'un élève à partir de ses données historiques
   * et de son style d'apprentissage (Particularité Synthesis AI - Données Prédictives Synthétiques).
   */
  static analyzeStudentTrajectory(student: StudentProfile): StudentProfile {
    const grades = student.historicalGrades;
    const recentTrend = grades[grades.length - 1] - grades[0];
    const isImproving = recentTrend > 0;

    // Calcul d'impact prédictif
    let predictedGrade = student.averageGrade + (recentTrend * 0.4);
    if (student.attentionScore < 60) predictedGrade -= 1.0;
    if (student.learningStyle === 'Visuel' && student.deskNumber <= 2) predictedGrade += 1.5;

    predictedGrade = Math.min(20, Math.max(0, Math.round(predictedGrade * 10) / 10));

    let riskFactor: 'Faible' | 'Modéré' | 'Élevé' = 'Faible';
    if (predictedGrade < 10) riskFactor = 'Élevé';
    else if (predictedGrade < 12 || !isImproving) riskFactor = 'Modéré';

    return {
      ...student,
      syntheticTrajectory: {
        predictedGradeNextMonth: predictedGrade,
        riskFactor,
        recommendedRemediation: student.status === 'SOUTIEN' 
          ? "Utiliser le boulier traditionnel et placer l'élève au 1er rang près de la zone chiffres du tableau." 
          : "Attribuer un rôle de tuteur en numération et proposer des énigmes complexes.",
        cognitiveBias: student.learningStyle === 'Visuel' 
          ? "Besoin de schématisation spatiale et de couleurs pour la retenue."
          : "Apprentissage renforcé par l'explication orale à haute voix."
      }
    };
  }

  /**
   * Génère un profil d'élève fictif d'entraînement (Génération Synthétique)
   */
  static generateSyntheticStudent(id: string, name: string, deskNumber: number): StudentProfile {
    const baseGrade = Math.floor(Math.random() * 10) + 8; // entre 8 et 18
    const status = baseGrade < 10 ? 'SOUTIEN' : baseGrade >= 14 ? 'MAITRISE' : 'STANDARD';
    const styles: ('Visuel' | 'Auditif' | 'Kinesthésique')[] = ['Visuel', 'Auditif', 'Kinesthésique'];
    
    const historicalGrades = Array.from({ length: 6 }, () => 
      Math.min(20, Math.max(5, baseGrade + (Math.floor(Math.random() * 5) - 2)))
    );

    const rawStudent: StudentProfile = {
      id,
      name,
      deskNumber,
      averageGrade: baseGrade,
      status,
      learningStyle: styles[Math.floor(Math.random() * styles.length)],
      attentionScore: Math.floor(Math.random() * 40) + 60,
      historicalGrades,
      syntheticTrajectory: {
        predictedGradeNextMonth: baseGrade,
        riskFactor: 'Faible',
        recommendedRemediation: '',
        cognitiveBias: ''
      }
    };

    return this.analyzeStudentTrajectory(rawStudent);
  }
}
