let currentPlayer = "X";
let gameState = ["", "", "", "", "", "", "", "", ""];
const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];
let gameActive = true;
let gameMode = "player";
let difficulty = "easy";

function makeMove(index) {
    if (gameState[index] !== "" || !gameActive) {
        return;
    }

    gameState[index] = currentPlayer;
    document.getElementById(`cell${index}`).innerText = currentPlayer;
    document.getElementById(`cell${index}`).style.color = currentPlayer === "X" ? "#e43f5a" : "#4f8a8b";

    checkResult();

    if (gameActive && gameMode === "computer" && currentPlayer === "O") {
        setTimeout(computerMove, 500);
    }
}

function checkResult() {
    let roundWon = false;
    
    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        const a = gameState[winCondition[0]];
        const b = gameState[winCondition[1]];
        const c = gameState[winCondition[2]];
        
        if (a === "" || b === "" || c === "") {
            continue;
        }
        
        if (a === b && b === c) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        document.getElementById('status').innerText = `Player ${currentPlayer} Wins! 🎉`;
        document.getElementById('status').classList.add("winner");
        gameActive = false;
        return;
    }

    if (!gameState.includes("")) {
        document.getElementById('status').innerText = "It's a Draw! 🤝";
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    document.getElementById('status').innerText = `Player ${currentPlayer}'s turn`;
}

function restartGame() {
    currentPlayer = "X";
    gameState = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;
    document.getElementById('status').innerText = `Player ${currentPlayer}'s turn`;
    document.getElementById('status').classList.remove("winner");

    gameMode = document.getElementById('gameMode').value;
    difficulty = document.getElementById('difficulty').value;

    
    const difficultyDiv = document.getElementById('difficultyDiv');
    if (gameMode === "computer") {
        difficultyDiv.style.display = 'block';
    } else {
        difficultyDiv.style.display = 'none';
    }

    for (let i = 0; i < 9; i++) {
        document.getElementById(`cell${i}`).innerText = "";
    }
}

function computerMove() {
    if (difficulty === "easy") {
        makeRandomMove();
    } else if (difficulty === "medium") {
        if (!makeWinningMove()) {
            if (!blockPlayerWin()) {
                makeRandomMove();
            }
        }
    } else if (difficulty === "hard") {
        const bestMove = minimax(gameState, "O").index;
        makeMove(bestMove);
    }
}

function makeRandomMove() {
    const availableCells = gameState.map((val, index) => val === "" ? index : null).filter(val => val !== null);
    const randomIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
    makeMove(randomIndex);
}

function blockPlayerWin() {
    return blockOrWinMove("X");
}

function makeWinningMove() {
    return blockOrWinMove("O");
}

function blockOrWinMove(player) {
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (gameState[a] === player && gameState[b] === player && gameState[c] === "") {
            makeMove(c);
            return true;
        } else if (gameState[a] === player && gameState[c] === player && gameState[b] === "") {
            makeMove(b);
            return true;
        } else if (gameState[b] === player && gameState[c] === player && gameState[a] === "") {
            makeMove(a);
            return true;
        }
    }
    return false;
}


function minimax(newBoard, player) {
    const availableSpots = newBoard.map((val, index) => val === "" ? index : null).filter(val => val !== null);

    if (checkWinner(newBoard, "X")) {
        return { score: -10 };
    } else if (checkWinner(newBoard, "O")) {
        return { score: 10 };
    } else if (availableSpots.length === 0) {
        return { score: 0 };
    }

    const moves = [];
    for (let i = 0; i < availableSpots.length; i++) {
        const move = {};
        move.index = availableSpots[i];
        newBoard[availableSpots[i]] = player;

        if (player === "O") {
            move.score = minimax(newBoard, "X").score;
        } else {
            move.score = minimax(newBoard, "O").score;
        }

        newBoard[availableSpots[i]] = "";
        moves.push(move);
    }

    let bestMove;
    if (player === "O") {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}

function checkWinner(board, player) {
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (board[a] === player && board[b] === player && board[c] === player) {
            return true;
        }
    }
    return false;
}
