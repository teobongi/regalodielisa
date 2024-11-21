const gridContainer = document.getElementById('grid-container');
const piecesContainer = document.getElementById('pieces-container');
const completionMessage = document.getElementById('completion-message');
const nextPageButton = document.getElementById('next-page-button');

// URL dell'immagine personalizzabile
const imageUrl = 'londra.jpeg'; // Cambia con l'URL della tua immagine

// Configurazione del puzzle
const rows = 4;
const cols = 4;
let pieces = [];

// Crea la griglia vuota e i pezzi del puzzle
function createPuzzle() {
    gridContainer.innerHTML = '';
    piecesContainer.innerHTML = '';
    pieces = [];

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            // Creazione dello slot nella griglia
            const slot = document.createElement('div');
            slot.dataset.position = `${row}-${col}`;
            slot.classList.add('grid-slot');
            gridContainer.appendChild(slot);

            // Creazione del pezzo
            const piece = document.createElement('div');
            piece.classList.add('puzzle-piece');
            piece.style.backgroundImage = `url(${imageUrl})`;
            piece.style.backgroundPosition = `${-col * 100}px ${-row * 100}px`;
            piece.dataset.position = `${row}-${col}`;
            piece.draggable = true;
            pieces.push(piece);
            piecesContainer.appendChild(piece);
        }
    }

    // Mescola i pezzi
    shufflePieces();
}

// Mescola i pezzi
function shufflePieces() {
    const shuffled = [...pieces].sort(() => Math.random() - 0.5);
    piecesContainer.innerHTML = '';
    shuffled.forEach(piece => piecesContainer.appendChild(piece));
}

// Verifica se il puzzle è completato
function checkCompletion() {
    const slots = document.querySelectorAll('.grid-slot');
    for (const slot of slots) {
        const piece = slot.firstElementChild;
        if (!piece || piece.dataset.position !== slot.dataset.position) {
            return false;
        }
    }
    return true;
}

// Gestione del drag-and-drop
piecesContainer.addEventListener('dragstart', e => {
    if (e.target.classList.contains('puzzle-piece')) {
        e.dataTransfer.setData('text/plain', e.target.dataset.position);
        e.target.classList.add('dragging');
    }
});

piecesContainer.addEventListener('dragend', e => {
    if (e.target.classList.contains('puzzle-piece')) {
        e.target.classList.remove('dragging');
    }
});

gridContainer.addEventListener('dragstart', e => {
    if (e.target.classList.contains('puzzle-piece')) {
        e.dataTransfer.setData('text/plain', e.target.dataset.position);
        e.target.classList.add('dragging');
    }
});

gridContainer.addEventListener('dragend', e => {
    if (e.target.classList.contains('puzzle-piece')) {
        e.target.classList.remove('dragging');
    }
});

gridContainer.addEventListener('dragover', e => {
    e.preventDefault();
});

gridContainer.addEventListener('drop', e => {
    e.preventDefault();
    const draggingPosition = e.dataTransfer.getData('text/plain');
    const draggingPiece = document.querySelector(`.puzzle-piece[data-position="${draggingPosition}"]`);
    const targetSlot = e.target.closest('.grid-slot');

    if (draggingPiece && targetSlot) {
        if (targetSlot.children.length === 0) {
            // Posiziona il pezzo nello slot vuoto
            targetSlot.appendChild(draggingPiece);

            // Verifica se è corretto
            if (targetSlot.dataset.position === draggingPiece.dataset.position) {
                targetSlot.classList.add('correct');
                targetSlot.classList.remove('incorrect');
            } else {
                targetSlot.classList.add('incorrect');
                targetSlot.classList.remove('correct');
            }
        }
    }

    // Rimuovi il segnale di errore quando il pezzo viene spostato
    const slots = document.querySelectorAll('.grid-slot.incorrect');
    slots.forEach(slot => {
        if (!slot.children.length) {
            slot.classList.remove('incorrect');
        }
    });

    // Controlla il completamento del puzzle
    if (checkCompletion()) {
        completionMessage.classList.remove('hidden');
    } else {
        completionMessage.classList.add('hidden');
    }
});

// Inizializza il puzzle
createPuzzle();