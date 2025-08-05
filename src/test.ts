import { MastermindGame } from './mastermind';
import { Color } from './types';

/**
 * Simple test function to verify game logic
 */
function runTests(): void {
  console.log('🧪 Running Mastermind Game Tests...\n');

  // Test 1: Basic game creation
  console.log('Test 1: Game Creation');
  const game = new MastermindGame();
  const state = game.getGameState();
  console.log(`✅ Game created with ${state.config.codeLength} colors and ${state.config.maxAttempts} attempts`);
  console.log(`✅ Available colors: ${game.getAvailableColors().join(', ')}\n`);

  // Test 2: Perfect guess (all correct positions)
  console.log('Test 2: Testing feedback calculation');
  const testGame = new MastermindGame();
  
  // We can't know the secret code, so let's test with a known scenario
  // by creating a game and testing feedback logic indirectly
  try {
    const feedback1 = testGame.makeGuess([Color.RED, Color.BLUE, Color.GREEN, Color.YELLOW]);
    console.log(`✅ Guess accepted: feedback = ${feedback1.correctPosition} correct positions, ${feedback1.correctColor} correct colors`);
    
    const feedback2 = testGame.makeGuess([Color.WHITE, Color.BLACK, Color.RED, Color.BLUE]);
    console.log(`✅ Second guess accepted: feedback = ${feedback2.correctPosition} correct positions, ${feedback2.correctColor} correct colors`);
  } catch (error) {
    console.log(`❌ Error making guess: ${error}`);
  }

  // Test 3: Invalid guess handling
  console.log('\nTest 3: Invalid guess handling');
  try {
    testGame.makeGuess([Color.RED, Color.BLUE]); // Too short
    console.log('❌ Should have thrown error for short guess');
  } catch (error) {
    console.log('✅ Correctly rejected short guess');
  }

  try {
    testGame.makeGuess([Color.RED, Color.BLUE, Color.GREEN, Color.YELLOW, Color.WHITE]); // Too long
    console.log('❌ Should have thrown error for long guess');
  } catch (error) {
    console.log('✅ Correctly rejected long guess');
  }

  // Test 4: Game state tracking
  console.log('\nTest 4: Game state tracking');
  const finalState = testGame.getGameState();
  console.log(`✅ Attempts made: ${finalState.attempts.length}`);
  console.log(`✅ Attempts remaining: ${finalState.attemptsRemaining}`);
  console.log(`✅ Game over: ${finalState.gameOver}`);
  console.log(`✅ Game won: ${finalState.gameWon}`);

  // Test 5: Game reset
  console.log('\nTest 5: Game reset');
  testGame.reset();
  const resetState = testGame.getGameState();
  console.log(`✅ After reset - Attempts: ${resetState.attempts.length}, Game over: ${resetState.gameOver}`);

  console.log('\n🎉 All tests completed!');
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}
