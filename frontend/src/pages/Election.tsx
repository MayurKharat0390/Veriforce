import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, MapPin, AlertCircle, TrendingUp, Search, Filter, Shield, Loader2 } from 'lucide-react';
import api from '../services/api';

const StateCard = ({ state, incidents, risk }: any) => (
    <div className="glass-panel p-6 border-white/5 hover:bg-white/[0.04] transition-colors cursor-pointer group">
        <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                    <MapPin size={16} className="text-force-blue" />
                </div>
                <h4 className="font-bold">{state}</h4>
            </div>
            <div className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${risk === 'High' ? 'bg-force-red/20 text-force-red' : risk === 'Medium' ? 'bg-force-gold/20 text-force-gold' : 'bg-force-green/20 text-force-green'}`}>
                {risk} Risk
            </div>
        </div>
        <div className="flex justify-between items-end">
            <div>
                <div className="text-2xl font-black">{incidents}</div>
                <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Detected Deepfakes</div>
            </div>
            <div className="w-12 h-1 bg-white/5 rounded-full overflow-hidden">
                <div className={`h-full ${risk === 'High' ? 'bg-force-red' : 'bg-force-green'}`} style={{ width: '70%' }} />
            </div>
        </div>
    </div>
);

const Election = () => {
    const [feed, setFeed] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeed = async () => {
            try {
                const res = await api.get('election/guardian/threat_feed/');
                setFeed(res.data);
            } catch (e) {
                console.error('Failed to fetch threat intelligence');
            } finally {
                setLoading(false);
            }
        };
        fetchFeed();
        const interval = setInterval(fetchFeed, 10000); // Dynamic updates
        return () => clearInterval(interval);
    }, []);

    if (loading) return (
        <div className="h-screen flex items-center justify-center">
            <Loader2 className="animate-spin text-force-blue" size={48} />
        </div>
    );

    return (
        <div className="container mx-auto px-6 py-12">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                <div>
                    <h1 className="text-4xl md:text-5xl font-display font-black mb-4">ELECTION GUARDIAN</h1>
                    <p className="text-white/50">Real-time deepfake monitoring for the 2026 Indian Elections.</p>
                </div>
                <div className="flex space-x-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                        <input
                            type="text"
                            placeholder="Search Candidate"
                            className="bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-force-blue transition-colors"
                        />
                    </div>
                    <button className="glass-panel px-4 py-2 flex items-center space-x-2 text-sm font-bold">
                        <Filter size={16} />
                        <span>Filter</span>
                    </button>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass-panel aspect-[16/10] relative overflow-hidden bg-force-black border-white/10 p-8">
                        <div className="flex justify-between items-start mb-8">
                            <h3 className="text-xl font-bold flex items-center space-x-2">
                                <Globe className="text-force-blue" />
                                <span>India Heatmap</span>
                            </h3>
                            <div className="flex space-x-4">
                                <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-white/40">
                                    <div className="w-2 h-2 rounded-full bg-force-red shadow-red-glow" />
                                    <span>High Risk</span>
                                </div>
                                <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-white/40">
                                    <div className="w-2 h-2 rounded-full bg-force-green" />
                                    <span>Low Risk</span>
                                </div>
                            </div>
                        </div>

                        <div className="relative w-full h-full flex items-center justify-center opacity-40">
                            <Shield size={300} className="text-force-blue/10 absolute animate-pulse-glow" />
                            <div className="text-4xl font-display font-black text-white/10 uppercase tracking-widest -rotate-12">
                                Secure Intel Grid Active
                            </div>

                            {feed?.active_threats.map((threat: any, i: number) => (
                                <motion.div
                                    key={threat.id}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                                    transition={{ repeat: Infinity, duration: 2 + i }}
                                    className={`absolute w-3 h-3 rounded-full ${threat.severity === 'Critical' ? 'bg-force-red shadow-red-glow' : 'bg-force-gold shadow-gold-glow'}`}
                                    style={{ top: `${20 + i * 15}%`, left: `${30 + (i % 3) * 20}%` }}
                                />
                            ))}
                        </div>

                        <div className="absolute bottom-8 right-8 text-right">
                            <motion.div
                                key={feed?.total_detected}
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="text-5xl font-display font-black text-force-blue"
                            >
                                {feed?.total_detected.toLocaleString()}
                            </motion.div>
                            <div className="text-xs font-bold uppercase tracking-widest text-white/40">Total Threats Blocked</div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <StateCard state="Maharashtra" incidents={342} risk="High" />
                        <StateCard state="Uttar Pradesh" incidents={215} risk="Medium" />
                        <StateCard state="West Bengal" incidents={78} risk="Low" />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="glass-panel p-6">
                        <h3 className="text-lg font-bold mb-6 flex items-center space-x-2">
                            <AlertCircle className="text-force-red shadow-red-glow" />
                            <span>Live Intelligence</span>
                        </h3>
                        <div className="space-y-4">
                            {feed?.active_threats.map((alert: any, i: number) => (
                                <motion.div
                                    key={alert.id}
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all cursor-pointer"
                                >
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                                        <span className="text-white/40">{alert.timestamp} • {alert.confidence}% Conf.</span>
                                        <span className={alert.severity === 'Critical' ? 'text-force-red' : 'text-force-gold'}>{alert.severity}</span>
                                    </div>
                                    <div className="font-bold mb-1">{alert.candidate}</div>
                                    <div className="text-xs text-white/50">{alert.type} detected in {alert.state}</div>
                                </motion.div>
                            ))}
                        </div>
                        <button className="w-full mt-6 py-3 text-xs font-bold uppercase tracking-widest text-force-blue hover:bg-force-blue/5 rounded-lg transition-all border border-force-blue/20">
                            Download Sentinel Report
                        </button>
                    </div>

                    <div className="glass-panel p-6 bg-gradient-to-br from-force-blue/10 to-transparent">
                        <h3 className="text-lg font-bold mb-6 flex items-center space-x-2">
                            <TrendingUp className="text-force-blue" />
                            <span>Analysis Target Share</span>
                        </h3>
                        <div className="space-y-6">
                            {[
                                { name: 'Incumbent Party', share: 65, color: 'force-blue' },
                                { name: 'Opposition Coalition', share: 28, color: 'force-red' },
                                { name: 'Independent Blocks', share: 7, color: 'white/40' },
                            ].map((target, i) => (
                                <div key={i}>
                                    <div className="flex justify-between text-xs font-bold mb-2">
                                        <span>{target.name}</span>
                                        <span>{target.share}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${target.share}%` }}
                                            className={`h-full bg-${target.color.includes('/') ? target.color : `force-${target.color}`}`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Election;
