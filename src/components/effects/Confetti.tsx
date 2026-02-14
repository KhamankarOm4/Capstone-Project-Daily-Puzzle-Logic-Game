import { useEffect, useRef } from 'react';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    size: number;
    rotation: number;
    rotationSpeed: number;
    opacity: number;
}

const COLORS = ['#7000FF', '#00C2FF', '#FF0055', '#FFD700', '#00FF99', '#FFFFFF'];

const Confetti = ({ isActive }: { isActive: boolean }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particles = useRef<Particle[]>([]);
    const animationId = useRef<number>();

    const createParticles = (width: number, height: number) => {
        const particleCount = 150;
        const newParticles: Particle[] = [];

        for (let i = 0; i < particleCount; i++) {
            newParticles.push({
                x: width / 2,
                y: height / 2,
                vx: (Math.random() - 0.5) * 15,
                vy: (Math.random() - 0.5) * 15 - 5, // Initial upward burst
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
                size: Math.random() * 8 + 4,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 10,
                opacity: 1,
            });
        }
        return newParticles;
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !isActive) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Resize canvas to full screen
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);
        resize();

        // Initialize blast
        particles.current = createParticles(canvas.width, canvas.height);

        const render = () => {
            if (!ctx || !canvas) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const activeParticles: Particle[] = [];

            particles.current.forEach((p) => {
                // Physics
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.2; // Gravity
                p.vx *= 0.99; // Air resistance
                p.rotation += p.rotationSpeed;
                p.opacity -= 0.005; // Fade out

                if (p.opacity > 0) {
                    ctx.save();
                    ctx.translate(p.x, p.y);
                    ctx.rotate((p.rotation * Math.PI) / 180);
                    ctx.globalAlpha = p.opacity;
                    ctx.fillStyle = p.color;
                    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                    ctx.restore();
                    activeParticles.push(p);
                }
            });

            particles.current = activeParticles;

            if (particles.current.length > 0) {
                animationId.current = requestAnimationFrame(render);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        };

        render();

        return () => {
            window.removeEventListener('resize', resize);
            if (animationId.current) cancelAnimationFrame(animationId.current);
        };
    }, [isActive]);

    if (!isActive) return null;

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-[100]"
        />
    );
};

export default Confetti;
