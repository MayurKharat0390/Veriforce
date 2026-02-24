import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Scale, Cpu, UserCheck, Share2, Download, Code, ExternalLink, Shield, AlertCircle } from 'lucide-react';

const JournalistView = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
        <div className="glass-panel p-12 text-center border-force-red/20 bg-force-red/[0.02]">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-force-red/10 text-force-red text-xs font-bold mb-6">
                <span>VERDICT: FAKE</span>
            </div>
            <h2 className="text-4xl font-display font-black mb-4 uppercase">MANIPULATION DETECTED</h2>
            <p className="text-white/60 max-w-xl mx-auto mb-8">
                Our system has high confidence that this video has been synthetically altered. Most newsrooms are advised to avoid broadcasting without further verification.
            </p>
            <div className="flex justify-center space-x-4">
                <button className="btn-primary py-2 px-6 text-sm flex items-center space-x-2">
                    <Share2 size={16} />
                    <span>Share Alert</span>
                </button>
                <button className="btn-secondary py-2 px-6 text-sm flex items-center space-x-2">
                    <Download size={16} />
                    <span>Press Kit</span>
                </button>
            </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
            <div className="glass-panel p-8">
                <h3 className="font-bold mb-4 flex items-center space-x-2">
                    <FileText className="text-force-blue" />
                    <span>Bullet Summary</span>
                </h3>
                <ul className="space-y-4 text-sm text-white/50">
                    <li>• Face mesh inconsistency detected at 04:12 mark</li>
                    <li>• Audio breath patterns don't match lip movements</li>
                    <li>• Background noise too consistent with AI generation</li>
                </ul>
            </div>
            <div className="glass-panel p-8">
                <h3 className="font-bold mb-4 flex items-center space-x-2">
                    <ExternalLink className="text-force-blue" />
                    <span>Reference Clips</span>
                </h3>
                <p className="text-sm text-white/50 mb-4 italic">Compare against original footage from government archives.</p>
                <div className="aspect-video bg-white/5 rounded-lg border border-white/10 flex items-center justify-center">
                    <span className="text-xs font-mono opacity-20">[Original Footage Sync]</span>
                </div>
            </div>
        </div>
    </motion.div>
);

const CourtView = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
        <div className="glass-panel p-8 grid md:grid-cols-3 gap-12">
            <div className="md:col-span-2">
                <h3 className="text-2xl font-black mb-6">FORENSIC EVIDENCE LOG</h3>
                <div className="space-y-4 font-mono text-xs">
                    {[
                        { time: '00:01:23', event: 'rPPG Heart Rate Mismatch', confidence: '99.2%', signal: 'FAIL' },
                        { time: '00:01:45', event: 'Metadata: Device Signature Missing', confidence: 'N/A', signal: 'WARN' },
                        { time: '00:02:12', event: 'Spectral Anomaly in High Frequencies', confidence: '84.5%', signal: 'FAIL' },
                        { time: '00:02:34', event: 'Face-to-Neck Boundary Artifacts', confidence: '91.0%', signal: 'FAIL' },
                    ].map((log, i) => (
                        <div key={i} className="flex justify-between p-3 bg-white/5 rounded border border-white/5">
                            <span className="text-white/40">{log.time}</span>
                            <span className="text-white/80">{log.event}</span>
                            <span className={log.signal === 'FAIL' ? 'text-force-red' : 'text-force-gold'}>{log.signal}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="space-y-6">
                <div className="p-6 rounded-xl bg-force-blue/5 border border-force-blue/20">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-force-blue mb-4">Integrity Certificate</h4>
                    <div className="aspect-square bg-force-black border border-white/10 rounded-lg flex flex-col items-center justify-center p-4">
                        <div className="w-16 h-16 border-2 border-force-blue rounded-full mb-4 flex items-center justify-center">
                            <Shield className="text-force-blue" />
                        </div>
                        <span className="text-[10px] text-white/40 text-center leading-tight">SHA-256 Hash Verified on Polygon Blockchain</span>
                    </div>
                </div>
                <button className="btn-primary w-full py-2 text-xs">Generate Admissibility Doc</button>
            </div>
        </div>
    </motion.div>
);

const PlatformView = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="glass-panel p-8">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold flex items-center space-x-2">
                    <Code className="text-force-green" />
                    <span>API Response Stream</span>
                </h3>
                <div className="text-[10px] font-mono text-white/30">v1.2 // real-time</div>
            </div>
            <div className="bg-force-black rounded-xl p-8 border border-white/5 font-mono text-sm overflow-x-auto">
                <pre className="text-emerald-500">
                    {`{
  "request_id": "vf_49201948",
  "analyzed_at": "2026-02-21T22:45:01Z",
  "media_type": "video/mp4",
  "verdict": {
    "status": "FAKE",
    "score": 0.942,
    "confidence": "high"
  },
  "force_breakdown": {
    "visual": 0.961,
    "audio": 0.892,
    "metadata": 0.654,
    "biometric": 0.998
  },
  "blockchain_id": "0x4f...921",
  "webhooks_triggered": true
}`}
                </pre>
            </div>
            <div className="mt-8 grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <h4 className="text-xs font-bold uppercase mb-2">Endpoint Method</h4>
                    <div className="text-force-blue font-mono">POST /api/v1/analyze</div>
                </div>
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <h4 className="text-xs font-bold uppercase mb-2">Auth Required</h4>
                    <div className="text-force-gold font-mono">Bearer API_KEY</div>
                </div>
            </div>
        </div>
    </motion.div>
);

const CitizenView = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex flex-col items-center justify-center py-12">
            <div className="w-full max-w-sm glass-panel p-8 relative">
                {/* Browser Extension Simulator */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2">
                    <div className="w-12 h-12 bg-force-blue rounded-xl flex items-center justify-center shadow-lg shadow-force-blue/20">
                        <Shield className="text-black" />
                    </div>
                </div>
                <h3 className="text-xl font-bold text-center mt-4 mb-2">VeriForce Extension</h3>
                <p className="text-sm text-center text-white/40 mb-8">Currently monitoring browser tab: YouTube</p>

                <div className="p-4 rounded-lg bg-force-red/10 border border-force-red/20 mb-6">
                    <div className="flex items-center space-x-3 mb-2">
                        <AlertCircle size={16} className="text-force-red" />
                        <span className="text-xs font-bold text-force-red uppercase">Fake Content Alert</span>
                    </div>
                    <p className="text-xs text-white/60 leading-relaxed">
                        This video has been flagged as synthetic. Viewer discretion is advised.
                    </p>
                </div>

                <div className="space-y-3">
                    <button className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold transition-colors">See Forensic Why</button>
                    <button className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold transition-colors">Report to Election Commission</button>
                </div>
            </div>
            <p className="mt-12 text-center text-white/40 text-sm max-w-xs">
                The Browser Extension Simulator shows how VeriForce protects everyday citizens from misinformation.
            </p>
        </div>
    </motion.div>
);

const Council = () => {
    const [activeTab, setActiveTab] = useState('journalist');

    const tabs = [
        { id: 'journalist', name: 'Journalist', icon: FileText },
        { id: 'court', name: 'Legal/Court', icon: Scale },
        { id: 'platform', name: 'Platform API', icon: Cpu },
        { id: 'citizen', name: 'Citizen', icon: UserCheck },
    ];

    return (
        <div className="container mx-auto px-6 py-12">
            <div className="flex flex-col items-center mb-16">
                <h1 className="text-4xl md:text-5xl font-display font-black mb-4">THE JEDI COUNCIL</h1>
                <p className="text-white/50">Four specialized perspectives on the same truth.</p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mb-16">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center space-x-2 px-6 py-3 rounded-full font-bold transition-all border ${activeTab === tab.id ? 'bg-force-blue text-black border-force-blue' : 'bg-transparent text-white/50 border-white/10 hover:border-white/30'}`}
                    >
                        <tab.icon size={18} />
                        <span>{tab.name} View</span>
                    </button>
                ))}
            </div>

            <div className="min-h-[500px]">
                <AnimatePresence mode="wait">
                    {activeTab === 'journalist' && <JournalistView key="journalist" />}
                    {activeTab === 'court' && <CourtView key="court" />}
                    {activeTab === 'platform' && <PlatformView key="platform" />}
                    {activeTab === 'citizen' && <CitizenView key="citizen" />}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Council;
