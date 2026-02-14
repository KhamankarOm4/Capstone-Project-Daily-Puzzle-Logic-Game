import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

interface SoundContextType {
    isMuted: boolean;
    toggleMute: () => void;
    playClick: () => void;
    playSuccess: () => void;
    playError: () => void;
    playPop: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isMuted, setIsMuted] = useState<boolean>(() => {
        const saved = localStorage.getItem('daily-puzzle-muted');
        return saved ? JSON.parse(saved) : false;
    });

    // AudioContext ref to persist across renders
    const audioCtxRef = useRef<AudioContext | null>(null);

    useEffect(() => {
        localStorage.setItem('daily-puzzle-muted', JSON.stringify(isMuted));
    }, [isMuted]);

    const getAudioContext = () => {
        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        return audioCtxRef.current;
    };

    const playTone = (freq: number, type: OscillatorType, duration: number, startTime: number = 0, volume: number = 0.1) => {
        if (isMuted) return;
        try {
            const ctx = getAudioContext();
            if (ctx.state === 'suspended') ctx.resume();

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);

            gain.gain.setValueAtTime(volume, ctx.currentTime + startTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + startTime + duration);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(ctx.currentTime + startTime);
            osc.stop(ctx.currentTime + startTime + duration);
        } catch (e) {
            console.error("Audio playback failed", e);
        }
    };

    const playClick = () => {
        // High-pitch short blip
        playTone(800, 'sine', 0.05, 0, 0.05);
    };

    const playPop = () => {
        // Lower "bubble" sound
        playTone(400, 'sine', 0.1, 0, 0.1);
    };

    const playSuccess = () => {
        // Major arpeggio
        if (isMuted) return;
        const ctx = getAudioContext();
        if (ctx.state === 'suspended') ctx.resume();

        const now = ctx.currentTime;
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => { // C Major: C E G C
            playTone(freq, 'sine', 0.3, i * 0.1, 0.1);
        });
    };

    const playError = () => {
        // Low dissonance/buzz
        if (isMuted) return;
        playTone(150, 'sawtooth', 0.3, 0, 0.1);
        playTone(145, 'sawtooth', 0.3, 0, 0.1); // Dissonant interval
    };

    const toggleMute = () => setIsMuted(prev => !prev);

    return (
        <SoundContext.Provider value={{ isMuted, toggleMute, playClick, playSuccess, playError, playPop }}>
            {children}
        </SoundContext.Provider>
    );
};

export const useSound = () => {
    const context = useContext(SoundContext);
    if (!context) {
        throw new Error('useSound must be used within a SoundProvider');
    }
    return context;
};
