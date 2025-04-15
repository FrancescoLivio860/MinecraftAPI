async function loadPlayer(identifier) {
    try {
        const isUuid = identifier.length === 32 || identifier.length === 36;
        let uuid, username;

        // Determina se l'input è un UUID o un nome utente
        if (isUuid) {
            uuid = identifier.replace(/-/g, '');
            const nameResponse = await fetch(`https://api.mojang.com/user/profile/${uuid}`);
            if (!nameResponse.ok) {
                throw new Error('Giocatore non trovato con questo UUID!');
            }
            const data = await nameResponse.json();
            username = data.name;
        } else {
            const uuidResponse = await fetch(`https://api.mojang.com/users/profiles/minecraft/${identifier}`);
            if (!uuidResponse.ok) {
                throw new Error('Giocatore non trovato con questo username!');
            }
            const data = await uuidResponse.json();
            uuid = data.id;
            username = data.name;
        }

        if (!uuid) throw new Error('Impossibile ottenere i dati del giocatore');

        // Aggiorna le informazioni del giocatore e carica i dati della skin
        currentUuid = uuid;
        updatePlayerInfo(username, uuid);
        loadSkinData(uuid);
        loadSkinHistory(uuid);
    } catch (error) {
        // Mostra una notifica d'errore e stampa nel console log
        showNotification(`Errore: ${error.message}`, true);
        console.error('Errore durante il caricamento del giocatore:', error);
    }
}

// Aggiungi un'immagine di fallback per il mantello
document.getElementById('cape-img').onerror = function () {
    this.src = 'path/to/your/fallback-image.png'; // Sostituisci con il percorso dell'immagine di fallback
};