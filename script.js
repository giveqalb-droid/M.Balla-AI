// Données des 12 élèves de la classe de CE2-A (Mbour, Sénégal)
const studentsDatabase = [
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

function chargerVoix() {
    if (!synth) return;
    voicesList = synth.getVoices();
}
chargerVoix();
if (synth && synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = chargerVoix;
}

// Stoppe la parole instantanément
function stopSpeaking() {
    if (synth) synth.cancel();
}

function speakText(text) {
    if (!synth) return;
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.98;
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

    const statutStr = student.mastery ? 'Maîtrise Acquise' : 'Soutien requis';
    const message = `${student.name} : ${student.score}/20 (${statutStr}). ${student.info}`;

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
    alert(`FICHE ÉLÈVE — CE2-A\n-------------------------\n${message}`);
}

function handleCurriculumUpload(event) {
    stopSpeaking();
    const file = event.target.files[0];
    if (!file) return;

    document.getElementById('upload-file-label').textContent = file.name;
    const msg = `Programme ${file.name} bien pris en compte. Je synchronise les binômes et le suivi.`;
    
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

// Réponses directes, percutantes et sans récitatif
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

    if (isManualMode || maladoModeAwake || q.includes('assistante')) {
        
        if (q.includes('vygotsky') || q.includes('tuteur') || q.includes('binôme') || q.includes('soutien')) {
            reponse = "Pour le tutorat Vygotsky, voici les binômes efficaces :\n• Awa (14) avec Oumar (9)\n• Aïcha (15) avec Moussa (7)\n• Karim (16) avec Diana (6).";
        }
        else if (q.includes('pédagogie') || q.includes('classe') || q.includes('bilan')) {
            reponse = "Moyenne de classe à 11.6. 7 élèves en soutien : l'effort prioritaire porte sur la remédiation en calcul et lecture.";
        }
        else if (q.includes('présente-toi') || q.includes('presente toi') || q.includes('qui es-tu')) {
            reponse = "Je suis Malado, ton assistante pédagogique pour la CE2-A à El Hadji Malick Sy.";
        } 
        else if (q.includes('capable') || q.includes('capacités') || q.includes('fais-tu')) {
            reponse = "Je gère les notes, les binômes Vygotsky, les stats de classe et le programme officiel.";
        } 
        else if (q.includes('élèves') || q.includes('liste')) {
            reponse = "Élèves CE2-A : " + studentsDatabase.map(s => `${s.name} (${s.score})`).join(', ') + ".";
        } 
        else {
            reponse = `C'est noté pour "${command}". On fonce là-dessus ?`;
        }
        
        maladoModeAwake = false;
    } 
    else {
        if (q.includes('assistante')) {
            maladoModeAwake = true;
            reponse = "Oui, je t'écoute.";
        } else {
            reponse = "Dis 'Assistante' ou clique sur le micro.";
        }
    }

    if (chatBox) {
        chatBox.innerHTML += `
            <div class="bg-amber-500/10 border border-amber-500/30 text-amber-300 p-3 rounded-xl max-w-xl my-2 whitespace-pre-line">
                <strong>🤖 Malado :</strong> "${reponse}"
            </div>
        `;
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    speakText(reponse);
}

function toggleVoiceMode() {
    stopSpeaking();
    isManualMode = !isManualMode;
    const modeText = document.getElementById('mode-text');
    const modeIcon = document.getElementById('mode-icon');

    if (isManualMode) {
        if (recognition) { try { recognition.stop(); } catch(e) {} recognition = null; }
        maladoModeAwake = false;
        modeText.textContent = "Mode : Manuel (Cliquez sur le micro)";
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

    recognition = new SpeechRecognition();
    recognition.lang = 'fr-FR';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = function(event) {
        handleCommand(event.results[0][0].transcript.trim());
    };
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
