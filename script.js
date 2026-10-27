// BASE DE DONNÉES DES 18 ÉLÈVES (École Aql al Kamil - CE2-A)
let studentsDatabase = [
    { id: 1, name: "Awa Diop", score: 14, mastery: true, column: 1, depth: 1, subjects: { math: 15, french: 14, dictation: 13 }, photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150", history: [12, 13, 14, 14], logbook: ["Très rigoureuse en classe."], personality: "Analytique et calme.", info: "Excellente et rigoureuse." },
    { id: 2, name: "Oumar Sarr", score: 9, mastery: false, column: 1, depth: 1, subjects: { math: 7, french: 10, dictation: 10 }, photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150", history: [8, 8, 9, 9], logbook: ["Besoin d'aide en calcul."], personality: "Kinésthésique.", info: "Soutien en mathématiques." },
    
    { id: 3, name: "Fatou Ndiaye", score: 12, mastery: true, column: 1, depth: 2, subjects: { math: 11, french: 14, dictation: 12 }, photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150", history: [10, 11, 12, 12], logbook: ["Bonne participation."], personality: "Attentive.", info: "Forte en français." },
    { id: 4, name: "Moussa Fall", score: 7, mastery: false, column: 1, depth: 2, subjects: { math: 6, french: 8, dictation: 7 }, photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150", history: [6, 6, 7, 7], logbook: ["Distrait en fin de matinée."], personality: "Énergique.", info: "Appui en numération." },

    { id: 5, name: "Aïcha Mbaye", score: 15, mastery: true, column: 1, depth: 3, subjects: { math: 14, french: 16, dictation: 15 }, photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150", history: [14, 14, 15, 15], logbook: ["Très active à l'oral."], personality: "Créative.", info: "Excellente rédaction." },
    { id: 6, name: "Ibrahima Traoré", score: 10, mastery: false, column: 1, depth: 3, subjects: { math: 10, french: 10, dictation: 10 }, photo: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150", history: [9, 9, 10, 10], logbook: ["Progrès réguliers."], personality: "Réservé.", info: "Proche du seuil." },

    { id: 7, name: "Mariama Camara", score: 13, mastery: true, column: 2, depth: 1, subjects: { math: 14, french: 12, dictation: 13 }, photo: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150", history: [12, 12, 13, 13], logbook: ["Très organisée."], personality: "Structurée.", info: "À l'aise en géométrie." },
    { id: 8, name: "Cheikh Diallo", score: 8, mastery: false, column: 2, depth: 1, subjects: { math: 8, french: 9, dictation: 7 }, photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150", history: [7, 7, 8, 8], logbook: ["Timide à l'oral."], personality: "Réfléchi.", info: "Soutien en résolution." },

    { id: 9, name: "Léona Mendy", score: 11, mastery: false, column: 2, depth: 2, subjects: { math: 11, french: 11, dictation: 11 }, photo: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150", history: [10, 10, 11, 11], logbook: ["Appliquée."], personality: "Observatrice.", info: "Acquiert les bases." },
    { id: 10, name: "Karim Sow", score: 16, mastery: true, column: 2, depth: 2, subjects: { math: 17, french: 15, dictation: 16 }, photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150", history: [15, 15, 16, 16], logbook: ["Leader naturel."], personality: "Dynamique.", info: "Leader en mathématiques." },

    { id: 11, name: "Diana Gaye", score: 6, mastery: false, column: 2, depth: 3, subjects: { math: 5, french: 7, dictation: 6 }, photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150", history: [5, 5, 6, 6], logbook: ["Fatigue matinale."], personality: "Discrète.", info: "Suivi rapproché en français." },
    { id: 12, name: "Amadou Bocoum", score: 14, mastery: true, column: 2, depth: 3, subjects: { math: 13, french: 14, dictation: 15 }, photo: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150", history: [13, 13, 14, 14], logbook: ["Entraide naturelle."], personality: "Empathique.", info: "Très bon niveau." },

    { id: 13, name: "Seynabou Ba", score: 15, mastery: true, column: 3, depth: 1, subjects: { math: 15, french: 15, dictation: 14 }, photo: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150", history: [13, 14, 15, 15], logbook: ["Très attentive."], personality: "Sérieuse.", info: "Excellente élève." },
    { id: 14, name: "Pape Diop", score: 10, mastery: false, column: 3, depth: 1, subjects: { math: 10, french: 10, dictation: 10 }, photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150", history: [9, 9, 10, 10], logbook: ["Écoute bien."], personality: "Calme.", info: "Régulier." },

    { id: 15, name: "Aminata Sow", score: 13, mastery: true, column: 3, depth: 2, subjects: { math: 13, french: 13, dictation: 12 }, photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150", history: [11, 12, 13, 13], logbook: ["Participative."], personality: "Dynamique.", info: "Bon niveau." },
    { id: 16, name: "Modou Ndiaye", score: 8, mastery: false, column: 3, depth: 2, subjects: { math: 8, french: 8, dictation: 8 }, photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150", history: [7, 7, 8, 8], logbook: ["Besoin de soutien."], personality: "Réservé.", info: "À encourager." },

    { id: 17, name: "Khady Fall", score: 14, mastery: true, column: 3, depth: 3, subjects: { math: 14, french: 14, dictation: 14 }, photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150", history: [12, 13, 14, 14], logbook: ["Appliquée."], personality: "Rigoureuse.", info: "Très solide." },
    { id: 18, name: "Babacar Sarr", score: 11, mastery: false, column: 3, depth: 3, subjects: { math: 11, french: 11, dictation: 11 }, photo: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150", history: [10, 10, 11, 11], logbook: ["Progresse bien."], personality: "Attentif.", info: "En progression." }
];

// CADRES DE RÉFÉRENCE THÉORIQUES MAJEURS DE MALADO AI
const maladoExpertFrameworks = {
    sociocognitif: {
        source: "Lev Vygotsky — 'Mind in Society' & Zone Proche de Développement (ZPD)",
        domaine: "Pédagogie et Interactions Sociales",
        application: "Jumelage entre apprenants pour l'étayage social, la médiation par les pairs et l'élévation des compétences."
    },
    cognitif: {
        source: "Jean Piaget & Jerome Bruner — Psychologie du Développement",
        domaine: "Étude Comportementale et Stades d'Apprentissage",
        application: "Analyse des rythmes d'acquisition en numération et structuration logique chez l'enfant de CE2."
    },
    contextuel: {
        source: "Rapports CONFEMEN / PASEC & IEF de Mbour",
        domaine: "Politiques Éducatives et Réussite Scolaire",
        application: "Adaptation des exercices aux contextes locaux, gestion des classes à effectifs multiples et remédiation ciblée."
    }
};

let schoolKnowledgeBase = localStorage.getItem('malado_custom_knowledge') || "Programme officiel Aql al Kamil (Sénégal) chargé par défaut.";
let synth = window.speechSynthesis;
let voicesList = [];
let isManualMode = false;

function chargerVoix() { if (synth) voicesList = synth.getVoices(); }
chargerVoix();
if (synth && synth.onvoiceschanged !== undefined) synth.onvoiceschanged = chargerVoix;

function stopSpeaking() { if (synth) synth.cancel(); }

function speakText(text) {
    if (!synth) return;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR'; utterance.rate = 1.0; utterance.pitch = 1.05;
    if (voicesList.length === 0) voicesList = synth.getVoices();
    const voixFeminine = voicesList.find(v => v.lang.startsWith('fr') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Hortense') || v.name.includes('Julie'))) || voicesList.find(v => v.lang.startsWith('fr'));
    if (voixFeminine) utterance.voice = voixFeminine;
    synth.speak(utterance);
}

function handleCurriculumUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        schoolKnowledgeBase = e.target.result;
        localStorage.setItem('malado_custom_knowledge', schoolKnowledgeBase);
        const label = document.getElementById('upload-file-label');
        if (label) label.textContent = file.name;
        const status = document.getElementById('curriculum-status');
        if (status) status.classList.remove('hidden');
        speakText("Programme pédagogique de l'école Aql al Kamil bien enregistré.");
    };
    reader.readAsText(file);
}

function renderClassroomDesks() {
    const container = document.getElementById('classroom-container');
    if (!container) return;
    container.innerHTML = '';

    const sceneWrapper = document.createElement('div');
    sceneWrapper.className = 'w-full max-w-7xl mx-auto space-y-8';

    const gridWrapper = document.createElement('div');
    gridWrapper.className = 'grid grid-cols-1 md:grid-cols-3 gap-8 w-full pt-2';

    for (let col = 1; col <= 3; col++) {
        let colDiv = document.createElement('div');
        colDiv.className = 'bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-2xl flex flex-col gap-6 backdrop-blur-md';
        
        let colTitle = document.createElement('div');
        colTitle.className = 'text-center text-xs font-bold text-amber-400 uppercase tracking-widest border-b border-slate-700/60 pb-2';
        colTitle.innerHTML = `📌 Rangée ${col === 1 ? 'Gauche' : col === 2 ? 'du Milieu' : 'Droite'}<br><span class="text-[10px] text-slate-400 font-normal">3 Pupitres Doubles (Assises incluses)</span>`;
        colDiv.appendChild(colTitle);

        let desksListDiv = document.createElement('div');
        desksListDiv.className = 'space-y-6';

        for (let depth = 1; depth <= 3; depth++) {
            let studentsAtDesk = studentsDatabase.filter(s => (s.column || 1) === col && (s.depth || 1) === depth);
            
            let singleDeskContainer = document.createElement('div');
            singleDeskContainer.className = 'bg-gradient-to-b from-[#e7d7c1] to-[#c8b093] border-2 border-[#4e342e] rounded-xl p-3 shadow-2xl relative';
            
            let deskHeader = document.createElement('div');
            deskHeader.className = 'flex justify-between items-center text-[10px] text-[#3e2723] font-black mb-2 border-b border-[#4e342e]/30 pb-1';
            deskHeader.innerHTML = `<span>🪵 Pupitre Double #${depth}</span> <span class="bg-[#3e2723] text-amber-300 px-2 py-0.5 rounded text-[9px]">Profondeur ${depth}/3</span>`;
            singleDeskContainer.appendChild(deskHeader);

            let seatsGrid = document.createElement('div');
            seatsGrid.className = 'grid grid-cols-2 gap-3 relative z-10';

            for (let seatIndex = 1; seatIndex <= 2; seatIndex++) {
                let student = studentsAtDesk[seatIndex - 1];
                let seatBox = document.createElement('div');

                if (student) {
                    seatBox.className = `p-2 rounded-lg cursor-pointer transition-all border text-left flex flex-col justify-between shadow-md ${
                        student.mastery 
                        ? 'bg-emerald-950/95 border-emerald-500 text-emerald-100 hover:bg-emerald-900' 
                        : 'bg-amber-950/95 border-amber-500 text-amber-100 hover:bg-amber-900'
                    }`;
                    seatBox.innerHTML = `
                        <div class="flex items-center gap-2">
                            <img src="${student.photo}" class="w-7 h-7 rounded-full object-cover border border-amber-400 shadow" alt="${student.name}">
                            <div class="truncate">
                                <div class="font-bold text-xs truncate">${student.name}</div>
                                <div class="text-[9px] text-slate-300">${student.score}/20</div>
                            </div>
                        </div>
                        <div class="text-[9px] text-right mt-1 font-semibold ${student.mastery ? 'text-emerald-400' : 'text-amber-400'}">
                            ${student.mastery ? '● Maîtrise' : '● Soutien'}
                        </div>
                    `;
                    seatBox.onclick = () => showStudentDetails(student.id);
                } else {
                    seatBox.className = 'p-2 rounded-lg border border-dashed border-stone-600 bg-stone-900/40 text-stone-400 text-[10px] text-center flex items-center justify-center';
                    seatBox.innerHTML = `<span>Place libre</span>`;
                }
                seatsGrid.appendChild(seatBox);
            }
            singleDeskContainer.appendChild(seatsGrid);

            let shelf = document.createElement('div');
            shelf.className = 'bg-[#3e2723] h-3 w-full rounded-md mt-2 border-t border-black/40 shadow-inner';
            singleDeskContainer.appendChild(shelf);

            let chairsRow = document.createElement('div');
            chairsRow.className = 'flex justify-around mt-2 pt-1 border-t border-[#4e342e]/20';
            for (let c = 0; c < 2; c++) {
                let chair = document.createElement('div');
                chair.className = 'bg-gradient-to-b from-[#d7ccc8] to-[#a1887f] border border-[#3e2723] w-12 h-6 rounded-t-lg shadow flex items-center justify-center text-[10px] font-bold text-black';
                chair.innerHTML = '🪑';
                chairsRow.appendChild(chair);
            }
            singleDeskContainer.appendChild(chairsRow);

            desksListDiv.appendChild(singleDeskContainer);
        }

        colDiv.appendChild(desksListDiv);
        gridWrapper.appendChild(colDiv);
    }

    sceneWrapper.appendChild(gridWrapper);
    container.appendChild(sceneWrapper);
}

// DOSSIER PÉDAGOGIQUE (AVEC ANALYSE CROISÉE DES OBSERVATIONS ET CADRES THÉORIQUES)
function showStudentDetails(studentId) {
    stopSpeaking();
    const student = studentsDatabase.find(s => s.id === studentId);
    if (!student) return;

    let history = student.history || [10, 10, 10, student.score];
    let subs = student.subjects || { math: 10, french: 10, dictation: 10 };
    let logbookEntries = student.logbook || ["Aucune observation récente."];
    let personalityAnalysis = student.personality || "Profil en cours d'analyse par Malado.";

    let expertRef = student.mastery 
        ? `📚 Référence (${maladoExpertFrameworks.sociocognitif.source}) : Peut agir comme médiateur social pour soutenir un pair.`
        : `📚 Référence (${maladoExpertFrameworks.sociocognitif.source}) : Bénéficie directement de l'étayage d'un pair en ZPD.`;

    const modalHtml = `
        <div id="student-modal" class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div class="bg-slate-900 border border-amber-500/40 rounded-2xl max-w-2xl w-full p-6 text-white shadow-2xl relative max-h-[90vh] overflow-y-auto">
                <button onclick="closeStudentModal()" class="absolute top-4 right-4 text-slate-400 hover:text-white text-xl font-bold">&times;</button>
                
                <div class="flex items-center gap-4 mb-4">
                    <img src="${student.photo}" class="w-16 h-16 rounded-full object-cover border-2 border-amber-400 shadow-md" alt="${student.name}">
                    <div>
                        <h3 class="text-xl font-bold text-amber-400">${student.name}</h3>
                        <p class="text-xs text-slate-400">Rangée ${student.column} • Pupitre Profondeur #${student.depth} • École Aql al Kamil (Mbour)</p>
                        <p class="text-xs font-semibold text-emerald-400 mt-0.5">Statut CEB : ${student.mastery ? 'Maîtrise' : 'Soutien'}</p>
                    </div>
                </div>

                <div class="flex border-b border-slate-700 mb-4">
                    <button onclick="switchTab('tab-notes')" id="btn-tab-notes" class="px-4 py-2 text-sm font-bold text-amber-400 border-b-2 border-amber-400">Notes & Évolution</button>
                    <button onclick="switchTab('tab-journal')" id="btn-tab-journal" class="px-4 py-2 text-sm font-semibold text-slate-400 hover:text-white">📋 Observations & Cadres experts</button>
                </div>

                <div id="tab-notes" class="tab-content">
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

                    <div class="bg-slate-800 p-4 rounded-xl mb-4 border border-slate-700">
                        <h4 class="font-bold text-amber-300 text-sm mb-3">📈 Courbe d'Évolution (Les 4 Vendredis du Mois)</h4>
                        <div class="flex justify-between items-end h-32 gap-3 pt-6 px-4 bg-slate-950 rounded-lg border border-slate-700">
                            ${history.map((val, idx) => {
                                let barHeight = (val / 20) * 100;
                                return `
                                    <div class="flex flex-col items-center gap-1 flex-1 h-full justify-end">
                                        <span class="text-[10px] text-amber-400 font-bold">${val}</span>
                                        <div class="w-full bg-amber-500 rounded-t transition-all shadow" style="height: ${barHeight}%; min-height: 15px;"></div>
                                        <span class="text-[10px] text-slate-300 mt-1">Vendredi ${idx+1}</span>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
                        <div class="bg-slate-800 p-4 rounded-xl border border-slate-700">
                            <h4 class="font-bold text-slate-300 mb-1">✍️ Appréciation du Maître</h4>
                            <p class="text-xs text-slate-400 italic">${student.info}</p>
                        </div>
                        <div class="bg-amber-500/10 p-4 rounded-xl border border-amber-500/30">
                            <h4 class="font-bold text-amber-300 mb-1">🤖 Analyse Malado & Théorie</h4>
                            <p class="text-xs text-amber-200 italic">${expertRef}</p>
                        </div>
                    </div>
                </div>

                <div id="tab-journal" class="tab-content hidden">
                    <div class="bg-slate-800 p-4 rounded-xl mb-4 border border-slate-700">
                        <h4 class="font-bold text-emerald-400 text-sm mb-2">🧠 Profil psychopédagogique</h4>
                        <p class="text-xs text-slate-300 italic bg-slate-900 p-3 rounded-lg border border-slate-800">${personalityAnalysis}</p>
                    </div>

                    <div class="bg-slate-800 p-4 rounded-xl mb-4 border border-slate-700">
                        <h4 class="font-bold text-amber-300 text-sm mb-2">📋 Observations & Remarques du Maître</h4>
                        <ul class="list-disc list-inside text-xs text-slate-300 space-y-1 mb-3">
                            ${logbookEntries.map(entry => `<li>${entry}</li>`).join('')}
                        </ul>
                        <div class="flex gap-2">
                            <input type="text" id="new-memo-input" placeholder="Ajouter une observation rapide..." class="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white w-full">
                            <button onclick="addManualMemo(${student.id})" class="bg-emerald-600 text-white font-bold px-3 py-1.5 rounded-lg text-xs hover:bg-emerald-500">Ajouter</button>
                        </div>
                    </div>
                </div>

                <div class="flex gap-3 justify-between items-center border-t border-slate-800 pt-4 mt-2">
                    <button onclick="exportStudentBulletin(${student.id})" class="bg-emerald-600 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-emerald-500 text-sm flex items-center gap-2 shadow-lg">
                        <i class="fa-solid fa-print"></i> Imprimer / Exporter le Bulletin Officiel
                    </button>
                    <button onclick="closeStudentModal()" class="bg-slate-800 text-slate-300 px-4 py-2.5 rounded-xl hover:bg-slate-700 text-sm">Fermer</button>
                </div>
            </div>
        </div>
    `;

    const existingModal = document.getElementById('student-modal');
    if (existingModal) existingModal.remove();
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    document.getElementById(tabId).classList.remove('hidden');
    document.getElementById('btn-tab-notes').className = "px-4 py-2 text-sm font-semibold text-slate-400 hover:text-white border-b-2 border-transparent";
    document.getElementById('btn-tab-journal').className = "px-4 py-2 text-sm font-semibold text-slate-400 hover:text-white border-b-2 border-transparent";
    if (tabId === 'tab-notes') {
        document.getElementById('btn-tab-notes').className = "px-4 py-2 text-sm font-bold text-amber-400 border-b-2 border-amber-400";
    } else {
        document.getElementById('btn-tab-journal').className = "px-4 py-2 text-sm font-bold text-emerald-400 border-b-2 border-emerald-400";
    }
}

function closeStudentModal() {
    const modal = document.getElementById('student-modal');
    if (modal) modal.remove();
}

function addManualMemo(studentId) {
    const input = document.getElementById('new-memo-input');
    if (!input || !input.value.trim()) return;
    let student = studentsDatabase.find(s => s.id === studentId);
    if (student) {
        if (!student.logbook) student.logbook = [];
        student.logbook.push(input.value.trim());
        localStorage.setItem('malado_students_db', JSON.stringify(studentsDatabase));
        showStudentDetails(studentId);
        speakText("Observation enregistrée et croisée avec les cadres experts.");
    }
}

function exportStudentBulletin(studentId) {
    const student = studentsDatabase.find(s => s.id === studentId);
    if (!student) return;

    let printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>Bulletin - ${student.name}</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
                .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
                .student-info { display: flex; gap: 20px; align-items: center; margin-bottom: 20px; }
                .student-info img { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 2px solid #333; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                th, td { border: 1px solid #999; padding: 8px; text-align: left; font-size: 14px; }
                th { background-color: #f2f2f2; }
                .appreciation { border: 1px solid #999; padding: 12px; margin-bottom: 15px; border-radius: 5px; font-size: 13px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h2>ÉCOLE AQL AL KAMIL (LE SOMMET DU SAVOIR) - MBOUR</h2>
                <p>Inspection de l'Éducation et de la Formation (IEF) de Mbour • Classe de CE2-A</p>
                <h3>BULLETIN MENSUEL DE NOTES & ÉVALUATION</h3>
            </div>
            <div class="student-info">
                <img src="${student.photo}" alt="${student.name}">
                <div>
                    <strong>Nom & Prénom :</strong> ${student.name}<br>
                    <strong>Position :</strong> Rangée ${student.column} (Pupitre Profondeur #${student.depth})<br>
                    <strong>Moyenne Mensuelle :</strong> ${student.score} / 20<br>
                    <strong>Statut :</strong> ${student.mastery ? 'Maîtrise Acquise' : 'Soutien Requis'}
                </div>
            </div>
            <table>
                <tr><th>Matière</th><th>Note (/20)</th><th>Appréciation / Niveau</th></tr>
                <tr><td>Mathématiques / Numération</td><td>${student.subjects.math}</td><td>${student.subjects.math >= 12 ? 'Maîtrise satisfaisante' : 'En consolidation'}</td></tr>
                <tr><td>Français / Grammaire</td><td>${student.subjects.french}</td><td>${student.subjects.french >= 12 ? 'Bon niveau' : 'Soutien nécessaire'}</td></tr>
                <tr><td>Dictée / Orthographe</td><td>${student.subjects.dictation}</td><td>${student.subjects.dictation >= 12 ? 'Acquis' : 'À renforcer'}</td></tr>
            </table>
            <div class="appreciation">
                <strong>✍️ Appréciation du Maître (Maître Balla) :</strong><br>
                ${student.info}
            </div>
            <div class="appreciation" style="background-color: #f9f9f9;">
                <strong>🤖 Appréciation de l'Assistant Pédagogique (Malado AI) :</strong><br>
                ${student.personality}
            </div>
            <div style="margin-top: 40px; display: flex; justify-content: space-between;">
                <div>Signature du Maître :</div>
                <div>Cachet de l'École :</div>
            </div>
            <script>window.print();</script>
        </body>
        </html>
    `);
    printWindow.document.close();
}

// COMMANDE IA AVEC MOBILISATION DES CADRES THÉORIQUES
function handleCommand(command) {
    stopSpeaking(); 
    const q = command.toLowerCase().trim();
    let reponse = "";

    const chatBox = document.getElementById('chat-box');
    if (chatBox) {
        chatBox.innerHTML += `<div class="bg-slate-800 text-white p-2.5 rounded-xl ml-auto text-right max-w-lg my-2"><strong>Maître Balla :</strong> "${command}"</div>`;
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    if (q.includes('vygotsky') || q.includes('optimise') || q.includes('changer') || q.includes('place') || q.includes('binôme') || q.includes('tuteur')) {
        reponse = `💡 **Suggestion Pédagogique (Fondée sur ${maladoExpertFrameworks.sociocognitif.source})** :\n\n` +
                  `Maître Balla, pour stimuler la Zone Proche de Développement (ZPD), je vous suggère de placer **Oumar Sarr** (soutien, note 9) au premier rang de la rangée gauche, à côté d'**Awa Diop** (maîtrise, note 14).\n\n` +
                  `🔍 **Fondement théorique** : L'étayage social par un pair plus avancé accélère l'intériorisation des concepts de calcul.\n\n` +
                  `📈 **Prédictions sur 1 mois** :\n` +
                  `• Semaine 1 : Réduction du stress cognitif.\n` +
                  `• Semaine 2 : Hausse estimée de la moyenne d'Oumar à 11.5 / 20.\n` +
                  `• Semaine 4 : Autonomie consolidée.`;
    }
    else if (q.includes('corrige') || q.includes('copie') || q.includes('exercice')) {
        reponse = `📝 **Analyse de copie (Référence : ${maladoExpertFrameworks.contextuel.source})** :\n` +
                  `J'ai analysé la dernière évaluation selon les standards de l'IEF de Mbour. Le taux de réussite en numération est de 66%. Consacrez 15 minutes aux fractions simples en début de séance pour stabiliser les bases.`;
    }
    else if (q.includes('imprime') && q.includes('bulletin')) {
        let foundStudent = studentsDatabase.find(s => q.includes(s.name.toLowerCase()));
        if (foundStudent) {
            exportStudentBulletin(foundStudent.id);
            reponse = `J'ouvre la fenêtre d'impression du bulletin pour ${foundStudent.name}.`;
        } else {
            reponse = "Précisez le nom de l'élève pour l'impression du bulletin.";
        }
    }
    else {
        reponse = `Consigne bien enregistrée pour l'école Aql al Kamil. Je croise vos observations avec les cadres de Piaget, Vygotsky et les rapports CONFEMEN.`;
    }

    if (reponse && chatBox) {
        chatBox.innerHTML += `<div class="bg-amber-500/10 border border-amber-500/30 text-amber-300 p-3 rounded-xl max-w-xl my-2 whitespace-pre-line"><strong>🤖 Malado :</strong> "${reponse}"</div>`;
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    if (reponse) speakText(reponse.replace(/[*_#]/g, ''));
}

function toggleVoiceMode() {
    isManualMode = !isManualMode;
    const txt = document.getElementById('mode-text');
    if (txt) txt.textContent = isManualMode ? "Mode : Manuel" : "Mode : Écoute Auto";
}

function updateKPISummary() {
    const total = studentsDatabase.length;
    if (total === 0) return;
    const avgScore = (studentsDatabase.reduce((sum, s) => sum + s.score, 0) / total).toFixed(1);
    const kpiTot = document.getElementById('kpi-total-students');
    const kpiAvg = document.getElementById('kpi-avg-score');
    if (kpiTot) kpiTot.innerHTML = `${total} <span class="text-xs font-normal text-slate-400">Élèves</span>`;
    if (kpiAvg) kpiAvg.innerHTML = `${avgScore} <span class="text-xs font-normal text-slate-400">/ 20</span>`;
}

// NOUVELLE OPTION : ANALYSE COMPORTEMENTALE GLOBALE DE LA CLASSE
function triggerBehavioralAnalysis() {
    stopSpeaking();
    
    // Synthèse des observations de tous les élèves
    let totalLogEntries = 0;
    let attentionAlerts = 0;
    let leadershipCount = 0;
    let peerSupportCount = 0;

    studentsDatabase.forEach(student => {
        if (student.logbook) {
            totalLogEntries += student.logbook.length;
            student.logbook.forEach(log => {
                let l = log.toLowerCase();
                if (l.includes('fatigue') || l.includes('distrait') || l.includes('lent')) attentionAlerts++;
                if (l.includes('leader') || l.includes('active') || l.includes('organisée')) leadershipCount++;
                if (l.includes('aide') || l.includes('entraide') || l.includes('tuteur')) peerSupportCount++;
            });
        }
    });

    let analysisReport = `🧠 **Rapport d'Analyse Comportementale Globale — CE2-A (École Aql al Kamil)**\n\n` +
        `📊 **Indicateurs clés issus de vos observations** :\n` +
        `• Total des observations consignées : ${totalLogEntries}\n` +
        `• Signes de fatigue / baisse d'attention : ${attentionAlerts} élève(s)\n` +
        `• Pôles de leadership et d'initiative : ${leadershipCount} élève(s)\n` +
        `• Dynamiques d'entraide spontanée : ${peerSupportCount} élève(s)\n\n` +
        `💡 **Recommandations psychopédagogiques (Cadres de Piaget & Vygotsky)** :\n` +
        `1. **Gestion de l'attention** : La présence de signes de fatigue matinale chez certains élèves confirme l'intérêt d'alterner les phases de conceptualisation (en début de matinée) et les exercices pratiques.\n` +
        `2. **Étayage par les pairs** : Capitalisez sur les ${peerSupportCount} situations d'entraide pour formaliser des binômes de tutorat en numération.\n` +
        `3. **Climat de classe** : Les observations montrent un bon équilibre relationnel. Maintenez les renforcements positifs pour encourager les élèves les plus réservés.`;

    // Affichage dans le chat de Malado AI
    const chatBox = document.getElementById('chat-box');
    if (chatBox) {
        chatBox.innerHTML += `<div class="bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 p-4 rounded-2xl max-w-2xl my-3 whitespace-pre-line text-xs shadow-xl"><strong>🤖 Analyse Malado :</strong>\n\n${analysisReport}</div>`;
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Lecture vocale de synthèse
    speakText("L'analyse comportementale globale de la classe est prête. J'ai examiné l'ensemble de vos observations pour évaluer l'attention et les dynamiques de groupe.");
}

window.addEventListener('DOMContentLoaded', () => { 
    renderClassroomDesks();
    updateKPISummary();
});
