import { addUser } from "./firebase.js";

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Configuración del juego
const gridSize = 30;
const tileCount = canvas.width / gridSize;

let pacman = {
    x: Math.floor(tileCount / 2),
    y: Math.floor(tileCount / 2),
    dx: 0,
    dy: 0
};

let gameRunning = true;
let obstacles = [];
let points = [];
let score = 0;

// Generar obstáculos aleatorios
function generateObstacles(count) {
    obstacles = [];
    const safeZone = 6; // Define una zona de seguridad alrededor de Pill-Man
    for (let i = 0; i < count; i++) {
        let obstacle;
        let obstacleSize = Math.floor(Math.random() * 5) + 1; // Tamaño del obstáculo
        do {
            obstacle = {
                x: Math.floor(Math.random() * tileCount),
                y: Math.floor(Math.random() * tileCount),
                size: obstacleSize
            };
        } while (
            (Math.abs(obstacle.x - pacman.x) < safeZone && Math.abs(obstacle.y - pacman.y) < safeZone) || 
            obstacles.some(ob => 
                obstacle.x < ob.x + ob.size &&
                obstacle.x + obstacle.size > ob.x &&
                obstacle.y < ob.y + ob.size &&
                obstacle.y + obstacle.size > ob.y
            )
        );
        obstacles.push(obstacle);
    }
}

// Generar puntos aleatorios
function generatePoints(count) {
    points = [];
    for (let i = 0; i < count; i++) {
        let point;
        do {
            point = {
                x: Math.floor(Math.random() * tileCount),
                y: Math.floor(Math.random() * tileCount)
            };
        } while (
            (point.x === pacman.x && point.y === pacman.y) ||
            points.some(p => p.x === point.x && p.y === point.y) ||
            obstacles.some(ob => 
                point.x >= ob.x &&
                point.x < ob.x + ob.size &&
                point.y >= ob.y &&
                point.y < ob.y + ob.size
            )
        );
        points.push(point);
    }
}

// Dibujar obstáculos
function drawObstacles() {
    ctx.fillStyle = '#862436';
    obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x * gridSize, obstacle.y * gridSize, obstacle.size * gridSize, obstacle.size * gridSize);
    });
}

// Dibujar puntos
function drawPoints() {
    ctx.fillStyle = '#00ff00';
    points.forEach(point => {
        ctx.beginPath();
        ctx.arc(point.x * gridSize + gridSize / 2, point.y * gridSize + gridSize / 2, gridSize / 6, 0, 2 * Math.PI);
        ctx.fill();
    });
}

// Dibujar Pill-Man
function drawPacman() {
    ctx.fillStyle = '#fece46';
    ctx.beginPath();
    ctx.arc(pacman.x * gridSize + gridSize / 2, pacman.y * gridSize + gridSize / 2, gridSize / 2, 0.2 * Math.PI, 1.8 * Math.PI);
    ctx.lineTo(pacman.x * gridSize + gridSize / 2, pacman.y * gridSize + gridSize / 2);
    ctx.fill();
}

// Tablero puntuación
function drawScore() {
    ctx.fillStyle = '#ffffff';
    ctx.font = '20px Arial';
    ctx.fillText('Puntos: ' + score, 10, 20);
}

// Limpiar canvas
function clearCanvas() {
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Comprobar impacto con obstáculos
function checkCollision() {
    if (obstacles.some(obstacle => 
        pacman.x >= obstacle.x &&
        pacman.x < obstacle.x + obstacle.size &&
        pacman.y >= obstacle.y &&
        pacman.y < obstacle.y + obstacle.size
    )) {
        gameRunning = false;
        alert('¡Juego terminado! Pac-Man chocó con un obstáculo.');
        saveScore(score); // Guardar el puntaje
    }
}

// Comprobar impacto con puntos
function checkPointCollection() {
    points = points.filter(point => {
        if (pacman.x === point.x && pacman.y === point.y) {
            score += 10;
            return false; // Eliminar el punto del array
        }
        return true;
    });

    // Verificar si todos los puntos han sido recolectados
    if (points.length === 0) {
        gameRunning = false;
        alert('¡Felicitaciones! Has recolectado todos los puntos.');
        saveScore(score); // Guardar el puntaje
    }
}

// Juego Nuevo
function updateGame() {
    if (!gameRunning) return;

    pacman.x += pacman.dx;
    pacman.y += pacman.dy;

    // Envolver las coordenadas de Pac-Man
    if (pacman.x < 0) {
        pacman.x = tileCount - 1;
    } else if (pacman.x >= tileCount) {
        pacman.x = 0;
    }

    if (pacman.y < 0) {
        pacman.y = tileCount - 1;
    } else if (pacman.y >= tileCount) {
        pacman.y = 0;
    }

    checkCollision();
    checkPointCollection();
}

// Bucle del juego
function gameLoop() {
    if (!gameRunning) return;

    clearCanvas();
    drawObstacles();
    drawPoints();
    drawPacman();
    drawScore();
    updateGame();
}

// Inicializar juego
function startGame() {
    pacman = {
        x: Math.floor(tileCount / 2),
        y: Math.floor(tileCount / 2),
        dx: 0,
        dy: 0
    };
    gameRunning = true;
    score = 0;
    generateObstacles(15); // Generar 15 obstáculos aleatorios
    generatePoints(20); // Generar 20 puntos aleatorios
    setInterval(gameLoop, 300); // Velocidad del juego en milisegundos (mayor valor = juego más lento)
}

// Guardar el puntaje en Google Sheets
function saveScore(score) {
    addUser(score)
}

// Eventos de teclado
document.addEventListener('keydown', event => {
    switch (event.key) {
        case 'ArrowUp':
            if (pacman.dy === 0) {
                pacman.dx = 0;
                pacman.dy = -1;
            }
            break;
        case 'ArrowDown':
            if (pacman.dy === 0) {
                pacman.dx = 0;
                pacman.dy = 1;
            }
            break;
        case 'ArrowLeft':
            if (pacman.dx === 0) {
                pacman.dx = -1;
                pacman.dy = 0;
            }
            break;
        case 'ArrowRight':
            if (pacman.dx === 0) {
                pacman.dx = 1;
                pacman.dy = 0;
            }
            break;
    }
});

// Eventos de botones
document.getElementById('upBtn').addEventListener('click', () => {
    if (pacman.dy === 0) {
        pacman.dx = 0;
        pacman.dy = -1;
    }
});

document.getElementById('downBtn').addEventListener('click', () => {
    if (pacman.dy === 0) {
        pacman.dx = 0;
        pacman.dy = 1;
    }
});

document.getElementById('leftBtn').addEventListener('click', () => {
    if (pacman.dx === 0) {
        pacman.dx = -1;
        pacman.dy = 0;
    }
});

document.getElementById('rightBtn').addEventListener('click', () => {
    if (pacman.dx === 0) {
        pacman.dx = 1;
        pacman.dy = 0;
    }
});

// Iniciar el juego
startGame();
