const playGround = document.querySelector(".playground > ul");

const GAME_ROWS = 20;
const GAME_COLS = 10;

let score = 0;
let duration = 500;
let downInterval;
let tempMovingItem;


const movingItem = {
    type: 'ㅗ', 
    direction: 0, 
    top: 0, 
    left: 0, 
};


function init() {
    tempMovingItem = { ...movingItem };
    createBoard();
    renderBlocks();
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
            setTimeout(() => {
                renderBlocks();
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
    generateNewBlock();
}

function generateNewBlock() {
    movingItem.top = 0;
    movingItem.left = 3;
    movingItem.direction = 0;
    tempMovingItem = { ...movingItem };
    renderBlocks();
}

function createBoard() {
    for (let i = 0; i < GAME_ROWS; i ++) {
        const li = document.createElement("li");
        const ul = document.createElement("ul");

        for (let j = 0; j < GAME_COLS; j ++) {
            const matrix = document.createElement("li");
            ul.prepend(matrix);
        }

        li.prepend(ul);
        playGround.prepend(li);
    }
}

function moveBlock(moveType, amount) {
    tempMovingItem[moveType] += amount;
    renderBlocks(moveType);
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
        default:
            break;
    }
});

init();
