import { motion } from 'framer-motion';
import { useMemo } from 'react';

export const StreakCelebration = ({ streak }: { streak: number }) => {
    const particles = useMemo(() => {
        if (streak < 2) return []; // optimization

        const emojis = streak >= 7 ? ['🔥', '⭐', '🎉', '💎', '🏆', '✨']
            : streak >= 3 ? ['🔥', '⭐', '🎉', '✨']
                : ['🔥', '✨'];

        return Array.from({ length: streak >= 7 ? 20 : streak >= 3 ? 12 : 6 }).map((_, i) => ({
            id: i,
            emoji: emojis[i % emojis.length],
            initial: {
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 800),
                y: -50,
                opacity: 1,
                rotate: 0,
                scale: 0.5 + Math.random() * 0.8
            },
            animate: {
                y: (typeof window !== 'undefined' ? window.innerHeight : 600) + 100,
                x: `+=${(Math.random() - 0.5) * 200}`,
                rotate: Math.random() * 720 - 360,
                opacity: [1, 1, 0]
            },
            transition: {
                duration: 2 + Math.random() * 2,
                delay: Math.random() * 0.8,
                ease: 'easeOut' as const
            }
        }));
    }, [streak]);

    if (streak < 2) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="absolute text-3xl"
                    initial={particle.initial}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    animate={particle.animate as any}
                    transition={particle.transition}
                >
                    {particle.emoji}
                </motion.div>
            ))}
        </div>
    );
};
