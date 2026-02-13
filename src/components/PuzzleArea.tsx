import React from 'react';

const PuzzleArea: React.FC = () => {
    return (
        <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8 min-h-[300px] flex items-center justify-center border-2 border-gray-100">
            <p className="text-gray-400 italic">Puzzle content goes here</p>
        </div>
    );
};

export default PuzzleArea;
