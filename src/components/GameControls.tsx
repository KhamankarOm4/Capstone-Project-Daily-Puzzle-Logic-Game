

interface GameControlsProps {
    onHint: () => void;
    onSubmit: () => void;
    canSubmit?: boolean; // made optional to avoid breaking changes if strict
    disabled?: boolean;
    hintsRemaining?: number;
}

import Button from './ui/Button';

interface GameControlsProps {
    onHint: () => void;
    onSubmit: () => void;
    canSubmit?: boolean;
    disabled?: boolean;
    hintsRemaining?: number;
}

const GameControls = ({ onHint, onSubmit, canSubmit = true, disabled = false, hintsRemaining }: GameControlsProps) => {
    return (
        <div className="flex flex-col items-center gap-4">
            <div className="flex gap-4">
                <Button
                    onClick={onHint}
                    disabled={disabled || (hintsRemaining !== undefined && hintsRemaining <= 0)}
                    variant="primary"
                    size="lg"
                    className="!bg-gradient-to-r !from-yellow-400 !to-orange-500 !shadow-orange-500/30 font-bold"
                    leftIcon={
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                    }
                >
                    Hint {hintsRemaining !== undefined && `(${hintsRemaining})`}
                </Button>

                <Button
                    onClick={onSubmit}
                    disabled={disabled || !canSubmit}
                    variant="primary"
                    size="lg"
                    className={!disabled && canSubmit
                        ? "!bg-gradient-to-r !from-green-500 !to-emerald-600 !shadow-emerald-500/30"
                        : "!bg-gray-300 !text-gray-500 !shadow-none !border-none cursor-not-allowed"
                    }
                    leftIcon={
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                >
                    Submit Answer
                </Button>
            </div>
        </div>
    );
};

export default GameControls;
