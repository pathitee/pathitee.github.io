var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var cw = canvas.height;
var ch = canvas.width;
console.log(cw, ch);

window.onload = async function () {
    init();
    requestAnimationFrame(animate);

}

const URL = "https://pathitee.github.io/";
    async function createModel() {
        const checkpointURL = URL + "model.json"; // model topology
        const metadataURL = URL + "metadata.json"; // model metadata

        const recognizer = speechCommands.create(
            "BROWSER_FFT", // fourier transform type, not useful to change
            undefined, // speech commands vocabulary feature, not useful for your models
            checkpointURL,
            metadataURL);

        // check that model and metadata are loaded via HTTPS requests.
        await recognizer.ensureModelLoaded();

        return recognizer;
    }

    async function init() {
        const recognizer = await createModel();
        const classLabels = recognizer.wordLabels(); // get class labels
        const labelContainer = document.getElementById("label-container");

        for (let i = 0; i < classLabels.length; i++) {
            labelContainer.appendChild(document.createElement("div"));
        }
        // listen() takes two arguments:
        // 1. A callback function that is invoked anytime a word is recognized.
        // 2. A configuration object with adjustable fields
        recognizer.listen(result => {
            if (result.scores[1] > 0.60) {
                isJumping = true;
                velocityY = jumpStrength;
            }

            const scores = result.scores; // probability of prediction for each class
            // render the probability scores per class
            for (let i = 0; i < classLabels.length; i++) {
                const classPrediction = classLabels[i] + ": " + result.scores[i].toFixed(2);
                labelContainer.childNodes[i].innerHTML = classPrediction;
            }
        }, {
            includeSpectrogram: true, // in case listen should return result.spectrogram
            probabilityThreshold: 0.75,
            invokeCallbackOnNoiseAndUnknown: true,
            overlapFactor: 0.50 // probably want between 0.5 and 0.75. More info in README
        });

        // Stop the recognition in 5 seconds.
        // setTimeout(() => recognizer.stopListening(), 5000);
    }

gameOver = false;


const Controls = {
    UP: "KeyW",
    DOWN: "KeyS",
    LEFT: "KeyA",
    RIGHT: "KeyD",
    JUMP: "Space",
    RESET: "KeyR"
}


var player = {
    x: 20,
    y: 20,
    width: 40,
    height: 40,
    x: cw / 2 - 120,
    y: ch - 40,
    speed: 4
}

var obstacle = {
    x: 20,
    y: 20,
    width: 40,
    height: 40,
    x: cw - 40,
    y: ch - 40,
    speed: 1.4
}

var gameObjects = [player, obstacle]





function animate(time) {
    if (isCollision()) {
        gameOver = true;
        requestAnimationFrame(animate);
    }

    if (!gameOver) {
        playerJump();
        moveObstacle();
        draw();
        requestAnimationFrame(animate);
    } 
   
}


function resetGame() {
    resetObstacle();
    gameOver = false;
}


function draw() {
    ctx.clearRect(0, 0, cw, ch);
    for (var i = 0; i < gameObjects.length; i++) {
        var r=gameObjects[i]
        ctx.strokeRect(r.x, r.y, r.width, r.height);
    }
}

function moveObstacle() {
    if (obstacle.x < 0 - obstacle.width) {
        resetObstacle();
    }
    obstacle.x -= obstacle.speed;
}
function resetObstacle() {
    obstacle.x = cw
}

function isCollision() {
    if (
        player.x < obstacle.x + obstacle.width && 
        player.x + player.width > obstacle.x && 
        player.y < obstacle.y + obstacle.height &&
        player.y + player.height > obstacle.y
    ) {
        return true;
    }
    return false;
}



document.addEventListener('keydown', function(event) {
    switch(event.code) {
        case Controls.LEFT:
            console.log(event.code);
            player.x -= player.speed;
            break;
        case Controls.RIGHT:
            console.log(event.code);
            player.x += player.speed;
            break;
        case Controls.UP:
            console.log(event.code);
            player.y -= player.speed;   
            break;  
        case Controls.DOWN:
            console.log(event.code);
            player.y += player.speed;
            break;
        case Controls.JUMP:
            console.log(event.code);
            isJumping = true
            velocityY = jumpStrength;
            break;
        case Controls.JUMP:
            console.log(event.code);
            isJumping = true
            velocityY = jumpStrength;
            break;
        case Controls.RESET:
            resetGame();
            break;
        default:
            console.log(event.code);
            break;
    }
});

// CHATGPT HYPPYJUTTU
var gravity = 0.13;  // Gravity pulls the player down
var jumpStrength = -7;  // Initial jump force (negative moves up)
var isJumping = false;
var velocityY = 0;  // Ver


function playerJump() {
    if (isJumping) {
        player.y += velocityY;  // Move the player based on velocity
        velocityY += gravity;   // Apply gravity

        // Stop jumping when player reaches the ground
        if (player.y >= ch - player.height) {
            player.y = ch - player.height;
            isJumping = false;
            velocityY = 0;
        }
    }
}

