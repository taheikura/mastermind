// This file is now deprecated in favor of the web interface (app.ts)
// Command line interface for the Mastermind game - DEPRECATED

export class GameInterface {
  constructor() {
    console.log('Use the web interface instead - open index.html in your browser');
  }
  
  start(): void {
    console.log('Web interface available at: http://localhost:3000');
    console.log('Run: npm start');
  }
}
