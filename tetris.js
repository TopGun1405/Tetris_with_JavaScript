import BLOCKS from "./blocks.js"


const playGround = document.querySelector(".playground > ul");
const gameText = document.querySelector(".game-text");
const scoreDisplay = document.querySelector(".score");
const restartButton = document.querySelector(".game-text > button");

const GAME_ROWS = 20;
const GAME_COLS = 10;

let score = 0;
let duration = 500;
let downInterval;
let tempMovingItem;


const movingItem = {
    type: '', 
    direction: 0, 
    top: 0, 
    left: 0, 
};


function init() {
    tempMovingItem = { ...movingItem };
    for (let i = 0; i < GAME_ROWS; i ++) {
        prependNewLine();
    }
    generateNewBlock();
}

function renderBlocks(moveType='') {
    const { type, direction, top, left } = tempMovingItem;
    const movingBlocks = document.querySelectorAll(".moving");

    movingBlocks.forEach(moving => {
        moving.classList.remove(type, "moving");
    })

    BLOCKS[type][direction].some(block => {
        const x = block[0] + left;
        const y = block[1] + top;

        const target = playGround.childNodes[y] ? playGround.childNodes[y].childNodes[0].childNodes[x] : null;
        const isAvailable = checkEmpty(target);

        if (isAvailable) {
            target.classList.add(type, "moving");
        }
        else {
            tempMovingItem = { ...movingItem };

            if (moveType === "retry") {
                clearInterval(downInterval);
                showGameOverText();
            }

            setTimeout(() => {
                renderBlocks("retry");
                if (moveType === "top") {
                    seizeBlocks();
                }
            }, 0);
            return true;
        }
    })
    movingItem.left = left;
    movingItem.top = top;
    movingItem.direction = direction;
}

function checkEmpty(target) {
    if (!target || target.classList.contains("seized")) {
        return false;
    }
    return true;
}

function seizeBlocks() {
    const movingBlocks = document.querySelectorAll(".moving");
    movingBlocks.forEach(moving => {
        moving.classList.remove("moving");
        moving.classList.add("seized");
    });
    checkMatch();
}

function checkMatch() {
    const allChildNodes = playGround.childNodes;

    allChildNodes.forEach(child => {
        let isMatched = true;
        child.children[0].childNodes.forEach(li => {
            if (!li.classList.contains("seized")) {
                isMatched = false;
            }
        });
        if (isMatched) {
            child.remove();
            prependNewLine();
        }
    });

    generateNewBlock();
}

function showGameOverText() {
    gameText.style.display = "flex";

}

function generateNewBlock() {

    clearInterval(downInterval);
    downInterval = setInterval(() => {
        moveBlock("top", 1);
    }, duration);

    const blocksArray = Object.entries(BLOCKS);
    const randomIndex = Math.floor(Math.random() * blocksArray.length);
    
    movingItem.type = blocksArray[randomIndex][0];
    movingItem.top = 0;
    movingItem.left = 3;
    movingItem.direction = 0;
    tempMovingItem = { ...movingItem };
    renderBlocks();
}

function prependNewLine() {
    const li = document.createElement("li");
    const ul = document.createElement("ul");

    for (let j = 0; j < GAME_COLS; j ++) {
        const matrix = document.createElement("li");
        ul.prepend(matrix);
    }

    li.prepend(ul);
    playGround.prepend(li);
}

function moveBlock(moveType, amount) {
    tempMovingItem[moveType] += amount;
    renderBlocks(moveType);
}

function dropBlock() {
    clearInterval(downInterval);
    downInterval = setInterval(() => {
        moveBlock("top", 1);
    }, 10);
}

function changeDirection() {
    const direction = tempMovingItem.direction;
    direction === 3 ? tempMovingItem.direction = 0 : tempMovingItem.direction += 1;
    renderBlocks();
}

document.addEventListener("keydown", e => {
    switch(e.keyCode) {
        case 39:
            moveBlock("left", 1);
            break;
        case 37:
            moveBlock("left", -1);
            break;
        case 40:
            moveBlock("top", 1);
            break;
        case 38:
            changeDirection();
            break;
        case 32:
            dropBlock();
            break;
        default:
            break;
    }
});

restartButton.addEventListener("click", () => {
    playGround.innerHTML = '';
    gameText.style.display = "none";
    init();
})

init();
