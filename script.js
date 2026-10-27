function showStudentDetails(studentId) {
    stopSpeaking();
    const student = studentsDatabase.find(s => s.id === studentId);
    if (!student) return;

    let history = student.history || [10, 10, 10, 10, 10, student.score];
    let subs = student.subjects || { math: 10, french: 10, dictation: 10 };
    let logbookEntries = student.logbook || ["Aucune note récente dans le journal."];

    let assistantAppreciation = student.score >= 14 
        ? `« Élève très solide. Peut encadrer un pair en difficulté grâce à sa maîtrise globale. »`
        : student.score >= 10 
        ? `« Progrès réguliers observés. Un renforcement méthodologique consolidera ses acquis. »`
        : `« Nécessite un soutien prioritaire. Jumelage Vygotsky recommandé au premier rang. »`;

    const modalHtml = `
        <div id="student-modal" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div class="bg-slate-900 border border-amber-500/40 rounded-2xl max-w-2xl w-full p-6 text-white shadow-2xl relative max-h-[90vh] overflow-y-auto">
                <button onclick="closeStudentModal()" class="absolute top-4 right-4 text-slate-400 hover:text-white text-xl font-bold">&times;</button>
                
                <div class="flex items-center gap-4 mb-4">
                    <img src="${student.photo}" class="w-16 h-16 rounded-full object-cover border-2 border-amber-400 shadow-md" alt="${student.name}">
                    <div>
                        <h3 class="text-xl font-bold text-amber-400">${student.name}</h3>
                        <p class="text-xs text-slate-400">Table-Banc N°${student.desk} • CE2 (École El Hadji Malick Sy, Mbour)</p>
                        <p class="text-xs font-semibold text-emerald-400 mt-0.5">Statut CEB : ${student.mastery ? 'Maîtrise' : 'Soutien'}</p>
                    </div>
                </div>

                <!-- NOTES PAR MATIÈRE -->
                <div class="grid grid-cols-3 gap-3 mb-4 text-center">
                    <div class="bg-slate-800 p-3 rounded-xl border border-slate-700">
                        <div class="text-xs text-slate-400">Mathématiques</div>
                        <div class="text-lg font-bold text-amber-400">${subs.math}/20</div>
                    </div>
                    <div class="bg-slate-800 p-3 rounded-xl border border-slate-700">
                        <div class="text-xs text-slate-400">Français</div>
                        <div class="text-lg font-bold text-amber-400">${subs.french}/20</div>
                    </div>
                    <div class="bg-slate-800 p-3 rounded-xl border border-slate-700">
                        <div class="text-xs text-slate-400">Dictée</div>
                        <div class="text-lg font-bold text-amber-400">${subs.dictation}/20</div>
                    </div>
                </div>

                <!-- COURBE D'ÉVOLUTION CORRIGÉE -->
                <div class="bg-slate-800 p-4 rounded-xl mb-4 border border-slate-700">
                    <h4 class="font-bold text-amber-300 text-sm mb-3">📈 Courbe d'Évolution (Tests des 6 Vendredis)</h4>
                    <div class="flex justify-between items-end h-32 gap-3 pt-6 px-4 bg-slate-950 rounded-lg border border-slate-700">
                        ${history.map((val, idx) => {
                            let barHeight = (val / 20) * 100;
                            return `
                                <div class="flex flex-col items-center gap-1 flex-1 h-full justify-end">
                                    <span class="text-[10px] text-amber-400 font-bold">${val}</span>
                                    <div class="w-full bg-amber-500 rounded-t transition-all shadow" style="height: ${barHeight}%; min-height: 15px;"></div>
                                    <span class="text-[10px] text-slate-300 mt-1">S${idx+1}</span>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>

                <!-- DOUBLE APPRÉCIATION -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
                    <div class="bg-slate-800 p-4 rounded-xl border border-slate-700">
                        <h4 class="font-bold text-slate-300 mb-1">✍️ Appréciation du Maître</h4>
                        <p class="text-xs text-slate-400 italic">${student.info}</p>
                    </div>
                    <div class="bg-amber-500/10 p-4 rounded-xl border border-amber-500/30">
                        <h4 class="font-bold text-amber-300 mb-1">🤖 Appréciation de Malado (Mémoire IA)</h4>
                        <p class="text-xs text-amber-200 italic">${assistantAppreciation}</p>
                    </div>
                </div>

                <!-- JOURNAL DE BORD VOCAL -->
                <div class="bg-slate-800 p-3 rounded-xl mb-4 border border-slate-700 text-xs">
                    <h4 class="font-bold text-emerald-400 mb-1">📖 Journal de Bord Vocal (Mémoire Persistante)</h4>
                    <ul class="list-disc list-inside text-slate-300 space-y-1">
                        ${logbookEntries.map(entry => `<li>${entry}</li>`).join('')}
                    </ul>
                </div>

                <div class="flex gap-3 justify-end">
                    <button onclick="exportStudentBulletin(${student.id})" class="bg-emerald-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-emerald-500 text-sm flex items-center gap-2">
                        <i class="fa-solid fa-print"></i> Exporter le Bulletin Officiel
                    </button>
                    <button onclick="closeStudentModal()" class="bg-slate-800 text-slate-300 px-4 py-2 rounded-xl hover:bg-slate-700 text-sm">Fermer</button>
                </div>
            </div>
        </div>
    `;

    const existingModal = document.getElementById('student-modal');
    if (existingModal) existingModal.remove();

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    speakText(`Ouverture du dossier de ${student.name}.`);
}
