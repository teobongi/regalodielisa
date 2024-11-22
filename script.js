const gridContainer = document.getElementById('grid-container');
const piecesContainer = document.getElementById('pieces-container');
const completionMessage = document.getElementById('completion-message');

// URL dell'immagine personalizzabile
const imageUrl = 'londra.jpeg'; // Cambia con l'URL della tua immagine

// Configurazione del puzzle
const rows = 4;
const cols = 4;
let pieces = [];
let draggingPiece = null;

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
            pieces.push(piece);
            piecesContainer.appendChild(piece);

            // Eventi touch
            piece.addEventListener('touchstart', handleTouchStart);
            piece.addEventListener('touchmove', handleTouchMove);
            piece.addEventListener('touchend', handleTouchEnd);
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

// Eventi Touch
function handleTouchStart(e) {
    const touch = e.touches[0];
    draggingPiece = e.target;
    draggingPiece.classList.add('dragging');
    draggingPiece.style.position = 'absolute';
    draggingPiece.style.zIndex = '1000';
    draggingPiece.style.left = `${touch.clientX - draggingPiece.offsetWidth / 2}px`;
    draggingPiece.style.top = `${touch.clientY - draggingPiece.offsetHeight / 2}px`;
}

function handleTouchMove(e) {
    if (!draggingPiece) return;

    const touch = e.touches[0];
    draggingPiece.style.left = `${touch.clientX - draggingPiece.offsetWidth / 2}px`;
    draggingPiece.style.top = `${touch.clientY - draggingPiece.offsetHeight / 2}px`;
}

function handleTouchEnd(e) {
    if (!draggingPiece) return;

    draggingPiece.classList.remove('dragging');
    draggingPiece.style.position = 'static';
    draggingPiece.style.zIndex = 'auto';

    // Controlla se è stato rilasciato su uno slot valido
    const touch = e.changedTouches[0];
    const elementUnder = document.elementFromPoint(touch.clientX, touch.clientY);
    const targetSlot = elementUnder?.closest('.grid-slot');

    if (targetSlot && targetSlot.children.length === 0) {
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

    draggingPiece = null;

    // Controlla il completamento del puzzle
    if (checkCompletion()) {
        completionMessage.classList.remove('hidden');
    } else {
        completionMessage.classList.add('hidden');
    }
}

// Inizializza il puzzle
createPuzzle();
