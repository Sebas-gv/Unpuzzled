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