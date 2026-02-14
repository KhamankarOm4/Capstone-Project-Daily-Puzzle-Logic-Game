
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
        <div className="flex flex-col md:flex-row items-center gap-4 w-full">
            {/* Hint Button */}
            <div className="w-full md:w-auto">
                <Button
                    onClick={onHint}
                    disabled={disabled || (hintsRemaining !== undefined && hintsRemaining <= 0)}
                    variant="ghost"
                    size="md"
                    className={`
                        !text-neutral-400 hover:!text-accent-cyan hover:!bg-accent-cyan/10 border border-transparent hover:border-accent-cyan/20 transition-all duration-300
                        ${(hintsRemaining === 0) ? '!opacity-50 !grayscale' : ''}
                    `}
                    leftIcon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                        </svg>
                    }
                >
                    <span className="font-medium">Hint</span>
                    {hintsRemaining !== undefined && (
                        <span className="ml-2 text-xs opacity-70">
                            ({hintsRemaining})
                        </span>
                    )}
                </Button>
            </div>

            {/* Submit Button */}
            <div className="flex-1 w-full">
                <Button
                    onClick={onSubmit}
                    disabled={disabled || !canSubmit}
                    variant="primary"
                    size="lg"
                    fullWidth
                    className={`
                        relative group overflow-hidden !rounded-xl
                        ${!disabled && canSubmit
                            ? "!bg-white !text-black hover:!bg-neutral-200 !shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:!shadow-[0_0_30px_rgba(255,255,255,0.25)] border-none"
                            : "!bg-white/5 !text-white/20 !shadow-none !border border-white/5 cursor-not-allowed"
                        }
                    `}
                    rightIcon={
                        <svg className={`w-5 h-5 transition-transform duration-300 ${!disabled && canSubmit ? 'group-hover:translate-x-1' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                        </svg>
                    }
                >
                    <span className="text-base font-bold tracking-wide uppercase">Submit</span>
                </Button>
            </div>
        </div>
    );
};

export default GameControls;
