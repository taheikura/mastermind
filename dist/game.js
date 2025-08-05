// Single-file Mastermind Game - All-in-one version to avoid module loading issues

// Types and Enums
const Color = {
    RED: 'R',
    BLUE: 'B', 
    GREEN: 'G',
    YELLOW: 'Y',
    WHITE: 'W',
    BLACK: 'K'
};

// Core Game Logic
class MastermindGame {
    constructor(config = {}) {
        this.config = {
            codeLength: 4,
            maxAttempts: 8,
            availableColors: [Color.RED, Color.BLUE, Color.GREEN, Color.YELLOW, Color.WHITE, Color.BLACK],
            ...config
        };
        
        this.secretCode = this.generateSecretCode();
        this.attempts = [];
        this.gameWon = false;
        this.gameOver = false;
    }

    generateSecretCode() {
        const code = [];
        for (let i = 0; i < this.config.codeLength; i++) {
            const randomIndex = Math.floor(Math.random() * this.config.availableColors.length);
            code.push(this.config.availableColors[randomIndex]);
        }
        return code;
    }

    makeGuess(guess) {
        if (this.gameOver) {
            throw new Error('Game is already over');
        }

        if (guess.length !== this.config.codeLength) {
            throw new Error(`Guess must be ${this.config.codeLength} colors long`);
        }

        if (!guess.every(color => this.config.availableColors.includes(color))) {
            throw new Error('Invalid color in guess');
        }

        const feedback = this.calculateFeedback(guess);
        const attemptNumber = this.attempts.length + 1;
        
        this.attempts.push({
            guess: [...guess],
            feedback,
            attemptNumber
        });

        if (feedback.correctPosition === this.config.codeLength) {
            this.gameWon = true;
            this.gameOver = true;
        }

        if (this.attempts.length >= this.config.maxAttempts) {
            this.gameOver = true;
        }

        return feedback;
    }

    calculateFeedback(guess) {
        let correctPosition = 0;
        let correctColor = 0;

        const secretCopy = [...this.secretCode];
        const guessCopy = [...guess];

        for (let i = 0; i < this.config.codeLength; i++) {
            if (guessCopy[i] === secretCopy[i]) {
                correctPosition++;
                secretCopy[i] = null;
                guessCopy[i] = null;
            }
        }

        for (let i = 0; i < this.config.codeLength; i++) {
            if (guessCopy[i] !== null) {
                const indexInSecret = secretCopy.indexOf(guessCopy[i]);
                if (indexInSecret !== -1) {
                    correctColor++;
                    secretCopy[indexInSecret] = null;
                }
            }
        }

        return { correctPosition, correctColor };
    }

    getGameState() {
        return {
            attempts: [...this.attempts],
            attemptsRemaining: this.config.maxAttempts - this.attempts.length,
            gameWon: this.gameWon,
            gameOver: this.gameOver,
            config: this.config
        };
    }

    getSecretCode() {
        if (!this.gameOver) {
            throw new Error('Cannot reveal secret code while game is in progress');
        }
        return [...this.secretCode];
    }

    reset() {
        this.secretCode = this.generateSecretCode();
        this.attempts = [];
        this.gameWon = false;
        this.gameOver = false;
    }

    getAvailableColors() {
        return [...this.config.availableColors];
    }
}

// Web Interface
class WebMastermindGame {
    constructor() {
        this.game = new MastermindGame();
        this.currentGuess = [null, null, null, null];
        this.selectedColorIndex = -1;

        this.initializeElements();
        this.setupEventListeners();
        this.showScreen('welcome');
    }

    initializeElements() {
        // Screens
        this.welcomeScreen = document.getElementById('welcome-screen');
        this.instructionsScreen = document.getElementById('instructions-screen');
        this.gameScreen = document.getElementById('game-screen');
        this.gameOverScreen = document.getElementById('game-over-screen');

        // Game elements
        this.gameBoard = document.getElementById('game-attempts');
        this.colorPalette = document.querySelector('.palette-colors');
        this.attemptsInfo = document.getElementById('attempts-info');
        this.submitBtn = document.getElementById('submit-guess-btn');
        this.clearBtn = document.getElementById('clear-guess-btn');
    }

    setupEventListeners() {
        // Welcome screen
        document.getElementById('start-game-btn')?.addEventListener('click', () => {
            this.startNewGame();
        });

        document.getElementById('instructions-btn')?.addEventListener('click', () => {
            this.showScreen('instructions');
        });

        // Instructions screen
        document.getElementById('back-to-welcome-btn')?.addEventListener('click', () => {
            this.showScreen('welcome');
        });

        document.getElementById('start-from-instructions-btn')?.addEventListener('click', () => {
            this.startNewGame();
        });

        // Game screen
        document.getElementById('new-game-btn')?.addEventListener('click', () => {
            this.startNewGame();
        });

        this.submitBtn?.addEventListener('click', () => {
            this.submitGuess();
        });

        this.clearBtn?.addEventListener('click', () => {
            this.clearCurrentGuess();
        });

        // Color palette
        this.colorPalette?.addEventListener('click', (e) => {
            const target = e.target;
            if (target.classList.contains('color-option')) {
                this.selectColor(target.dataset.color);
            }
        });

        // Game Over screen
        document.getElementById('play-again-btn')?.addEventListener('click', () => {
            this.startNewGame();
        });

        document.getElementById('back-to-menu-btn')?.addEventListener('click', () => {
            this.showScreen('welcome');
        });
    }

    showScreen(screenName) {
        const screens = document.querySelectorAll('.screen');
        screens.forEach(screen => screen.classList.remove('active'));

        const targetScreen = document.getElementById(`${screenName}-screen`);
        if (targetScreen) {
            targetScreen.classList.add('active');
        }
    }

    startNewGame() {
        this.game.reset();
        this.currentGuess = [null, null, null, null];
        this.selectedColorIndex = -1;
        this.setupGameBoard();
        this.updateUI();
        this.showScreen('game');
    }

    setupGameBoard() {
        this.gameBoard.innerHTML = '';
        
        // Create rows for all attempts
        for (let i = 0; i < this.game.getGameState().config.maxAttempts; i++) {
            const row = this.createGameRow(i + 1);
            this.gameBoard.appendChild(row);
        }

        // Set first row as current
        const firstRow = this.gameBoard.querySelector('.game-row');
        if (firstRow) {
            firstRow.classList.add('current');
        }
    }

    createGameRow(attemptNumber) {
        const row = document.createElement('div');
        row.className = 'game-row';
        row.dataset.attempt = attemptNumber.toString();

        row.innerHTML = `
            <div class="row-label">${attemptNumber}.</div>
            <div class="guess-section">
                <div class="color-slot" data-position="0"></div>
                <div class="color-slot" data-position="1"></div>
                <div class="color-slot" data-position="2"></div>
                <div class="color-slot" data-position="3"></div>
            </div>
            <div class="feedback-section">
                <div class="feedback-peg empty"></div>
                <div class="feedback-peg empty"></div>
                <div class="feedback-peg empty"></div>
                <div class="feedback-peg empty"></div>
            </div>
        `;

        // Add click listeners to color slots in current row
        if (attemptNumber === this.game.getGameState().attempts.length + 1) {
            const colorSlots = row.querySelectorAll('.color-slot');
            colorSlots.forEach((slot, index) => {
                slot.addEventListener('click', () => {
                    this.selectSlot(index);
                });
            });
        }

        return row;
    }

    selectColor(color) {
        // Update color palette selection
        this.colorPalette.querySelectorAll('.color-option').forEach(option => {
            option.classList.remove('selected');
        });
        
        const selectedOption = this.colorPalette.querySelector(`[data-color="${color}"]`);
        if (selectedOption) {
            selectedOption.classList.add('selected');
        }

        // If a slot is selected, fill it with the color
        if (this.selectedColorIndex >= 0) {
            this.setSlotColor(this.selectedColorIndex, color);
            this.selectNextEmptySlot();
        } else {
            // Auto-select first empty slot
            const firstEmptyIndex = this.currentGuess.findIndex(slot => slot === null);
            if (firstEmptyIndex >= 0) {
                this.setSlotColor(firstEmptyIndex, color);
                this.selectNextEmptySlot();
            }
        }

        this.updateSubmitButton();
    }

    selectSlot(index) {
        const currentRow = this.gameBoard.querySelector('.game-row.current');
        if (!currentRow) return;

        // Update slot selection
        currentRow.querySelectorAll('.color-slot').forEach((slot, i) => {
            slot.classList.toggle('selected', i === index);
        });

        this.selectedColorIndex = index;
    }

    setSlotColor(index, color) {
        this.currentGuess[index] = color;
        
        const currentRow = this.gameBoard.querySelector('.game-row.current');
        if (!currentRow) return;

        const slot = currentRow.querySelector(`[data-position="${index}"]`);
        if (slot) {
            slot.className = `color-slot filled ${this.getColorClass(color)}`;
            slot.textContent = '';
        }
    }

    selectNextEmptySlot() {
        const nextEmptyIndex = this.currentGuess.findIndex(slot => slot === null);
        if (nextEmptyIndex >= 0) {
            this.selectSlot(nextEmptyIndex);
        } else {
            this.selectedColorIndex = -1;
            const currentRow = this.gameBoard.querySelector('.game-row.current');
            if (currentRow) {
                currentRow.querySelectorAll('.color-slot').forEach(slot => {
                    slot.classList.remove('selected');
                });
            }
        }
    }

    clearCurrentGuess() {
        this.currentGuess = [null, null, null, null];
        this.selectedColorIndex = -1;

        const currentRow = this.gameBoard.querySelector('.game-row.current');
        if (currentRow) {
            currentRow.querySelectorAll('.color-slot').forEach((slot, index) => {
                slot.className = 'color-slot';
                slot.textContent = '';
            });
        }

        // Clear color palette selection
        this.colorPalette.querySelectorAll('.color-option').forEach(option => {
            option.classList.remove('selected');
        });

        this.updateSubmitButton();
    }

    submitGuess() {
        const guess = this.currentGuess.filter(color => color !== null);
        if (guess.length !== 4) return;

        try {
            const feedback = this.game.makeGuess(guess);
            this.updateGameRow(feedback);
            this.currentGuess = [null, null, null, null];
            this.selectedColorIndex = -1;

            const gameState = this.game.getGameState();
            if (gameState.gameOver) {
                this.endGame();
            } else {
                this.moveToNextRow();
            }

            this.updateUI();
        } catch (error) {
            console.error('Error submitting guess:', error);
        }
    }

    updateGameRow(feedback) {
        const currentRow = this.gameBoard.querySelector('.game-row.current');
        if (!currentRow) return;

        // Update feedback pegs
        const feedbackPegs = currentRow.querySelectorAll('.feedback-peg');
        let pegIndex = 0;

        // Add black pegs for correct positions
        for (let i = 0; i < feedback.correctPosition; i++) {
            if (feedbackPegs[pegIndex]) {
                feedbackPegs[pegIndex].className = 'feedback-peg black';
                pegIndex++;
            }
        }

        // Add white pegs for correct colors in wrong positions
        for (let i = 0; i < feedback.correctColor; i++) {
            if (feedbackPegs[pegIndex]) {
                feedbackPegs[pegIndex].className = 'feedback-peg white';
                pegIndex++;
            }
        }

        // Mark row as completed
        currentRow.classList.remove('current');
        currentRow.classList.add('completed');
    }

    moveToNextRow() {
        const gameState = this.game.getGameState();
        const nextAttempt = gameState.attempts.length + 1;
        
        if (nextAttempt <= gameState.config.maxAttempts) {
            const nextRow = this.gameBoard.querySelector(`[data-attempt="${nextAttempt}"]`);
            if (nextRow) {
                nextRow.classList.add('current');
                
                // Add click listeners to new current row
                const colorSlots = nextRow.querySelectorAll('.color-slot');
                colorSlots.forEach((slot, index) => {
                    slot.addEventListener('click', () => {
                        this.selectSlot(index);
                    });
                });
            }
        }
    }

    endGame() {
        const gameState = this.game.getGameState();
        const secretCode = this.game.getSecretCode();

        // Reveal secret code
        const secretRow = document.getElementById('secret-row');
        if (secretRow) {
            secretRow.classList.add('revealed');
            const secretSlots = secretRow.querySelectorAll('.secret-slot');
            secretSlots.forEach((slot, index) => {
                slot.className = `color-slot secret-slot revealed ${this.getColorClass(secretCode[index])}`;
                slot.textContent = '';
            });
        }

        // Show game over screen
        this.showGameOverScreen(gameState.gameWon, gameState.attempts.length, secretCode);
    }

    showGameOverScreen(won, attempts, secretCode) {
        const gameResult = document.getElementById('game-result');
        const revealedCode = document.getElementById('revealed-code');

        if (won) {
            gameResult.innerHTML = `
                <div class="win-message">🎉 Congratulations!</div>
                <div class="result-details">You cracked the code in ${attempts} attempt${attempts === 1 ? '' : 's'}!</div>
            `;
        } else {
            gameResult.innerHTML = `
                <div class="lose-message">💔 Game Over</div>
                <div class="result-details">You ran out of attempts. Better luck next time!</div>
            `;
        }

        // Show secret code
        revealedCode.innerHTML = secretCode.map(color => 
            `<div class="color-slot filled ${this.getColorClass(color)}"></div>`
        ).join('');

        this.showScreen('game-over');
    }

    updateUI() {
        const gameState = this.game.getGameState();
        
        // Update attempts info
        if (this.attemptsInfo) {
            const currentAttempt = gameState.attempts.length + 1;
            this.attemptsInfo.textContent = `Attempt ${currentAttempt} of ${gameState.config.maxAttempts}`;
        }

        this.updateSubmitButton();
    }

    updateSubmitButton() {
        const hasCompleteGuess = this.currentGuess.every(color => color !== null);
        this.submitBtn.disabled = !hasCompleteGuess;
    }

    getColorClass(color) {
        const colorMap = {
            [Color.RED]: 'red',
            [Color.BLUE]: 'blue',
            [Color.GREEN]: 'green',
            [Color.YELLOW]: 'yellow',
            [Color.WHITE]: 'white',
            [Color.BLACK]: 'black'
        };
        return colorMap[color] || '';
    }
}

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WebMastermindGame();
});
