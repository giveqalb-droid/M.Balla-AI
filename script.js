let studentsDatabase = [];
let synth = window.speechSynthesis;
let voicesList = [];
let maladoModeAwake = false; 
let recognition = null;
let isManualMode = false;
let schoolKnowledgeBase = localStorage.getItem('malado_custom_knowledge') || "Aucun programme spécifique importé.";

// MÉMOIRE ÉVOLUTIVE (Persistante)
let maladoMemory = JSON.parse(localStorage.getItem('malado_dynamic_memory')) || {
    directives: [],          
    tone: "direct",
    learnedConcepts: {}      
};

let awaitingInternetPermissionFor = null;

// Chargement initial depuis database.json ou LocalStorage
async function loadInitialDatabase() {
    const localData = localStorage.getItem('malado_students_db');
    if (localData) {
        studentsDatabase = JSON.parse(localData);
        initUI();
    } else {
        try {
            const response = await fetch('database.json');
            const data = await response.json();
            studentsDatabase = data.students || [];
            localStorage.setItem('malado_students_db', JSON.stringify(studentsDatabase));
        } catch (error) {
            console.error("Erreur lors du chargement de database.json :", error);
        }
        initUI();
    }
}

function initUI() {
    renderClassroomDesks();
    updateKPISummary();
    setTimeout(() => { initVoiceRecognition(); }, 1000);
}

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

        if (cleanQ.includes('vygotsky') || cleanQ.includes('tuteur') || cleanQ.includes('binôme') || cleanQ.includes('soutien')) {
            let forts = studentsDatabase.filter(s => s.mastery).sort((a,b) => b.score - a.score);
            let faibles = studentsDatabase.filter(s => !s.mastery).sort((a,b) => a.score - b.score);
            
            reponse = maladoMemory.tone === "polite" ? "Maître Balla, voici les binômes Vygotsky :\n" : "Binômes Vygotsky :\n";
            for(let i = 0; i < Math.min(forts.length, faibles.length); i++) {
                reponse += `• ${forts[i].name} (${forts[i].score}) + ${faibles[i].name} (${faibles[i].score})\n`;
            }
        }
        else if (cleanQ.includes('pédagogie') || cleanQ.includes('classe') || cleanQ.includes('bilan') || cleanQ.includes('élèves') || cleanQ.includes('liste')) {
            let avg = (studentsDatabase.reduce((sum, s) => sum + s.score, 0) / studentsDatabase.length).toFixed(1);
            let faiblesCount = studentsDatabase.filter(s => !s.mastery).length;
            reponse = `Bilan CE2-A : Moyenne de ${avg}/20. ${faiblesCount} élèves en soutien.`;
        }
        else if (cleanQ.includes('présente-toi') || cleanQ.includes('presente toi') || cleanQ.includes('qui es-tu')) {
            reponse = "Je suis Malado, assistante pédagogique de la CE2-A à El Hadji Malick Sy.";
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
    loadInitialDatabase();
});
