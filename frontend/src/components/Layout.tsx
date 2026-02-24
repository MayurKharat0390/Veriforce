import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Shield, BarChart2, Github, Twitter, ShieldCheck, Gamepad2, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const links = [
        { name: 'Detector', path: '/detector', icon: Shield },
        { name: 'Council', path: '/council', icon: Users },
        { name: 'Blockchain', path: '/blockchain', icon: ShieldCheck },
        { name: 'Election', path: '/election', icon: BarChart2 },
        { name: 'Training', path: '/training', icon: Gamepad2 },
    ];

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-force-black/80 backdrop-blur-lg border-b border-white/10 py-3' : 'bg-transparent py-6'}`}>
            <div className="container mx-auto px-6 flex justify-between items-center">
                <Link to="/" className="flex items-center space-x-2 group">
                    <div className="w-10 h-10 bg-force-blue rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform shadow-[0_0_20px_rgba(0,204,255,0.4)]">
                        <Shield className="text-black" />
                    </div>
                    <span className="text-2xl font-display font-black tracking-tighter text-white">VERI<span className="text-force-blue">FORCE</span></span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center space-x-8">
                    {links.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`text-sm font-bold uppercase tracking-widest transition-colors hover:text-force-blue ${location.pathname === link.path ? 'text-force-blue' : 'text-white/70'}`}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link to="/detector" className="btn-primary py-2 px-6 text-sm">Use the Force</Link>
                </div>

                {/* Mobile Toggle */}
                <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-full left-0 w-full bg-force-black border-b border-white/10 p-6 md:hidden flex flex-col space-y-4"
                    >
                        {links.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className="flex items-center space-x-4 text-lg font-bold"
                            >
                                <link.icon className="text-force-blue" />
                                <span>{link.name}</span>
                            </Link>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

const Footer = () => (
    <footer className="bg-force-black border-t border-white/10 py-12">
        <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-12">
                <div className="col-span-2">
                    <div className="flex items-center space-x-2 mb-6">
                        <Shield className="text-force-blue" />
                        <span className="text-2xl font-display font-black tracking-tighter">VERIFORCE</span>
                    </div>
                    <p className="text-white/50 max-w-sm mb-6">
                        The ultimate deepfake detection system for the digital age. protecting democracy and human connection from the Jedi mind tricks of AI.
                    </p>
                    <div className="flex space-x-4">
                        <Github className="text-white/50 hover:text-white cursor-pointer" />
                        <Twitter className="text-white/50 hover:text-white cursor-pointer" />
                    </div>
                </div>
                <div>
                    <h4 className="font-bold mb-6 uppercase tracking-widest text-sm text-force-blue">Platform</h4>
                    <ul className="space-y-4 text-white/50 text-sm">
                        <li>Detector</li>
                        <li>Jedi Council</li>
                        <li>Blockchain Explorer</li>
                        <li>API Documentation</li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold mb-6 uppercase tracking-widest text-sm text-force-blue">Impact</h4>
                    <ul className="space-y-4 text-white/50 text-sm">
                        <li>Election Monitoring</li>
                        <li>Case Studies</li>
                        <li>Research Papers</li>
                        <li>About the Mission</li>
                    </ul>
                </div>
            </div>
            <div className="mt-12 pt-12 border-t border-white/5 text-center text-white/30 text-xs">
                © 2026 VeriForce. May the truth be with you. Built for Bluebit 4.0 Hackathon.
            </div>
        </div>
    </footer>
);

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [stars, setStars] = useState<{ id: number, x: number, y: number, size: number, delay: number }[]>([]);

    useEffect(() => {
        const newStars = Array.from({ length: 100 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 2 + 1,
            delay: Math.random() * 5
        }));
        setStars(newStars);
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            <div className="stars-container">
                {stars.map(star => (
                    <div
                        key={star.id}
                        className="star"
                        style={{
                            left: `${star.x}%`,
                            top: `${star.y}%`,
                            width: `${star.size}px`,
                            height: `${star.size}px`,
                            animationDelay: `${star.delay}s`
                        }}
                    />
                ))}
            </div>
            <Navbar />
            <main className="flex-grow pt-24">
                {children}
            </main>
            <Footer />
        </div>
    );
};
