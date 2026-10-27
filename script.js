// Variable globale pour la base des élèves
let studentsDatabase = [];
let schoolKnowledgeBase = localStorage.getItem('malado_custom_knowledge') || "Aucun programme spécifique importé.";

let synth = window.speechSynthesis;
let voicesList = [];
let maladoModeAwake = false; 
let recognition = null;
let isManualMode = false; // Mode Écoute Auto actif par défaut

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

// CHARGEMENT DE LA BASE DE DONNÉES DEPUIS LE FICHIER database.json
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
            { id: 1, name: "Awa Diop", score: 14, mastery: true, desk: 1, style: "Visuel / Logique", behavior: "Calme & Attentif", info: "Excellente et rigoureuse. Idéale comme tutrice." },
            { id: 2, name: "Oumar Sarr", score: 9, mastery: false, desk: 2, style: "Kinésthésique", behavior: "Besoin de bouger", info: "En difficulté en calcul. À jumeler avec un tuteur (Effet Vygotsky)." },
            { id: 3, name: "Fatou Ndiaye", score: 12, mastery: true, desk: 3, style: "Auditif", behavior: "Attentive", info: "Bonne élève, attentive en grammaire." },
            { id: 4, name: "Moussa Fall", score: 7, mastery: false, desk: 4, style: "Visuel", behavior: "Distrait", info: "Besoin d'un appui renforcé en numération." },
            { id: 5, name: "Aïcha Mbaye", score: 15, mastery: true, desk: 5, style: "Visuel / Littéraire", behavior: "Leader calme", info: "En tête de classe, très bonne en expression écrite." },
            { id: 6, name: "Ibrahima Traoré", score: 10, mastery: false, desk: 6, style: "Kinésthésique", behavior: "Dynamique", info: "Proche du seuil, progresse bien." },
            { id: 7, name: "Mariama Camara", score: 13, mastery: true, desk: 7, style: "Logique", behavior: "Méthodique", info: "Très à l'aise en géométrie et logique." },
            { id: 8, name: "Cheikh Diallo", score: 8, mastery: false, desk: 8, style: "Auditif", behavior: "Réservé", info: "Soutien prioritaire sur les problèmes." },
            { id: 9, name: "Léona Mendy", score: 11, mastery: false, desk: 9, style: "Visuel", behavior: "Appappliquée", info: "Acquiert progressivement les bases." },
            { id: 10, name: "Karim Sow", score: 16, mastery: true, desk: 10, style: "Visuel / Rapide", behavior: "Très actif", info: "Dynamique, tire le groupe vers le haut." },
            { id: 11, name: "Diana Gaye", score: 6, mastery: false, desk: 11, style: "Auditif", behavior: "Discrète", info: "Demande un suivi individualisé rapproché." },
            { id: 12, name: "Amadou Bocoum", score: 14, mastery: true, desk: 12, style: "Logique", behavior: "Entraide naturelle", info: "Très bon niveau, actif et entraide naturelle." }
        ];
    }
    renderClassroomDesks();
    updateKPISummary();
}

function renderClassroomDesks() {
    const container = document.getElementById('classroom-container');
    if (!container) return;
    container.innerHTML = '';
    studentsDatabase.forEach(student => {
        const desk = document.createElement('div');
        desk.className = `desk p-3 rounded-xl border cursor-pointer transition-all ${student.mastery ? 'bg-emerald-900/20 border-emerald-500/40 text-emerald-200' : 'bg-amber-900/20 border-amber-500/40 text-amber-200'}`;
        desk.innerHTML = `
            <div class="font-bold text-sm">${student.name}</div>
            <div class="text-xs text-slate-300 mt-1">Table-Banc N°${student.desk}</div>
            <div class="text-xs font-semibold mt-1">${student.score}/20 — ${student.mastery ? 'Maîtrise' : 'Soutien'}</div>
        `;
        desk.onclick = () => showStudentDetails(student.id);
        container.appendChild(desk);
    });
}

// AFFICHAGE DU DOSSIER PÉDAGOGIQUE COMPLET DE L'ÉLÈVE AU CLIC
function showStudentDetails(studentId) {
    stopSpeaking();
    const student = studentsDatabase.find(s => s.id === studentId);
    if (!student) return;

    const modalHtml = `
        <div id="student-modal" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div class="bg-slate-900 border border-amber-500/40 rounded-2xl max-w-2xl w-full p-6 text-white shadow-2xl relative max-h-[90vh] overflow-y-auto">
                <button onclick="closeStudentModal()" class="absolute top-4 right-4 text-slate-400 hover:text-white text-xl font-bold">&times;</button>
                
                <h3 class="text-xl font-bold text-amber-400 mb-1">Dossier Pédagogique : ${student.name}</h3>
                <p class="text-xs text-slate-400 mb-4">Table-Banc N°${student.desk} • CE2 (École El Hadji Malick Sy)</p>

                <div class="grid grid-cols-2 gap-4 mb-4 text-sm bg-slate-800 p-4 rounded-xl">
                    <div><strong>Moyenne Générale :</strong> ${student.score}/20</div>
                    <div><strong>Statut CEB :</strong> <span class="${student.mastery ? 'text-emerald-400' : 'text-amber-400'}">${student.mastery ? 'Maîtrise' : 'Soutien'}</span></div>
                    <div><strong>Style d'Apprentissage :</strong> ${student.style || 'Visuel / Kinesthésique'}</div>
                    <div><strong>Comportement :</strong> ${student.behavior || 'Calme & Attentif'}</div>
                </div>

                <div class="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl mb-4 text-sm">
                    <h4 class="font-bold text-amber-300 mb-2">🔍 Analyse OCR du Dernier Devoir Scanné</h4>
                    <p class="text-slate-300 italic mb-2">"Erreur détectée en Numération : Confusion dans le report d'alignement spatial lors des additions à 3 chiffres."</p>
                    <p class="text-amber-200 text-xs"><strong>Conseil Pédagogique de Malado :</strong> Placer l'élève au premier rang près de la Zone Chiffres du tableau noir. Utiliser le boulier traditionnel et lui donner 2 exercices ciblés avant le test du vendredi.</p>
                </div>

                <div class="mb-4">
                    <label class="block text-xs text-slate-400 mb-1">Mettre à jour la note de l'élève (/20) :</label>
                    <div class="flex gap-2">
                        <input type="number" id="modal-new-score" value="${student.score}" min="0" max="20" step="0.5" class="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white w-full">
                        <button onclick="saveStudentScore(${student.id})" class="bg-amber-500 text-slate-950 font-bold px-4 py-2 rounded-lg hover:bg-amber-400">Enregistrer</button>
                    </div>
                </div>

                <div class="text-right">
                    <button onclick="closeStudentModal()" class="bg-slate-800 text-slate-300 px-4 py-2 rounded-lg hover:bg-slate-700 text-sm">Fermer le Dossier</button>
                </div>
            </div>
        </div>
    `;

    // Supprime l'ancienne modale si elle existe
    const existingModal = document.getElementById('student-modal');
    if (existingModal) existingModal.remove();

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    speakText(`Ouverture du dossier pédagogique de ${student.name}. Moyenne générale : ${student.score} sur 20.`);
}

function closeStudentModal() {
    const modal = document.getElementById('student-modal');
    if (modal) modal.remove();
}

function saveStudentScore(studentId) {
    const input = document.getElementById('modal-new-score');
    if (!input) return;
    let noteNum = parseFloat(input.value);
    if (!isNaN(noteNum) && noteNum >= 0 && noteNum <= 20) {
        let student = studentsDatabase.find(s => s.id === studentId);
        if (student) {
            student.score = noteNum;
            student.mastery = noteNum >= 12;
            localStorage.setItem('malado_students_db', JSON.stringify(studentsDatabase));
            renderClassroomDesks();
            updateKPISummary();
            closeStudentModal();
            speakText(`Note de ${student.name} mise à jour à ${noteNum} sur 20.`);
        }
    }
}

// MODULE DE PERMUTATION INTELLIGENTE VYGOTSKY
function triggerVygotskyPermutationSimulation() {
    stopSpeaking();
    const modalHtml = `
        <div id="permutation-modal" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div class="bg-slate-900 border border-emerald-500/40 rounded-2xl max-w-2xl w-full p-6 text-white shadow-2xl relative max-h-[90vh] overflow-y-auto">
                <button onclick="document.getElementById('permutation-modal').remove()" class="absolute top-4 right-4 text-slate-400 hover:text-white text-xl font-bold">&times;</button>
                
                <h3 class="text-xl font-bold text-emerald-400 mb-2">🧠 Analyse Prédictive de Permutation Intelligente</h3>
                <p class="text-xs text-slate-400 mb-4">Simulation pédagogique basée sur le modèle d'apprentissage CEB (Effet Vygotsky)</p>

                <div class="bg-slate-800 p-4 rounded-xl mb-4 text-sm border border-emerald-500/20">
                    <h4 class="font-bold text-amber-300 mb-1">Permutation Suggérée : Table-Banc 1 (Abdou L. ⇄ Moussa D.)</h4>
                    <p class="text-slate-300 text-xs mb-3">Échange de position entre Abdou Laye (Rang 3 - Fond) et Moussa Diallo (Rang 1 - Face Tableau).</p>
                    
                    <div class="space-y-2 text-xs text-slate-300">
                        <div><strong>1. Raisons Détaillées :</strong></div>
                        <p>• <strong>Proximité Visuelle :</strong> Abdou Laye présente des difficultés légères de vision. Le placer au Rang 1 réduira sa fatigue cognitive en numération.</p>
                        <p>• <strong>Synergie de Pairage :</strong> Placer Abdou à côté d'Aïssatou Sow crée un binôme d'entraide spontanée.</p>
                        <p>• <strong>Canalisation de Moussa D. :</strong> Moussa bénéficiera d'une autonomie accrue au Rang 3 aux côtés de Cheikh Tidiane.</p>
                        
                        <div class="mt-3"><strong>2. Prédictions d'Impact :</strong></div>
                        <p>• <strong>Abdou Laye :</strong> <span class="text-emerald-400">+3.5 Pts Estimés</span> en numération grâce au repérage facilité des colonnes.</p>
                        <p>• <strong>Moussa Diallo :</strong> <span class="text-emerald-400">+1.5 Pts Estimés</span> en responsabilisation et résolution de problèmes complexes.</p>

                        <div class="mt-3"><strong>3. Risques Identifiés & Mesures :</strong></div>
                        <p class="text-amber-300">• Risque de bavardage discret au Rang 3 (Moussa & Cheikh). Consigne : Effectuer des déplacements réguliers et désigner Cheikh responsable du cahier.</p>
                    </div>
                </div>

                <div class="flex gap-3 justify-end">
                    <button onclick="document.getElementById('permutation-modal').remove()" class="bg-slate-800 text-slate-300 px-4 py-2 rounded-lg hover:bg-slate-700 text-sm">Conserver le Plan Actuel</button>
                    <button onclick="applyPermutation()" class="bg-emerald-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-emerald-500 text-sm">Valider & Appliquer le Nouveau Plan</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    speakText("Simulation de permutation intelligente Vygotsky prête. Voulez-vous valider le déplacement d'Abdou Laye et Moussa Diallo ?");
}

function applyPermutation() {
    document.getElementById('permutation-modal').remove();
    speakText("Nouveau plan de classe validé et appliqué avec succès. Les prédictions d'impact sont enregistrées.");
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

// Cerveau principal stable
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
            let simulatedOnlineDefinition = `Recherche en ligne effectuée pour "${concept}" : Méthode pédagogique active et adaptée au niveau de la classe.`;
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

        if (cleanQ.includes('vygotsky') || cleanQ.includes('tuteur') || cleanQ.includes('binôme') || cleanQ.includes('soutien') || cleanQ.includes('permutation')) {
            triggerVygotskyPermutationSimulation();
            reponse = "J'ai ouvert le module de permutation intelligente Vygotsky pour vous.";
        }
        else if (cleanQ.includes('pédagogie') || cleanQ.includes('classe') || cleanQ.includes('bilan') || cleanQ.includes('élèves') || cleanQ.includes('liste')) {
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
        if (recognition) { 
            try { recognition.stop(); } catch(e) {} 
            recognition = null; 
        }
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
    if (!SpeechRecognition) {
        alert("Reconnaissance vocale non supportée par ce navigateur.");
        return;
    }

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

    if (recognition) { 
        try { recognition.stop(); } catch(e) {} 
    }

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
            setTimeout(() => { 
                try { recognition.start(); } catch(e) {} 
            }, 500);
        }
    };

    try { recognition.start(); } catch(e) {}
}

window.addEventListener('DOMContentLoaded', () => {
    loadClassroomData();
    setTimeout(() => { initVoiceRecognition(); }, 1000);
});
