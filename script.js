// RENDU VISUEL IMMERSIF 3D (3 Rangées verticales, 3 pupitres doubles en profondeur)
function renderClassroomDesks() {
    const container = document.getElementById('classroom-container');
    if (!container) return;
    container.innerHTML = '';

    // Conteneur de scène 3D globale
    const sceneWrapper = document.createElement('div');
    sceneWrapper.className = 'classroom-scene-container w-full max-w-7xl mx-auto space-y-8';

    // Tableau noir du maître en haut de la scène
    let blackboard = document.createElement('div');
    blackboard.className = 'blackboard-3d max-w-4xl mx-auto p-4 text-center';
    blackboard.innerHTML = `
        <h2 class="font-chalk text-2xl text-emerald-300 tracking-wider">🏫 SALLE DE CLASSE CE2-A — ÉCOLE EL HADJI MALICK SY</h2>
        <p class="font-chalk text-xs text-emerald-400/80 mt-1">Inspection de l'Éducation et de la Formation (IEP) de Mbour • Maître Balla</p>
    `;
    sceneWrapper.appendChild(blackboard);

    // Grille 3D des 3 rangées verticales
    const gridWrapper = document.createElement('div');
    gridWrapper.className = 'grid grid-cols-1 md:grid-cols-3 gap-8 w-full row-depth-effect pt-4';

    for (let col = 1; col <= 3; col++) {
        let colDiv = document.createElement('div');
        colDiv.className = 'bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 shadow-2xl flex flex-col gap-6 backdrop-blur-sm';
        
        let colTitle = document.createElement('div');
        colTitle.className = 'text-center text-xs font-bold text-amber-400 uppercase tracking-widest border-b border-slate-700/60 pb-2';
        colTitle.innerHTML = `📌 Rangée ${col === 1 ? 'Gauche' : col === 2 ? 'du Milieu' : 'Droite'}<br><span class="text-[10px] text-slate-400 font-normal">3 Pupitres Doubles (Profondeur)</span>`;
        colDiv.appendChild(colTitle);

        let desksListDiv = document.createElement('div');
        desksListDiv.className = 'space-y-6';

        // 3 pupitres doubles en profondeur pour chaque rangée
        for (let depth = 1; depth <= 3; depth++) {
            let studentsAtDesk = studentsDatabase.filter(s => (s.column || 1) === col && (s.depth || 1) === depth);
            
            let deskCard = document.createElement('div');
            deskCard.className = 'desk-3d-card p-3 flex flex-col justify-between shadow-xl';
            
            let deskHeader = document.createElement('div');
            deskHeader.className = 'flex justify-between items-center text-[10px] text-slate-900 font-bold mb-2 border-b border-stone-500/40 pb-1';
            deskHeader.innerHTML = `<span>🪑 Pupitre Double #${depth}</span> <span class="text-amber-900">Rang ${depth}/3</span>`;
            deskCard.appendChild(deskHeader);

            let seatsGrid = document.createElement('div');
            seatsGrid.className = 'grid grid-cols-2 gap-3 relative z-10';

            // 2 places par pupitre
            for (let seatIndex = 1; seatIndex <= 2; seatIndex++) {
                let student = studentsAtDesk[seatIndex - 1];
                let seatBox = document.createElement('div');

                if (student) {
                    seatBox.className = `p-2 rounded-lg cursor-pointer transition-all border text-left flex flex-col justify-between shadow ${
                        student.mastery 
                        ? 'bg-emerald-950/90 border-emerald-500/80 text-emerald-100 hover:bg-emerald-900' 
                        : 'bg-amber-950/90 border-amber-500/80 text-amber-100 hover:bg-amber-900'
                    }`;
                    seatBox.innerHTML = `
                        <div class="flex items-center gap-2">
                            <img src="${student.photo}" class="w-7 h-7 rounded-full object-cover border border-amber-400 shadow" alt="${student.name}">
                            <div class="truncate">
                                <div class="font-bold text-xs truncate">${student.name}</div>
                                <div class="text-[9px] text-slate-300">${student.score}/20</div>
                            </div>
                        </div>
                        <div class="text-[9px] text-right mt-1 font-semibold ${student.mastery ? 'text-emerald-400' : 'text-amber-400'}">
                            ${student.mastery ? '● Maîtrise' : '● Soutien'}
                        </div>
                    `;
                    seatBox.onclick = () => showStudentDetails(student.id);
                } else {
                    seatBox.className = 'p-2 rounded-lg border border-dashed border-stone-600 bg-stone-900/40 text-stone-400 text-[10px] text-center flex items-center justify-center';
                    seatBox.innerHTML = `<span>Place libre</span>`;
                }
                seatsGrid.appendChild(seatBox);
            }

            deskCard.appendChild(seatsGrid);

            // Casier sous le plateau
            let shelf = document.createElement('div');
            shelf.className = 'desk-shelf-3d mt-2';
            deskCard.appendChild(shelf);

            // Chaises sous le pupitre
            let chairsRow = document.createElement('div');
            chairsRow.className = 'flex justify-around mt-2';
            for (let c = 0; c < 2; c++) {
                let chair = document.createElement('div');
                chair.className = 'chair-3d w-10 h-4 rounded-t-sm shadow flex items-center justify-center text-[8px]';
                chair.innerText = '🪑';
                chairsRow.appendChild(chair);
            }
            deskCard.appendChild(chairsRow);

            desksListDiv.appendChild(deskCard);
        }

        colDiv.appendChild(desksListDiv);
        gridWrapper.appendChild(colDiv);
    }

    sceneWrapper.appendChild(gridWrapper);
    container.appendChild(sceneWrapper);
}
