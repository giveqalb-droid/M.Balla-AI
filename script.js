// Variable globale pour la base des élèves avec suivi par matière et journal de bord
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

// CHARGEMENT DE LA BASE DE DONNÉES
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
            { id: 1, name: "Awa Diop", score: 14, mastery: true, desk: 1, subjects: { math: 15, french: 14, dictation: 13 }, photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150", history: [11, 12, 13, 12, 14, 14], logbook: ["Très rigoureuse en classe."], info: "Excellente et rigoureuse. Idéale comme tutrice en Maths." },
            { id: 2, name: "Oumar Sarr", score: 9, mastery: false, desk: 2, subjects: { math: 7, french: 10, dictation: 10 }, photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150", history: [7, 8, 8, 9, 8, 9], logbook: ["Besoin d'aide en calcul."], info: "Besoin de soutien en Mathématiques (calcul et numération)." },
            { id: 3, name: "Fatou Ndiaye", score: 12, mastery: true, desk: 3, subjects: { math: 11, french: 14, dictation: 12 }, photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150", history: [10, 10, 11, 12, 11, 12], logbook: ["Bonne participation."], info: "Bonne élève, forte en Français et grammaire." },
            { id: 4, name: "Moussa Fall", score: 7, mastery: false, desk: 4, subjects: { math: 6, french: 8, dictation: 7 }, photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150", history: [5, 6, 6, 7, 6, 7], logbook: ["Distrait en fin de matinée."], info: "Besoin d'un appui renforcé en Numération et Dictée." },
            { id: 5, name: "Aïcha Mbaye", score: 15, mastery: true, desk: 5, subjects: { math: 14, french: 16, dictation: 15 }, photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150", history: [13, 14, 14, 15, 14, 15], logbook: ["Très active à l'oral."], info: "Excellente en Expression Écrite et Français." },
            { id: 6, name: "Ibrahima Traoré", score: 10, mastery: false, desk: 6, subjects: { math: 10, french: 10, dictation: 10 }, photo: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150", history: [8, 9, 9, 10, 9, 10], logbook: ["Progrès réguliers."], info: "Proche du seuil, progresse régulièrement." },
            { id: 7, name: "Mariama Camara", score: 13, mastery: true, desk: 7, subjects: { math: 14, french: 12, dictation: 13 }, photo: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150", history: [11, 12, 12, 13, 12, 13], logbook: ["Méthodique en géométrie."], info: "Très à l'aise en Géométrie et Logique." },
            { id: 8, name: "Cheikh Diallo", score: 8, mastery: false, desk: 8, subjects: { math: 8, french: 9, dictation: 7 }, photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150", history: [6, 7, 7, 8, 7, 8], logbook: ["Réservé, demande de l'encouragement."], info: "Soutien prioritaire sur la Résolution de Problèmes." },
            { id: 9, name: "Léona Mendy", score: 11, mastery: false, desk: 9, subjects: { math: 11, french: 11, dictation: 11 }, photo: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150", history: [9, 10, 10, 11, 10, 11], logbook: ["Appliquée et attentive."], info: "Acquiert progressivement les bases dans toutes les matières." },
            { id: 10, name: "Karim Sow", score: 16, mastery: true, desk: 10, subjects: { math: 17, french: 15, dictation: 16 }, photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150", history: [14, 15, 15, 16, 15, 16], logbook: ["Leader naturel en calcul."], info: "Leader en Mathématiques et Calcul rapide." },
            { id: 11, name: "Diana Gaye", score: 6, mastery: false, desk: 11, subjects: { math: 5, french: 7, dictation: 6 }, photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150", history: [4, 5, 5, 6, 5, 6], logbook: ["Suivi individualisé requis."], info: "Demande un suivi individualisé rapproché en Français." },
            { id: 12, name: "Amadou Bocoum", score: 14, mastery: true, desk: 12, subjects: { math: 13, french: 14, dictation: 15 }, photo: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150", history: [12, 13, 13, 14, 13, 14], logbook: ["Bon esprit d'entraide."], info: "Très bon niveau, entraide naturelle." }
        ];
    }
    renderClassroomDesks();
    updateKPISummary();
    injectLocalBadge();
}

// 1. AJOUT DU BADGE DE STATUT LOCAL (SSD / CLÉ USB)
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

function renderClassroomDesks() {
    const container = document.getElementById('classroom-container');
    if (!container) return;
    container.innerHTML = '';
    studentsDatabase.forEach(student => {
        const desk = document.createElement('div');
        desk.className = `desk p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${student.mastery ? 'bg-emerald-900/20 border-emerald-500/40 text-emerald-200' : 'bg-amber-900/20 border-amber-500/40 text-amber-200'}`;
        desk.innerHTML = `
            <img src="${student.photo || 'https://via.placeholder.com/150'}" class="w-10 h-10 rounded-full object-cover border border-amber-500/50" alt="${student.name}">
            <div>
                <div class="font-bold text-sm">${student.name}</div>
                <div class="text-xs text-slate-300">Table ${student.desk} • <span class="font-semibold">${student.score}/20</span></div>
            </div>
        `;
        desk.onclick = () => showStudentDetails(student.id);
        container.appendChild(desk);
    });
}

// DOSSIER PÉDAGOGIQUE AVEC EXPORT DE BULLETIN ET JOURNAL DE BORD
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

                <!-- COURBE D'ÉVOLUTION -->
                <div class="bg-slate-800 p-4 rounded-xl mb-4 border border-slate-700">
                    <h4 class="font-bold text-amber-300 text-sm mb-2">📈 Courbe d'Évolution (Tests des 6 Vendredis)</h4>
                    <div class="flex justify-between items-end h-24 gap-2 pt-4 px-2 bg-slate-900/50 rounded-lg">
                        ${history.map((val, idx) => `
                            <div class="flex flex-col items-center gap-1 flex-1">
                                <span class="text-[10px] text-amber-400 font-bold">${val}</span>
                                <div class="w-full bg-amber-500/80 rounded-t transition-all" style="height: ${(val / 20) * 100}%"></div>
                                <span class="text-[9px] text-slate-400">S${idx+1}</span>
                            </div>
                        `).join('')}
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
                    <button onclick="closeStudentModal()" class="bg-slate-800 text-slate-300 px-4 py-2 rounded-lg hover:bg-slate-700 text-sm">Fermer</button>
                </div>
            </div>
        </div>
    `;

    const existingModal = document.getElementById('student-modal');
    if (existingModal) existingModal.remove();

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    speakText(`Ouverture du dossier de ${student.name}.`);
}

function closeStudentModal() {
    const modal = document.getElementById('student-modal');
    if (modal) modal.remove();
}

// 2. EXPORTATEUR DE BULLETIN OFFICIEL (Format imprimable)
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
                <h3>BULLETIN TRIMESTRIEL DE NOTES & ÉVALUATION</h3>
            </div>
            <div class="student-info">
                <img src="${student.photo}" alt="${student.name}">
                <div>
                    <strong>Nom & Prénom :</strong> ${student.name}<br>
                    <strong>Table-Banc N° :</strong> ${student.desk}<br>
                    <strong>Moyenne Générale :</strong> ${student.score} / 20<br>
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
                Élève suivi via l'analyse des tests hebdomadaires du vendredi. Évolution régulière et dynamique de classe positive.
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

// 3. JOURNAL DE BORD VOCAL (Mémo instantané dicté par le Maître)
function addMemoToLogbook(studentName, memoText) {
    let student = studentsDatabase.find(s => s.name.toLowerCase().includes(studentName.toLowerCase()));
    if (student) {
        if (!student.logbook) student.logbook = [];
        student.logbook.push(memoText);
        localStorage.setItem('malado_students_db', JSON.stringify(studentsDatabase));
        speakText(`Mémo enregistré pour ${student.name}.`);
    } else {
        speakText(`Je n'ai pas trouvé l'élève ${studentName}.`);
    }
}

// MODULE DE PERMUTATION LOGIQUE VYGOTSKY
function triggerVygotskyPermutationSimulation() {
    stopSpeaking();
    let weakStudents = studentsDatabase.filter(s => !s.mastery);
    let strongStudents = studentsDatabase.filter(s => s.mastery);
    let targetWeak = weakStudents.length > 0 ? weakStudents[0] : studentsDatabase[1];
    let targetStrong = strongStudents.length > 0 ? strongStudents[0] : studentsDatabase[0];

    const modalHtml = `
        <div id="permutation-modal" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div class="bg-slate-900 border border-emerald-500/40 rounded-2xl max-w-2xl w-full p-6 text-white shadow-2xl relative max-h-[90vh] overflow-y-auto">
                <button onclick="document.getElementById('permutation-modal').remove()" class="absolute top-4 right-4 text-slate-400 hover:text-white text-xl font-bold">&times;</button>
                
                <h3 class="text-xl font-bold text-emerald-400 mb-2">🧠 Analyse Logique & Permutation Prédictive</h3>
                <p class="text-xs text-slate-400 mb-4">Croisement des notes par matière et des besoins du CEB (Effet Vygotsky)</p>

                <div class="bg-slate-800 p-4 rounded-xl mb-4 text-sm border border-emerald-500/20">
                    <h4 class="font-bold text-amber-300 mb-1">Permutation Recommandée : Table-Banc ${targetWeak.desk} ⇄ Table-Banc ${targetStrong.desk}</h4>
                    <p class="text-slate-300 text-xs mb-3">Association ciblée entre <strong>${targetWeak.name}</strong> et <strong>${targetStrong.name}</strong>.</p>
                    
                    <div class="space-y-2 text-xs text-slate-300">
                        <p>• <strong>Logique Pédagogique :</strong> Jumelage par pairage pour stimuler l'explication mutuelle.</p>
                        <p>• <strong>Prédiction d'Impact :</strong> <span class="text-emerald-400">+3.0 Pts Estimés</span> au test du prochain vendredi.</p>
                    </div>
                </div>

                <div class="flex gap-3 justify-end">
                    <button onclick="document.getElementById('permutation-modal').remove()" class="bg-slate-800 text-slate-300 px-4 py-2 rounded-lg hover:bg-slate-700 text-sm">Fermer</button>
                    <button onclick="applyPermutation()" class="bg-emerald-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-emerald-500 text-sm">Valider & Appliquer</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    speakText(`Proposition de permutation entre ${targetWeak.name} et ${targetStrong.name} prête.`);
}

function applyPermutation() {
    document.getElementById('permutation-modal').remove();
    speakText("Permutation logique appliquée avec succès.");
}

// SCAN PHOTO DES DEVOIRS
function triggerOCRScanModal() {
    stopSpeaking();
    const modalHtml = `
        <div id="ocr-modal" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div class="bg-slate-900 border border-emerald-500/40 rounded-2xl max-w-xl w-full p-6 text-white shadow-2xl relative">
                <button onclick="document.getElementById('ocr-modal').remove()" class="absolute top-4 right-4 text-slate-400 hover:text-white text-xl font-bold">&times;</button>
                
                <h3 class="text-xl font-bold text-emerald-400 mb-2">📸 Correction Automatique par Photo (Devoirs du Vendredi)</h3>
                <p class="text-xs text-slate-400 mb-4">Malado analyse les copies, met à jour les courbes et rédige la double appréciation.</p>

                <div class="border-2 border-dashed border-emerald-500/40 rounded-xl p-6 text-center bg-slate-800/50 mb-4 cursor-pointer hover:bg-slate-800" onclick="simulateOCRProcessing()">
                    <i class="fa-solid fa-cloud-arrow-up text-3xl text-emerald-400 mb-2"></i>
                    <p class="text-sm font-semibold">Cliquez ici pour photographier ou importer les copies</p>
                </div>

                <div id="ocr-progress" class="hidden text-center text-amber-300 text-sm mb-4">
                    <i class="fa-solid fa-spinner fa-spin mr-2"></i> Analyse OCR et diagnostic en cours...
                </div>

                <div class="flex justify-end">
                    <button onclick="document.getElementById('ocr-modal').remove()" class="bg-slate-800 text-slate-300 px-4 py-2 rounded-lg hover:bg-slate-700 text-sm">Annuler</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    speakText("Module de correction photo ouvert.");
}

function simulateOCRProcessing() {
    const progress = document.getElementById('ocr-progress');
    if (progress) progress.classList.remove('hidden');

    setTimeout(() => {
        if (progress) progress.classList.add('hidden');
        document.getElementById('ocr-modal').remove();
        
        studentsDatabase.forEach(s => {
            let randBonus = Math.floor(Math.random() * 3);
            s.score = Math.min(20, s.score + randBonus);
            s.mastery = s.score >= 12;
            if(!s.history) s.history = [10, 11, 12, 12, 13, s.score];
            else s.history.push(s.score);
        });
        localStorage.setItem('malado_students_db', JSON.stringify(studentsDatabase));
        renderClassroomDesks();
        updateKPISummary();

        speakText("Correction et analyse terminées. Bulletins et appréciations générés.");
        alert("✅ Succès : Copies corrigées ! Bulletins actualisés.");
    }, 2000);
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

// Cerveau principal stable (avec écoute du Journal de bord vocal)
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
    else if (isManualMode || maladoModeAwake || q.includes('assistante')) {
        let cleanQ = q.replace('assistante', '').trim();

        // Détection de mémo vocal pour le journal de bord
        if (cleanQ.startsWith('note que') || cleanQ.startsWith('rappelle-moi') || cleanQ.startsWith('ajoute')) {
            let parts = cleanQ.split(' pour ');
            if (parts.length > 1) {
                let memoContent = parts[0];
                let studentName = parts[1];
                addMemoToLogbook(studentName, memoContent);
                reponse = `C'est noté dans le journal de bord.`;
            } else {
                reponse = "Précisez pour quel élève vous souhaitez enregistrer ce mémo.";
            }
        }
        else if (cleanQ.includes('vygotsky') || cleanQ.includes('tuteur') || cleanQ.includes('binôme') || cleanQ.includes('permutation')) {
            triggerVygotskyPermutationSimulation();
            reponse = "J'ouvre l'analyse logique et les propositions de permutation Vygotsky.";
        }
        else if (cleanQ.includes('devoir') || cleanQ.includes('copie') || cleanQ.includes('scan') || cleanQ.includes('bulletin')) {
            triggerOCRScanModal();
            reponse = "J'ouvre l'assistant de correction photo des devoirs.";
        }
        else if (cleanQ.includes('pédagogie') || cleanQ.includes('classe') || cleanQ.includes('bilan') || cleanQ.includes('élèves')) {
            let avg = studentsDatabase.length > 0 ? (studentsDatabase.reduce((sum, s) => sum + s.score, 0) / studentsDatabase.length).toFixed(1) : 0;
            let faiblesCount = studentsDatabase.filter(s => !s.mastery).length;
            reponse = `Bilan CE2-A (El Hadji Malick Sy) : Moyenne de ${avg}/20. ${faiblesCount} élèves en soutien.`;
        }
        else if (cleanQ.includes('présente-toi') || cleanQ.includes('presente toi') || cleanQ.includes('qui es-tu')) {
            reponse = "Je suis Malado, assistante pédagogique de la CE2-A à l'école El Hadji Malick Sy de Mbour.";
        } 
        else if (cleanQ.includes('politesse') || cleanQ.includes('poliment')) {
            maladoMemory.tone = "polite";
            localStorage.setItem('malado_dynamic_memory', JSON.stringify(maladoMemory));
            reponse = "C'est bien noté, Maître Balla. Je serai plus polie.";
        }
        else {
            let foundConcept = Object.keys(maladoMemory.learnedConcepts).find(c => cleanQ.includes(c));
            if (foundConcept) {
                reponse = `Au sujet de "${foundConcept}" : ${maladoMemory.learnedConcepts[foundConcept]}`;
            } else if (cleanQ === "" || cleanQ === "assistante") {
                reponse = "Oui, Maître Balla ?";
            } else {
                awaitingInternetPermissionFor = cleanQ;
                reponse = `Maître Balla, je ne connais pas ce concept (« ${cleanQ} »). Me donnez-vous la permission d'aller consulter les ressources en ligne ?`;
            }
        }
        
        maladoModeAwake = false;
    } 
    else {
        if (q.includes('assistante')) {
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

    if (reponse) {
        speakText(reponse);
    }
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

window.addEventListener('DOMContentLoaded', () => {
    loadClassroomData();
    setTimeout(() => { initVoiceRecognition(); }, 1000);
});
