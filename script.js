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

// Variables globales
let synthesisActive = false;
const synth = window.speechSynthesis;
let recognition;

// Rendu des pupitres des élèves
function renderClassroomDesks() {
    const container = document.getElementById('classroom-container');
    if (!container) {
        console.error("Element #classroom-container introuvable !");
        return;
    }
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

// Affichage et vocalisation des détails d'un élève
function showStudentDetails(studentId) {
    const student = studentsDatabase.find(s => s.id === studentId);
    if (!student) return;
    
    const message = `Élève ${student.name}. Note de ${student.score} sur 20. ${student.info}`;
    speakText(message);
}

// Mise à jour des KPIs
function updateKPISummary() {
    const total = studentsDatabase.length;
    const avgScore = (studentsDatabase.reduce((sum, s) => sum + s.score, 0) / total).toFixed(1);
    const masteryCount = studentsDatabase.filter(s => s.mastery).length;
    const supportCount = total - masteryCount;
    
    document.getElementById('kpi-total-students').innerHTML = `${total} <span class="text-xs font-normal text-slate-400">Élèves suivis</span>`;
    document.getElementById('kpi-avg-score').innerHTML = `${avgScore} <span class="text-xs font-normal text-slate-400">/ 20</span>`;
    document.getElementById('kpi-mastery-count').innerHTML = `${masteryCount} <span class="text-xs font-normal text-slate-400">Élèves (&ge;12)</span>`;
    document.getElementById('kpi-support-count').innerHTML = `${supportCount} <span class="text-xs font-normal text-slate-400">Élèves (&lt;12)</span>`;
}

// Activation de Synthesis AI avec voix féminine fluide unique
function activateSynthesisAI() {
    if (!synth) {
        alert("La synthèse vocale n'est pas supportée par ce navigateur.");
        return;
    }
    synthesisActive = true;
    updateVoiceStatus('active');
    
    const introMsg = "Bonjour Maître Balla. Je suis Synthesis AI, votre co-pilote intelligent pour la classe de CE2 A à l'école El Hadji Malick Sy de Mbour. Je suis activée et prête.";
    speakText(introMsg);
    
    if (recognition) {
        try { recognition.start(); } catch(e) {}
    }
}

// Synthèse vocale fluide et exclusive (Voix féminine)
function speakText(text) {
    if (!synth) return;
    synth.cancel(); // Annule toute parole précédente pour éviter les superpositions

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.92;
    utterance.pitch = 1.1;

    // Sélection stricte d'une voix féminine française si disponible
    const voices = synth.getVoices();
    const voixFeminine = voices.find(v => v.lang.startsWith('fr') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Hortense') || v.name.includes('Julie'))) 
                      || voices.find(v => v.lang.startsWith('fr'));

    if (voixFeminine) {
        utterance.voice = voixFeminine;
    }

    synth.speak(utterance);
}

function updateVoiceStatus(status) {
    const badge = document.getElementById('voice-status-badge');
    const dot = document.getElementById('voice-indicator-dot');
    const text = document.getElementById('voice-status-text');
    if (!badge || !dot || !text) return;

    if (status === 'active') {
        badge.classList.add('active');
        dot.classList.add('active');
        text.textContent = 'Synthesis AI Active';
    } else {
        badge.classList.remove('active');
        dot.classList.remove('active');
        text.textContent = 'Synthèse vocale en attente';
    }
}

// Initialisation de la reconnaissance vocale
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'fr-FR';
    recognition.continuous = false;

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        console.log('Reconnu :', transcript);
        handleCommand(transcript);
    };

    recognition.onerror = (event) => {
        console.error('Erreur de reconnaissance vocale:', event);
    };

    recognition.onend = () => {
        try { recognition.start(); } catch(e) {}
    };
}

// Gestion intelligente des commandes (avec explication de l'Effet Vygotsky)
function handleCommand(command) {
    const q = command.toLowerCase();

    if (q.includes('bonjour') || q.includes('salut')) {
        speakText("Bonjour Maître Balla. La classe de CE2 A est prête.");
    } else if (q.includes('présente') || q.includes('presentation') || q.includes('qui es-tu') || q.includes('qui es tu')) {
        presentSelf();
    } else if (q.includes('élèves') || q.includes('liste')) {
        listStudents();
    } else if (q.includes('vygotsky') || q.includes('tuteur') || q.includes('binôme')) {
        speakText("L'Effet Vygotsky consiste à placer un élève en soutien à côté d'un élève fort. Le tuteur aide son camarade à progresser dans sa zone proximale de développement.");
    } else {
        speakText("J'ai bien reçu votre consigne. Je analyse les progrès de la classe.");
    }
}

// Présentation complète de Synthesis AI et de l'Effet Vygotsky
function presentSelf() {
    const presentation = "Bonjour Maître Balla. Je suis Synthesis AI, votre co-pilote pédagogique pour la classe de CE2 A à l'école El Hadji Malick Sy de Mbour. " +
                         "J'analyse les résultats de vos 12 élèves et j'applique la théorie de l'Effet Vygotsky pour organiser le tutorat par les pairs, " +
                         "permettant aux élèves en difficulté de progresser au contact de leurs camarades plus avancés.";
    speakText(presentation);
}

// Lister les élèves
function listStudents() {
    const names = studentsDatabase.map(s => s.name).join(', ');
    speakText("Les 12 élèves de la classe sont : " + names);
}

// Lecture globale du tableau
function readFullBoard() {
    speakText("Tableau noir de la classe de CE2 A. Activités du jour : calcul mental, numération et lecture active.");
}

// Chargement initial des voix
if ('speechSynthesis' in window) {
    synth.onvoiceschanged = () => { synth.getVoices(); };
}

// Initialisation au chargement de la page
window.addEventListener('DOMContentLoaded', () => {
    renderClassroomDesks();
    updateKPISummary();
});
