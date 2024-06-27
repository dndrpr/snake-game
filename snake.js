// Initialize canvas for drawing the game
const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 400;
document.body.appendChild(canvas);

// Initialize game variables
let snake = [{x: 160, y: 160}, {x: 150, y: 160}, {x: 140, y: 160}]; // Starting snake segments
let dx = 10; // Horizontal velocity of snake
let dy = 0; // Vertical velocity of snake
let foodX; // X-coordinate of food
let foodY; // Y-coordinate of food
let score = 0; // Player's score
let obstacles = []; // Initialize an empty array for obstacles

// Start the game loop
main();
createFood(); // Place the first food item
createObstacles(); // Place obstacles on the canvas

// Event listener for keyboard input
document.addEventListener('keydown', changeDirection);

// Main game loop
function main() {
    if (didGameEnd()) return; // Check for game over conditions

    setTimeout(function onTick() {
        clearCanvas(); // Clear the canvas for the new frame
        drawObstacles(); // Draw the obstacles
        drawFood(); // Draw the food
        advanceSnake(); // Move the snake
        drawSnake(); // Draw the snake

        main(); // Recursively call main to continue the game loop
    }, 100);
}

// Clear the canvas
function clearCanvas() {
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);
}

function createObstacles() {
    // Example: Add 5 obstacles
    for (let i = 0; i < 5; i++) {
        let obstacle = {
            x: Math.floor(Math.random() * (canvas.width / 10)) * 10,
            y: Math.floor(Math.random() * (canvas.height / 10)) * 10
        };
        // Check if the obstacle is not placed on the snake or food
        if (!snake.some(segment => segment.x === obstacle.x && segment.y === obstacle.y) &&
            !(obstacle.x === foodX && obstacle.y === foodY)) {
            obstacles.push(obstacle);
        } else {
            i--; // Retry placing this obstacle
        }
    }
}

// Draw the snake on the canvas
function drawSnake() {
    snake.forEach(part => {
        context.fillStyle = 'lightgreen'; // Snake color
        context.strokeStyle = 'darkgreen'; // Border color of snake
        context.fillRect(part.x, part.y, 10, 10); // Draw snake segment
        context.strokeRect(part.x, part.y, 10, 10); // Draw border around snake segment
    });
}

function drawObstacles() {
    obstacles.forEach(obstacle => {
        context.fillStyle = 'blue'; // Obstacle color
        context.fillRect(obstacle.x, obstacle.y, 10, 10); // Draw obstacle
    });
}

// Update the snake's position
function advanceSnake() {
    let head = {x: snake[0].x + dx, y: snake[0].y + dy}; // Calculate new head position

    // Canvas boundaries (assuming these are defined)
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Wrap snake position when it goes out of bounds
    if (head.x >= canvasWidth) {
        head.x = 0; // Wrap to the left side
    } else if (head.x < 0) {
        head.x = canvasWidth - 10; // Wrap to the right side, assuming segment size is 10
    }

    if (head.y >= canvasHeight) {
        head.y = 0; // Wrap to the top
    } else if (head.y < 0) {
        head.y = canvasHeight - 10; // Wrap to the bottom, assuming segment size is 10
    }

    snake.unshift(head); // Add the new head to the front of the snake

    const didEatFood = snake[0].x === foodX && snake[0].y === foodY; // Check if snake has eaten the food
    if (didEatFood) {
        score += 10; // Increase score
        updateScore(score)
        createFood(); // Generate new food
    } else {
        // Existing code to remove the last segment if food wasn't eaten
        snake.pop(); // Remove the last segment of the snake
    }
}

// Change the direction of the snake based on keyboard input
function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    const keyPressed = event.keyCode;
    const goingUp = dy === -10;
    const goingDown = dy === 10;
    const goingRight = dx === 10;
    const goingLeft = dx === -10;

    if (keyPressed === LEFT_KEY && !goingRight) { dx = -10; dy = 0; }
    if (keyPressed === UP_KEY && !goingDown) { dx = 0; dy = -10; }
    if (keyPressed === RIGHT_KEY && !goingLeft) { dx = 10; dy = 0; }
    if (keyPressed === DOWN_KEY && !goingUp) { dx = 0; dy = 10; }
}

function updateScore(score) {
    document.getElementById('score').innerText = 'Score: ' + score;
}

// Check if the game has ended
function didGameEnd() {
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true; // Snake collides with itself
    }
    const hitWall = snake[0].x < 0 || snake[0].x > canvas.width - 10 || snake[0].y < 0 || snake[0].y > canvas.height - 10;
    return snake.some(segment => obstacles.some(obstacle => segment.x === obstacle.x && segment.y === obstacle.y));
}

// Generate a new food location
function randomTen(min, max) {
    return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}

function createFood() {
    foodX = randomTen(0, canvas.width - 10);
    foodY = randomTen(0, canvas.height - 10);
    snake.forEach(part => {
        if (part.x == foodX && part.y == foodY) createFood(); // Recreate food if it's on the snake
    });
}

// Draw the food on the canvas
function drawFood() {
    context.fillStyle = 'red'; // Food color
    context.fillRect(foodX, foodY, 10, 10); // Draw food
}