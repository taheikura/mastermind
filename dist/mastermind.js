import { Color } from './types';
/**
 * Core Mastermind game logic
 */
export class MastermindGame {
    constructor(config) {
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
    /**
     * Generate a random secret code
     */
    generateSecretCode() {
        const code = [];
        for (let i = 0; i < this.config.codeLength; i++) {
            const randomIndex = Math.floor(Math.random() * this.config.availableColors.length);
            code.push(this.config.availableColors[randomIndex]);
        }
        return code;
    }
    /**
     * Make a guess and get feedback
     */
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
        // Check if game is won
        if (feedback.correctPosition === this.config.codeLength) {
            this.gameWon = true;
            this.gameOver = true;
        }
        // Check if max attempts reached
        if (this.attempts.length >= this.config.maxAttempts) {
            this.gameOver = true;
        }
        return feedback;
    }
    /**
     * Calculate feedback for a guess
     */
    calculateFeedback(guess) {
        let correctPosition = 0;
        let correctColor = 0;
        // Count exact matches (correct position)
        const secretCopy = [...this.secretCode];
        const guessCopy = [...guess];
        for (let i = 0; i < this.config.codeLength; i++) {
            if (guessCopy[i] === secretCopy[i]) {
                correctPosition++;
                secretCopy[i] = null; // Mark as used
                guessCopy[i] = null; // Mark as used
            }
        }
        // Count color matches in wrong positions
        for (let i = 0; i < this.config.codeLength; i++) {
            if (guessCopy[i] !== null) {
                const indexInSecret = secretCopy.indexOf(guessCopy[i]);
                if (indexInSecret !== -1) {
                    correctColor++;
                    secretCopy[indexInSecret] = null; // Mark as used
                }
            }
        }
        return { correctPosition, correctColor };
    }
    /**
     * Get the current game state
     */
    getGameState() {
        return {
            attempts: [...this.attempts],
            attemptsRemaining: this.config.maxAttempts - this.attempts.length,
            gameWon: this.gameWon,
            gameOver: this.gameOver,
            config: this.config
        };
    }
    /**
     * Get the secret code (only call when game is over)
     */
    getSecretCode() {
        if (!this.gameOver) {
            throw new Error('Cannot reveal secret code while game is in progress');
        }
        return [...this.secretCode];
    }
    /**
     * Reset the game
     */
    reset() {
        this.secretCode = this.generateSecretCode();
        this.attempts = [];
        this.gameWon = false;
        this.gameOver = false;
    }
    /**
     * Get available colors
     */
    getAvailableColors() {
        return [...this.config.availableColors];
    }
}
//# sourceMappingURL=mastermind.js.map