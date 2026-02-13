import type { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
    children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white flex flex-col font-sans selection:bg-blue-500/30">
            <Header />
            <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8 flex flex-col">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
