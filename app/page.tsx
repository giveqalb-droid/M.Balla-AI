'use client';

import React, { useState } from 'react';

interface StudentProfile {
  id: string;
  name: string;
  deskNumber: number;
  averageGrade: number;
  status: 'SOUTIEN' | 'STANDARD' | 'MAITRISE';
  learningStyle: 'Visuel' | 'Auditif' | 'Kinesthésique';
  attentionScore: number;
  historicalGrades: number[];
  syntheticTrajectory: {
    predictedGradeNextMonth: number;
    riskFactor: 'Faible' | 'Modéré' | 'Élevé';
    recommendedRemediation: string;
    cognitiveBias: string;
  };
}

export default function HomePage() {
  const initialStudents: StudentProfile[] = [
    {
      id: '1', name: 'Abdou Laye', deskNumber: 1, averageGrade: 8.5, status: 'SOUTIEN', learningStyle: 'Visuel', attentionScore: 55, historicalGrades: [8, 8.5, 8, 9, 8, 8.5],
      syntheticTrajectory: { predictedGradeNextMonth: 12.0, riskFactor: 'Faible', recommendedRemediation: 'Utiliser le boulier traditionnel et placer l\'élève au 1er rang près de la zone chiffres.', cognitiveBias: 'Besoin de schématisation spatiale et de couleurs pour la retenue.' }
    },
    {
      id: '2', name: 'Aïssatou Sow', deskNumber: 1, averageGrade: 14.0, status: 'MAITRISE', learningStyle: 'Auditif', attentionScore: 85, historicalGrades: [13, 14, 14, 15, 14, 14],
      syntheticTrajectory: { predictedGradeNextMonth: 15.5, riskFactor: 'Faible', recommendedRemediation: 'Attribuer un rôle de tuteur en numération.', cognitiveBias: 'Apprentissage renforcé par l\'explication orale.' }
    },
    {
      id: '3', name: 'Moussa Diallo', deskNumber: 2, averageGrade: 9.0, status: 'SOUTIEN', learningStyle: 'Kinesthésique', attentionScore: 60, historicalGrades: [9, 8.5, 9, 9, 9.5, 9],
      syntheticTrajectory: { predictedGradeNextMonth: 11.5, riskFactor: 'Modéré', recommendedRemediation: 'Manipulation concrète d\'objets pour les exercices de calcul.', cognitiveBias: 'Besoin d\'interaction physique avec le matériel pédagogique.' }
    },
    {
      id: '4', name: 'Fatou Ndiaye', deskNumber: 2, averageGrade: 12.5, status: 'STANDARD', learningStyle: 'Visuel', attentionScore: 75, historicalGrades: [12, 12, 13, 12, 13, 12.5],
      syntheticTrajectory: { predictedGradeNextMonth: 13.5, riskFactor: 'Faible', recommendedRemediation: 'Encourager la prise de notes structurées.', cognitiveBias: 'Bonne mémorisation visuelle des schémas.' }
    },
    {
      id: '5', name: 'Cheikh Tidiane', deskNumber: 3, averageGrade: 15.0, status: 'MAITRISE', learningStyle: 'Auditif', attentionScore: 90, historicalGrades: [15, 14, 15, 16, 15, 15],
      syntheticTrajectory: { predictedGradeNextMonth: 16.5, riskFactor: 'Faible', recommendedRemediation: 'Proposer des énigmes complexes d\'approfondissement.', cognitiveBias: 'Excellente restitution auditive.' }
    },
    {
      id: '6', name: 'Khadija Ba', deskNumber: 3, averageGrade: 11.0, status: 'STANDARD', learningStyle: 'Visuel', attentionScore: 70, historicalGrades: [10, 11, 11, 12, 11, 11],
      syntheticTrajectory: { predictedGradeNextMonth: 12.0, riskFactor: 'Faible', recommendedRemediation: 'Suivi régulier des tracés géométriques.', cognitiveBias: 'Sensible à la clarté visuelle du tableau.' }
    }
  ];

  const [students] = useState<StudentProfile[]>(initialStudents);
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);
  const [showPermutationModal, setShowPermutationModal] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceQuery, setVoiceQuery] = useState('');
  const [aiSpeechResponse, setAiSpeechResponse] = useState('');

  const soutienCount = students.filter(s => s.status === 'SOUTIEN').length;
  const maitriseCount = students.filter(s => s.status === 'MAITRISE').length;

  const speakText = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      window.speechSynthesis.speak(utterance);
    }
  };

  const startVoiceRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("La reconnaissance vocale n'est pas supportée par ce navigateur. Utilisez Google Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'fr-FR';
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setVoiceQuery(transcript);
      const response = `J'ai bien écouté votre consigne : "${transcript}". Le moteur Synthesis AI recommande une attention particulière sur la différenciation pédagogique.`;
      setAiSpeechResponse(response);
      speakText(response);
    };

    recognition.start();
  };

  return (
    <div className="min-h-screen flex flex-col bg-amber-50/40 text-slate-800 font-sans">
      <header className="bg-amber-900 text-amber-50 shadow-md border-b-4 border-amber-950 p-4 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-wide flex items-center gap-2">
              <span>Assistant Pédagogique M. Balla</span>
              <span className="text-xs px-2 py-0.5 rounded bg-amber-700 text-amber-200">Vocal & Synthesis AI</span>
            </h1>
            <p className="text-xs text-amber-200">Système Prédictif & Vocal • CEB Sénégal</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={startVoiceRecognition}
              className={`px-4 py-2 font-bold rounded-lg text-xs shadow transition-all flex items-center gap-2 ${
                isListening ? 'bg-rose-600 text-white animate-pulse' : 'bg-amber-100 text-amber-950 hover:bg-white'
              }`}
            >
              <span>{isListening ? '🎙️ Écoute en cours...' : '🎤 Parler à l\'Assistant'}</span>
            </button>

            <button 
              onClick={() => setShowPermutationModal(true)}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold rounded-lg text-xs shadow transition-all"
            >
              ⚡ Permutation Intelligente
            </button>
          </div>
        </div>
      </header>

      {(voiceQuery || aiSpeechResponse) && (
        <div className="max-w-7xl w-full mx-auto px-6 pt-4">
          <div className="bg-amber-100/80 border border-amber-300 p-4 rounded-xl shadow-sm flex items-start gap-3">
            <span className="text-2xl">🔊</span>
            <div className="text-xs space-y-1">
              <p className="text-slate-600"><strong>Vous avez dit :</strong> "{voiceQuery}"</p>
              <p className="text-amber-900 font-semibold"><strong>Réponse Vocale :</strong> {aiSpeechResponse}</p>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6 flex-grow">
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border-2 border-slate-200">
            <p className="text-xs font-semibold text-slate-500 uppercase">Effectif Total</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{students.length} Élèves</h3>
            <span className="text-xs text-slate-400">Classe CE2-A</span>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border-2 border-rose-200">
            <p className="text-xs font-semibold text-rose-600 uppercase">Soutien Prioritaire</p>
            <h3 className="text-2xl font-bold text-rose-700 mt-1">{soutienCount} Élèves</h3>
            <span className="text-xs text-rose-500">Moyenne &lt; 10/20</span>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border-2 border-emerald-200">
            <p className="text-xs font-semibold text-emerald-600 uppercase">Maîtrise Acquise</p>
            <h3 className="text-2xl font-bold text-emerald-700 mt-1">{maitriseCount} Élèves</h3>
            <span className="text-xs text-emerald-500">Moyenne ≥ 10/20</span>
          </div>
        </section>

        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="font-bold text-lg text-slate-800 flex items-center justify-between">
            <span>Disposition des Tables-Bancs (Modélisation Synthétique)</span>
            <span className="text-xs text-amber-700 bg-amber-100 px-3 py-1 rounded-full font-medium">
              Cliquez pour écouter l'analyse prédictive
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {students.map((student) => (
              <div 
                key={student.id}
                onClick={() => {
                  setSelectedStudent(student);
                  speakText(`Analyse prédictive pour ${student.name}. Moyenne actuelle : ${student.averageGrade} sur 20. Prévision à trente jours : ${student.syntheticTrajectory.predictedGradeNextMonth} sur 20.`);
                }}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all hover:scale-[1.02] shadow-sm ${
                  student.status === 'SOUTIEN' ? 'border-rose-300 bg-rose-50/40 hover:border-rose-500' : 'border-emerald-300 bg-emerald-50/40 hover:border-emerald-500'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                      {student.name}
                      <span className="text-xs">🔊</span>
                    </h4>
                    <p className="text-xs text-slate-500">Table-Banc N°{student.deskNumber}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    student.status === 'SOUTIEN' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {student.averageGrade}/20
                  </span>
                </div>
                
                <div className="mt-3 pt-2 border-t border-slate-200/60 flex justify-between items-center text-xs">
                  <span className="text-slate-600">Style : <strong>{student.learningStyle}</strong></span>
                  <span className="text-amber-800 font-bold">
                    Prévision M+1 : {student.syntheticTrajectory.predictedGradeNextMonth}/20
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {selectedStudent && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                  <span>{selectedStudent.name}</span>
                  <button 
                    onClick={() => speakText(`${selectedStudent.name}. ${selectedStudent.syntheticTrajectory.recommendedRemediation}`)}
                    className="text-xs px-2 py-1 bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200"
                  >
                    🔊 Écouter
                  </button>
                </h3>
                <p className="text-xs text-slate-500">Analyse Évolutive Synthesis AI Engine</p>
              </div>
              <button onClick={() => setSelectedStudent(null)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex justify-between">
                <div>
                  <p className="text-slate-500">Moyenne Actuelle</p>
                  <p className="text-base font-bold text-slate-900">{selectedStudent.averageGrade}/20</p>
                </div>
                <div className="text-right">
                  <p className="text-slate-500">Trajectoire Prédictive (M+1)</p>
                  <p className="text-base font-bold text-amber-900">{selectedStudent.syntheticTrajectory.predictedGradeNextMonth}/20</p>
                </div>
              </div>

              <div>
                <p className="font-bold text-slate-800 mb-1">Diagnostic Cognitif :</p>
                <p className="bg-slate-50 p-2.5 rounded-lg border">{selectedStudent.syntheticTrajectory.cognitiveBias}</p>
              </div>

              <div>
                <p className="font-bold text-slate-800 mb-1">Remédiation Pédagogique Recommandée :</p>
                <p className="bg-slate-50 p-2.5 rounded-lg border">{selectedStudent.syntheticTrajectory.recommendedRemediation}</p>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t">
              <button onClick={() => setSelectedStudent(null)} className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg text-xs font-bold">
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {showPermutationModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-lg text-slate-900">⚡ Analyse Prédictive de Permutation Intelligente</h3>
              <button onClick={() => setShowPermutationModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>
            <div className="text-xs space-y-3 text-slate-700">
              <p><strong>Permutation Suggérée :</strong> Table-Banc 1 (Abdou L. ⇄ Moussa D.)</p>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-1">
                <p><strong>Impact Abdou Laye :</strong> +3.5 Pts Estimés (Proximité visuelle ameliorée).</p>
                <p><strong>Impact Moussa Diallo :</strong> +1.5 Pts Estimés (Autonomie renforcée).</p>
              </div>
            </div>
            <div className="flex justify-end pt-2 border-t">
              <button onClick={() => setShowPermutationModal(false)} className="px-4 py-2 bg-amber-600 text-white rounded-lg text-xs font-bold">
                Appliquer le Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
