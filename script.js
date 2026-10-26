// Données des élèves
const studentsDatabase = [
    { id: 1, name: "Awa Diop", score: 14, mastery: true, desk: 1 },
    { id: 2, name: "Oumar Sarr", score: 9, mastery: false, desk: 2 },
    { id: 3, name: "Fatou Ndiaye", score: 12, mastery: true, desk: 3 },
    { id: 4, name: "Moussa Fall", score: 7, mastery: false, desk: 4 },
    { id: 5, name: "Aïcha Mbaye", score: 15, mastery: true, desk: 5 },
    { id: 6, name: "Ibrahima Traoré", score: 10, mastery: false, desk: 6 },
    { id: 7, name: "Mariama Camara", score: 13, mastery: true, desk: 7 },
    { id: 8, name: "Cheikh Diallo", score: 8, mastery: false, desk: 8 },
    { id: 9, name: "Léona Mendy", score: 11, mastery: false, desk: 9 },
    { id: 10, name: "Karim Sow", score: 16, mastery: true, desk: 10 },
    { id: 11, name: "Diana Gaye", score: 6, mastery: false, desk: 11 },
    { id: 12, name: "Amadou Bocoum", score: 14, mastery: true, desk: 12 }
];

// Variables globales
let synthesisActive = false;
let currentUtterance = null;
const synth = window.speechSynthesis;
let recognition;

// Fonctions principales
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
            <div class="student-score">${student.score}/20</div>
        `;
        desk.onclick = () => showStudentDetails(student.id);
        container.appendChild(desk);
    });
}

function showStudentDetails(studentId) {
    const student = studentsDatabase.find(s => s.id === studentId);
    if (!student) return;
    // Utilise un modal au lieu d'alert
    alert(`Élèves: ${student.name}\nNote: ${student.score}/20\nStatut: ${student.mastery ? 'Maîtrise' : 'Soutien'}`);
}

function updateKPISummary() {
    const total = studentsDatabase.length;
    const avgScore = (studentsDatabase.reduce((sum, s) => sum + s.score, 0) / total).toFixed(1);
    const masteryCount = studentsDatabase.filter(s => s.mastery).length;
    const supportCount = total - masteryCount;
    document.getElementById('kpi-total-students').textContent = `${total} Élèves suivis`;
    document.getElementById('kpi-avg-score').textContent = `${avgScore} / 20`;
    document.getElementById('kpi-mastery-count').textContent = `${masteryCount} Élèves (≥12)`;
    document.getElementById('kpi-support-count').textContent = `${supportCount} Élèves (<12)`;
}

function activateSynthesisAI() {
    if (!synth) {
        alert("La synthèse vocale n'est pas supportée par ce navigateur.");
        return;
    }
    synthesisActive = true;
    updateVoiceStatus('active');
    speakText("Assistant pédagogique activé. Je suis prêt à aider la classe de CE2-A.");
    if (recognition) recognition.start();
}

function speakText(text) {
    if (!synthesisActive || !synth) return;
    if (currentUtterance) {
        synth.cancel();
    }
    currentUtterance = new SpeechSynthesisUtterance(text);
    currentUtterance.lang = 'fr-FR';
    currentUtterance.rate = 0.9;
    currentUtterance.pitch = 1.1;
    synth.speak(currentUtterance);
}

function updateVoiceStatus(status) {
    const badge = document.getElementById('voice-status-badge');
    const dot = document.getElementById('voice-indicator-dot');
    const text = document.getElementById('voice-status-text');
    if (status === 'active') {
        badge.classList.add('active');
        dot.classList.add('active');
        text.textContent = 'Synthèse vocale active';
    } else {
        badge.classList.remove('active');
        dot.classList.remove('active');
        text.textContent = 'Synthèse vocale en attente';
    }
}

// Reconnaissance vocale
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
        // Reconnaissance terminée, on peut la relancer
        recognition.start();
    };
}

// Fonction pour gérer les commandes vocales
function handleCommand(command) {
    if (command.includes('bonjour') || command.includes('salut')) {
        speakText("Bonjour ! Bienvenue sur l'Assistant Pédagogique de la classe CE2-A.");
    } else if (command.includes('présente-toi') || command.includes('qui es-tu')) {
        presentSelf();
    } else if (command.includes('élèves') || command.includes('liste des élèves')) {
        listStudents();
    } else {
        speakText("Je n'ai pas compris. Pouvez-vous répéter ?");
    }
}

// Fonction pour présenter l'assistant
function presentSelf() {
    const presentation = "Bonjour ! Je suis l'Assistant Pédagogique de la classe CE2-A. " +
                         "Mes atouts sont : la synthèse vocale pour aider les élèves, " +
                         "la gestion des notes et le suivi des progrès. " +
                         "Je suis là pour vous aider et vous guider !";
    speakText(presentation);
}

// Fonction pour lister les élèves
function listStudents() {
    const names = studentsDatabase.map(s => s.name).join(', ');
    speakText("Les élèves de la classe sont : " + names);
}

// Initialisation
window.addEventListener('DOMContentLoaded', () => {
    renderClassroomDesks();
    updateKPISummary();
    // Ajout d'un écouteur pour les erreurs de synthèse vocale
    if (synth) {
        synth.onerror = (event) => {
            console.error("Erreur de synthèse vocale :", event);
            updateVoiceStatus('inactive');
        };
    }
});
