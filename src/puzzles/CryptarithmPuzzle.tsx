import { useState, useEffect } from 'react';
import { type PuzzleProps } from './PuzzleEngine';
import { type CryptarithmData, type CryptarithmSolution, type CryptarithmInput } from './engines/CryptarithmEngine';

export const CryptarithmRenderer = ({ data, onInput, disabled, solution, hintTrigger }: PuzzleProps<CryptarithmData, CryptarithmSolution, CryptarithmInput>) => {
    const [inputs, setInputs] = useState<CryptarithmInput>({});

    // Initialize inputs
    useEffect(() => {
        const init: CryptarithmInput = {};
        data.uniqueLetters.forEach(l => init[l] = "");
        setInputs(prev => ({ ...init, ...prev }));
    }, [data.uniqueLetters]);

    useEffect(() => {
        if (hintTrigger > 0) {
            // Reveal one unknown letter
            const unrevealed = data.uniqueLetters.filter(l => inputs[l] !== solution.mapping[l].toString());
            if (unrevealed.length > 0) {
                const target = unrevealed[Math.floor(Math.random() * unrevealed.length)];
                const newInputs = { ...inputs, [target]: solution.mapping[target].toString() };
                setInputs(newInputs);
                onInput(newInputs);
            }
        }
    }, [hintTrigger, onInput, solution, inputs, data.uniqueLetters]);

    const handleChange = (letter: string, val: string) => {
        if (disabled) return;
        if (!/^[0-9]?$/.test(val)) return; // Only 0-9 or empty

        const newInputs = { ...inputs, [letter]: val };
        setInputs(newInputs);
        onInput(newInputs);
    };

    const w1 = data.equation[0];
    const w2 = data.equation[2];
    const w3 = data.equation[4];

    return (
        <div className="flex flex-col items-center gap-8 w-full max-w-3xl mx-auto p-8 glass-panel rounded-3xl relative overflow-hidden">
            <div className="text-center space-y-2 relative z-10">
                <h3 className="text-3xl font-black text-white">Crypt<span className="text-accent-glow">arithm</span></h3>
                <p className="text-neutral-300 text-sm">Decode the letters to make the math correct.</p>
            </div>

            {/* Equation Display */}
            <div className="flex flex-col items-end font-mono text-4xl md:text-6xl text-white tracking-widest bg-black/20 p-8 rounded-2xl border border-white/10 shadow-lg">
                <div className="flex gap-2">
                    {w1.split('').map((l, i) => (
                        <span key={i} className={inputs[l] ? "text-accent-cyan" : ""}>
                            {inputs[l] || l}
                        </span>
                    ))}
                </div>
                <div className="flex gap-2 items-center">
                    <span className="text-accent-glow mr-4">+</span>
                    {w2.split('').map((l, i) => (
                        <span key={i} className={inputs[l] ? "text-accent-cyan" : ""}>
                            {inputs[l] || l}
                        </span>
                    ))}
                </div>
                <div className="w-full h-1 bg-white/20 my-2"></div>
                <div className="flex gap-2">
                    {w3.split('').map((l, i) => (
                        <span key={i} className={inputs[l] ? "text-accent-cyan" : ""}>
                            {inputs[l] || l}
                        </span>
                    ))}
                </div>
            </div>

            {/* Input Area */}
            <div className="grid grid-cols-5 gap-4">
                {data.uniqueLetters.map(l => (
                    <div key={l} className="flex flex-col items-center gap-2">
                        <div className="text-xl font-bold text-white/50">{l}</div>
                        <input
                            type="text"
                            maxLength={1}
                            value={inputs[l] || ""}
                            onChange={(e) => handleChange(l, e.target.value)}
                            disabled={disabled}
                            className="w-12 h-14 bg-surface-100 border border-white/10 rounded-lg text-center text-2xl font-bold text-white focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};
