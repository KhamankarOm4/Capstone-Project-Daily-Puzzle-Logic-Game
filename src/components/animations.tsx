import { motion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

// ─── Puzzle Reveal ───────────────────────────────────────────────────
export const puzzleReveal: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: 'spring',
            stiffness: 260,
            damping: 20,
            duration: 0.5
        }
    }
};

// ─── Stagger children (for grid cells etc.) ─────────────────────────
export const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.04, delayChildren: 0.1 }
    }
};

export const staggerItem: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
};

// ─── Success burst ──────────────────────────────────────────────────
export const successPop: Variants = {
    hidden: { opacity: 0, scale: 0.3 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            type: 'spring',
            stiffness: 400,
            damping: 15
        }
    }
};

export const successGrade: Variants = {
    hidden: { opacity: 0, scale: 0, rotate: -180 },
    visible: {
        opacity: 1,
        scale: 1,
        rotate: 0,
        transition: {
            type: 'spring',
            stiffness: 200,
            damping: 12,
            delay: 0.3
        }
    }
};



// ─── Page transition wrapper ────────────────────────────────────────
export const PageTransition = ({ children }: { children: ReactNode }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
    >
        {children}
    </motion.div>
);

// ─── Fade-in-up wrapper ─────────────────────────────────────────────
export const FadeInUp = ({ children, delay = 0 }: { children: ReactNode; delay?: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay, ease: 'easeOut' }}
    >
        {children}
    </motion.div>
);
