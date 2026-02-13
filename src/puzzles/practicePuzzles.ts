
export interface PracticePuzzle {
    id: string;
    date: string; // Display name or "Puzzle #X"
    type: 'miniSudoku';
    difficulty: 'Easy' | 'Medium' | 'Hard';
    initialBoard: (number | null)[][];
    solution: number[][];
}

export const practicePuzzles: PracticePuzzle[] = [
    {
        id: 'p1',
        date: 'Practice #1',
        type: 'miniSudoku',
        difficulty: 'Easy',
        initialBoard: [
            [null, 2, 3, 4],
            [3, 4, 1, 2],
            [2, 1, 4, 3],
            [4, 3, 2, 1]
        ],
        solution: [
            [1, 2, 3, 4],
            [3, 4, 1, 2],
            [2, 1, 4, 3],
            [4, 3, 2, 1]
        ]
    },
    {
        id: 'p2',
        date: 'Practice #2',
        type: 'miniSudoku',
        difficulty: 'Easy',
        initialBoard: [
            [1, null, 3, 4],
            [3, 4, null, 2],
            [2, 1, 4, null],
            [null, 3, 2, 1]
        ],
        solution: [
            [1, 2, 3, 4],
            [3, 4, 1, 2],
            [2, 1, 4, 3],
            [4, 3, 2, 1]
        ]
    },
    {
        id: 'p3',
        date: 'Practice #3',
        type: 'miniSudoku',
        difficulty: 'Medium',
        initialBoard: [
            [null, 2, null, 4],
            [3, null, 1, null],
            [2, 1, null, 3],
            [null, 3, 2, null]
        ],
        solution: [
            [1, 2, 3, 4],
            [3, 4, 1, 2],
            [2, 1, 4, 3],
            [4, 3, 2, 1]
        ]
    },
    {
        id: 'p4',
        date: 'Practice #4',
        type: 'miniSudoku',
        difficulty: 'Medium',
        initialBoard: [
            [1, null, null, 4],
            [null, 4, 1, null],
            [null, 1, 4, null],
            [4, null, null, 1]
        ],
        solution: [
            [1, 2, 3, 4],
            [3, 4, 1, 2],
            [2, 1, 4, 3],
            [4, 3, 2, 1]
        ]
    },
    {
        id: 'p5',
        date: 'Practice #5',
        type: 'miniSudoku',
        difficulty: 'Hard',
        initialBoard: [
            [null, null, 3, null],
            [3, null, null, 2],
            [null, 1, null, null],
            [null, 3, null, 1]
        ],
        solution: [
            [1, 2, 3, 4],
            [3, 4, 1, 2],
            [2, 1, 4, 3],
            [4, 3, 2, 1]
        ]
    },
    {
        id: 'p6',
        date: 'Practice #6',
        type: 'miniSudoku',
        difficulty: 'Hard',
        initialBoard: [
            [1, 2, 3, null],
            [3, null, 1, 2],
            [2, 1, null, 3],
            [null, 3, 2, 1]
        ],
        solution: [
            [1, 2, 3, 4],
            [3, 4, 1, 2],
            [2, 1, 4, 3],
            [4, 3, 2, 1]
        ]
    },
    {
        id: 'p7',
        date: 'Practice #7',
        type: 'miniSudoku',
        difficulty: 'Easy',
        initialBoard: [
            [1, 2, 3, 4],
            [3, 4, 1, 2],
            [2, 1, 4, 3],
            [null, null, null, null]
        ],
        solution: [
            [1, 2, 3, 4],
            [3, 4, 1, 2],
            [2, 1, 4, 3],
            [4, 3, 2, 1]
        ]
    },
    {
        id: 'p8',
        date: 'Practice #8',
        type: 'miniSudoku',
        difficulty: 'Medium',
        initialBoard: [
            [1, null, 3, 4],
            [3, 4, 1, null],
            [2, 1, null, 3],
            [4, null, 2, 1]
        ],
        solution: [
            [1, 2, 3, 4],
            [3, 4, 1, 2],
            [2, 1, 4, 3],
            [4, 3, 2, 1]
        ]
    },
    {
        id: 'p9',
        date: 'Practice #9',
        type: 'miniSudoku',
        difficulty: 'Hard',
        initialBoard: [
            [null, 2, null, 4],
            [3, null, null, 2],
            [2, null, null, 3],
            [4, null, 2, null]
        ],
        solution: [
            [1, 2, 3, 4],
            [3, 4, 1, 2],
            [2, 1, 4, 3],
            [4, 3, 2, 1]
        ]
    },
    {
        id: 'p10',
        date: 'Practice #10',
        type: 'miniSudoku',
        difficulty: 'Hard',
        initialBoard: [
            [null, null, 3, null],
            [null, 4, null, 2],
            [2, null, 4, null],
            [null, 3, null, null]
        ],
        solution: [
            [1, 2, 3, 4],
            [3, 4, 1, 2],
            [2, 1, 4, 3],
            [4, 3, 2, 1]
        ]
    }
];
