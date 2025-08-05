// This file is now for Node.js testing only
// The main web application is in app.ts
/**
 * Main entry point for the Node.js version (for testing)
 */
function main() {
    console.log('For the web version, open index.html in your browser');
    console.log('This Node.js version is for testing only');
    // Uncomment the line below to run the command-line version
    // const gameInterface = new GameInterface();
    // gameInterface.start();
}
// Run if executed directly in Node.js
if (typeof window === 'undefined' && typeof require !== 'undefined' && require.main === module) {
    main();
}
export { main };
//# sourceMappingURL=index.js.map