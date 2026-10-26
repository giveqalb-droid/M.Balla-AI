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

function renderClassroomDesks() {
    const container = document.getElementById('classroom-container');
    if (!container) return;
    
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

// Initialisation
window.addEventListener('DOMContentLoaded', () => {
    renderClassroomDesks();
    updateKPISummary();
});
