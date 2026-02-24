import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Target, Rocket, Heart, ChevronRight, Github, ExternalLink, Mail } from 'lucide-react';

const TeamMember = ({ name, role, img }: any) => (
    <div className="group">
        <div className="aspect-square rounded-2xl bg-white/5 border border-white/10 mb-4 overflow-hidden relative">
            <img src={img} alt={name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-110 group-hover:scale-100" />
            <div className="absolute inset-0 bg-gradient-to-t from-force-black via-transparent to-transparent opacity-60" />
        </div>
        <h4 className="font-bold">{name}</h4>
        <p className="text-xs text-white/40 uppercase tracking-widest mt-1 font-bold">{role}</p>
    </div>
);

const About = () => {
    return (
        <div className="container mx-auto px-6 py-12">
            {/* Our Mission */}
            <section className="mb-32">
                <div className="grid lg:grid-cols-2 gap-20 items-center">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-force-blue/10 text-force-blue text-xs font-bold mb-8 uppercase tracking-widest"
                        >
                            <Rocket size={14} />
                            <span>THE MISSION</span>
                        </motion.div>
                        <h1 className="text-5xl md:text-7xl font-display font-black mb-8 leading-[0.9]">EQUILIBRIUM IN THE <br /><span className="text-force-blue">SYNTHETIC ERA.</span></h1>
                        <p className="text-xl text-white/50 mb-12 leading-relaxed">
                            We believe that truth is the bedrock of democracy and human connection. VeriForce was founded at Bluebit 4.0 with a single goal: to provide the tools necessary to distinguish between reality and artifice.
                        </p>
                        <div className="flex space-x-8">
                            <div>
                                <div className="text-3xl font-black mb-1">2026</div>
                                <div className="text-[10px] font-bold uppercase tracking-widest text-white/30">Founded</div>
                            </div>
                            <div className="w-px h-12 bg-white/10" />
                            <div>
                                <div className="text-3xl font-black mb-1">0.97</div>
                                <div className="text-[10px] font-bold uppercase tracking-widest text-white/30">Precision Core</div>
                            </div>
                        </div>
                    </div>
                    <div className="glass-panel p-2 aspect-square group">
                        <div className="w-full h-full rounded-xl bg-force-black border border-white/10 overflow-hidden relative">
                            <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2000" alt="Space" className="w-full h-full object-cover opacity-60" />
                            <div className="absolute inset-0 flex items-center justify-center p-12 text-center">
                                <h3 className="text-3xl font-display font-black leading-tight group-hover:scale-105 transition-transform">"IF THERE IS NO PULSE, THERE IS NO TRUTH."</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Impact & Stats */}
            <section className="py-32 border-y border-white/5 bg-white/[0.01]">
                <div className="grid md:grid-cols-3 gap-12">
                    {[
                        { icon: Target, title: 'Democratic Guard', desc: 'Active monitoring of political campaigns in major democracies to prevent election interference.' },
                        { icon: Heart, title: 'Consensual Media', desc: 'Protecting citizens from non-consensual synthetic imagery through automated platform alerting.' },
                        { icon: Users, title: 'Educational Training', desc: 'Equipping the next generation with the biological tools to spot manipulation on their own.' },
                    ].map((item, i) => (
                        <div key={i} className="space-y-6">
                            <div className="w-12 h-12 rounded-xl bg-force-blue/10 flex items-center justify-center text-force-blue">
                                <item.icon size={24} />
                            </div>
                            <h3 className="text-2xl font-bold">{item.title}</h3>
                            <p className="text-sm text-white/40 leading-relaxed">{item.desc}</p>
                            <button className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-[0.2em] text-force-blue group">
                                <span>Read Research</span>
                                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Team */}
            <section className="py-32">
                <div className="flex flex-col items-center text-center mb-20">
                    <h2 className="text-4xl font-display font-black mb-6 uppercase">THE ARCHITECTS</h2>
                    <p className="text-white/40 max-w-xl">A specialized task force of developers and UI designers dedicated to the VeriForce protocol.</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <TeamMember name="Jedi Master" role="Lead Developer" img="https://i.pravatar.cc/300?u=1" />
                    <TeamMember name="Force Commander" role="UI/UX Designer" img="https://i.pravatar.cc/300?u=2" />
                    <TeamMember name="Core Sentinel" role="ML Architect" img="https://i.pravatar.cc/300?u=3" />
                    <TeamMember name="Data Guardian" role="Blockchain Lead" img="https://i.pravatar.cc/300?u=4" />
                </div>
            </section>

            {/* Call to Action */}
            <section className="mb-20">
                <div className="glass-panel p-12 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-force-blue/20 blur-[100px] -z-10 translate-x-1/2 -translate-y-1/2" />
                    <div className="flex flex-col md:flex-row justify-between items-center gap-12">
                        <div>
                            <h2 className="text-4xl font-display font-black mb-4 uppercase">Join the Rebellion <br /> <span className="text-force-blue">Against Lies</span></h2>
                            <p className="text-white/40">Open source, decentralized, and built for the people.</p>
                        </div>
                        <div className="flex space-x-6">
                            <Link to="/detector" className="btn-primary">Become a Sentinel</Link>
                            <div className="flex items-center space-x-4">
                                <Github className="text-white hover:text-force-blue cursor-pointer" />
                                <Mail className="text-white hover:text-force-blue cursor-pointer" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
