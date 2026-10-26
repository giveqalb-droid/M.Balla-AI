// Données des 12 élèves de la classe de CE2-A (Mbour, Sénégal)
let studentsDatabase = JSON.parse(localStorage.getItem('malado_students_db')) || [
    { id: 1, name: "Awa Diop", score: 14, mastery: true, desk: 1, info: "Excellente et rigoureuse. Idéale comme tutrice." },
    { id: 2, name: "Oumar Sarr", score: 9, mastery: false, desk: 2, info: "En difficulté en calcul. À jumeler avec un tuteur (Effet Vygotsky)." },
    { id: 3, name: "Fatou Ndiaye", score: 12, mastery: true, desk: 3, info: "Bonne élève, attentive en grammaire." },
    { id: 4, name: "Moussa Fall", score: 7, mastery: false, desk: 4, info: "Besoin d'un appui renforcé en numération." },
    { id: 5, name: "Aïcha Mbaye", score: 15, mastery: true, desk: 5, info: "En tête de classe, très bonne en expression écrite." },
    { id: 6, name: "Ibrahima Traoré", score: 10, mastery: false, desk: 6, info: "Proche du seuil, progresse bien." },
    { id: 7, name: "Mariama Camara", score: 13, mastery: true, desk: 7, info: "Très à l'aise en géométrie et logique." },
    { id: 8, name: "Cheikh Diallo", score: 8, mastery: false, desk: 8, info: "Soutien prioritaire sur les problèmes." },
    { id: 9, name: "Léona Mendy", score: 11, mastery: false, desk: 9, info: "Acquiert progressivement les bases." },
    { id: 10, name: "Karim Sow", score: 16, mastery: true, desk: 10, info: "Dynamique, tire le groupe vers le haut." },
    { id: 11, name: "Diana Gaye", score: 6, mastery: false, desk: 11, info: "Demande un suivi individualisé rapproché." },
    { id: 12, name: "Amadou Bocoum", score: 14, mastery: true, desk: 12, info: "Très bon niveau, actif et entraide naturelle." }
];

let synth = window.speechSynthesis;
let voicesList = [];
let maladoModeAwake = false; 
let recognition = null;
let isManualMode = false;
let schoolKnowledgeBase = localStorage.getItem('malado_custom_knowledge') || "Aucun programme spécifique importé.";

// MÉMOIRE DES RÈGLES (Persistante)
let maladoRules = JSON.parse(localStorage.getItem('malado_dynamic_rules')) || {
    politeMode: false          // Mode poli mémorisé
};

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

function renderClassroomDesks() {
    const container = document.getElementById('classroom-container');
    if (!container) return;
    container.innerHTML = '';
    studentsDatabase.forEach(student => {
        const desk = document.createElement('div');
        desk.className = `desk ${student.mastery ? 'mastery' : 'support'}`;
        desk.innerHTML = `
            <div class="student-name">${student.name}</div>
            <div class="student-score">${student.score}/20 — ${student.mastery ? 'Maîtrise' : 'Soutien'}</div>
        `;
        desk.onclick = () => showStudentDetails(student.id);
        container.appendChild(desk);
    });
}

function showStudentDetails(studentId) {
    stopSpeaking();
    const student = studentsDatabase.find(s => s.id === studentId);
    if (!student) return;

    const statutStr = student.mastery ? 'Maîtrise' : 'Soutien';
    const message = `${student.name}, ${student.score}/20. Statut : ${statutStr}. ${student.info}`;

    const chatBox = document.getElementById('chat-box');
    if (chatBox) {
        chatBox.innerHTML += `
            <div class="bg-amber-500/10 border border-amber-500/30 text-amber-300 p-3 rounded-xl max-w-xl my-2">
                <strong>🤖 Malado :</strong> "${message}"
            </div>
        `;
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    speakText(message);
    
    let nouvelleNote = prompt(`Fiche de ${student.name}\nNote actuelle : ${student.score}/20\n\nEntrez une nouvelle note (ou laissez vide) :`, student.score);
    if (nouvelleNote !== null && nouvelleNote.trim() !== "") {
        let noteNum = parseFloat(nouvelleNote);
        if (!isNaN(noteNum) && noteNum >= 0 && noteNum <= 20) {
            student.score = noteNum;
            student.mastery = noteNum >= 12;
            localStorage.setItem('malado_students_db', JSON.stringify(studentsDatabase));
            renderClassroomDesks();
            updateKPISummary();
            speakText(`Note de ${student.name} mise à jour à ${noteNum}.`);
        }
    }
}

function handleCurriculumUpload(event) {
    stopSpeaking();
    const file = event.target.files[0];
    if (!file) return;

    document.getElementById('upload-file-label').textContent = file.name;
    const reader = new FileReader();
    reader.onload = function(e) {
        schoolKnowledgeBase = e.target.result;
        localStorage.setItem('malado_custom_knowledge', schoolKnowledgeBase);
        const msg = `Programme ${file.name} intégré.`;
        
        const chatBox = document.getElementById('chat-box');
        if (chatBox) {
            chatBox.innerHTML += `
                <div class="bg-amber-500/10 border border-amber-500/30 text-amber-300 p-3 rounded-xl max-w-xl my-2">
                    <strong>🤖 Malado :</strong> "${msg}"
                </div>
            `;
            chatBox.scrollTop = chatBox.scrollHeight;
        }
        speakText(msg);
    };
    reader.readAsText(file);
}

function updateKPISummary() {
    const total = studentsDatabase.length;
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

// Cerveau intelligent
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

    // 1. APPRENTISSAGE DE LA DIRECTIVE "POLITESSE" (Si tu dis "politesse" ou "poliment")
    if (q.includes('politesse') || q.includes('poliment') || q.includes('avec politesse')) {
        maladoRules.politeMode = true;
        localStorage.setItem('malado_dynamic_rules', JSON.stringify(maladoRules));
        reponse = "C'est bien compris, Maître Balla. Je te répondrai désormais avec toute la politesse requise.";
    }
    // 2. EN MODE AUTO : On vérifie si tu as dit "Assistante" au début de la phrase
    else if (isManualMode || maladoModeAwake || q.includes('assistante')) {
        
        let cleanQ = q.replace('assistante', '').trim();

        if (cleanQ.includes('vygotsky') || cleanQ.includes('tuteur') || cleanQ.includes('binôme') || cleanQ.includes('soutien')) {
            let forts = studentsDatabase.filter(s => s.mastery).sort((a,b) => b.score - a.score);
            let faibles = studentsDatabase.filter(s => !s.mastery).sort((a,b) => a.score - b.score);
            
            reponse = maladoRules.politeMode 
                ? "Maître Balla, voici respectueusement les binômes Vygotsky :\n" 
                : "Binômes Vygotsky :\n";
            
            for(let i = 0; i < Math.min(forts.length, faibles.length); i++) {
                reponse += `• ${forts[i].name} (${forts[i].score}) + ${faibles[i].name} (${faibles[i].score})\n`;
            }
        }
        else if (cleanQ.includes('pédagogie') || cleanQ.includes('classe') || cleanQ.includes('bilan')) {
            let avg = (studentsDatabase.reduce((sum, s) => sum + s.score, 0) / studentsDatabase.length).toFixed(1);
            let faiblesCount = studentsDatabase.filter(s => !s.mastery).length;
            reponse = maladoRules.politeMode
                ? `Moyenne de la classe : ${avg}/20. ${faiblesCount} élèves nécessitent un soutien.`
                : `Moyenne : ${avg}/20. ${faiblesCount} élèves en soutien.`;
        }
        else if (cleanQ.includes('présente-toi') || cleanQ.includes('presente toi') || cleanQ.includes('qui es-tu')) {
            reponse = maladoRules.politeMode
                ? "Je suis Malado, ton assistante pédagogique dévouée pour la classe de CE2-A."
                : "Je suis Malado, assistante pédagogique de la CE2-A.";
        } 
        else {
            reponse = maladoRules.politeMode ? "C'est bien noté, Maître Balla." : "C'est noté.";
        }
        
        maladoModeAwake = false;
    } 
    else {
        // En mode écoute auto, si tu n'as pas dit "Assistante", elle ne fait rien (silence)
        if (q.includes('assistante')) {
            maladoModeAwake = true;
            reponse = maladoRules.politeMode ? "Oui, Maître Balla ?" : "Oui ?";
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
        modeText.textContent = "Mode : Manuel (Micro requis)";
        modeIcon.className = "fa-solid fa-microphone-slash text-amber-400";
    } else {
        modeText.textContent = "Mode : Écoute Auto (\"Assistante\")";
        modeIcon.className = "fa-solid fa-microphone text-emerald-400";
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
    renderClassroomDesks();
    updateKPISummary();
    setTimeout(() => { initVoiceRecognition(); }, 1000);
});
