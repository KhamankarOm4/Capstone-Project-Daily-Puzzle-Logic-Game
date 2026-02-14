import { fileURLToPath } from "url";

import fs from "fs";
import path from "path";
import { puzzleEngineRegistry } from "../src/puzzles/puzzleEngineRegistry";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputPath = path.join(__dirname, "practiceData.json");


const data: any[] = [];

for (const key in puzzleEngineRegistry) {
  const engine = (puzzleEngineRegistry as any)[key];
  if (engine.generatePuzzle) {
    const puzzle = engine.generatePuzzle();
    data.push({
      type: key,
      puzzle
    });
  }
}

fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));

console.log("Practice data generated!");
