import type { PuzzleType } from './puzzleRegistry';

export interface PuzzleInstruction {
    title: string;
    description: string;
    rules: string[];
    example?: string;
}

export const puzzleInstructions: Record<PuzzleType, PuzzleInstruction> = {
    'mini-sudoku': {
        title: 'Mini Sudoku',
        description: 'Fill the grid with numbers so that every row, column, and region contains each number exactly once.',
        rules: [
            'Use numbers 1-4 (or 1-6 for larger grids).',
            'Each row must contain each number once.',
            'Each column must contain each number once.',
            'Each bold outline region (box) must contain each number once.'
        ]
    },
    'pattern-sequence': {
        title: 'Pattern Sequence',
        description: 'Identify the next pattern in the sequence based on the changing rules.',
        rules: [
            'Observe how symbols move, rotate, or change color.',
            'Find the underlying logic driving the changes.',
            'Select the option that logically follows the sequence.'
        ]
    },
    'deduction-grid': {
        title: 'Logic Grid',
        description: 'Use the clues to deduce the correct relationships between items.',
        rules: [
            'Read the clues carefully (e.g., "Alice is not the Doctor").',
            'Mark squares as X (false) or O (true) based on clues.',
            'Use logic to fill in the rest: once a connection is found (O), other options in that row/column are elimated (X).'
        ]
    },
    'number-sequence': {
        title: 'Number Sequence',
        description: 'Find the missing number in the mathematical sequence.',
        rules: [
            'Look for arithmetic (add/subtract) or geometric (multiply/divide) patterns.',
            'Check for alternating patterns or secondary sequences.',
            'Enter the number that completes the pattern.'
        ]
    },
    'binary-grid': {
        title: 'Binary Grid',
        description: 'Fill the grid with 0s and 1s adhering to specific constraints.',
        rules: [
            'No more than two of the same number can be next to each other (e.g., 001 is okay, 000 is not).',
            'Each row and column must have an equal number of 0s and 1s.',
            'No two rows or columns can be identical.'
        ]
    },
    'constraint-path': {
        title: 'Constraint Path',
        description: 'Draw a path from Start to End passing through all required points.',
        rules: [
            'Connect the start point to the end point.',
            'The path must stay within the grid.',
            'Navigate around obstacles and pass through checkpoints if present.'
        ]
    },
    'logic-operators': {
        title: 'Logic Gates',
        description: 'Determine the output (True/False) based on logic gates.',
        rules: [
            'AND: True only if BOTH inputs are True.',
            'OR: True if AT LEAST ONE input is True.',
            'XOR: True if inputs are DIFFERENT.',
            'NOT: Inverts the input (True becomes False).'
        ]
    },
    'rotating-pattern': {
        title: 'Rotating Pattern',
        description: 'Determine the final orientation of the shape after rotations.',
        rules: [
            'Follow the sequence of rotations (e.g., 90° CW, 180°).',
            'Visualize the shape rotating step-by-step.',
            'Select the final position matching the operations.'
        ]
    },
    'weighted-sudoku': {
        title: 'Weighted Sudoku',
        description: 'A variation of Sudoku where numbers have "weight".',
        rules: [
            'Standard Sudoku rules apply (unique rows/cols).',
            'Follow the additional constraint (e.g. "heavier" numbers sink logic).',
            'Typically, just standard Sudoku rules with a visually different theme.'
        ]
    },
    'graph-coloring': {
        title: 'Graph Coloring',
        description: 'Color the vertices of the graph such that no two adjacent vertices share the same color.',
        rules: [
            'Connected nodes (vertices) cannot have the same color.',
            'Use the minimum number of colors possible if specified (chromatic number).',
            'Ensure all nodes are colored validly.'
        ]
    },
    'cryptarithm': {
        title: 'Cryptarithm',
        description: 'Decode the letter-number mapping to make the math equation true.',
        rules: [
            'Each letter represents a unique digit (0-9).',
            'The leading letter of a multi-digit number cannot be 0.',
            'The numbers must satisfy the arithmetic operation (e.g. SEND + MORE = MONEY).'
        ]
    }
};
