import type { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
    children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="min-h-screen bg-primary text-neutral-50 flex flex-col font-sans selection:bg-accent/30 relative overflow-hidden">
            {/* Ambient Background Effects */}
            <div className="fixed inset-0 pointer-events-none data-[blob]:">
                <div className="absolute top-0 -left-4 w-96 h-96 bg-accent/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute top-0 -right-4 w-96 h-96 bg-highlight/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob" style={{ animationDelay: '2s' }}></div>
                <div className="absolute -bottom-32 left-20 w-96 h-96 bg-accent-glow/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob" style={{ animationDelay: '4s' }}></div>
                <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-[0.02]"></div>
            </div>

            {/* Content - Z-Index to float above background */}
            <div className="relative z-10 flex flex-col min-h-screen">
                <Header />
                <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8 md:py-12 flex flex-col items-center">
                    {children}
                </main>
                <Footer />
            </div>
        </div>
    );
};

export default Layout;
