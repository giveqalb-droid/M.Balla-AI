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
let uploadedCurriculumText = "";

function chargerVoix() {
    if (!synth) return;
    voicesList = synth.getVoices();
}

chargerVoix();
if (synth && synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = chargerVoix;
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

// Affichage direct de la Fiche Élève et Vocalisation
function showStudentDetails(studentId) {
    const student = studentsDatabase.find(s => s.id === studentId);
    if (!student) return;

    const statutStr = student.mastery ? 'Maîtrise Acquise' : 'Soutien & Vygotsky';
    const message = `Élève : ${student.name}\nNote : ${student.score}/20 (${statutStr})\n\nAnalyse : ${student.info}`;

    // Affichage dans le Chat Malado
    const chatBox = document.getElementById('chat-box');
    if (chatBox) {
        chatBox.innerHTML += `
            <div class="bg-amber-500/10 border border-amber-500/30 text-amber-300 p-3 rounded-xl max-w-xl my-2">
                <strong>🤖 Malado :</strong> "Fiche de ${student.name} : Note ${student.score}/20. ${student.info}"
            </div>
        `;
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Parole de Malado
    speakText(`Élève ${student.name}. Note de ${student.score} sur 20. ${student.info}`);

    // Pop-up d'affichage simple
    alert(`FICHE ÉLÈVE — CE2-A\n-------------------------\n${message}`);
}

// Gestion de l'upload du programme
function handleCurriculumUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    document.getElementById('upload-file-label').textContent = file.name;

    const confirmationMsg = `Programme officiel ${file.name} chargé avec succès pour la classe de CE2-A de Maître Balla.`;
    
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

function activateSynthesisAI() {
    if (!synth) {
        alert("La synthèse vocale n'est pas supportée par votre navigateur.");
        return;
    }
    updateVoiceStatus('active');
    const introMsg = "Bonjour Maître Balla. C'est Malado, votre co-pédagogue pour la classe de CE2 A à l'école El Hadji Malick Sy de Mbour. Je suis active et prête.";
    speakText(introMsg);
}

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

function updateVoiceStatus(status) {
    const badge = document.getElementById('voice-status-badge');
    const dot = document.getElementById('voice-indicator-dot');
    const text = document.getElementById('voice-status-text');
    if (!badge || !dot || !text) return;

    if (status === 'active') {
        badge.classList.add('active');
        dot.classList.add('active');
        text.textContent = 'Malado Active';
    } else {
        badge.classList.remove('active');
        dot.classList.remove('active');
        text.textContent = 'Synthèse vocale en attente';
    }
}

function handleCommand(command) {
    const q = command.toLowerCase();
    let reponse = "";

    if (q.includes('bonjour') || q.includes('salut')) {
        reponse = "Bonjour Maître Balla. C'est Malado. La classe de CE2 A est prête.";
    } else if (q.includes('présente') || q.includes('presentation') || q.includes('qui es-tu') || q.includes('qui es tu')) {
        reponse = "Je m'appelle Malado, votre assistante pédagogique pour la classe de CE2 A à l'école El Hadji Malick Sy de Mbour. J'analyse les résultats de vos 12 élèves et j'applique la théorie de l'Effet Vygotsky.";
    } else if (q.includes('élèves') || q.includes('liste')) {
        reponse = "Les 12 élèves de la classe suivis par Malado sont : " + studentsDatabase.map(s => s.name).join(', ');
    } else if (q.includes('vygotsky') || q.includes('tuteur') || q.includes('binôme')) {
        reponse = "L'Effet Vygotsky consiste à associer un élève en soutien avec un élève fort pour stimuler son apprentissage dans sa zone proximale de développement.";
    } else {
        reponse = `J'ai bien noté votre consigne Maître Balla : "${command}". Je veille sur la classe.`;
    }

    const chatBox = document.getElementById('chat-box');
    if (chatBox) {
        chatBox.innerHTML += `
            <div class="bg-amber-500/10 border border-amber-500/30 text-amber-300 p-3 rounded-xl max-w-xl my-2">
                <strong>🤖 Malado :</strong> "${reponse}"
            </div>
        `;
        chatBox.scrollTop = chatBox.scrollHeight;
    }
    speakText(reponse);
}

// Lancement au chargement de la page
window.addEventListener('DOMContentLoaded', () => {
    renderClassroomDesks();
    updateKPISummary();
});
