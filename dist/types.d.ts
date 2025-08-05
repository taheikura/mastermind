/**
 * Available colors for the Mastermind game
 */
export declare enum Color {
    RED = "R",
    BLUE = "B",
    GREEN = "G",
    YELLOW = "Y",
    WHITE = "W",
    BLACK = "K"
}
/**
 * Feedback for a guess
 */
export interface Feedback {
    correctPosition: number;
    correctColor: number;
}
/**
 * A guess attempt
 */
export interface GuessAttempt {
    guess: Color[];
    feedback: Feedback;
    attemptNumber: number;
}
/**
 * Game configuration
 */
export interface GameConfig {
    codeLength: number;
    maxAttempts: number;
    availableColors: Color[];
}
//# sourceMappingURL=types.d.ts.map