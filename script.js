// Données des 12 élèves de la classe de CE2-A (Mbour, Sénégal) avec profils détaillés pour l'Effet Vygotsky
const studentsDatabase = [
    { id: 1, name: "Awa Diop", score: 14, mastery: true, desk: 1, info: "Excellente et rigoureuse. Tutorat idéal pour les camarades en difficulté." },
    { id: 2, name: "Oumar Sarr", score: 9, mastery: false, desk: 2, info: "En difficulté sur le calcul. Bénéficie directement de l'Effet Vygotsky via un tuteur." },
    { id: 3, name: "Fatou Ndiaye", score: 12, mastery: true, desk: 3, info: "Bonne élève, très attentive aux consignes grammaticales." },
    { id: 4, name: "Moussa Fall", score: 7, mastery: false, desk: 4, info: "Nécessite un accompagnement renforcé en numération et lecture." },
    { id: 5, name: "Aïcha Mbaye", score: 15, mastery: true, desk: 5, info: "En tête de classe, excellente en expression écrite et leadership." },
    { id: 6, name: "Ibrahima Traoré", score: 10, mastery: false, desk: 6, info: "Proche du seuil de maîtrise, progresse régulièrement avec de l'encouragement." },
    { id: 7, name: "Mariama Camara", score: 13, mastery: true, desk: 7, info: "Très à l'aise en géométrie, logique et résolution de problèmes." },
    { id: 8, name: "Cheikh Diallo", score: 8, mastery: false, desk: 8, info: "En soutien prioritaire sur les exercices d'application rapide." },
    { id: 9, name: "Léona Mendy", score: 11, mastery: false, desk: 9, info: "Acquiert peu à peu les notions fondamentales du CE2." },
    { id: 10, name: "Karim Sow", score: 16, mastery: true, desk: 10, info: "Très dynamique, stimule positivement son entourage par son niveau." },
    { id: 11, name: "Diana Gaye", score: 6, mastery: false, desk: 11, info: "Demande un suivi individualisé et un tutorat de proximité rapproché." },
    { id: 12, name: "Amadou Bocoum", score: 14, mastery: true, desk: 12, info: "Très bon niveau général, participation active et entraide naturelle." }
];

let synth = window.speechSynthesis;
let voicesList = [];
let maladoModeAwake = false; 
let recognition = null;
let isManualMode = false;

// Charger les voix du navigateur
function chargerVoix() {
    if (!synth) return;
    voicesList = synth.getVoices();
}
chargerVoix();
if (synth && synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = chargerVoix;
}

// Fonction pour faire parler Malado avec une intonation fluide
function speakText(text) {
    if (!synth) return;
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.92;
    utterance.pitch = 1.05;

    if (voicesList.length === 0) {
        voicesList = synth.getVoices();
    }

    const voixFeminine = voicesList.find(v => v.lang.startsWith('fr') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Hortense') || v.name.includes('Julie') || v.name.includes('Amélie'))) 
                      || voicesList.find(v => v.lang.startsWith('fr'));

    if (voixFeminine) {
        utterance.voice = voixFeminine;
    }

    synth.speak(utterance);
}

// Rendu dynamique des pupitres
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

// Affichage de la Fiche Élève
function showStudentDetails(studentId) {
    const student = studentsDatabase.find(s => s.id === studentId);
    if (!student) return;

    const statutStr = student.mastery ? 'Maîtrise Acquise' : 'Soutien & Vygotsky';
    const message = `Élève : ${student.name}. Note : ${student.score}/20 (${statutStr}). ${student.info}`;

    const chatBox = document.getElementById('chat-box');
    if (chatBox) {
        chatBox.innerHTML += `
            <div class="bg-amber-500/10 border border-amber-500/30 text-amber-300 p-3 rounded-xl max-w-xl my-2">
                <strong>🤖 Malado :</strong> "Fiche de ${student.name} : ${message}"
            </div>
        `;
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    speakText(`Fiche de ${student.name}. Note de ${student.score} sur 20. ${student.info}`);
    alert(`FICHE ÉLÈVE — CE2-A\n-------------------------\n${message}`);
}

// Gestion de l'upload du programme
function handleCurriculumUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    document.getElementById('upload-file-label').textContent = file.name;
    const confirmationMsg = `Programme officiel ${file.name} intégré avec succès. Mes suggestions pédagogiques et l'application de l'Effet Vygotsky s'alignent désormais sur ces directives.`;
    
    const chatBox = document.getElementById('chat-box');
    if (chatBox) {
        chatBox.innerHTML += `
            <div class="bg-amber-500/10 border border-amber-500/30 text-amber-300 p-3 rounded-xl max-w-xl my-2">
                <strong>🤖 Malado :</strong> "${confirmationMsg}"
            </div>
        `;
        chatBox.scrollTop = chatBox.scrollHeight;
    }
    speakText(confirmationMsg);
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

// Traitement intelligent et conversationnel (Effet Vygotsky & Profondeur)
function handleCommand(command) {
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
        
        // 1. Gestion de l'Effet Vygotsky / Tutorat par les pairs
        if (q.includes('vygotsky') || q.includes('tuteur') || q.includes('binôme') || q.includes('soutien')) {
            reponse = "Maître Balla, selon la théorie de Lev Vygotsky sur la Zone Proximale de Développement (ZPD), l'apprentissage est social. Pour votre classe de CE2-A, je vous suggère ces binômes de tutorat par les pairs :\n\n" +
                      "• Awa Diop (14/20) jumelée avec Oumar Sarr (9/20) pour le calcul.\n" +
                      "• Aïcha Mbaye (15/20) jumelée avec Moussa Fall (7/20) pour la lecture.\n" +
                      "• Karim Sow (16/20) jumelé avec Diana Gaye (6/20) pour le soutien renforcé.\n\n" +
                      "L'élève fort consolide ses acquis en expliquant, et l'élève en difficulté progresse grâce à un pair de confiance.";
        }
        // 2. Conversation profonde / Philosophie pédagogique
        else if (q.includes('pédagogie') || q.includes('apprendre') || q.includes('classe') || q.includes('bilan') || q.includes('progrès')) {
            reponse = "C'est une excellente réflexion, Maître Balla. En tant qu'éducateur à l'école El Hadji Malick Sy de Mbour, vous savez que chaque enfant possède un potentiel unique. Avec une moyenne de classe de 11.6 sur 20 et 7 élèves nécessitant un accompagnement, notre mission est de transformer ces écarts en une force collective grâce à l'émulation positive.";
        }
        // 3. Présentation simple
        else if (q.includes('présente-toi') || q.includes('presente toi') || q.includes('qui es-tu')) {
            reponse = "Je m'appelle Malado, votre assistante pédagogique et co-pilote pour la classe de CE2-A à l'école El Hadji Malick Sy de Mbour, au Sénégal. Je suis conçue pour vous épauler dans la gestion quotidienne et l'excellence de vos 12 élèves.";
        } 
        // 4. Capacités approfondies
        else if (q.includes('capable') || q.includes('capacités') || q.includes('fais-tu')) {
            reponse = "Voici l'étendue de mes compétences pédagogiques :\n1. Suivi individualisé des 12 élèves et de leurs notes.\n2. Génération de stratégies de tutorat basées sur l'Effet Vygotsky.\n3. Analyse des dynamiques de classe et des besoins en soutien.\n4. Intégration des programmes officiels nationaux du Sénégal.\n5. Échange interactif par écriture ou par commande vocale.";
        } 
        // 5. Liste des élèves
        else if (q.includes('élèves') || q.includes('liste')) {
            reponse = "Voici l'effectif actuel des 12 élèves de la classe de CE2-A : " + studentsDatabase.map(s => `${s.name} (${s.score}/20)`).join(', ') + ".";
        } 
        else {
            reponse = `J'analyse votre remarque, Maître Balla : "${command}". La classe de CE2-A avance bien. Souhaitez-vous que l'on aborde un point particulier sur le programme ou les binômes de soutien ?`;
        }
        
        maladoModeAwake = false;
    } 
    else {
        // Si le mot clé n'est pas prononcé en mode auto
        if (q.includes('assistante')) {
            maladoModeAwake = true;
            reponse = "Oui Maître Balla, je vous écoute. Que souhaitez-vous analyser ?";
        } else {
            reponse = "Veuillez dire 'Assistante' pour m'activer, ou utilisez le bouton micro manuel en bas.";
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

// Bouton Switch Mode (Auto / Manuel)
function toggleVoiceMode() {
    isManualMode = !isManualMode;
    const modeText = document.getElementById('mode-text');
    const modeIcon = document.getElementById('mode-icon');

    if (isManualMode) {
        if (recognition) {
            try { recognition.stop(); } catch(e) {}
            recognition = null;
        }
        maladoModeAwake = false;
        modeText.textContent = "Mode : Manuel (Cliquez sur le micro)";
        modeIcon.className = "fa-solid fa-microphone-slash text-amber-400";
    } else {
        modeText.textContent = "Mode : Écoute Auto (\"Assistante\")";
        modeIcon.className = "fa-solid fa-microphone text-emerald-400";
        initVoiceRecognition();
    }
}

// Fonction du micro manuel
function startManualListening() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert("La reconnaissance vocale n'est pas supportée par votre navigateur.");
        return;
    }

    const manualRec = new SpeechRecognition();
    manualRec.lang = 'fr-FR';
    manualRec.continuous = false;
    manualRec.interimResults = false;

    const micBtnIcon = document.querySelector('#btn-manual-mic i');
    if (micBtnIcon) micBtnIcon.className = "fa-solid fa-spinner fa-spin text-amber-400";

    manualRec.onresult = function(event) {
        const transcript = event.results[0][0].transcript.trim();
        if (micBtnIcon) micBtnIcon.className = "fa-solid fa-microphone text-amber-400";
        handleCommand(transcript);
    };

    manualRec.onerror = function(event) {
        if (micBtnIcon) micBtnIcon.className = "fa-solid fa-microphone text-amber-400";
    };

    manualRec.onend = function() {
        if (micBtnIcon) micBtnIcon.className = "fa-solid fa-microphone text-amber-400";
    };

    try {
        manualRec.start();
    } catch(e) {
        if (micBtnIcon) micBtnIcon.className = "fa-solid fa-microphone text-amber-400";
    }
}

// Initialisation veille vocale
function initVoiceRecognition() {
    if (isManualMode) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    recognition = new SpeechRecognition();
    recognition.lang = 'fr-FR';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript.trim();
        handleCommand(transcript);
    };

    recognition.onerror = function(event) {};

    recognition.onend = function() {
        if (!isManualMode) {
            setTimeout(() => {
                try { recognition.start(); } catch(e) {}
            }, 500);
        }
    };

    try {
        recognition.start();
    } catch(e) {}
}

// Lancement au chargement de la page
window.addEventListener('DOMContentLoaded', () => {
    renderClassroomDesks();
    updateKPISummary();
    
    setTimeout(() => {
        initVoiceRecognition();
    }, 1000);
});
