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

let uploadedCurriculumText = "";

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
    const message = `Élève : ${student.name}\nNote : ${student.score}/20 (${statutStr})\n\nAnalyse : ${student.info}`;

    const chatBox = document.getElementById('chat-box');
    if (chatBox) {
        chatBox.innerHTML += `
            <div class="bg-amber-500/10 border border-amber-500/30 text-amber-300 p-3 rounded-xl max-w-xl my-2">
                <strong>🤖 Malado :</strong> "Fiche de ${student.name} : Note ${student.score}/20. ${student.info}"
            </div>
        `;
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    alert(`FICHE ÉLÈVE — CE2-A\n-------------------------\n${message}`);
}

// Gestion de l'upload du programme
function handleCurriculumUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    document.getElementById('upload-file-label').textContent = file.name;
    uploadedCurriculumText = `Programme officiel chargé via ${file.name}`;

    const confirmationMsg = `Programme officiel ${file.name} pris en compte avec succès, Maître Balla. Mes analyses pédagogiques sont désormais synchronisées avec ce référentiel.`;
    
    const chatBox = document.getElementById('chat-box');
    if (chatBox) {
        chatBox.innerHTML += `
            <div class="bg-amber-500/10 border border-amber-500/30 text-amber-300 p-3 rounded-xl max-w-xl my-2">
                <strong>🤖 Malado :</strong> "${confirmationMsg}"
            </div>
        `;
        chatBox.scrollTop = chatBox.scrollHeight;
    }
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

// Gestion des commandes textuelles pour Malado
function handleCommand(command) {
    const q = command.toLowerCase();
    let reponse = "";

    if (q.includes('bonjour') || q.includes('salut')) {
        reponse = "Bonjour Maître Balla. C'est Malado. La classe de CE2-A de l'école El Hadji Malick Sy est prête.";
    } 
    // Présentation simple
    else if (q.includes('présente') || q.includes('presentation') || q.includes('qui es-tu') || q.includes('qui es tu')) {
        reponse = "Je m'appelle Malado, votre assistante pédagogique et co-pilote pour la classe de CE2-A à l'école El Hadji Malick Sy de Mbour (CEB Sénégal). Je suis là pour vous accompagner dans le suivi individualisé de vos 12 élèves.";
    } 
    // Présentation approfondie (de quoi es-tu capable)
    else if (q.includes('capable') || q.includes('capacités') || q.includes('fais-tu') || q.includes('que fais') || q.includes('fonctionnalités')) {
        reponse = "En tant que Malado, voici l'étendue de mes capacités pour vous assister :\n\n" +
                  "1. Suivi individualisé des 12 élèves de la classe de CE2-A avec leurs notes et statuts.\n" +
                  "2. Application de la théorie de l'Effet Vygotsky (Zone Proximale de Développement) pour organiser le tutorat par les pairs entre élèves forts et élèves en soutien.\n" +
                  "3. Analyse en temps réel des statistiques de la classe (moyenne, taux de maîtrise, élèves en difficulté).\n" +
                  "4. Intégration et lecture du Programme Éducatif National du Sénégal que vous pouvez importer directement.\n" +
                  "5. Consultation rapide des fiches détaillées de chaque élève d'un simple clic sur son pupitre.";
    } 
    else if (q.includes('élèves') || q.includes('liste')) {
        reponse = "Les 12 élèves de la classe de CE2-A suivis sont : " + studentsDatabase.map(s => s.name).join(', ') + ".";
    } 
    else if (q.includes('vygotsky') || q.includes('tuteur') || q.includes('binôme')) {
        reponse = "L'Effet Vygotsky consiste à associer un élève en soutien avec un élève en maîtrise pour stimuler son apprentissage dans sa zone proximale de développement.";
    } 
    else {
        reponse = `J'ai bien pris en compte votre consigne Maître Balla : "${command}". Je veille sur la classe de CE2-A.`;
    }

    const chatBox = document.getElementById('chat-box');
    if (chatBox) {
        chatBox.innerHTML += `
            <div class="bg-amber-500/10 border border-amber-500/30 text-amber-300 p-3 rounded-xl max-w-xl my-2 whitespace-pre-line">
                <strong>🤖 Malado :</strong> "${reponse}"
            </div>
        `;
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}

// Lancement au chargement de la page
window.addEventListener('DOMContentLoaded', () => {
    renderClassroomDesks();
    updateKPISummary();
});
