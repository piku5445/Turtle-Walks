
const board = document.querySelector("#board");
const scoreBoard = document.querySelector("#scoreBoard"); 
let inputDir = { x: 0, y: 0 };
let speed = 10;
let eat = new Audio("food.mp3");
let gameOver = new Audio("sound3.mp3");
let move = new Audio("sound2.mp3");
let lastPaintTime = 0;
let point = 0;
let rotate = 0;
let hi = document.querySelector("#hi");

// Turtle Initial Position
let turtle = { x: 13, y: 15 };

// Food Initial Position
let food = { x: 6, y: 7 };

// Store all trunks
let trunkArray = [];

function handleKeyDown(e) {
    const turtleElement = document.querySelector(".turtle");
    if (!e.key.includes("Arrow")) return;
    move.play();
    let eyeLeft = "15px"; // Default eye position
    let eyeTop = "15px"; // Default eye height
    let flipped = false;


    switch (e.key) {
        case "ArrowUp":
            inputDir = { x: 0, y: -1 };
            rotate = -90;
            eyeLeft='25px'
            eyeTop='5px'
            break;
        case "ArrowDown":
            inputDir = { x: 0, y: 1 };
            rotate = 90;
            eyeLeft='15px'
            eyeTop='25px'
            break;
        case "ArrowLeft":
            inputDir = { x: -1, y: 0 };
            rotate = 180
            eyeLeft='35px'

            flipped = false;
            break;
        case "ArrowRight":
            inputDir = { x: 1, y: 0 };
            rotate = 0;
            eyeLeft='15px'
            flipped = true;
            break;
    }

    
    turtleElement.style.setProperty("--rotate", `${rotate}deg`);
    turtleElement.style.setProperty("--rotateX", flipped ? "180deg" : "0deg");
    turtleElement.style.setProperty("--eye-left", eyeLeft);
    turtleElement.style.setProperty("--eye-top", eyeTop);
}


// Function to check collision with trunks
function isCollide() {
    return trunkArray.some(trunk => trunk.x === turtle.x && trunk.y === turtle.y) ||
           turtle.x >= 18 || turtle.x <= 1 || turtle.y >= 18 || turtle.y <= 1;
}

function gameEngine() {
    // Game Over Check
    if (isCollide()) {
        gameOver.play();
        move.pause();
        alert("Game Over. Press any key to play again!");
        turtle = { x: 13, y: 15 };
        point = 0;
        trunkArray = []; // Clear all trunks
        return;
    }

    // If Turtle Eats Food
    if (turtle.x === food.x && turtle.y === food.y) {
        point += 1;
        if(point>high){
            high = point;
            localStorage.setItem("hiscore",JSON.stringify(high));
            hi.innerHTML = "High Score: " + high;
        }
        scoreBoard.innerText = `Score: ${point}`;
        eat.play();

        // Generate New Food Position
        let a = 2, b = 16;
        food = {
            x: Math.round(a + (b - a) * Math.random()),
            y: Math.round(a + (b - a) * Math.random())
        };
    }

    // Move Turtle
    turtle.x += inputDir.x;
    turtle.y += inputDir.y;

    // Clear Board
    board.innerHTML = "";

    // Render Turtle
    let turtleElement = document.createElement("div");
    // turtleElement.src = "img1.jpg";
    turtleElement.className = "turtle";
    let eye = document.createElement("div");
    eye.className = "eye";
    turtleElement.appendChild(eye);
    turtleElement.style.gridRowStart = turtle.y;
    turtleElement.style.gridColumnStart = turtle.x;
    turtleElement.classList.add("turtle");
    board.appendChild(turtleElement);

    // Render Food
    let foodElement = document.createElement("img");
    foodElement.src = "img3.jpg";
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add("perry");
    board.appendChild(foodElement);

    // Render Trunks
    trunkArray.forEach(trunk => {
        let trunkElement = document.createElement("div");
        trunkElement.classList.add("trunk");
        trunkElement.style.gridRowStart = trunk.y;
        trunkElement.style.gridColumnStart = trunk.x;
        board.appendChild(trunkElement);
    });
}

// Function to create trunks independently
function createRandomTrunk() {
    let trunkX = Math.floor(Math.random() * (17 - 1) + 1); // Random position
    let trunk = { x: trunkX, y: 18 }; // Start at the bottom
    trunkArray.push(trunk);
}

// Move trunks independently every 300ms
setInterval(() => {
    for (let i = 0; i < trunkArray.length; i++) {
        trunkArray[i].y -= 1; // Move trunk up

        // Remove trunks that reach the top
        if (trunkArray[i].y < 1) {
            trunkArray.splice(i, 1);
            i--; // Adjust index after removal
        }
    }
}, 300);

// Generate trunks every 2 seconds
setInterval(createRandomTrunk, 2000);
let hiscore = localStorage.getItem("hiscore");

if(hiscore === null){
    let high = 0;
    localStorage.setItem("hiscore",JSON.stringify(high))
}else{
    let hi = document.querySelector("#hi");
    high=JSON.parse(hiscore);
    hi.innerHTML = "High Score: " + hiscore;

}
// Game loop (only updates turtle logic)
function main(ctime) {
    window.requestAnimationFrame(main);
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

// Start the game loop
window.requestAnimationFrame(main);

// Add event listener for keydown
window.addEventListener("keydown", handleKeyDown);
