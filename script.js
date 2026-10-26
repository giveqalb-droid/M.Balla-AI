// Données des 12 élèves de la classe de CE2-A (Mbour, Sénégal)
const studentsDatabase = [
    { id: 1, name: "Awa Diop", score: 14, mastery: true, desk: 1, info: "Awa Diop excelle avec 14 sur 20. Très rigoureuse, elle est idéale pour faire office de tutrice." },
    { id: 2, name: "Oumar Sarr", score: 9, mastery: false, desk: 2, info: "Oumar Sarr est à 9 sur 20. En difficulté sur le calcul, il bénéficie de l'Effet Vygotsky en étant jumelé avec un tuteur." },
    { id: 3, name: "Fatou Ndiaye", score: 12, mastery: true, desk: 3, info: "Fatou Ndiaye totalise 12 sur 20. Bonne élève, attentive aux consignes grammaticales." },
    { id: 4, name: "Moussa Fall", score: 7, mastery: false, desk: 4, info: "Moussa Fall est à 7 sur 20. Nécessite un accompagnement renforcé en numération." },
    { id: 5, name: "Aïcha Mbaye", score: 15, mastery: true, desk: 5, info: "Aïcha Mbaye est en tête avec 15 sur 20. Excellente en expression écrite." },
    { id: 6, name: "Ibrahima Traoré", score: 10, mastery: false, desk: 6, info: "Ibrahima Traoré a 10 sur 20. Proche du seuil de maîtrise, il progresse régulièrement." },
    { id: 7, name: "Mariama Camara", score: 13, mastery: true, desk: 7, info: "Mariama Camara obtient 13 sur 20. Très à l'aise en géométrie et logique." },
    { id: 8, name: "Cheikh Diallo", score: 8, mastery: false, desk: 8, info: "Cheikh Diallo a 8 sur 20. En soutien prioritaire sur les résolutions de problèmes." },
    { id: 9, name: "Léona Mendy", score: 11, mastery: false, desk: 9, info: "Léona Mendy est à 11 sur 20. Elle acquiert peu à peu les notions fondamentales." },
    { id: 10, name: "Karim Sow", score: 16, mastery: true, desk: 10, info: "Karim Sow est l'un des plus forts avec 16 sur 20. Il stimule son entourage par son dynamisme." },
    { id: 11, name: "Diana Gaye", score: 6, mastery: false, desk: 11, info: "Diana Gaye a 6 sur 20. Demande un suivi individualisé et un tutorat de proximité." },
    { id: 12, name: "Amadou Bocoum", score: 14, mastery: true, desk: 12, info: "Amadou Bocoum obtient 14 sur 20. Très bon niveau général et participation active." }
];

let synth = window.speechSynthesis;
let voicesList = [];
let maladoModeAwake = false; // Indicateur si l'assistante a été appelée
let recognition = null;

// Charger les voix du navigateur
function chargerVoix() {
    if (!synth) return;
    voicesList = synth.getVoices();
}
chargerVoix();
if (synth && synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = chargerVoix;
}

// Fonction pour faire parler Malado (Voix féminine fluide)
function speakText(text) {
    if (!synth) return;
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.92;
    utterance.pitch = 1.1;

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
    const message = `Élève : ${student.name}. Note : ${student.score} sur 20. ${student.info}`;

    const chatBox = document.getElementById('chat-box');
    if (chatBox) {
        chatBox.innerHTML += `
            <div class="bg-amber-500/10 border border-amber-500/30 text-amber-300 p-3 rounded-xl max-w-xl my-2">
                <strong>🤖 Malado :</strong> "Fiche de ${student.name} : Note ${student.score}/20. ${student.info}"
            </div>
        `;
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    speakText(`Fiche de ${student.name}. Note de ${student.score} sur 20. ${student.info}`);
    alert(`FICHE ÉLÈVE — CE2-A\n-------------------------\nÉlève : ${student.name}\nNote : ${student.score}/20 (${statutStr})\n\nAnalyse : ${student.info}`);
}

// Gestion de l'upload du programme
function handleCurriculumUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    document.getElementById('upload-file-label').textContent = file.name;
    const confirmationMsg = `Programme officiel ${file.name} pris en compte avec succès, Maître Balla.`;
    
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

// Traitement intelligent des commandes
function handleCommand(command) {
    const q = command.toLowerCase().trim();
    let reponse = "";

    const chatBox = document.getElementById('chat-box');
    if (chatBox) {
        chatBox.innerHTML += `
            <div class="bg-slate-800 text-white p-2.5 rounded-xl ml-auto text-right max-w-lg my-2">
                <strong>Maître Balla (Vocal) :</strong> "${command}"
            </div>
        `;
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // ÉTAPE 1 : Si on prononce le mot-clé "Assistante"
    if (q.includes('assistante')) {
        maladoModeAwake = true; // L'assistante est réveillée
        reponse = "Oui Maître Balla, je vous écoute. Que souhaitez-vous ?";
    } 
    // ÉTAPE 2 : Si l'assistante est éveillée, elle traite les ordres
    else if (maladoModeAwake) {
        if (q.includes('présente-toi') || q.includes('presente toi') || q.includes('qui es-tu') || q.includes('qui es tu')) {
            reponse = "Je m'appelle Malado, votre assistante pédagogique et co-pilote pour la classe de CE2-A à l'école El Hadji Malick Sy de Mbour, au Sénégal. Je suis là pour vous accompagner dans le suivi individualisé de vos 12 élèves.";
            maladoModeAwake = false; // Retour en mode veille silencieuse
        } 
        else if (q.includes('capable') || q.includes('capacités') || q.includes('fais-tu') || q.includes('que fais') || q.includes('fonctionnalités')) {
            reponse = "En tant qu'assistante, voici mes capacités :\n1. Suivi individualisé des 12 élèves de CE2-A.\n2. Application de l'Effet Vygotsky pour le tutorat par les pairs.\n3. Analyse des statistiques de la classe.\n4. Intégration du Programme Éducatif National du Sénégal.\n5. Consultation des fiches élèves au clic.";
            maladoModeAwake = false;
        } 
        else if (q.includes('élèves') || q.includes('liste')) {
            reponse = "Les 12 élèves de la classe de CE2-A sont : " + studentsDatabase.map(s => s.name).join(', ') + ".";
            maladoModeAwake = false;
        } 
        else if (q.includes('vygotsky') || q.includes('tuteur') || q.includes('binôme')) {
            reponse = "L'Effet Vygotsky consiste à associer un élève en soutien avec un élève fort pour stimuler son apprentissage dans sa zone proximale de développement.";
            maladoModeAwake = false;
        } 
        else {
            reponse = `J'ai bien noté : "${command}". Je veille sur la classe.`;
            maladoModeAwake = false;
        }
    } 
    // ÉTAPE 3 : Si on parle sans dire "Assistante" au préalable
    else {
        reponse = "Veuillez d'abord dire 'Assistante' pour attirer mon attention, Maître Balla.";
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

// Initialisation du micro en arrière-plan discret et silencieux
function initVoiceRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        console.warn("La reconnaissance vocale n'est pas supportée par ce navigateur.");
        return;
    }

    recognition = new SpeechRecognition();
    recognition.lang = 'fr-FR';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript.trim();
        console.log("Voix entendue :", transcript);
        handleCommand(transcript);
    };

    recognition.onerror = function(event) {
        // Mode discret : aucune alerte visuelle ou sonore en cas d'erreur de veille
    };

    recognition.onend = function() {
        // Redémarrage automatique et silencieux pour maintenir la veille
        setTimeout(() => {
            try { recognition.start(); } catch(e) {}
        }, 500);
    };

    try {
        recognition.start();
        console.log("Veille vocale silencieuse active (Dites 'Assistante')...");
    } catch(e) {
        console.error("Impossible de démarrer l'écoute micro :", e);
    }
}

// Lancement au chargement de la page
window.addEventListener('DOMContentLoaded', () => {
    renderClassroomDesks();
    updateKPISummary();
    
    // Démarrage de la veille discrète
    setTimeout(() => {
        initVoiceRecognition();
    }, 1000);
});
