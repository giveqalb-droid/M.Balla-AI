'use client';

import React, { useState } from 'react';
import { SynthesisAIPedagogicalEngine, StudentProfile } from '../lib/synthesis-engine';

export default function HomePage() {
  // Initialisation de 12 élèves avec le moteur synthétique Synthesis AI
  const initialStudents: StudentProfile[] = [
    SynthesisAIPedagogicalEngine.generateSyntheticStudent('1', 'Abdou Laye', 1),
    SynthesisAIPedagogicalEngine.generateSyntheticStudent('2', 'Aïssatou Sow', 1),
    SynthesisAIPedagogicalEngine.generateSyntheticStudent('3', 'Moussa Diallo', 2),
    SynthesisAIPedagogicalEngine.generateSyntheticStudent('4', 'Fatou Ndiaye', 2),
    SynthesisAIPedagogicalEngine.generateSyntheticStudent('5', 'Cheikh Tidiane', 3),
    SynthesisAIPedagogicalEngine.generateSyntheticStudent('6', 'Khadija Ba', 3),
    SynthesisAIPedagogicalEngine.generateSyntheticStudent('7', 'Ousmane Fall', 4),
    SynthesisAIPedagogicalEngine.generateSyntheticStudent('8', 'Mariama Kane', 4),
    SynthesisAIPedagogicalEngine.generateSyntheticStudent('9', 'Ibrahima Sarr', 5),
    SynthesisAIPedagogicalEngine.generateSyntheticStudent('10', 'Aminata Diop', 5),
    SynthesisAIPedagogicalEngine.generateSyntheticStudent('11', 'Babacar Sy', 6),
    SynthesisAIPedagogicalEngine.generateSyntheticStudent('12', 'Coumba Cissé', 6),
  ];

  const [students, setStudents] = useState<StudentProfile[]>(initialStudents);
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);
  const [showPermutationModal, setShowPermutationModal] = useState(false);

  const soutienCount = students.filter(s => s.status === 'SOUTIEN').length;
  const maitriseCount = students.filter(s => s.status === 'MAITRISE').length;

  return (
    <div class="min-h-screen flex flex-col">
      {/* Header Pro Next.js */}
      <header class="bg-amber-900 text-amber-50 shadow-md border-b-4 border-amber-950 p-4 sticky top-0 z-30">
        <div class="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 class="text-xl font-bold tracking-wide flex items-center gap-2">
              <span>Assistant Pédagogique M. Balla</span>
              <span class="text-xs px-2 py-0.5 rounded bg-amber-700 text-amber-200">Next.js + Synthesis AI</span>
            </h1>
            <p class="text-xs text-amber-200">Système Prédictif d'Évolution Cognitive • CEB Sénégal</p>
          </div>
          <button 
            onClick={() => setShowPermutationModal(true)}
            class="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold rounded-lg text-xs shadow transition-all"
          >
            ⚡ Permutation Intelligente
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main class="max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6 flex-grow">
        
        {/* KPI Dynamic */}
        <section class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="bg-white p-4 rounded-xl shadow-sm border-2 border-slate-200">
            <p class="text-xs font-semibold text-slate-500 uppercase">Effectif Total</p>
            <h3 class="text-2xl font-bold text-slate-800 mt-1">{students.length} Élèves</h3>
            <span class="text-xs text-slate-400">Classe CE2-A</span>
          </div>
          <div class="bg-white p-4 rounded-xl shadow-sm border-2 border-rose-200">
            <p class="text-xs font-semibold text-rose-600 uppercase">Soutien Prioritaire</p>
            <h3 class="text-2xl font-bold text-rose-700 mt-1">{soutienCount} Élèves</h3>
            <span class="text-xs text-rose-500">Moyenne &lt; 10/20</span>
          </div>
          <div class="bg-white p-4 rounded-xl shadow-sm border-2 border-emerald-200">
            <p class="text-xs font-semibold text-emerald-600 uppercase">Maîtrise Acquise</p>
            <h3 class="text-2xl font-bold text-emerald-700 mt-1">{maitriseCount} Élèves</h3>
            <span class="text-xs text-emerald-500">Moyenne ≥ 10/20</span>
          </div>
        </section>

        {/* Grille des Tables-Bancs (Élèves alimentés par le moteur synthétique) */}
        <section class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 class="font-bold text-lg text-slate-800 flex items-center justify-between">
            <span>Disposition des Tables-Bancs (Modélisation Synthétique)</span>
            <span class="text-xs text-amber-700 bg-amber-100 px-3 py-1 rounded-full font-medium">
              Cliquez sur un élève pour voir son analyse prédictive à 30 jours
            </span>
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            {students.map((student) => (
              <div 
                key={student.id}
                onClick={() => setSelectedStudent(student)}
                class={`p-4 rounded-xl border-2 cursor-pointer transition-all hover:scale-[1.02] shadow-sm ${
                  student.status === 'SOUTIEN' 
                    ? 'border-rose-300 bg-rose-50/40 hover:border-rose-500' 
                    : 'border-emerald-300 bg-emerald-50/40 hover:border-emerald-500'
                }`}
              >
                <div class="flex justify-between items-start">
                  <div>
                    <h4 class="font-bold text-slate-900 text-sm">{student.name}</h4>
                    <p class="text-xs text-slate-500">Table-Banc N°{student.deskNumber}</p>
                  </div>
                  <span class={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    student.status === 'SOUTIEN' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {student.averageGrade}/20
                  </span>
                </div>
                
                <div class="mt-3 pt-2 border-t border-slate-200/60 flex justify-between items-center text-xs">
                  <span class="text-slate-600">Style : <strong>{student.learningStyle}</strong></span>
                  <span class="text-amber-800 font-bold">
                    Prévision M+1 : {student.syntheticTrajectory.predictedGradeNextMonth}/20
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Modal Dossier Élève Synthétique */}
      {selectedStudent && (
        <div class="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div class="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 space-y-4">
            <div class="flex justify-between items-center border-b pb-3">
              <div>
                <h3 class="font-bold text-lg text-slate-900">{selectedStudent.name}</h3>
                <p class="text-xs text-slate-500">Analyse Évolutive Synthesis AI Engine</p>
              </div>
              <button onClick={() => setSelectedStudent(null)} class="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <div class="space-y-3 text-xs text-slate-700">
              <div class="p-3 bg-amber-50 rounded-xl border border-amber-200 flex justify-between">
                <div>
                  <p class="text-slate-500">Moyenne Actuelle</p>
                  <p class="text-base font-bold text-slate-900">{selectedStudent.averageGrade}/20</p>
                </div>
                <div class="text-right">
                  <p class="text-slate-500">Trajectoire Prédictive (M+1)</p>
                  <p class="text-base font-bold text-amber-900">{selectedStudent.syntheticTrajectory.predictedGradeNextMonth}/20</p>
                </div>
              </div>

              <div>
                <p class="font-bold text-slate-800 mb-1">Diagnostic Cognitif & Bias d'Apprentissage :</p>
                <p class="bg-slate-50 p-2.5 rounded-lg border">{selectedStudent.syntheticTrajectory.cognitiveBias}</p>
              </div>

              <div>
                <p class="font-bold text-slate-800 mb-1">Remédiation Pédagogique Recommandée (M. Balla) :</p>
                <p class="bg-slate-50 p-2.5 rounded-lg border">{selectedStudent.syntheticTrajectory.recommendedRemediation}</p>
              </div>
            </div>

            <div class="flex justify-end pt-2 border-t">
              <button onClick={() => setSelectedStudent(null)} class="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg text-xs font-bold">
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
