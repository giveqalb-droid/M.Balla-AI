// BASE DES 18 ÉLÈVES DU CE2-A
const students = [
    { id: 1, name: "Awa Diop", score: 14, mastery: true, col: 1, depth: 1, subjects: { math: 15, french: 14, dictation: 13 }, history: [12, 13, 14, 14], photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150", info: "Très rigoureuse et attentive.", personality: "Profil analytique et calme.", logbook: ["Excellente participation aux travaux de groupes."] },
    { id: 2, name: "Oumar Sarr", score: 9, mastery: false, col: 1, depth: 1, subjects: { math: 7, french: 10, dictation: 10 }, history: [8, 8, 9, 9], photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150", info: "Aide requise en numération.", personality: "Apprenant visuel et dynamique.", logbook: ["Besoin d'encadrement sur les exercices individuels.", "Distrait lorsque l'exercice est long."] },
    { id: 3, name: "Fatou Ndiaye", score: 12, mastery: true, col: 1, depth: 2, subjects: { math: 11, french: 14, dictation: 12 }, history: [10, 11, 12, 12], photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150", info: "Aisance en lecture et grammaire.", personality: "Sociable et expressive.", logbook: ["Bonne intégration au groupe."] },
    { id: 4, name: "Moussa Fall", score: 7, mastery: false, col: 1, depth: 2, subjects: { math: 6, french: 8, dictation: 7 }, history: [6, 6, 7, 7], photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150", info: "Soutien prioritaire en lecture.", personality: "Kinesthésique.", logbook: ["Déconcentré en fin de matinée."] },
    { id: 5, name: "Aïcha Mbaye", score: 15, mastery: true, col: 1, depth: 3, subjects: { math: 14, french: 16, dictation: 15 }, history: [14, 14, 15, 15], photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150", info: "Excellente expression écrite.", personality: "Créative et autonomie élevée.", logbook: ["Aide volontiers ses camarades.", "Très active."] },
    { id: 6, name: "Ibrahima Traoré", score: 10, mastery: false, col: 1, depth: 3, subjects: { math: 10, french: 10, dictation: 10 }, history: [9, 9, 10, 10], photo: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150", info: "Niveau moyen, constant.", personality: "Réservé.", logbook: ["Progrès réguliers."] },
    { id: 7, name: "Mariama Camara", score: 13, mastery: true, col: 2, depth: 1, subjects: { math: 14, french: 12, dictation: 13 }, history: [12, 12, 13, 13], photo: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150", info: "Très bien organisée.", personality: "Méthodique.", logbook: ["Travail propre et bien tenu.", "Très organisée."] },
    { id: 8, name: "Cheikh Diallo", score: 8, mastery: false, col: 2, depth: 1, subjects: { math: 8, french: 9, dictation: 7 }, history: [7, 7, 8, 8], photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150", info: "Difficultés en résolution.", personality: "Réfléchi.", logbook: ["Prend du temps pour démarrer."] },
    { id: 9, name: "Léona Mendy", score: 11, mastery: false, col: 2, depth: 2, subjects: { math: 11, french: 11, dictation: 11 }, history: [10, 10, 11, 11], photo: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150", info: "En voie d'acquisition.", personality: "Observatrice.", logbook: ["Bonne écoute.", "Lente à exécuter."] },
    { id: 10, name: "Karim Sow", score: 16, mastery: true, col: 2, depth: 2, subjects: { math: 17, french: 15, dictation: 16 }, history: [15, 15, 16, 16], photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150", info: "Leader logique de la classe.", personality: "Compétitif et enthousiaste.", logbook: ["Excellente rapidité d'assimilation.", "Leader naturel."] },
    { id: 11, name: "Diana Gaye", score: 6, mastery: false, col: 2, depth: 3, subjects: { math: 5, french: 7, dictation: 6 }, history: [5, 5, 6, 6], photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150", info: "Besoin de soutien rapproché.", personality: "Sensible et appliquée.", logbook: ["Encouragements fréquents requis.", "Fatigue matinale."] },
    { id: 12, name: "Amadou Bocoum", score: 14, mastery: true, col: 2, depth: 3, subjects: { math: 13, french: 14, dictation: 15 }, history: [13, 13, 14, 14], photo: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150", info: "Solide en orthographe.", personality: "Calme et coopératif.", logbook: ["Prêt pour le rôle de tuteur.", "Entraide naturelle."] },
    { id: 13, name: "Seynabou Ba", score: 15, mastery: true, col: 3, depth: 1, subjects: { math: 15, french: 15, dictation: 14 }, history: [13, 14, 15, 15], photo: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150", info: "Excellente élève globale.", personality: "Application constante.", logbook: ["Présentation irréprochable."] },
    { id: 14, name: "Pape Diop", score: 10, mastery: false, col: 3, depth: 1, subjects: { math: 10, french: 10, dictation: 10 }, history: [9, 9, 10, 10], logbook: ["Écoute régulière."], personality: "Calme.", info: "Moyenne stable." },
    { id: 15, name: "Aminata Sow", score: 13, mastery: true, col: 3, depth: 2, subjects: { math: 13, french: 13, dictation: 12 }, history: [11, 12, 13, 13], photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150", info: "Bonne autonomie.", personality: "Dynamique.", logbook: ["Participe bien à l'oral."] },
    { id: 16, name: "Modou Ndiaye", score: 8, mastery: false, col: 3, depth: 2, subjects: { math: 8, french: 8, dictation: 8 }, history: [7, 7, 8, 8], logbook: ["Besoin de soutien en français."], personality: "Réservé.", info: "Travaille bien en binôme." },
    { id: 17, name: "Khady Fall", score: 14, mastery: true, col: 3, depth: 3, subjects: { math: 14, french: 14, dictation: 14 }, history: [12, 13, 14, 14], photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150", info: "Très rigoureuse.", personality: "Attentive.", logbook: ["Résultats constants."] },
    { id: 18, name: "Babacar Sarr", score: 11, mastery: false, col: 3, depth: 3, subjects: { math: 11, french: 11, dictation: 11 }, history: [10, 10, 11, 11], logbook: ["Progresse bien."], personality: "Attentif.", info: "En progression." }
];

let synth = window.speechSynthesis;
let isVoiceMode = true;

function render3DClassroom() {
    for (let col = 1; col <= 3; col++) {
        const rowContainer = document.getElementById(`row-${col}`);
        if (!rowContainer) continue;
        rowContainer.innerHTML = '';

        for (let depth = 1; depth <= 3; depth++) {
            const pupils = students.filter(s => s.col === col && s.depth === depth);

            const deskBlock = document.createElement('div');
            deskBlock.className = 'relative w-full space-y-2';

            const deskBody = document.createElement('div');
            deskBody.className = 'desk-3d-box rounded-xl p-3 relative z-30 shadow-2xl border-2 border-[#3e2723]';
            
            deskBody.innerHTML = `
                <div class="flex justify-between items-center text-[10px] text-[#2c1d11] font-extrabold mb-1.5 border-b border-[#3e2723]/20 pb-1">
                    <span>🪵 PUPITRE DOUBLE N°${depth} (Rangée ${col})</span>
                    <span class="groove-pencil w-16 inline-block"></span>
                </div>
                
                <div class="grid grid-cols-2 gap-3 relative z-40">
                    ${[1, 2].map(seatIdx => {
                        const st = pupils[seatIdx - 1];
                        if (st) {
                            return `
                                <div onclick="openStudentModal(${st.id})" class="p-2 rounded-lg cursor-pointer transition-all border shadow-lg flex items-center gap-2.5 ${st.mastery ? 'bg-emerald-950/90 border-emerald-500 hover:bg-emerald-900' : 'bg-amber-950/90 border-amber-500 hover:bg-amber-900'}">
                                    <img src="${st.photo}" class="w-8 h-8 rounded-full object-cover border border-amber-400 shadow" alt="${st.name}">
                                    <div class="truncate">
                                        <div class="font-extrabold text-xs text-white truncate">${st.name}</div>
                                        <div class="text-[10px] ${st.mastery ? 'text-emerald-300' : 'text-amber-300'} font-bold">${st.score}/20 • ${st.mastery ? 'Acquis' : 'Soutien'}</div>
                                    </div>
                                </div>
                            `;
                        } else {
                            return `<div class="p-2 rounded-lg border border-dashed border-slate-700 bg-slate-900/50 text-[10px] text-slate-500 text-center flex items-center justify-center">Place libre</div>`;
                        }
                    }).join('')}
                </div>

                <div class="mt-2 h-2.5 bg-[#2c1d11] rounded-md shadow-inner border-t border-black/50"></div>
            `;

            const chairsContainer = document.createElement('div');
            chairsContainer.className = 'grid grid-cols-2 gap-4 pt-1 relative z-10';

            for (let c = 0; c < 2; c++) {
                const chair3D = document.createElement('div');
                chair3D.className = 'chair-3d-wrapper';
                
                chair3D.innerHTML = `
                    <div class="chair-shadow"></div>
                    <div class="chair-leg leg-fl"></div>
                    <div class="chair-leg leg-fr"></div>
                    <div class="chair-leg leg-bl"></div>
                    <div class="chair-leg leg-br"></div>
                    <div class="chair-crossbar"></div>
                    <div class="chair-back-posts">
                        <div class="post-left"></div>
                        <div class="post-right"></div>
                        <div class="chair-backrest-3d"></div>
                    </div>
                    <div class="chair-seat-3d">
                        <div class="chair-seat-edge"></div>
                    </div>
                `;
                chairsContainer.appendChild(chair3D);
            }

            deskBlock.appendChild(deskBody);
            deskBlock.appendChild(chairsContainer);
            rowContainer.appendChild(deskBlock);
        }
    }
}

function speak(text) {
    if (!synth) return;
    synth.cancel();
    const cleanText = text.replace(/[*_#]/g, '');
    const ut = new SpeechSynthesisUtterance(cleanText);
    ut.lang = 'fr-FR';
    ut.rate = 1.0;
    synth.speak(ut);
}

function uploadCurriculum(e) {
    const file = e.target.files[0];
    if (!file) return;
    document.getElementById('curriculum-filename').textContent = file.name;
    document.getElementById('curriculum-status').classList.remove('hidden');
    speak(`Le programme officiel ${file.name} a été importé. Malado s'y réfère désormais.`);
}

// ANALYSE COMPORTEMENTALE GLOBALE DE LA CLASSE
function triggerBehavioralAnalysis() {
    synth.cancel();
    
    let totalLogEntries = 0;
    let attentionAlerts = 0;
    let leadershipCount = 0;
    let peerSupportCount = 0;

    students.forEach(student => {
        if (student.logbook) {
            totalLogEntries += student.logbook.length;
            student.logbook.forEach(log => {
                let l = log.toLowerCase();
                if (l.includes('fatigue') || l.includes('distrait') || l.includes('lent') || l.includes('déconcentré')) attentionAlerts++;
                if (l.includes('leader') || l.includes('active') || l.includes('organisée') || l.includes('excellente')) leadershipCount++;
                if (l.includes('aide') || l.includes('entraide') || l.includes('tuteur') || l.includes('volontiers')) peerSupportCount++;
            });
        }
    });

    let analysisReport = `🧠 **Rapport d'Analyse Comportementale Globale — CE2-A (École Aql al Kamil)**\n\n` +
        `📊 **Indicateurs clés issus de vos observations** :\n` +
        `• Total des observations consignées : ${totalLogEntries}\n` +
        `• Signes de fatigue / baisse d'attention : ${attentionAlerts} élève(s)\n` +
        `• Pôles de leadership et d'initiative : ${leadershipCount} élève(s)\n` +
        `• Dynamiques d'entraide spontanée : ${peerSupportCount} élève(s)\n\n` +
        `💡 **Recommandations psychopédagogiques (Cadres de Piaget & Vygotsky)** :\n` +
        `1. **Gestion de l'attention** : La présence de signes de fatigue matinale chez certains élèves confirme l'intérêt d'alterner les phases de conceptualisation (en début de matinée) et les exercices pratiques.\n` +
        `2. **Étayage par les pairs** : Capitalisez sur les ${peerSupportCount} situations d'entraide pour formaliser des binômes de tutorat en numération.\n` +
        `3. **Climat de classe** : Les observations montrent un bon équilibre relationnel. Maintenez les renforcements positifs pour encourager les élèves les plus réservés.`;

    const chatBox = document.getElementById('chat-box');
    if (chatBox) {
        chatBox.innerHTML += `<div class="bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 p-4 rounded-2xl max-w-2xl my-3 whitespace-pre-line text-xs shadow-xl"><strong>🤖 Analyse Malado :</strong>\n\n${analysisReport}</div>`;
        chatBox.scrollTop = chatBox.scrollHeight;
    }
    speak("Voici le rapport d'analyse comportementale globale de votre classe.");
}

function openStudentModal(id) {
    synth.cancel();
    const st = students.find(s => s.id === id);
    if (!st) return;

    const modalHtml = `
        <div id="student-modal" class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div class="bg-slate-900 border border-amber-500/40 rounded-3xl max-w-2xl w-full p-6 text-white shadow-2xl relative animate-modal max-h-[90vh] overflow-y-auto">
                <button onclick="closeModal()" class="absolute top-4 right-4 text-slate-400 hover:text-white text-2xl font-bold">&times;</button>

                <div class="flex items-center gap-4 mb-5 border-b border-slate-800 pb-4">
                    <img src="${st.photo}" class="w-16 h-16 rounded-full object-cover border-2 border-amber-400 shadow-md" alt="${st.name}">
                    <div>
                        <h3 class="text-xl font-extrabold text-amber-400">${st.name}</h3>
                        <p class="text-xs text-slate-400">Rangée ${st.col} • Pupitre Profondeur n°${st.depth} • École Aql al Kamil</p>
                        <span class="inline-block mt-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full ${st.mastery ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}">
                            ${st.mastery ? '● Niveau Solide (Tuteur potentiel)' : '● Accompagnement Requis (ZPD)'}
                        </span>
                    </div>
                </div>

                <!-- ONGLETS -->
                <div class="flex border-b border-slate-800 mb-5">
                    <button onclick="toggleTab('tab-notes')" id="btn-notes" class="px-4 py-2 text-xs font-bold text-amber-400 border-b-2 border-amber-400">Notes & Évolution</button>
                    <button onclick="toggleTab('tab-log')" id="btn-log" class="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white">📋 Observations & Personnalité</button>
                </div>

                <!-- CONTENU 1 : NOTES -->
                <div id="tab-notes" class="space-y-4">
                    <div class="grid grid-cols-3 gap-3 text-center">
                        <div class="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
                            <span class="text-[10px] text-slate-400 block">Mathématiques</span>
                            <span class="text-lg font-black text-amber-400">${st.subjects.math}/20</span>
                        </div>
                        <div class="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
                            <span class="text-[10px] text-slate-400 block">Français</span>
                            <span class="text-lg font-black text-amber-400">${st.subjects.french}/20</span>
                        </div>
                        <div class="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
                            <span class="text-[10px] text-slate-400 block">Dictée</span>
                            <span class="text-lg font-black text-amber-400">${st.subjects.dictation}/20</span>
                        </div>
                    </div>

                    <div class="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                        <h4 class="text-xs font-bold text-amber-400 mb-3">📈 Progression Mensuelle (4 Vendredis)</h4>
                        <div class="flex items-end justify-between h-28 pt-4 px-2 gap-3">
                            ${st.history.map((h, idx) => `
                                <div class="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                                    <span class="text-[10px] text-amber-400 font-bold">${h}</span>
                                    <div class="w-full bg-amber-500 rounded-t-md" style="height: ${(h/20)*100}%;"></div>
                                    <span class="text-[9px] text-slate-500">V${idx+1}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-xs text-amber-200">
                        <strong>🤖 Diagnostic de Malado AI :</strong> "${st.mastery ? 'Élève performant. Idéal pour être jumelé avec un camarade en soutien.' : 'Présente une marge de progression rapide via le tutorat Vygotsky.'}"
                    </div>
                </div>

                <!-- CONTENU 2 : OBSERVATIONS -->
                <div id="tab-log" class="space-y-4 hidden">
                    <div class="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                        <h4 class="text-xs font-bold text-emerald-400 mb-1">🧠 Profil psychopédagogique</h4>
                        <p class="text-xs text-slate-300 italic">${st.personality}</p>
                    </div>

                    <div class="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                        <h4 class="text-xs font-bold text-amber-400">📋 Observations & Remarques du Maître</h4>
                        <ul id="log-list" class="list-disc list-inside text-xs text-slate-300 space-y-1">
                            ${st.logbook.map(l => `<li>${l}</li>`).join('')}
                        </ul>
                        <div class="flex gap-2 pt-2">
                            <input type="text" id="new-log-item" placeholder="Ajouter une observation..." class="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white">
                            <button onclick="addLogEntry(${st.id})" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs">Ajouter</button>
                        </div>
                    </div>
                </div>

                <!-- FOOTER ACTIONS -->
                <div class="flex justify-between items-center border-t border-slate-800 pt-4 mt-6">
                    <button onclick="printBulletin(${st.id})" class="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold rounded-xl flex items-center gap-2 shadow-lg">
                        <i class="fa-solid fa-print"></i>
                        <span>Imprimer Bulletin Officiel</span>
                    </button>
                    <button onclick="closeModal()" class="px-4 py-2.5 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl">Fermer</button>
                </div>

            </div>
        </div>
    `;

    const prev = document.getElementById('student-modal');
    if (prev) prev.remove();
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function toggleTab(tabId) {
    document.getElementById('tab-notes').classList.add('hidden');
    document.getElementById('tab-log').classList.add('hidden');
    document.getElementById('btn-notes').className = 'px-4 py-2 text-xs font-bold text-slate-400 hover:text-white';
    document.getElementById('btn-log').className = 'px-4 py-2 text-xs font-bold text-slate-400 hover:text-white';

    document.getElementById(tabId).classList.remove('hidden');
    if (tabId === 'tab-notes') {
        document.getElementById('btn-notes').className = 'px-4 py-2 text-xs font-bold text-amber-400 border-b-2 border-amber-400';
    } else {
        document.getElementById('btn-log').className = 'px-4 py-2 text-xs font-bold text-emerald-400 border-b-2 border-emerald-400';
    }
}

function closeModal() {
    const m = document.getElementById('student-modal');
    if (m) m.remove();
}

function addLogEntry(id) {
    const input = document.getElementById('new-log-item');
    if (!input || !input.value.trim()) return;
    const st = students.find(s => s.id === id);
    if (st) {
        st.logbook.push(input.value.trim());
        openStudentModal(id);
        toggleTab('tab-log');
    }
}

function printBulletin(id) {
    const st = students.find(s => s.id === id);
    if (!st) return;

    const win = window.open('', '_blank');
    win.document.write(`
        <html>
        <head>
            <title>Bulletin - ${st.name}</title>
            <style>
                body { font-family: sans-serif; padding: 30px; color: #111; }
                .header { text-align: center; border-bottom: 2px solid #222; padding-bottom: 15px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #666; padding: 10px; text-align: left; }
                th { background: #eee; }
                .box { border: 1px solid #aaa; padding: 12px; margin-top: 15px; border-radius: 6px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h2>ÉCOLE AQL AL KAMIL — LE SOMMET DU SAVOIR</h2>
                <p>Bulletin d'Évaluation Mensuelle — Classe de CE2-A (Maître Balla)</p>
            </div>
            <h3>Élève : ${st.name}</h3>
            <p>Moyenne Générale : <strong>${st.score} / 20</strong> — Statut : ${st.mastery ? 'Acquis' : 'Soutien'}</p>
            
            <table>
                <tr><th>Discipline</th><th>Note / 20</th><th>Appréciation</th></tr>
                <tr><td>Mathématiques</td><td>${st.subjects.math}</td><td>${st.subjects.math >= 10 ? 'Satisfaisant' : 'Aide requise'}</td></tr>
                <tr><td>Français</td><td>${st.subjects.french}</td><td>${st.subjects.french >= 10 ? 'Bon niveau' : 'Soutien recommandé'}</td></tr>
                <tr><td>Dictée</td><td>${st.subjects.dictation}</td><td>${st.subjects.dictation >= 10 ? 'Acquis' : 'À renforcer'}</td></tr>
            </table>

            <div class="box">
                <strong>✍️ Observations du Maître Balla :</strong><br>
                ${st.info}
            </div>

            <div class="box" style="background:#fafafa;">
                <strong>🤖 Recommandation Pédagogique (Malado AI) :</strong><br>
                ${st.personality}
            </div>

            <script>window.print();<\/script>
        </body>
        </html>
    `);
    win.document.close();
}

function sendTeacherMessage() {
    const input = document.getElementById('teacher-input');
    if (!input || !input.value.trim()) return;
    const query = input.value.trim();
    input.value = '';

    const chat = document.getElementById('chat-box');
    chat.innerHTML += `<div class="bg-slate-800 text-white p-3 rounded-2xl ml-auto text-right max-w-lg font-sans"><strong>Maître Balla :</strong> "${query}"</div>`;
    chat.scrollTop = chat.scrollHeight;

    let response = "";
    const q = query.toLowerCase();

    if (q.includes('analyse') || q.includes('comportement') || q.includes('bilan')) {
        triggerBehavioralAnalysis();
        return;
    } else if (q.includes('vygotsky') || q.includes('optimise') || q.includes('place') || q.includes('binome') || q.includes('tuteur')) {
        response = `💡 **Optimisation Vygotsky (Zone Proche de Développement)** :\n\n` +
                   `Maître Balla, pour stimuler la classe CE2-A, je suggère de placer **Oumar Sarr** (note 9) au pupitre 1 avec **Awa Diop** (note 14).\n\n` +
                   `📈 **Prédictions sur 1 Mois** :\n` +
                   `• Semaine 1 : Baisse de l'anxiété en numération.\n` +
                   `• Semaine 2 : Progression d'Oumar estimée à 11.5/20.\n` +
                   `• Semaine 4 : Autonomie acquise sur la résolution de problèmes.`;
    } else if (q.includes('programme') || q.includes('corrige') || q.includes('copie')) {
        response = `📝 Selon le programme officiel d'Aql al Kamil, les objectifs de CE2-A en numération nécessitent une révision des fractions simples. Je recommande un atelier de 15 minutes demain matin.`;
    } else {
        response = `Instruction bien enregistrée pour la classe CE2-A. Dites "Malado, analyse le comportement" ou "Optimise les places selon Vygotsky".`;
    }

    setTimeout(() => {
        chat.innerHTML += `<div class="bg-amber-500/10 border border-amber-500/30 text-amber-300 p-3.5 rounded-2xl max-w-2xl whitespace-pre-line leading-relaxed"><strong>🤖 Malado :</strong>\n${response}</div>`;
        chat.scrollTop = chat.scrollHeight;
        speak(response);
    }, 400);
}

function toggleVoiceMode() {
    isVoiceMode = !isVoiceMode;
    document.getElementById('mode-text').textContent = isVoiceMode ? 'Écoute Vocal Auto ("Malado")' : 'Mode Manuel';
}

function startMic() {
    speak("Je vous écoute Maître Balla.");
}

window.addEventListener('DOMContentLoaded', () => {
    render3DClassroom();
});
