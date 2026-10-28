const museumData = [
    {
        title: "Mona Lisa",
        image: "images/Mona_Lisa.png",
        artist: "Leonardo da Vinci",
        year: "1503–1519"
    },
    {
        title: "The Scream",
        image: "images/The_Scream.png",
        artist: "Edvard Munch",
        year: "1893"
    },
    {
        title: "American Gothic",
        image: "images/American_Gothic.png",
        artist: "Grant Wood",
        year: "1930"
    },
    {
        title: "The Great Wave",
        image: "images/Great_Wave.png",
        artist: "Katsushika Hokusai",
        year: "c. 1831"
    },
    {
        title: "The Kiss",
        image: "images/The_Kiss.png",
        artist: "Gustav Klimt",
        year: "1907–1908"
    },
    {
        title: "Madonna",
        image: "images/Madonna.png",
        artist: "To be confirmed",
        year: "To be confirmed"
    },
    {
        title: "The Milkmaid",
        image: "images/The_Milkmaid.png",
        artist: "Johannes Vermeer",
        year: "c. 1658–1660"
    },
    {
        title: "Self Portrait",
        image: "images/Self_Portrait.png",
        artist: "Vincent van Gogh",
        year: "1889"
    },
    {
        title: "Sunflowers",
        image: "images/Sunflowers.png",
        artist: "Vincent van Gogh",
        year: "1888"
    },
    {
        title: "Girl with a Pearl Earring",
        image: "images/Girl_With_A_Pearl_Earring.png",
        artist: "Johannes Vermeer",
        year: "c. 1665"
    }
];


let unlockedPaintings =
    JSON.parse(
        localStorage.getItem("museumCollection")) || [];

function updateMuseumCounter() {

    const counter = document.getElementById("museum-counter");

    counter.textContent =
        `${unlockedPaintings.length} / ${museumData.length}`;
}

function renderMuseum() {

    const museumGrid = document.getElementById("museum-grid");

    if (!museumGrid) return;

    museumGrid.innerHTML = "";

    museumData.forEach(painting => {

        const unlocked =
            unlockedPaintings.includes(
                painting.image
            );

        const card =
            document.createElement("article");

        card.classList.add(
            "museum-card"
        );

        if (!unlocked) {

            card.classList.add(
                "locked"
            );

        }

        card.innerHTML = `
            <img src="${painting.image}"
                 alt="${painting.title}">

            <h3>${painting.title}</h3>

            <p>
                ${unlocked
                    ? "✅ Restored"
                    : "🔒 Locked"}
            </p>
            <p class="painting-artist">
                ${painting.artist}
            </p>

            <small class="painting-year">
                ${painting.year}
            </small>
        `;

        museumGrid.appendChild(card);

    });

    updateMuseumCounter();
}

renderMuseum();