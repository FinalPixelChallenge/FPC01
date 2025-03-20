const canvas = document.getElementById("pixelCanvas");
const ctx = canvas.getContext("2d");
const winnerMessage = document.getElementById("winnerMessage");
const winnerName = document.getElementById("winnerName");
const remainingPixels = document.getElementById("pixelCount");

const img = new Image();
img.src = "image.jpeg";

let hiddenPixels = [];
let originalImageData;

img.onload = function () {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    
    originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    hiddenPixels = Array.from({ length: canvas.width * canvas.height }, (_, i) => i);
    shuffle(hiddenPixels);
    coverImage();
    updateRemainingPixels();
    fetchYouTubeComments();
};

function coverImage() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function revealPixel() {
    for (let i = 0; i < 50000; i++) { // Onthul 50000 pixels per comment
        if (hiddenPixels.length > 0) {
            let index = hiddenPixels.pop();
            let x = index % canvas.width;
            let y = Math.floor(index / canvas.width);
            
            let pixelData = originalImageData.data.slice((y * canvas.width + x) * 4, (y * canvas.width + x + 1) * 4);
            let imageData = ctx.createImageData(1, 1);
            imageData.data.set(pixelData);
            ctx.putImageData(imageData, x, y);
            
            updateRemainingPixels();
        }
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

async function fetchYouTubeComments() {
    const apiKey = "YOUR_YOUTUBE_API_KEY";
    const liveChatId = "YOUR_LIVE_CHAT_ID";
    const url = `https://www.googleapis.com/youtube/v3/liveChat/messages?liveChatId=${liveChatId}&part=snippet,authorDetails&key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.items) {
            data.items.forEach(() => {
                revealPixel();
            });
        }
    } catch (error) {
        console.error("Error fetching comments:", error);
    }
    
    setTimeout(fetchYouTubeComments, 5000);
}
