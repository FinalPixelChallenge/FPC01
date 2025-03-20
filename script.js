const canvas = document.getElementById("pixelCanvas");
const ctx = canvas.getContext("2d");
const winnerMessage = document.getElementById("winnerMessage");
const winnerName = document.getElementById("winnerName");
const remainingPixels = document.getElementById("pixelCount");

const img = new Image();
img.src = "image.jpeg";

let hiddenPixels = [];

img.onload = function () {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    
    hiddenPixels = Array.from({ length: canvas.width * canvas.height }, (_, i) => i);
    shuffle(hiddenPixels);
    coverImage();
    updateRemainingPixels();
};

function coverImage() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function revealPixel() {
    if (hiddenPixels.length > 0) {
        let index = hiddenPixels.pop();
        let x = index % canvas.width;
        let y = Math.floor(index / canvas.width);
        
        // Haal de originele pixel terug
        let pixelData = ctx.getImageData(x, y, 1, 1);
        ctx.putImageData(pixelData, x, y);
        
        updateRemainingPixels();
    }
    if (hiddenPixels.length === 0) {
        displayWinner("Final Player");
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

canvas.addEventListener("click", revealPixel);