const museumData = [
    {
        title: "Mona Lisa",
        image: "images/Mona_Lisa.png"
    },
    {
        title: "The Scream",
        image: "images/The_Scream.png"
    },
    {
        title: "American Gothic",
        image: "images/American_Gothic.png"
    },
    {
        title: "The Great Wave",
        image: "images/Great_Wave.png"
    },
    {
        title: "The Kiss",
        image: "images/The_Kiss.png"
    },
    {
        title: "Madonna",
        image: "images/Madonna.png"
    },
    {
        title: "The Milkmaid",
        image: "images/The_Milkmaid.png"
    },
    {
        title: "Self Portrait",
        image: "images/Self_Portrait.png"
    },
    {
        title: "Sunflowers",
        image: "images/Sunflowers.png"
    },
    {
        title: "Girl with a Pearl Earring",
        image: "images/Girl_With_A_Pearl_Earring.png"
    }
];


let unlockedPaintings =
    JSON.parse(
        localStorage.getItem(
            "museumCollection"
)) || [];

function updateMuseumCounter() {

    const counter =
        document.getElementById(
            "museum-counter"
        );

    counter.textContent =
        `${unlockedPaintings.length} / ${museumData.length}`;
}

function renderMuseum() {

    const museumGrid =
        document.getElementById(
            "museum-grid"
        );

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
        `;

        museumGrid.appendChild(card);

    });

    updateMuseumCounter();
}

renderMuseum();