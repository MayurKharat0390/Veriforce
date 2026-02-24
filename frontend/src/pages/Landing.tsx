import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Database, Globe, ArrowRight, Play, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => (
    <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col items-center text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-force-blue/10 border border-force-blue/20 text-force-blue text-xs font-bold uppercase tracking-widest mb-8"
                >
                    <Zap size={14} />
                    <span>The Jedi Mind Trick Detector is Live</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-6xl md:text-8xl font-display font-black tracking-tighter mb-8 leading-[0.9]"
                >
                    TRUST NO <br />
                    <span className="text-force-blue italic">PROJECTION.</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl text-white/60 max-w-2xl mb-12"
                >
                    In a galaxy overflowing with synthetic media, VeriForce uses the Four Forces of forensic analysis to detect deepfakes with 97% accuracy.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
                >
                    <Link to="/detector" className="btn-primary flex items-center space-x-2">
                        <span>Activate the Force</span>
                        <ArrowRight size={18} />
                    </Link>
                    <button className="btn-secondary flex items-center space-x-2">
                        <Play size={18} />
                        <span>Watch the Reveal</span>
                    </button>
                </motion.div>
            </div>
        </div>

        {/* Abstract Background Element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-force-blue/20 blur-[120px] rounded-full -z-10 opacity-30 animate-pulse-glow" />
    </section>
);

const Stats = () => (
    <section className="py-20 bg-white/[0.02] border-y border-white/5">
        <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-8">
                {[
                    { label: 'Deepfake Accuracy', value: '97%', sub: 'Independently Proven' },
                    { label: 'Detection Speed', value: 'Real-time', sub: 'Low Latency ML' },
                    { label: 'Voters Protected', value: '900M+', sub: 'Indian Elections 2024' },
                    { label: 'Forces Applied', value: '4', sub: 'Visual, Audio, Bio, Meta' },
                ].map((stat, i) => (
                    <div key={i} className="text-center">
                        <div className="text-4xl font-display font-black text-force-blue mb-2">{stat.value}</div>
                        <div className="text-sm font-bold uppercase tracking-widest text-white/80 mb-1">{stat.label}</div>
                        <div className="text-xs text-white/40">{stat.sub}</div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const ForceCard = ({ force, icon: Icon, title, desc, features }: any) => (
    <motion.div
        whileHover={{ y: -10 }}
        className="glass-panel p-8 relative overflow-hidden group"
    >
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Icon size={120} />
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-gradient-to-br ${force === 'visual' ? 'from-force-blue to-blue-600' :
            force === 'audio' ? 'from-force-red to-red-600' :
                force === 'meta' ? 'from-force-green to-emerald-600' :
                    'from-force-gold to-yellow-600'}`}>
            <Icon className="text-white" />
        </div>
        <h3 className="text-2xl font-bold mb-4">{title}</h3>
        <p className="text-white/50 text-sm mb-6 leading-relaxed">{desc}</p>
        <ul className="space-y-3">
            {features.map((f: string, i: number) => (
                <li key={i} className="flex items-center space-x-3 text-xs font-bold text-white/70">
                    <CheckCircle size={14} className="text-force-blue" />
                    <span>{f}</span>
                </li>
            ))}
        </ul>
    </motion.div>
);

const FourForces = () => (
    <section className="py-32">
        <div className="container mx-auto px-6">
            <div className="flex flex-col items-center text-center mb-20">
                <h2 className="text-4xl md:text-5xl font-display font-black mb-6">THE FOUR FORCES</h2>
                <p className="text-white/50 max-w-2xl">
                    VeriForce doesn't just look at pixels. We combine four distinct modalities to uncover truth in the synthetic era.
                </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
                <ForceCard
                    force="visual"
                    icon={Shield}
                    title="Visual Force"
                    desc="AI-driven scanning of face swaps and lighting inconsistencies."
                    features={['Face-swap Detection', 'Lighting Analysis', 'Eye Blink Patterns']}
                />
                <ForceCard
                    force="audio"
                    icon={Zap}
                    title="Audio Force"
                    desc="Detection of voice cloning and unnatural breath patterns."
                    features={['Voice Cloning Check', 'Spectral Analysis', 'Silence Detection']}
                />
                <ForceCard
                    force="meta"
                    icon={Database}
                    title="Metadata Force"
                    desc="Reconstructing file origin and detecting compression artifacts."
                    features={['Original Tracing', 'Edit History Rev', 'Device Signatures']}
                />
                <ForceCard
                    force="bio"
                    icon={Globe}
                    title="Biometric Force"
                    desc="Proprietary rPPG technology to detect real human pulses."
                    features={['Remote Pulse (rPPG)', 'Blood Flow Mapping', 'Micro-expressions']}
                />
            </div>
        </div>
    </section>
);

const Landing = () => {
    return (
        <div>
            <Hero />
            <Stats />
            <FourForces />

            {/* Indian Context Section */}
            <section className="py-32 relative overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="glass-panel p-12 border-force-blue/20 bg-force-blue/[0.02]">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-4xl font-display font-black mb-6 leading-tight">
                                    PROTECTING THE <br />
                                    <span className="text-force-blue italic">WORLD'S LARGEST DEMOCRACY</span>
                                </h2>
                                <p className="text-white/60 mb-8 leading-relaxed">
                                    With 900M+ voters, India is the prime target for political deepfakes. VeriForce provides real-time monitoring and verification for elections, celebrities, and citizens.
                                </p>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                        <div className="text-2xl font-black text-white mb-1">96%</div>
                                        <div className="text-[10px] uppercase font-bold text-white/40 tracking-widest">Non-consensual Deepfakes</div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                        <div className="text-2xl font-black text-white mb-1">73%</div>
                                        <div className="text-[10px] uppercase font-bold text-white/40 tracking-widest">Unable to Distinguish</div>
                                    </div>
                                </div>
                            </div>
                            <div className="relative">
                                <div className="aspect-video rounded-2xl overflow-hidden border border-white/10 relative group">
                                    <img src="https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?auto=format&fit=crop&q=80&w=2000" alt="India Map" className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-force-black to-transparent" />
                                    <div className="absolute bottom-6 left-6 right-6">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <div className="w-2 h-2 rounded-full bg-force-red animate-pulse" />
                                            <span className="text-xs font-bold uppercase tracking-widest text-force-red">Live Election Alert</span>
                                        </div>
                                        <div className="text-sm font-bold">Suspected deepfake detected in Maharashtra state campaign.</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Landing;
