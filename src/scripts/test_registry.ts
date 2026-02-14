
import { puzzleEngines } from '../puzzles/puzzleRegistry';

console.log("Loading puzzle registry...");
try {
    const keys = Object.keys(puzzleEngines);
    console.log(`Successfully loaded ${keys.length} engines:`, keys.join(', '));
} catch (e) {
    console.error("Failed to load puzzleEngines:", e);
}
