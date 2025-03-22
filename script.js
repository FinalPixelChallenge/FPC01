const canvas = document.getElementById("pixelCanvas");
const ctx = canvas.getContext("2d");
const winnerMessage = document.getElementById("winnerMessage");
const winnerName = document.getElementById("winnerName");
const remainingPixels = document.getElementById("pixelCount");
const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const resetButton = document.getElementById("resetButton");

const img = new Image();
img.src = "image.jpeg";

let hiddenPixels = [];
let originalImageData;
let processedComments = new Set(); // Houd bij welke comments al zijn verwerkt
let lastWinner = localStorage.getItem("lastWinner") || ""; // Bewaar de laatste winnaar in localStorage
let fetchingComments = false; // Controleert of de comment-fetching actief is

img.onload = function () {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    
    originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    hiddenPixels = Array.from({ length: canvas.width * canvas.height }, (_, i) => i);
    shuffle(hiddenPixels);
    coverImage();
    updateRemainingPixels();
    
    if (hiddenPixels.length === 0 && lastWinner) {
        displayWinner(lastWinner);
    }
};

function coverImage() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function revealPixel(authorName) {
    if (hiddenPixels.length === 0) return;

    let pixelsToReveal = 1;
    let actualRevealed = 0;

    for (let i = 0; i < pixelsToReveal; i++) {
        if (hiddenPixels.length > 0) {
            let index = hiddenPixels.pop();
            let x = index % canvas.width;
            let y = Math.floor(index / canvas.width);
            
            let pixelData = originalImageData.data.slice((y * canvas.width + x) * 4, (y * canvas.width + x + 1) * 4);
            let imageData = ctx.createImageData(1, 1);
            imageData.data.set(pixelData);
            ctx.putImageData(imageData, x, y);
            
            actualRevealed++;
        }
    }

    console.log(`Revealed ${actualRevealed} pixels by ${authorName}`);
    updateRemainingPixels();
    
    if (hiddenPixels.length === 0) {
        lastWinner = authorName;
        localStorage.setItem("lastWinner", lastWinner); // Bewaar de winnaar
        displayWinner(lastWinner);
    }
}

function updateRemainingPixels() {
    remainingPixels.textContent = hiddenPixels.length;
}

function displayWinner(name) {
    winnerName.textContent = name;
    winnerMessage.style.display = "block";
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

async function fetchYouTubeComments() {
    if (!fetchingComments) return;

    const apiKey = "AIzaSyBOSW0hQYHk2cI0Whq4cPsfuWb_mOtRFkk";
    const liveChatId = "Cg0KC2VHQkh5VEgzNnBJKicKGFVDYlUzM3lLVTIwZDNOS2lBMzhQM09GZxILZUdCSHlUSDM2cEk";
    const url = `https://www.googleapis.com/youtube/v3/liveChat/messages?liveChatId=${liveChatId}&part=snippet,authorDetails&key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.items) {
            data.items.forEach((item) => {
                if (!processedComments.has(item.id)) { // Zorg dat comments niet dubbel tellen
                    revealPixel(item.authorDetails.displayName);
                    processedComments.add(item.id);
                }
            });
        }
    } catch (error) {
        console.error("Error fetching comments:", error);
    }
    
    setTimeout(fetchYouTubeComments, 1000); // Sneller ophalen, nu elke 100ms
}

startButton.addEventListener("click", () => {
    if (!fetchingComments) {
        fetchingComments = true;
        fetchYouTubeComments();
    }
});

stopButton.addEventListener("click", () => {
    fetchingComments = false;
});

resetButton.addEventListener("click", () => {
    lastWinner = "";
    localStorage.removeItem("lastWinner");
    winnerMessage.style.display = "none";
    
    hiddenPixels = Array.from({ length: canvas.width * canvas.height }, (_, i) => i);
    shuffle(hiddenPixels);
    coverImage();
    updateRemainingPixels();
    processedComments.clear();
});
