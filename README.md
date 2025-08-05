# Mastermind Game - Web Version

A classic single-player Mastermind game with a beautiful web interface, implemented in TypeScript.

## Game Rules

- The computer generates a secret code consisting of 4 colors
- Available colors: Red, Blue, Green, Yellow, White, Black (displayed as actual colors!)
- You have 8 attempts to guess the secret code
- After each guess, you receive visual feedback:
  - ⚫ Black pegs: Number of colors in correct position
  - ⚪ White pegs: Number of colors in the code but in wrong position
- Win by guessing the secret code within 8 attempts

## Features

✨ **Beautiful Web Interface**
- Graphical front page with game preview
- Visual color selection (no more letters!)
- Interactive game board with real-time feedback
- Responsive design that works on desktop and mobile

🎮 **Enhanced Gameplay**
- Click-to-select color palette
- Visual feedback with colored pegs
- Game state management with win/lose screens
- Play again functionality

## Installation & Setup

1. Make sure you have Node.js installed (version 14 or higher)
2. Install dependencies:
   ```bash
   npm install
   ```

## How to Play

1. **Start the game:**
   ```bash
   npm start
   ```
   This will build the project and open it in your browser at `http://localhost:3000`

2. **Alternative commands:**
   ```bash
   npm run dev    # Build and serve
   npm run build  # Build only
   npm run serve  # Serve existing build
   ```

3. **Gameplay:**
   - Click "Start Game" on the welcome screen
   - Select colors from the color palette by clicking on them
   - Click on empty slots to place colors (or they'll auto-fill)
   - Complete your 4-color guess and click "Submit Guess"
   - Review the feedback and refine your strategy
   - Try to crack the code within 8 attempts!

## Game Screens

### 🏠 **Welcome Screen**
- Game title and preview
- Quick rules summary
- Start game or view detailed instructions

### 📖 **Instructions Screen**
- Complete game rules
- Color legend with visual examples
- Feedback system explanation

### 🎯 **Game Screen**
- Interactive game board with 8 attempt rows
- Visual color palette for selection
- Real-time attempt counter
- Submit and clear controls

### 🎊 **Game Over Screen**
- Win/lose message with attempt count
- Secret code reveal
- Play again or return to menu options

## Controls

- **Color Selection**: Click on colors in the palette
- **Slot Selection**: Click on empty slots to place colors
- **Submit Guess**: Complete your guess and get feedback
- **Clear**: Reset your current guess
- **New Game**: Start over at any time

## Technical Features

- **TypeScript**: Full type safety and modern JavaScript features
- **Modular Design**: Separation of game logic and UI
- **Responsive CSS**: Works great on all screen sizes
- **No External Dependencies**: Pure web technologies
- **Local Server**: Includes development server for easy testing

## Project Structure

```
src/
├── types.ts      # Type definitions and interfaces
├── mastermind.ts # Core game logic (unchanged)
├── app.ts        # Web application and UI logic
├── index.html    # Main HTML structure
├── styles.css    # Complete styling and responsive design
├── interface.ts  # Legacy CLI interface (deprecated)
└── index.ts      # Legacy entry point (deprecated)
```

## Development

- **Build**: `npm run build`
- **Serve**: `npm run serve`
- **Development**: `npm run dev` (builds and serves)
- **Clean**: `npm run clean` (removes build files)
- **Test**: `npm test` (runs core logic tests)

## Browser Compatibility

- Modern browsers with ES2020 support
- Chrome, Firefox, Safari, Edge (recent versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Example Gameplay

1. **Welcome Screen** → Click "Start Game"
2. **Game Board** → Select colors and fill slots
3. **Submit Guess** → Get visual feedback
4. **Refine Strategy** → Use feedback to improve next guess
5. **Win/Lose** → View results and play again

The game now provides a much more engaging experience with visual colors, intuitive controls, and a polished interface. Enjoy cracking the code! 🎯

## Migration from CLI Version

The original command-line version is still available in the codebase but deprecated. The web version provides the same core game logic with a vastly improved user experience.
