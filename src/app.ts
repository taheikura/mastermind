import { MastermindGame } from './mastermind.js';
import { Color, Feedback } from './types.js';

/**
 * Web-based Mastermind Game Interface
 */
class WebMastermindGame {
    private game: MastermindGame;
    private currentGuess: (Color | null)[];
    private selectedColorIndex: number;

    // Screen elements
    private welcomeScreen!: HTMLElement;
    private instructionsScreen!: HTMLElement;
    private gameScreen!: HTMLElement;
    private gameOverScreen!: HTMLElement;

    // Game elements
    private gameBoard!: HTMLElement;
    private gameAttempts!: HTMLElement;
    private colorPalette!: HTMLElement;
    private attemptsInfo!: HTMLElement;
    private submitBtn!: HTMLButtonElement;
    private clearBtn!: HTMLButtonElement;

    constructor() {
        this.game = new MastermindGame();
        this.currentGuess = [null, null, null, null];
        this.selectedColorIndex = -1;

        this.initializeElements();
        this.setupEventListeners();
        this.showScreen('welcome');
    }

    private initializeElements(): void {
        // Screens
        this.welcomeScreen = document.getElementById('welcome-screen')!;
        this.instructionsScreen = document.getElementById('instructions-screen')!;
        this.gameScreen = document.getElementById('game-screen')!;
        this.gameOverScreen = document.getElementById('game-over-screen')!;

        // Game elements
        this.gameBoard = document.getElementById('game-attempts')!;
        this.colorPalette = document.querySelector('.palette-colors')!;
        this.attemptsInfo = document.getElementById('attempts-info')!;
        this.submitBtn = document.getElementById('submit-guess-btn') as HTMLButtonElement;
        this.clearBtn = document.getElementById('clear-guess-btn') as HTMLButtonElement;
    }

    private setupEventListeners(): void {
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
            const target = e.target as HTMLElement;
            if (target.classList.contains('color-option')) {
                this.selectColor(target.dataset.color as Color);
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

    private showScreen(screenName: string): void {
        const screens = document.querySelectorAll('.screen');
        screens.forEach(screen => screen.classList.remove('active'));

        const targetScreen = document.getElementById(`${screenName}-screen`);
        if (targetScreen) {
            targetScreen.classList.add('active');
        }
    }

    private startNewGame(): void {
        this.game.reset();
        this.currentGuess = [null, null, null, null];
        this.selectedColorIndex = -1;
        this.setupGameBoard();
        this.updateUI();
        this.showScreen('game');
    }

    private setupGameBoard(): void {
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

    private createGameRow(attemptNumber: number): HTMLElement {
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

    private selectColor(color: Color): void {
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

    private selectSlot(index: number): void {
        const currentRow = this.gameBoard.querySelector('.game-row.current');
        if (!currentRow) return;

        // Update slot selection
        currentRow.querySelectorAll('.color-slot').forEach((slot, i) => {
            slot.classList.toggle('selected', i === index);
        });

        this.selectedColorIndex = index;
    }

    private setSlotColor(index: number, color: Color): void {
        this.currentGuess[index] = color;
        
        const currentRow = this.gameBoard.querySelector('.game-row.current');
        if (!currentRow) return;

        const slot = currentRow.querySelector(`[data-position="${index}"]`) as HTMLElement;
        if (slot) {
            slot.className = `color-slot filled ${this.getColorClass(color)}`;
            slot.textContent = '';
        }
    }

    private selectNextEmptySlot(): void {
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

    private clearCurrentGuess(): void {
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

    private submitGuess(): void {
        const guess = this.currentGuess.filter(color => color !== null) as Color[];
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

    private updateGameRow(feedback: Feedback): void {
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

    private moveToNextRow(): void {
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

    private endGame(): void {
        const gameState = this.game.getGameState();
        const secretCode = this.game.getSecretCode();

        // Reveal secret code
        const secretRow = document.getElementById('secret-row');
        if (secretRow) {
            secretRow.classList.add('revealed');
            const secretSlots = secretRow.querySelectorAll('.secret-slot');
            secretSlots.forEach((slot, index) => {
                const slotElement = slot as HTMLElement;
                slotElement.className = `color-slot secret-slot revealed ${this.getColorClass(secretCode[index])}`;
                slotElement.textContent = '';
            });
        }

        // Show game over screen
        this.showGameOverScreen(gameState.gameWon, gameState.attempts.length, secretCode);
    }

    private showGameOverScreen(won: boolean, attempts: number, secretCode: Color[]): void {
        const gameResult = document.getElementById('game-result')!;
        const revealedCode = document.getElementById('revealed-code')!;

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

    private updateUI(): void {
        const gameState = this.game.getGameState();
        
        // Update attempts info
        if (this.attemptsInfo) {
            const currentAttempt = gameState.attempts.length + 1;
            this.attemptsInfo.textContent = `Attempt ${currentAttempt} of ${gameState.config.maxAttempts}`;
        }

        this.updateSubmitButton();
    }

    private updateSubmitButton(): void {
        const hasCompleteGuess = this.currentGuess.every(color => color !== null);
        this.submitBtn.disabled = !hasCompleteGuess;
    }

    private getColorClass(color: Color): string {
        const colorMap: Record<Color, string> = {
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
