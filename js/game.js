const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Renk paleti
const colors = {
    ball: "#00ffff",  // Parlak cyan top
    paddle: "#4488ff", // Parlak mavi raket
    brickColors: [     // Gökkuşağı renkleri
        "#ff0000",     // Kırmızı
        "#ff4400",     // Turuncu-kırmızı
        "#ff8800",     // Turuncu
        "#ffbb00",     // Altın
        "#ffff00",     // Sarı
        "#88ff00",     // Açık yeşil
        "#00ff00",     // Yeşil
        "#00ffff",     // Cyan
        "#0088ff",     // Açık mavi
        "#0000ff",     // Mavi
    ],
    text: "#ffffff",   // Beyaz yazı
    score: "#ffffff",  // Beyaz skor
    gameOver: "#ff4444", // Parlak kırmızı game over
    gameWon: "#44ff44"   // Parlak yeşil kazanma
};

// Oyun durumu
let gameStarted = false;
let gameOver = false;
let gameWon = false;
let score = 0;
let lives = 3;

// Oyun nesneleri
const ballRadius = 8;
let ballX = canvas.width / 2;
let ballY = canvas.height - 30;
let ballDX = 5;
let ballDY = -5;

const paddleHeight = 15;
const paddleWidth = 100;
let paddleX = (canvas.width - paddleWidth) / 2;

const brickRowCount = 12;    // Tuğla sırası
const brickColumnCount = 16; // Tuğla sütunu
const brickWidth = 42;      // Tuğla genişliği
const brickHeight = 20;     // Tuğla yüksekliği
const brickPadding = 4;     // Tuğlalar arası boşluk

// Tuğlaların toplam genişlik ve yüksekliğini hesapla
const totalBrickWidth = (brickWidth + brickPadding) * brickColumnCount - brickPadding;
const totalBrickHeight = (brickHeight + brickPadding) * brickRowCount - brickPadding;

// Tuğlaları ortalamak için offset değerlerini hesapla
const brickOffsetLeft = (canvas.width - totalBrickWidth) / 2;
const brickOffsetTop = 50;

// Tuğlaları oluştur
const bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

// Klavye kontrolleri
let rightPressed = false;
let leftPressed = false;

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);
document.addEventListener("mousemove", mouseMoveHandler);

function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
    } else if (e.key === " ") {
        if (!gameStarted && !gameOver && !gameWon) {
            gameStarted = true;
        } else if (gameOver || gameWon) {
            document.location.reload();
        }
    }
}

function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
    }
}

function mouseMoveHandler(e) {
    const relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

// Çarpışma kontrolü
function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const b = bricks[c][r];
            if (b.status === 1) {
                if (ballX > b.x && ballX < b.x + brickWidth && ballY > b.y && ballY < b.y + brickHeight) {
                    ballDY = -ballDY;
                    b.status = 0;
                    score++;
                    if (score === brickRowCount * brickColumnCount) {
                        gameWon = true;
                    }
                }
            }
        }
    }
}

// Top çizimi
function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = colors.ball;
    ctx.fill();
    ctx.closePath();
}

// Raket çizimi
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = colors.paddle;
    ctx.fill();
    ctx.closePath();
}

// Tuğlaları çiz
function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                // Renk gradyanı oluştur
                ctx.fillStyle = colors.brickColors[r % colors.brickColors.length];
                ctx.fill();
                ctx.closePath();

                // 3D efekti için üst kısım
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight/3);
                ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
                ctx.fill();
                ctx.closePath();

                // 3D efekti için alt kısım
                ctx.beginPath();
                ctx.rect(brickX, brickY + brickHeight*2/3, brickWidth, brickHeight/3);
                ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

// Skor çizimi
function drawScore() {
    ctx.font = "16px 'Open Sans', sans-serif";
    ctx.fillStyle = colors.score;
    ctx.fillText("Skor: " + score, 8, 20);
}

// Can çizimi
function drawLives() {
    ctx.font = "16px 'Open Sans', sans-serif";
    ctx.fillStyle = colors.score;
    ctx.fillText("Can: " + lives, canvas.width - 65, 20);
}

// Başlangıç mesajı
function drawStartMessage() {
    if (!gameStarted && !gameOver && !gameWon) {
        ctx.font = "bold 24px 'Open Sans', sans-serif";
        ctx.fillStyle = colors.text;
        ctx.textAlign = "center";
        ctx.fillText("Başlamak için SPACE tuşuna basın", canvas.width / 2, canvas.height / 2);
        ctx.textAlign = "left";
    }
}

// Oyun sonu mesajları
function drawEndMessage() {
    if (gameOver || gameWon) {
        ctx.font = "bold 32px 'Open Sans', sans-serif";
        ctx.fillStyle = gameWon ? colors.gameWon : colors.gameOver;
        ctx.textAlign = "center";
        ctx.fillText(gameWon ? "Tebrikler! Kazandınız!" : "Oyun Bitti!", canvas.width / 2, canvas.height / 2 - 20);
        
        ctx.font = "20px 'Open Sans', sans-serif";
        ctx.fillStyle = colors.text;
        ctx.fillText("Tekrar oynamak için SPACE tuşuna basın", canvas.width / 2, canvas.height / 2 + 20);
        ctx.textAlign = "left";
    }
}

// Ana oyun döngüsü
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    drawStartMessage();
    drawEndMessage();
    
    if (gameStarted && !gameOver && !gameWon) {
        collisionDetection();

        // Top çarpışma kontrolleri
        if (ballX + ballDX > canvas.width - ballRadius || ballX + ballDX < ballRadius) {
            ballDX = -ballDX;
        }
        if (ballY + ballDY < ballRadius) {
            ballDY = -ballDY;
        } else if (ballY + ballDY > canvas.height - ballRadius) {
            if (ballX > paddleX && ballX < paddleX + paddleWidth) {
                ballDY = -ballDY;
            } else {
                lives--;
                if (!lives) {
                    gameOver = true;
                } else {
                    ballX = canvas.width / 2;
                    ballY = canvas.height - 30;
                    ballDX = 5;
                    ballDY = -5;
                }
            }
        }

        // Raket hareketi
        if (rightPressed && paddleX < canvas.width - paddleWidth) {
            paddleX += 7;
        } else if (leftPressed && paddleX > 0) {
            paddleX -= 7;
        }

        ballX += ballDX;
        ballY += ballDY;
    }
}

// Pencere boyutu değiştiğinde canvas'ı yeniden boyutlandır
window.addEventListener('resize', function() {
    canvas.width = Math.min(800, window.innerWidth - 40);
    canvas.height = Math.min(600, window.innerHeight - 40);
});

setInterval(draw, 10); 