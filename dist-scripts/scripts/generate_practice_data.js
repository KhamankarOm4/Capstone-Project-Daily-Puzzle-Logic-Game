"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const puzzleEngineRegistry_1 = require("../src/puzzles/puzzleEngineRegistry");
const outputPath = path_1.default.join(__dirname, "practiceData.json");
const data = [];
for (const key in puzzleEngineRegistry_1.puzzleEngineRegistry) {
    const engine = puzzleEngineRegistry_1.puzzleEngineRegistry[key];
    if (engine.generatePuzzle) {
        const puzzle = engine.generatePuzzle();
        data.push({
            type: key,
            puzzle
        });
    }
}
fs_1.default.writeFileSync(outputPath, JSON.stringify(data, null, 2));
console.log("Practice data generated!");
