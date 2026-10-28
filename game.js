
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
    "images/Girl_With_a_Pearl_Earring.png"
];

//CARUSEL
//Getting elements needed for the carousel
const carouselImage = document.getElementById("carouselImage");

const prevBtn = document.getElementById("prevBtn");

const nextBtn = document.getElementById("nextBtn");

const pauseBtn = document.getElementById("pauseBtn");

const resumeBtn = document.getElementById("resumeBtn");

let currentImageIndex = 0; //index of the displayed image

function showImage() { 
    //showing first image
    carouselImage.src = paintings[currentImageIndex];
}

function nextImage() {

    currentImageIndex++;

    if (currentImageIndex >= paintings.length) { //clycling through the images (last one becomes first one)

        currentImageIndex = 0;
    }
    //increasing index fot next image
    showImage();
}

function previousImage() {

    currentImageIndex--;

    if (currentImageIndex < 0) {
        currentImageIndex = paintings.length - 1;
    }
    //decreasing index for a previous image
    showImage();
}



//Creating an interval to continue to next image automatically
let carouselInterval = setInterval(nextImage, 4000);

//event listener to buttons for next or previus functions
nextBtn.addEventListener("click", nextImage);

prevBtn.addEventListener("click",previousImage);

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

    event.preventDefault(); //avoid reloading page

    const difficulty = parseInt(document.getElementById("difficulty").value);//getting value of difficulty

    if (isNaN(difficulty) || difficulty < 2 ||difficulty > 6) { //checking if is a valid input
        alert("Difficulty must be a whole number between 2 and 6.");
        return;
    }
    generatePuzzle(difficulty);
});

// Shuffle the elements of an array randomly
function shuffleArray(array) {

     // Start at the last index and move backwards through the array
    for (let i = array.length - 1; i > 0; i--) 
    {
        // Generate a random index between 0 and the current index (i)
        const j =Math.floor(Math.random() * (i + 1));

        // Swap the elements at indexes i and j
        // This places a randomly selected element in the current position
        [array[i], array[j]] =[array[j], array[i]];
    }
}

function generatePuzzle(difficulty) {

    // Save the selected difficulty so it can be used later
    currentDifficulty = difficulty;

    // Clear any previous puzzle from the board
    puzzleBoard.innerHTML = "";

     // Hide the victory message when starting a new game
    victoryMessage.classList.add("hidden");

    selectedPainting = paintings[ Math.floor
        ( Math.random() * paintings.length)]; //// Pick a random painting from the collection
        //a decimal from 0 to 1, multiplied by the lenght of the array and rounded.

    const totalPieces = difficulty * difficulty; //amount of pieces of the code

    // Create grid columns
    let columns = "";

    for (let i = 0; i < difficulty; i++) {
        
        //creating divisions for the columns
        columns += "1fr";

        if (i < difficulty - 1) {
            columns += " 15px "; //adding columns gap in the middle
        }
    }

    puzzleBoard.style.gridTemplateColumns = columns;

    // Create grid rows
    let rows = "";

    for (let i = 0; i < difficulty; i++) {

        //creating divisions for the columns
        rows += "1fr";

        if (i < difficulty - 1) { //adding rows gap in the middle
            rows += " 15px ";
        }
    }

    //creating the grid
    puzzleBoard.style.gridTemplateRows = rows;

    //reset the puzzle pieces
    currentPieces = [];

    for (let i = 0; i < totalPieces; i++) {
        //creating object per puzzle piece and adds it to current piece
        currentPieces.push({correctPosition: i});
    }

    //calling shuffleArray
    shuffleArray(currentPieces);

    //reseting boardState
    boardState = [];

    
    currentPieces.forEach(
        (pieceData, position) => {
        // Create a puzzle piece using the difficulty,
        // its current position, and its correct position
            const piece =
                createPuzzlePiece(
                    difficulty,
                    position,
                    pieceData.correctPosition
                );
        // Add the created puzzle piece to the boardState array
        boardState.push(piece);
    });

    //calling functions
    renderBoard();
    applyVisualEffects();
    //commenting the generate puzzle
    statusText.textContent = `Puzzle generated (${difficulty} x ${difficulty})`;
}

function applyVisualEffects() {

    let filters = [];

    // Add blur if selected
    if (blurCheckbox.checked) {
        filters.push("blur(3px)");
    }

    // Add greyscale if selected
    if (greyscaleCheckbox.checked) {
        filters.push("grayscale(100%)");
    }

    const filterString = filters.join(" ");

    //aplaying the filters
    document.querySelectorAll(".puzzle-piece").forEach(piece => {
        piece.style.filter = filterString;
    });
}

function renderBoard() {

    // Clear the board before rendering it again
    puzzleBoard.innerHTML = "";

    for (let row = 0; row < currentDifficulty; row++) 
    {
        // Loop through each column in the current row
        for (
            let col = 0;
            col < currentDifficulty;
            col++
        ) {
             // Calculate the index of the current puzzle piece
            const index = row * currentDifficulty + col;

            puzzleBoard.appendChild(boardState[index]);

            // If this is not the last column, add a horizontal swap button
            if (col < currentDifficulty - 1) 
            {
                const button = createHorizontalSwapButton(index);

            // Add the horizontal swap button to the board
                puzzleBoard.appendChild(button);
            }
        }
        // If this is not the last row, create the vertical swap buttons
        if ( row < currentDifficulty - 1) 
        {
            for (
                let col = 0;
                col < currentDifficulty;
                col++
            ) {
                // Calculate the index of the piece above this row's gap
                const index = row * currentDifficulty + col;

                //create the button
                const button = createVerticalSwapButton(index);

                // Add the vertical swap button to the board
                puzzleBoard.appendChild(
                    button
                );

                if (
                    col <
                    currentDifficulty - 1
                ) {
                    // Create an empty div to fill the unused grid position
                    const spacer =document.createElement("div");

                    // Assign a CSS class to style the empty cell
                    spacer.classList.add("empty-cell");

                    puzzleBoard.appendChild(spacer);
                }
            }
        }
    }
}

function createHorizontalSwapButton( index) {

    const button = document.createElement("button");

    //adding text to button
    button.textContent = "⇄";

    //adding classes to button
    button.classList.add(
        "swap-button",
        "horizontal-swap"
    );

    button.addEventListener("click",() => {
        //calling the function swap
         swapBoardPositions(index, index + 1);
        }
    );
    return button;
}

function createVerticalSwapButton(index) {
    const button =document.createElement("button");

    //adding text to button
    button.textContent = "⇅";

    //adding classes to button
    button.classList.add( "swap-button", "vertical-swap");

    
    button.addEventListener("click", () => {
       // Swap the piece at the current index with the piece one row below
        // Adding currentDifficulty moves down by one complete row
            swapBoardPositions(index, index + currentDifficulty);
        }
    );
    return button;
}

function swapBoardPositions( firstIndex, secondIndex) {
    // Temporarily store the first puzzle piece
    const temp = boardState[firstIndex];

    // Move the second puzzle piece to the first position
    boardState[firstIndex] = boardState[secondIndex];

     // Move the original first puzzle piece to the second position
    boardState[secondIndex] = temp;

    // Update the visual board to display the new positions
    renderBoard();

    checkWin();
}

function createPuzzlePiece(difficulty, currentPosition, correctPosition) {

    // Create a new div element to represent the puzzle piece
    const piece = document.createElement("div");

    piece.classList.add("puzzle-piece");

    // Make the puzzle piece focusable so it can be selected using the keyboard
    piece.tabIndex = 0;

    // Define the total size of the puzzle image in pixels
    const boardSize = 700;

    // Calculate the width and height of each piece based on the difficulty
    const pieceSize = boardSize / difficulty;

    // Calculate the row where this piece belongs in the original image
    const row = Math.floor(correctPosition / difficulty);

    // Calculate the column where this piece belongs in the original image
    const col =  correctPosition % difficulty;

    // Set the selected painting as the background image of the piece
    piece.style.backgroundImage = `url(${selectedPainting})`;

    // Set the background image size so all pieces use the same complete image
    piece.style.backgroundSize = `${boardSize}px ${boardSize}px`;

    piece.style.backgroundRepeat = "no-repeat";

    // Position the background image to display only the correct section
    // of the painting for this puzzle piece
    piece.style.backgroundPosition =
        `-${col * pieceSize}px -${row * pieceSize}px`;

    //possible rotations
    const rotations =
        [0, 90, 180, 270];

    // Store the correct position in a data attribute
    const randomRotation = rotations[ Math.floor(Math.random() * 4)];

    piece.dataset.correctPosition = correctPosition;

    piece.dataset.rotation = randomRotation;

    // Rotate the puzzle piece using the randomly selected angle
    piece.style.transform =`rotate(${randomRotation}deg)`;


    //Listener rotate pieces
    piece.addEventListener( "click",() => {
            rotatePiece(piece);
        }
    );

    // Add a keyboard event listener to allow rotation using the Space key
    piece.addEventListener( "keydown", (event) => {

        // Check whether the pressed key is Space
        if (event.code === "Space") {

            // Prevent the browser from performing its default Space-key action
            event.preventDefault();

            rotatePiece(piece);
            }
        }
    );

    return piece;
}


function rotatePiece(piece) {

    // Get the current rotation angle from the piece's data attribute
    let rotation = parseInt(piece.dataset.rotation);

    // Add 90 degrees to the current rotation
    // Use % 360 to return to 0 degrees after reaching 360
    rotation =(rotation + 90) % 360;

    // Save the updated rotation angle in the piece's data attribute
    piece.dataset.rotation = rotation;

    // Apply the new rotation angle to the piece using CSS
    piece.style.transform =
        `rotate(${rotation}deg)`;

    checkWin();
}


function checkWin() {

    let solved = true;

     // Loop through every puzzle piece in the boardState array
    boardState.forEach((piece, index) => {

            // Get the piece's correct position and convert it to a number
            const correctPosition =
                Number(
                    piece.dataset.correctPosition
                );

            // Get the piece's current rotation and convert it to a number
            const rotation =
                Number(
                    piece.dataset.rotation
                );

            // Check whether the piece is in the wrong position
            // or has an incorrect rotation
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
        // Display the victory message by removing the hidden class
        victoryMessage.classList.remove("hidden");
        //Removes filters
        puzzleBoard.style.filter = "none";

        setTimeout(() => {

            puzzleBoard.classList.add("completed-board");
            showCompletePainting();

        // Retrieve the saved museum collection from localStorage
        let unlockedPaintings = JSON.parse(
            localStorage.getItem(
                "museumCollection"
            )) || [];

        if (
            !unlockedPaintings.includes(
                selectedPainting
            )
        ) {
            // Add the painting to the collection if it is not already there
            unlockedPaintings.push(
                selectedPainting
            );
            // Save the updated collection in localStorage as a JSON string
            localStorage.setItem("museumCollection", JSON.stringify(unlockedPaintings)
            );
        }
    }, 1000);}}

function showCompletePainting() {

    puzzleBoard.innerHTML = "";

    puzzleBoard.style.gridTemplateColumns = "1fr";
    puzzleBoard.style.gridTemplateRows = "1fr";

    const image = document.createElement("img");

    image.src = selectedPainting;
    image.classList.add("completed-image");

    puzzleBoard.appendChild(image);
}