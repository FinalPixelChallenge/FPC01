const canvas = document.getElementById("pixelCanvas");
const ctx = canvas.getContext("2d");
const winnerMessage = document.getElementById("winnerMessage");
const winnerName = document.getElementById("winnerName");
const remainingPixels = document.getElementById("pixelCount");

const img = new Image();
img.src = "image.jpeg";

const pixelSize = 5;
let hiddenPixels = [];

img.onload = function () {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    hiddenPixels = Array.from({ length: imgData.data.length / 4 }, (_, i) => i);
    shuffle(hiddenPixels);
    hideImage();
    updateRemainingPixels();
};

function hideImage() {
    ctx.fillStyle = "black";
    for (let i = 0; i < hiddenPixels.length; i++) {
        let x = (hiddenPixels[i] % canvas.width) * pixelSize;
        let y = Math.floor(hiddenPixels[i] / canvas.width) * pixelSize;
        ctx.fillRect(x, y, pixelSize, pixelSize);
    }
}

function revealPixel() {
    if (hiddenPixels.length > 0) {
        let index = hiddenPixels.pop();
        let x = (index % canvas.width) * pixelSize;
        let y = Math.floor(index / canvas.width) * pixelSize;
        ctx.drawImage(img, x, y, pixelSize, pixelSize, x, y, pixelSize, pixelSize);
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
