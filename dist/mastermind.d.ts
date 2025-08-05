import { Color, Feedback, GuessAttempt, GameConfig } from './types';
/**
 * Core Mastermind game logic
 */
export declare class MastermindGame {
    private secretCode;
    private attempts;
    private config;
    private gameWon;
    private gameOver;
    constructor(config?: Partial<GameConfig>);
    /**
     * Generate a random secret code
     */
    private generateSecretCode;
    /**
     * Make a guess and get feedback
     */
    makeGuess(guess: Color[]): Feedback;
    /**
     * Calculate feedback for a guess
     */
    private calculateFeedback;
    /**
     * Get the current game state
     */
    getGameState(): {
        attempts: GuessAttempt[];
        attemptsRemaining: number;
        gameWon: boolean;
        gameOver: boolean;
        config: GameConfig;
    };
    /**
     * Get the secret code (only call when game is over)
     */
    getSecretCode(): Color[];
    /**
     * Reset the game
     */
    reset(): void;
    /**
     * Get available colors
     */
    getAvailableColors(): Color[];
}
//# sourceMappingURL=mastermind.d.ts.map