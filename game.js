console.log("Hello");

//Declaring images
const paintings = [
    "images/Mona_Lisa.png",
    "images/The_Scream.png",
    "images/American_Gothic.png",
    "images/Great_Wave.png",
    "images/The_Kiss.png",
    "images/Madonna.png",
    "images/The_Milkmaid.png",
    "images/Self_Portrait.png",
    "images/Sunflowers.png",
    "images/Girl_With_A_Pearl_Earring.png"
];

//CARUSEL
//Getting elements needed for the carousel
const carouselImage =
    document.getElementById("carouselImage");
    console.log(carouselImage);

const prevBtn =
    document.getElementById("prevBtn");
    console.log(prevBtn);

const nextBtn =
    document.getElementById("nextBtn");
    console.log(nextBtn);

const pauseBtn =
    document.getElementById("pauseBtn");
    console.log(pauseBtn);

const resumeBtn =
    document.getElementById("resumeBtn");
    console.log(resumeBtn);

let currentImageIndex = 0; //index of the displayed image

function showImage() { 
    //showing first image
    carouselImage.src =
        paintings[currentImageIndex];
}

function nextImage() {

    currentImageIndex++;

    if (currentImageIndex >= paintings.length) { //clycling through the images

        currentImageIndex = 0;
    }
    //incrising index fot next image
    showImage();
}

function previousImage() {

    currentImageIndex--;

    if (currentImageIndex < 0) {

        currentImageIndex =
            paintings.length - 1;
    }
    //decresing index for previus image
    showImage();
}

//event listener to buttons for next or previus functions
nextBtn.addEventListener(
    "click",
    nextImage
);

prevBtn.addEventListener(
    "click",
    previousImage
);

//Creating an interval to continue to next image automatically
let carouselInterval =
    setInterval(nextImage, 4000);

pauseBtn.addEventListener("click", () => {
    //pause button clear the interval
    clearInterval(carouselInterval);

});

resumeBtn.addEventListener("click", () => {

    clearInterval(carouselInterval);
    //resume button clear the interval an generates a new one
    carouselInterval =
        setInterval(nextImage, 4000);

});

// ------------------ Game logic ----------------- //
const puzzleForm = document.getElementById("puzzle-form");
const puzzleBoard = document.getElementById("puzzle-board");
const statusText = document.getElementById("game-status");
const victoryMessage = document.getElementById("victory-message");

let currentPieces = [];
let selectedPainting = "";
let selectedPiece = null;

puzzleForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const difficulty =
        parseInt(document.getElementById("difficulty").value);

    if (
        isNaN(difficulty) ||
        difficulty < 2 ||
        difficulty > 6
    ) {
        alert("Difficulty must be a whole number between 2 and 6.");
        return;
    }

    generatePuzzle(difficulty);

});

function generatePuzzle(difficulty) {

    puzzleBoard.innerHTML = "";

    victoryMessage.classList.add("hidden");

    selectedPainting =
        paintings[
            Math.floor(Math.random() * paintings.length)
        ];

    const totalPieces =
        difficulty * difficulty;

    puzzleBoard.style.gridTemplateColumns =
        `repeat(${difficulty}, 1fr)`;

    puzzleBoard.style.gridTemplateRows =
        `repeat(${difficulty}, 1fr)`;

    currentPieces = [];

    for (let i = 0; i < totalPieces; i++) {

        currentPieces.push({
            currentPosition: i,
            correctPosition: i
        });

    }

    shuffleArray(currentPieces);

    currentPieces.forEach((pieceData, position) => {

        const piece = createPuzzlePiece(
            difficulty,
            position,
            pieceData.correctPosition
        );

        puzzleBoard.appendChild(piece);

    });

    statusText.textContent =
        `Puzzle generated (${difficulty} x ${difficulty})`;

}

function createPuzzlePiece(
    difficulty,
    currentPosition,
    correctPosition
) {

    const piece =
        document.createElement("div");

    piece.classList.add("puzzle-piece");

    piece.tabIndex = 0;

    const boardSize = 700;
    const pieceSize = boardSize / difficulty;

    const row =
        Math.floor(correctPosition / difficulty);

    const col =
        correctPosition % difficulty;

    piece.style.backgroundImage =
        `url(${selectedPainting})`;

    piece.style.backgroundSize =
        `${boardSize}px ${boardSize}px`;

    piece.style.backgroundRepeat =
        "no-repeat";

    piece.style.backgroundPosition =
        `-${col * pieceSize}px -${row * pieceSize}px`;

    const rotations =
        [0, 90, 180, 270];

    const randomRotation =
        rotations[
            Math.floor(Math.random() * 4)
        ];

    piece.dataset.correctPosition =
        correctPosition;

    piece.dataset.currentPosition =
        currentPosition;

    piece.dataset.rotation =
        randomRotation;

    piece.style.transform =
        `rotate(${randomRotation}deg)`;

    piece.addEventListener(
        "click",
        () => {

            if (selectedPiece === null) {

                selectedPiece = piece;

                piece.style.outline =
                    "4px solid red";

            }
            else {

                if (selectedPiece !== piece) {

                    swapPieces(
                        selectedPiece,
                        piece
                    );

                }

                selectedPiece.style.outline =
                    "none";

                selectedPiece = null;
            }

        }
    );

    piece.addEventListener(
        "dblclick",
        () => {

            rotatePiece(piece);

        }
    );

    piece.addEventListener(
        "keydown",
        (event) => {

            if (event.code === "Space") {

                event.preventDefault();

                rotatePiece(piece);

            }

        }
    );

    return piece;

}

function rotatePiece(piece) {

    let rotation =
        parseInt(piece.dataset.rotation);

    rotation =
        (rotation + 90) % 360;

    piece.dataset.rotation =
        rotation;

    piece.style.transform =
        `rotate(${rotation}deg)`;

    checkWin();

}

function swapPieces(pieceA, pieceB) {

    const tempPosition =
        pieceA.dataset.currentPosition;

    pieceA.dataset.currentPosition =
        pieceB.dataset.currentPosition;

    pieceB.dataset.currentPosition =
        tempPosition;

    const pieces =
        Array.from(
            puzzleBoard.children
        );

    const indexA =
        pieces.indexOf(pieceA);

    const indexB =
        pieces.indexOf(pieceB);

    pieces[indexA] = pieceB;
    pieces[indexB] = pieceA;

    puzzleBoard.innerHTML = "";

    pieces.forEach(piece => {

        puzzleBoard.appendChild(piece);

    });

    checkWin();

}

function shuffleArray(array) {

    for (
        let i = array.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() * (i + 1)
            );

        [array[i], array[j]] =
            [array[j], array[i]];

    }

}

function checkWin() {

    const pieces =
        document.querySelectorAll(
            ".puzzle-piece"
        );

    let solved = true;

    pieces.forEach(piece => {

        const correct =
            Number(
                piece.dataset.correctPosition
            );

        const current =
            Number(
                piece.dataset.currentPosition
            );

        const rotation =
            Number(
                piece.dataset.rotation
            );

        if (
            correct !== current ||
            rotation !== 0
        ) {

            solved = false;

        }

    });

    if (solved) {

        victoryMessage.classList.remove("hidden");

        puzzleBoard.classList.add(
            "puzzle-complete"
        );

        statusText.textContent =
            "Masterpiece Restored!";

    }

}