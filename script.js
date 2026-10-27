// Variable globale pour la base des élèves (18 élèves : 3 rangées verticales, 3 pupitres doubles en profondeur)
let studentsDatabase = [];
let schoolKnowledgeBase = localStorage.getItem('malado_custom_knowledge') || "Aucun programme spécifique importé.";

let synth = window.speechSynthesis;
let voicesList = [];
let maladoModeAwake = false; 
let recognition = null;
let isManualMode = false;

// MÉMOIRE ÉVOLUTIVE (Persistante)
let maladoMemory = JSON.parse(localStorage.getItem('malado_dynamic_memory')) || {
    directives: [],          
    tone: "direct",
    learnedConcepts: {}      
};

let awaitingInternetPermissionFor = null;

function chargerVoix() {
    if (!synth) return;
    voicesList = synth.getVoices();
}
chargerVoix();
if (synth && synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = chargerVoix;
}

function stopSpeaking() {
    if (synth) synth.cancel();
}

function speakText(text) {
    if (!synth) return;
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = 1.0;
    utterance.pitch = 1.05;

    if (voicesList.length === 0) voicesList = synth.getVoices();

    const voixFeminine = voicesList.find(v => v.lang.startsWith('fr') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Hortense') || v.name.includes('Julie'))) 
                      || voicesList.find(v => v.lang.startsWith('fr'));

    if (voixFeminine) utterance.voice = voixFeminine;
    synth.speak(utterance);
}

// CHARGEMENT DE LA BASE DE DONNÉES (18 Élèves : 3 rangées, 3 pupitres doubles chacune)
async function loadClassroomData() {
    try {
        const localSaved = localStorage.getItem('malado_students_db');
        if (localSaved) {
            studentsDatabase = JSON.parse(localSaved);
        } else {
            const response = await fetch('database.json');
            if (!response.ok) throw new Error("Fichier database.json introuvable.");
            const data = await response.json();
            studentsDatabase = data.students;
            localStorage.setItem('malado_students_db', JSON.stringify(studentsDatabase));
        }
    } catch (error) {
        console.warn("Chargement local de secours activé :", error);
        studentsDatabase = [
            // RANGÉE 1 (GAUCHE) - 3 Pupitres doubles (Profondeur 1, 2, 3)
            { id: 1, name: "Awa Diop", score: 14, mastery: true, column: 1, depth: 1, subjects: { math: 15, french: 14, dictation: 13 }, photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150", history: [12, 13, 14, 14], logbook: ["Très rigoureuse en classe."], personality: "Analytique et calme.", info: "Excellente et rigoureuse." },
            { id: 2, name: "Oumar Sarr", score: 9, mastery: false, column: 1, depth: 1, subjects: { math: 7, french: 10, dictation: 10 }, photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150", history: [8, 8, 9, 9], logbook: ["Besoin d'aide en calcul."], personality: "Kinésthésique.", info: "Soutien en mathématiques." },
            
            { id: 3, name: "Fatou Ndiaye", score: 12, mastery: true, column: 1, depth: 2, subjects: { math: 11, french: 14, dictation: 12 }, photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150", history: [10, 11, 12, 12], logbook: ["Bonne participation."], personality: "Attentive.", info: "Forte en français." },
            { id: 4, name: "Moussa Fall", score: 7, mastery: false, column: 1, depth: 2, subjects: { math: 6, french: 8, dictation: 7 }, photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150", history: [6, 6, 7, 7], logbook: ["Distrait en fin de matinée."], personality: "Énergique.", info: "Appui en numération." },

            { id: 5, name: "Aïcha Mbaye", score: 15, mastery: true, column: 1, depth: 3, subjects: { math: 14, french: 16, dictation: 15 }, photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150", history: [14, 14, 15, 15], logbook: ["Très active à l'oral."], personality: "Créative.", info: "Excellente rédaction." },
            { id: 6, name: "Ibrahima Traoré", score: 10, mastery: false, column: 1, depth: 3, subjects: { math: 10, french: 10, dictation: 10 }, photo: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150", history: [9, 9, 10, 10], logbook: ["Progrès réguliers."], personality: "Réservé.", info: "Proche du seuil." },

            // RANGÉE 2 (MILIEU) - 3 Pupitres doubles (Profondeur 1, 2, 3)
            { id: 7, name: "Mariama Camara", score: 13, mastery: true, column: 2, depth: 1, subjects: { math: 14, french: 12, dictation: 13 }, photo: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150", history: [12, 12, 13, 13], logbook: ["Très organisée."], personality: "Structurée.", info: "À l'aise en géométrie." },
            { id: 8, name: "Cheikh Diallo", score: 8, mastery: false, column: 2, depth: 1, subjects: { math: 8, french: 9, dictation: 7 }, photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150", history: [7, 7, 8, 8], logbook: ["Timide à l'oral."], personality: "Réfléchi.", info: "Soutien en résolution." },

            { id: 9, name: "Léona Mendy", score: 11, mastery: false, column: 2, depth: 2, subjects: { math: 11, french: 11, dictation: 11 }, photo: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150", history: [10, 10, 11, 11], logbook: ["Appliquée."], personality: "Observatrice.", info: "Acquiert les bases." },
            { id: 10, name: "Karim Sow", score: 16, mastery: true, column: 2, depth: 2, subjects: { math: 17, french: 15, dictation: 16 }, photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150", history: [15, 15, 16, 16], logbook: ["Leader naturel."], personality: "Dynamique.", info: "Leader en mathématiques." },

            { id: 11, name: "Diana Gaye", score: 6, mastery: false, column: 2, depth: 3, subjects: { math: 5, french: 7, dictation: 6 }, photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150", history: [5, 5, 6, 6], logbook: ["Fatigue matinale."], personality: "Discrète.", info: "Suivi rapproché en français." },
            { id: 12, name: "Amadou Bocoum", score: 14, mastery: true, column: 2, depth: 3, subjects: { math: 13, french: 14, dictation: 15 }, photo: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150", history: [13, 13, 14, 14], logbook: ["Entraide naturelle."], personality: "Empathique.", info: "Très bon niveau." },

            // RANGÉE 3 (DROITE) - 3 Pupitres doubles (Profondeur 1, 2, 3)
            { id: 13, name: "Seynabou Ba", score: 15, mastery: true, column: 3, depth: 1, subjects: { math: 15, french: 15, dictation: 14 }, photo: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150", history: [13, 14, 15, 15], logbook: ["Très attentive."], personality: "Sérieuse.", info: "Excellente élève." },
            { id: 14, name: "Pape Diop", score: 10, mastery: false, column: 3, depth: 1, subjects: { math: 10, french: 10, dictation: 10 }, photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150", history: [9, 9, 10, 10], logbook: ["Écoute bien."], personality: "Calme.", info: "Régulier." },

            { id: 15, name: "Aminata Sow", score: 13, mastery: true, column: 3, depth: 2, subjects: { math: 13, french: 13, dictation: 12 }, photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150", history: [11, 12, 13, 13], logbook: ["Participative."], personality: "Dynamique.", info: "Bon niveau." },
            { id: 16, name: "Modou Ndiaye", score: 8, mastery: false, column: 3, depth: 2, subjects: { math: 8, french: 8, dictation: 8 }, photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150", history: [7, 7, 8, 8], logbook: ["Besoin de soutien."], personality: "Réservé.", info: "À encourager." },

            { id: 17, name: "Khady Fall", score: 14, mastery: true, column: 3, depth: 3, subjects: { math: 14, french: 14, dictation: 14 }, photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150", history: [12, 13, 14, 14], logbook: ["Appliquée."], personality: "Rigoureuse.", info: "Très solide." },
            { id: 18, name: "Babacar Sarr", score: 11, mastery: false, column: 3, depth: 3, subjects: { math: 11, french: 11, dictation: 11 }, photo: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150", history: [10, 10, 11, 11], logbook: ["Progresse bien."], personality: "Attentif.", info: "En progression." }
        ];
    }
    renderClassroomDesks();
    updateKPISummary();
    injectLocalBadge();
}

// BADGE DE STATUT LOCAL
function injectLocalBadge() {
    const headerContainer = document.querySelector('header') || document.body;
    if (!document.getElementById('local-status-badge')) {
        const badge = document.createElement('div');
        badge.id = 'local-status-badge';
        badge.className = 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs px-3 py-1.5 rounded-full flex items-center gap-2 w-fit mx-auto my-2 shadow-lg';
        badge.innerHTML = `<span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span> 🟢 Mode Local Actif • Stockage SSD 1 To / Clé USB (0% Cloud — Sécurisé CEB Mbour)`;
        document.body.prepend(badge);
    }
}

// RENDU VISUEL PLEINE LARGEUR : 3 RANGÉES VERTICALES DE 3 PUPITRES DOUBLES EN PROFONDEUR (18 PLACES)
function renderClassroomDesks() {
    const container = document.getElementById('classroom-container');
    if (!container) return;
    container.innerHTML = '';

    // Tableau noir en haut (face aux élèves)
    let blackboard = document.getElementById('classroom-blackboard');
    if (!blackboard) {
        blackboard = document.createElement('div');
        blackboard.id = 'classroom-blackboard';
        blackboard.className = 'bg-slate-900 border-2 border-emerald-500/40 p-3 rounded-xl mb-6 text-center text-emerald-400 font-bold text-sm shadow-inner w-full max-w-7xl mx-auto';
        blackboard.innerHTML = `🏫 [ TABLEAU NOIR — ZONE PÉDAGOGIQUE DU MAÎTRE (CE2-A) • 18 ÉLÈVES ]`;
        container.parentNode.insertBefore(blackboard, container);
    }

    // Conteneur global en grille à 3 colonnes égales prenant toute la largeur
    const gridWrapper = document.createElement('div');
    gridWrapper.className = 'grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-7xl mx-auto px-4';

    // Génération des 3 rangées verticales (Colonnes 1, 2, 3)
    for (let col = 1; col <= 3; col++) {
        let colDiv = document.createElement('div');
        colDiv.className = 'bg-slate-900/80 border border-slate-700/80 rounded-2xl p-4 shadow-xl flex flex-col gap-4 w-full';
        
        let colTitle = document.createElement('div');
        colTitle.className = 'text-center text-xs font-bold text-amber-400 uppercase tracking-wider border-b border-slate-700 pb-2';
        colTitle.innerHTML = `📌 Rangée Verticale ${col === 1 ? 'Gauche' : col === 2 ? 'du Milieu' : 'Droite'}<br><span class="text-[10px] text-slate-400">3 Pupitres Doubles (6 Places)</span>`;
        colDiv.appendChild(colTitle);

        let desksListDiv = document.createElement('div');
        desksListDiv.className = 'space-y-3';

        // Génération des 3 pupitres en profondeur pour cette rangée
        for (let depth = 1; depth <= 3; depth++) {
            let studentsAtDesk = studentsDatabase.filter(s => (s.column || 1) === col && (s.depth || 1) === depth);
            
            let deskCard = document.createElement('div');
            deskCard.className = 'bg-slate-800/90 border border-slate-700 rounded-xl p-3 shadow';
            
            let deskHeader = document.createElement('div');
            deskHeader.className = 'flex justify-between items-center text-[10px] text-slate-400 mb-2 border-b border-slate-700/50 pb-1';
            deskHeader.innerHTML = `<span>🪑 Pupitre Double #${depth}</span> <span class="text-amber-300">Profondeur ${depth}/3</span>`;
            deskCard.appendChild(deskHeader);

            let seatsGrid = document.createElement('div');
            seatsGrid.className = 'grid grid-cols-2 gap-2';

            // 2 places par pupitre double
            for (let seatIndex = 1; seatIndex <= 2; seatIndex++) {
                let student = studentsAtDesk[seatIndex - 1];
                let seatBox = document.createElement('div');

                if (student) {
                    seatBox.className = `p-2 rounded-lg cursor-pointer transition-all border text-left flex flex-col justify-between ${student.mastery ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200 hover:bg-emerald-900/40' : 'bg-amber-950/40 border-amber-500/40 text-amber-200 hover:bg-amber-900/40'}`;
                    seatBox.innerHTML = `
                        <div class="font-bold text-xs truncate">${student.name}</div>
                        <div class="text-[10px] text-slate-300 flex justify-between mt-1">
                            <span>${student.score}/20</span>
                            <span class="${student.mastery ? 'text-emerald-400 font-semibold' : 'text-amber-400'}">${student.mastery ? 'Maîtrise' : 'Soutien'}</span>
                        </div>
                    `;
                    seatBox.onclick = () => showStudentDetails(student.id);
                } else {
                    seatBox.className = 'p-2 rounded-lg border border-dashed border-slate-700/60 bg-slate-900/40 text-slate-500 text-[10px] text-center flex items-center justify-center';
                    seatBox.innerHTML = `<span>Place libre</span>`;
                }
                seatsGrid.appendChild(seatBox);
            }

            deskCard.appendChild(seatsGrid);
            desksListDiv.appendChild(deskCard);
        }

        colDiv.appendChild(desksListDiv);
        gridWrapper.appendChild(colDiv);
    }

    container.appendChild(gridWrapper);
}

// DOSSIER PÉDAGOGIQUE AVEC ONGLETS
function showStudentDetails(studentId) {
    stopSpeaking();
    const student = studentsDatabase.find(s => s.id === studentId);
    if (!student) return;

    let history = student.history || [10, 10, 10, student.score];
    let subs = student.subjects || { math: 10, french: 10, dictation: 10 };
    let logbookEntries = student.logbook || ["Aucune observation récente."];
    let personalityAnalysis = student.personality || "Profil en cours d'analyse par Malado.";

    let assistantAppreciation = student.score >= 14 
        ? `« Élève très solide. Peut encadrer un pair en difficulté grâce à sa maîtrise globale. »`
        : student.score >= 10 
        ? `« Progrès réguliers observés sur le mois. Un renforcement méthodologique consolidera ses acquis. »`
        : `« Nécessite un soutien prioritaire. Jumelage Vygotsky recommandé au premier rang. »`;

    const modalHtml = `
        <div id="student-modal" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div class="bg-slate-900 border border-amber-500/40 rounded-2xl max-w-2xl w-full p-6 text-white shadow-2xl relative max-h-[90vh] overflow-y-auto">
                <button onclick="closeStudentModal()" class="absolute top-4 right-4 text-slate-400 hover:text-white text-xl font-bold">&times;</button>
                
                <div class="flex items-center gap-4 mb-4">
                    <img src="${student.photo}" class="w-16 h-16 rounded-full object-cover border-2 border-amber-400 shadow-md" alt="${student.name}">
                    <div>
                        <h3 class="text-xl font-bold text-amber-400">${student.name}</h3>
                        <p class="text-xs text-slate-400">Rangée ${student.column} • Pupitre Profondeur #${student.depth} • CE2 (École El Hadji Malick Sy, Mbour)</p>
                        <p class="text-xs font-semibold text-emerald-400 mt-0.5">Statut CEB : ${student.mastery ? 'Maîtrise' : 'Soutien'}</p>
                    </div>
                </div>

                <div class="flex border-b border-slate-700 mb-4">
                    <button onclick="switchTab('tab-notes')" id="btn-tab-notes" class="px-4 py-2 text-sm font-bold text-amber-400 border-b-2 border-amber-400">Notes & Évolution</button>
                    <button onclick="switchTab('tab-journal')" id="btn-tab-journal" class="px-4 py-2 text-sm font-semibold text-slate-400 hover:text-white">📖 Journal Intime & Personnalité</button>
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
                            <h4 class="font-bold text-amber-300 mb-1">🤖 Appréciation de Malado</h4>
                            <p class="text-xs text-amber-200 italic">${assistantAppreciation}</p>
                        </div>
                    </div>
                </div>

                <div id="tab-journal" class="tab-content hidden">
                    <div class="bg-slate-800 p-4 rounded-xl mb-4 border border-slate-700">
                        <h4 class="font-bold text-emerald-400 text-sm mb-2">🧠 Analyse Continue de la Personnalité (IA Malado)</h4>
                        <p class="text-xs text-slate-300 italic bg-slate-900 p-3 rounded-lg border border-slate-800">${personalityAnalysis}</p>
                    </div>

                    <div class="bg-slate-800 p-4 rounded-xl mb-4 border border-slate-700">
                        <h4 class="font-bold text-amber-300 text-sm mb-2">📖 Journal Intime / Observations du Maître</h4>
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
        speakText("Observation enregistrée dans le journal intime.");
    }
}

// EXPORTATEUR DE BULLETIN OFFICIEL
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
                <h2>ÉCOLE ÉLÉMENTAIRE EL HADJI MALICK SY - MBOUR</h2>
                <p>Inspection de l'Éducation et de la Formation (IEP) de Mbour • Classe de CE2-A</p>
                <h3>BULLETIN MENSUEL DE NOTES & ÉVALUATION</h3>
            </div>
            <div class="student-info">
                <img src="${student.photo}" alt="${student.name}">
                <div>
                    <strong>Nom & Prénom :</strong> ${student.name}<br>
                    <strong>Position :</strong> Rangée ${student.column} (Pupitre Profondeur #${student.depth})<br>
                    <strong>Moyenne Mensuelle :</strong> ${student.score} / 20<br>
                    <strong>Statut CEB :</strong> ${student.mastery ? 'Maîtrise Acquise' : 'Soutien Requis'}
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

// COMMANDE VOCALE & TEXTUELLE
function handleCommand(command) {
    stopSpeaking(); 
    const q = command.toLowerCase().trim();
    let reponse = "";

    const chatBox = document.getElementById('chat-box');
    if (chatBox) {
        chatBox.innerHTML += `
            <div class="bg-slate-800 text-white p-2.5 rounded-xl ml-auto text-right max-w-lg my-2">
                <strong>Maître Balla :</strong> "${command}"
            </div>
        `;
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    if (awaitingInternetPermissionFor) {
        let concept = awaitingInternetPermissionFor;
        if (q.includes('oui') || q.includes('vas-y') || q.includes('va') || q.includes('d\'accord') || q.includes('ok')) {
            let simulatedOnlineDefinition = `Recherche en ligne effectuée pour "${concept}" : Méthode pédagogique active.`;
            maladoMemory.learnedConcepts[concept] = simulatedOnlineDefinition;
            localStorage.setItem('malado_dynamic_memory', JSON.stringify(maladoMemory));

            awaitingInternetPermissionFor = null;
            reponse = `C'est fait. J'ai consulté les ressources en ligne sur "${concept}" et je les ai enregistrées.`;
        } else {
            awaitingInternetPermissionFor = null;
            reponse = "Entendu, je ne vais pas sur Internet.";
        }
    }
    else if (isManualMode || maladoModeAwake || q.includes('assistante') || q.includes('malado')) {
        let cleanQ = q.replace('assistante', '').replace('malado', '').trim();

        if (cleanQ.includes('imprime') && cleanQ.includes('bulletin')) {
            let foundStudent = studentsDatabase.find(s => cleanQ.includes(s.name.toLowerCase()));
            if (foundStudent) {
                exportStudentBulletin(foundStudent.id);
                reponse = `J'ouvre la fenêtre d'impression du bulletin pour ${foundStudent.name}.`;
            } else {
                reponse = "Je n'ai pas trouvé le nom de l'élève pour l'impression du bulletin.";
            }
        }
        else if (cleanQ.includes('devoir') || cleanQ.includes('note') || cleanQ.includes('math') || cleanQ.includes('français')) {
            let foundStudent = studentsDatabase.find(s => cleanQ.includes(s.name.toLowerCase()));
            if (foundStudent) {
                showStudentDetails(foundStudent.id);
                reponse = `Voici le dossier de ${foundStudent.name}.`;
            } else {
                reponse = "Précisez le nom de l'élève.";
            }
        }
        else if (cleanQ.startsWith('note que') || cleanQ.startsWith('rappelle-moi') || cleanQ.startsWith('ajoute')) {
            let parts = cleanQ.split(' pour ');
            if (parts.length > 1) {
                let memoContent = parts[0];
                let studentName = parts[1];
                let student = studentsDatabase.find(s => s.name.toLowerCase().includes(studentName.toLowerCase()));
                if (student) {
                    if (!student.logbook) student.logbook = [];
                    student.logbook.push(memoContent);
                    localStorage.setItem('malado_students_db', JSON.stringify(studentsDatabase));
                    reponse = `Observation enregistrée dans le journal intime de ${student.name}.`;
                } else {
                    reponse = `Élève ${studentName} introuvable.`;
                }
            } else {
                reponse = "Précisez pour quel élève enregistrer cette observation.";
            }
        }
        else if (cleanQ.includes('vygotsky') || cleanQ.includes('tuteur') || cleanQ.includes('binôme') || cleanQ.includes('permutation')) {
            triggerVygotskyPermutationSimulation();
            reponse = "J'ouvre l'analyse de permutation Vygotsky.";
        }
        else if (cleanQ.includes('scan') || cleanQ.includes('copie')) {
            triggerOCRScanModal();
            reponse = "J'ouvre l'assistant de correction photo.";
        }
        else if (cleanQ.includes('pédagogie') || cleanQ.includes('classe') || cleanQ.includes('bilan')) {
            let avg = studentsDatabase.length > 0 ? (studentsDatabase.reduce((sum, s) => sum + s.score, 0) / studentsDatabase.length).toFixed(1) : 0;
            let faiblesCount = studentsDatabase.filter(s => !s.mastery).length;
            reponse = `Bilan CE2-A : Moyenne de ${avg}/20. ${faiblesCount} élèves en soutien.`;
        }
        else {
            let foundConcept = Object.keys(maladoMemory.learnedConcepts).find(c => cleanQ.includes(c));
            if (foundConcept) {
                reponse = `Au sujet de "${foundConcept}" : ${maladoMemory.learnedConcepts[foundConcept]}`;
            } else if (cleanQ === "" || cleanQ === "assistante" || cleanQ === "malado") {
                reponse = "Oui, Maître Balla ?";
            } else {
                awaitingInternetPermissionFor = cleanQ;
                reponse = `Maître Balla, je ne connais pas ce concept (« ${cleanQ} »). Me donnez-vous la permission d'aller consulter les ressources en ligne ?`;
            }
        }
        maladoModeAwake = false;
    } 
    else {
        if (q.includes('assistante') || q.includes('malado')) {
            maladoModeAwake = true;
            reponse = "Oui ?";
        } else {
            reponse = ""; 
        }
    }

    if (reponse && chatBox) {
        chatBox.innerHTML += `
            <div class="bg-amber-500/10 border border-amber-500/30 text-amber-300 p-3 rounded-xl max-w-xl my-2 whitespace-pre-line">
                <strong>🤖 Malado :</strong> "${reponse}"
            </div>
        `;
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    if (reponse) speakText(reponse);
}

function toggleVoiceMode() {
    stopSpeaking();
    isManualMode = !isManualMode;
    const modeText = document.getElementById('mode-text');
    const modeIcon = document.getElementById('mode-icon');

    if (isManualMode) {
        if (recognition) { try { recognition.stop(); } catch(e) {} recognition = null; }
        maladoModeAwake = false;
        if (modeText) modeText.textContent = "Mode : Manuel (Cliquez sur le micro)";
        if (modeIcon) modeIcon.className = "fa-solid fa-microphone-slash text-amber-400";
    } else {
        if (modeText) modeText.textContent = "Mode : Écoute Auto (\"Assistante\")";
        if (modeIcon) modeIcon.className = "fa-solid fa-microphone text-emerald-400";
        initVoiceRecognition();
    }
}

function startManualListening() {
    stopSpeaking(); 
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const manualRec = new SpeechRecognition();
    manualRec.lang = 'fr-FR';
    manualRec.continuous = false;
    manualRec.interimResults = false;

    const micBtnIcon = document.querySelector('#btn-manual-mic i');
    if (micBtnIcon) micBtnIcon.className = "fa-solid fa-spinner fa-spin text-amber-400";

    manualRec.onresult = function(event) {
        if (micBtnIcon) micBtnIcon.className = "fa-solid fa-microphone text-amber-400";
        handleCommand(event.results[0][0].transcript.trim());
    };
    manualRec.onerror = manualRec.onend = function() {
        if (micBtnIcon) micBtnIcon.className = "fa-solid fa-microphone text-amber-400";
    };

    try { manualRec.start(); } catch(e) {}
}

function initVoiceRecognition() {
    if (isManualMode) return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (recognition) { try { recognition.stop(); } catch(e) {} }

    recognition = new SpeechRecognition();
    recognition.lang = 'fr-FR';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = function(event) {
        handleCommand(event.results[0][0].transcript.trim());
    };
    
    recognition.onerror = function(event) {};

    recognition.onend = function() {
        if (!isManualMode) {
            setTimeout(() => { try { recognition.start(); } catch(e) {} }, 500);
        }
    };

    try { recognition.start(); } catch(e) {}
}

function triggerVygotskyPermutationSimulation() {
    stopSpeaking();
    alert("Module de permutation Vygotsky activé.");
}

function triggerOCRScanModal() {
    stopSpeaking();
    alert("Module de scan photo ouvert.");
}

function updateKPISummary() {
    const total = studentsDatabase.length;
    if (total === 0) return;
    const avgScore = (studentsDatabase.reduce((sum, s) => sum + s.score, 0) / total).toFixed(1);
    const masteryCount = studentsDatabase.filter(s => s.mastery).length;
    const supportCount = total - masteryCount;
    
    const kpiTotal = document.getElementById('kpi-total-students');
    const kpiAvg = document.getElementById('kpi-avg-score');
    const kpiMastery = document.getElementById('kpi-mastery-count');
    const kpiSupport = document.getElementById('kpi-support-count');

    if (kpiTotal) kpiTotal.innerHTML = `${total} <span class="text-xs font-normal text-slate-400">Élèves suivis</span>`;
    if (kpiAvg) kpiAvg.innerHTML = `${avgScore} <span class="text-xs font-normal text-slate-400">/ 20</span>`;
    if (kpiMastery) kpiMastery.innerHTML = `${masteryCount} <span class="text-xs font-normal text-slate-400">Élèves (&ge;12)</span>`;
    if (kpiSupport) kpiSupport.innerHTML = `${supportCount} <span class="text-xs font-normal text-slate-400">Élèves (&lt;12)</span>`;
}

window.addEventListener('DOMContentLoaded', () => {
    loadClassroomData();
    setTimeout(() => { initVoiceRecognition(); }, 1000);
});
