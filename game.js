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
const carouselImage = document.getElementById("carouselImage");
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
    carouselImage.src = paintings[currentImageIndex];
}

function nextImage() {

    currentImageIndex++;

    if (currentImageIndex >= paintings.length) { //clycling through the images

        currentImageIndex = 0;
    }
    //increasing index fot next image
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



//Creating an interval to continue to next image automatically
let carouselInterval =
    setInterval(nextImage, 4000);

    //event listener to buttons for next or previus functions
nextBtn.addEventListener(
    "click",
    nextImage
);

prevBtn.addEventListener(
    "click",
    previousImage
);

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
let currentDifficulty = 0;
let boardState = [];
const blurCheckbox = document.getElementById("blur");
const greyscaleCheckbox =  document.getElementById("greyscale");

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

    currentDifficulty = difficulty;

    puzzleBoard.innerHTML = "";

    victoryMessage.classList.add("hidden");

    selectedPainting =
        paintings[
            Math.floor(
                Math.random() * paintings.length
            )
        ];

    const totalPieces =
        difficulty * difficulty;

    // Create grid columns
    let columns = "";

    for (let i = 0; i < difficulty; i++) {

        columns += "1fr";

        if (i < difficulty - 1) {
            columns += " 15px ";
        }
    }

    puzzleBoard.style.gridTemplateColumns =
        columns;

    // Create grid rows
    let rows = "";

    for (let i = 0; i < difficulty; i++) {

        rows += "1fr";

        if (i < difficulty - 1) {
            rows += " 15px ";
        }
    }

    puzzleBoard.style.gridTemplateRows =
        rows;

    currentPieces = [];

    for (let i = 0; i < totalPieces; i++) {

        currentPieces.push({
            correctPosition: i
        });

    }

    shuffleArray(currentPieces);

    boardState = [];

    currentPieces.forEach(
        (pieceData, position) => {

            const piece =
                createPuzzlePiece(
                    difficulty,
                    position,
                    pieceData.correctPosition
                );

            boardState.push(piece);

        }
    );

    renderBoard();
    applyVisualEffects();
    statusText.textContent = `Puzzle generated (${difficulty} x ${difficulty})`;
}

function applyVisualEffects() {

    let filters = [];

    if (blurCheckbox.checked) {

        filters.push("blur(3px)");

    }

    if (greyscaleCheckbox.checked) {

        filters.push("grayscale(100%)");

    }

    const filterString =
        filters.join(" ");

    document
        .querySelectorAll(".puzzle-piece")
        .forEach(piece => {

            piece.style.filter = "none";

        });
}

function renderBoard() {

    puzzleBoard.innerHTML = "";

    for (
        let row = 0;
        row < currentDifficulty;
        row++
    ) {

        for (
            let col = 0;
            col < currentDifficulty;
            col++
        ) {

            const index =
                row * currentDifficulty + col;

            puzzleBoard.appendChild(
                boardState[index]
            );

            if (
                col <
                currentDifficulty - 1
            ) {

                const button =
                    createHorizontalSwapButton(
                        index
                    );

                puzzleBoard.appendChild(
                    button
                );
            }
        }

        if (
            row <
            currentDifficulty - 1
        ) {

            for (
                let col = 0;
                col < currentDifficulty;
                col++
            ) {

                const index =
                    row * currentDifficulty + col;

                const button =
                    createVerticalSwapButton(
                        index
                    );

                puzzleBoard.appendChild(
                    button
                );

                if (
                    col <
                    currentDifficulty - 1
                ) {

                    const spacer =
                        document.createElement(
                            "div"
                        );

                    spacer.classList.add(
                        "empty-cell"
                    );

                    puzzleBoard.appendChild(
                        spacer
                    );
                }
            }
        }
    }
}

function createHorizontalSwapButton( index) {

    const button =
        document.createElement("button");

    button.textContent = "⇄";

    button.classList.add(
        "swap-button",
        "horizontal-swap"
    );

    button.addEventListener(
        "click",
        () => {

            swapBoardPositions(
                index,
                index + 1
            );

        }
    );

    return button;
}

function createVerticalSwapButton(
    index
) {

    const button =
        document.createElement("button");

    button.textContent = "⇅";

    button.classList.add( "swap-button", "vertical-swap");

    button.addEventListener(
        "click",
        () => {

            swapBoardPositions(
                index,
                index + currentDifficulty
            );

        }
    );

    return button;
}

function swapBoardPositions( firstIndex, secondIndex) {
    const temp =
        boardState[firstIndex];

    boardState[firstIndex] =
        boardState[secondIndex];

    boardState[secondIndex] =
        temp;

    renderBoard();

    checkWin();
}

function createPuzzlePiece(difficulty, currentPosition, correctPosition) {

    const piece = document.createElement("div");

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

    piece.dataset.rotation =
        randomRotation;

    piece.style.transform =
        `rotate(${randomRotation}deg)`;


    //Listener rotate pieces
    piece.addEventListener( "click",() => {
            rotatePiece(piece);
        }
    );

    piece.addEventListener( "keydown", (event) => {

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

    let solved = true;

    boardState.forEach(
        (piece, index) => {

            const correctPosition =
                Number(
                    piece.dataset.correctPosition
                );

            const rotation =
                Number(
                    piece.dataset.rotation
                );

            if (
                correctPosition !== index ||
                rotation !== 0
            ) {

                solved = false;

            }
        }
    );

    if (solved) 
    {
        victoryMessage.classList.remove("hidden");
        puzzleBoard.style.filter = "none";
        setTimeout(() => {

            puzzleBoard.classList.add("completed-board");
            showCompletePainting();

        let unlockedPaintings =
        JSON.parse(
            localStorage.getItem(
                "museumCollection"
            )
        ) || [];

        if (
            !unlockedPaintings.includes(
                selectedPainting
            )
        ) {

            unlockedPaintings.push(
                selectedPainting
            );

            localStorage.setItem(
                "museumCollection",
                JSON.stringify(
                    unlockedPaintings
                )
            );
        }

    }, 1000);}}

function showCompletePainting() {


    puzzleBoard.innerHTML = "";

    puzzleBoard.style.gridTemplateColumns = "1fr";
    puzzleBoard.style.gridTemplateRows = "1fr";

    const image =
        document.createElement("img");

    image.src = selectedPainting;
    image.classList.add("completed-image");

    puzzleBoard.appendChild(image);

}