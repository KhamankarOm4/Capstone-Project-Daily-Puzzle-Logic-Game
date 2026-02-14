
import * as fs from 'fs';
import { puzzleEngines } from '../puzzles/puzzleRegistry';

const generateAllPracticeData = async () => {
    // ... code ...
    const seeds: Record<string, string> = {
        'mini-sudoku': 'a1b2c3d4e5f67890',
        'pattern-sequence': '1a2b3c4d5e6f7890',
        'deduction-grid': 'b1c2d3e4f5a67890',
        'number-sequence': 'c1d2e3f4a5b67890',
        'binary-grid': 'd1e2f3a4b5c67890',
        'constraint-path': 'e1f2a3b4c5d67890',
        'logic-operators': 'f1a2b3c4d5e67890',
        'rotating-pattern': 'a2b3c4d5e6f71890',
        'weighted-sudoku': 'b2c3d4e5f6a71890',
        'graph-coloring': 'c2d3e4f5a6b71890',
        'cryptarithm': 'd2e3f4a5b6c71890'
    };

    const results: any = {};

    for (const [type, engine] of Object.entries(puzzleEngines)) {
        const seed = seeds[type] || 'default-seed';
        try {
            const puzzle = await engine.generate(seed);
            results[type] = {
                id: `practice-${type}-1`,
                date: `Practice ${type}`,
                type: type,
                difficulty: 'Medium',
                data: puzzle.data,
                solution: puzzle.solution
            };
            console.log(`Generated ${type}`);
        } catch (e) {
            console.error(`Error generating ${type}:`, e);
        }
    }

    fs.writeFileSync('src/puzzles/practice_data.json', JSON.stringify(Object.values(results), null, 2));
    console.log("Data written to src/puzzles/practice_data.json");
};

generateAllPracticeData();
