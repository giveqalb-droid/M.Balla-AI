// Fonction pour la synthèse vocale HD (Google TTS + Secours Navigateur)
function speakText(text) {
    if (!text) return;
    
    // Arrêter tout son en cours
    if (window.currentAudio) {
        window.currentAudio.pause();
    }

    // Encoder le texte pour l'URL Google TTS
    const encodedText = encodeURIComponent(text);
    const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedText}&tl=fr&client=tw-ob`;

    const audio = new Audio(audioUrl);
    window.currentAudio = audio;

    // Lecture audio HD Google
    audio.play().catch(err => {
        console.warn("Connexion lente, bascule sur la voix locale du navigateur...", err);
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'fr-FR';
            utterance.rate = 0.95;
            window.speechSynthesis.speak(utterance);
        }
    });
}

// Fonction de synthèse vocale pour un élève
function speakStudent(name, grade, status, rem) {
    const msg = `Élève ${name}. Moyenne : ${grade} sur 20. Statut : ${status}. Conseil : ${rem}.`;
    speakText(msg);
}

// Fonction de Reconnaissance Vocale (Microphone)
function startVoiceRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert("La reconnaissance vocale n'est pas supportée par votre navigateur. Utilisez Google Chrome.");
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'fr-FR';
    recognition.interimResults = false;

    const btn = document.getElementById('micBtn');
    const alertBox = document.getElementById('voiceAlert');
    const transcriptText = document.getElementById('transcriptText');
    const aiResponseText = document.getElementById('aiResponseText');

    recognition.onstart = () => {
        if (btn) {
            btn.classList.add('bg-rose-600', 'text-white', 'animate-pulse');
            btn.innerText = "🎙️ Écoute...";
        }
        if (alertBox) alertBox.classList.remove('hidden');
    };

    recognition.onend = () => {
        if (btn) {
            btn.classList.remove('bg-rose-600', 'text-white', 'animate-pulse');
            btn.innerText = "🎤 Parler à l'Assistant";
        }
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcriptText) transcriptText.innerHTML = `<strong>Vous avez dit :</strong> "${transcript}"`;
        
        const response = `J'ai bien reçu votre demande concernant "${transcript}". Le moteur prédictif analyse la classe pour y répondre.`;
        if (aiResponseText) aiResponseText.innerHTML = `<strong>Réponse Vocale :</strong> ${response}`;
        
        speakText(response);
    };

    recognition.start();
}
