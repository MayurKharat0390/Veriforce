import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Hash, Layers, ArrowDown, Search, ExternalLink, Database, Cpu } from 'lucide-react';

const RecordItem = ({ record }: any) => (
    <div className="p-6 rounded-xl bg-white/[0.02] border border-white/5 hover:border-force-blue/20 transition-all group">
        <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-force-blue/10 flex items-center justify-center">
                    <Layers size={20} className="text-force-blue" />
                </div>
                <div>
                    <h4 className="font-bold text-sm">Block #{record.block}</h4>
                    <p className="text-[10px] text-white/30 uppercase tracking-widest">{record.time}</p>
                </div>
            </div>
            <div className="px-2 py-1 rounded bg-force-green/20 text-force-green text-[10px] font-black uppercase tracking-widest">Verified</div>
        </div>
        <div className="space-y-3 font-mono text-[10px]">
            <div className="flex justify-between">
                <span className="text-white/20">FILE HASH:</span>
                <span className="text-white/60 truncate ml-4">{record.hash}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-white/20">TX_ID:</span>
                <span className="text-force-blue truncate ml-4 hover:underline cursor-pointer">{record.tx}</span>
            </div>
        </div>
    </div>
);

const Blockchain = () => {
    const [activeView, setActiveView] = useState<'register' | 'verify'>('verify');

    const records = [
        { block: 19283401, time: '2 mins ago', hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', tx: '0x32f...912' },
        { block: 19283385, time: '12 mins ago', hash: 'fb5231c5ee965f80c2fdb188448657682db596bc4e3a4e98f4803d2fb5b8696b', tx: '0x88e...441' },
        { block: 19283350, time: '1 hr ago', hash: '08d5336d39415668407dd523b08e5e1a38096f3a3f009e46a7f85854bc65727e', tx: '0xc1a...00b' },
    ];

    return (
        <div className="container mx-auto px-6 py-12">
            <div className="flex flex-col items-center text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-display font-black mb-4">BLOCKCHAIN GUARDIAN</h1>
                <p className="text-white/50 max-w-xl">
                    Content authentication via the Polygon network. Register originals, verify hashes, and ensure tamper-proof truth.
                </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-12">
                    <div className="flex space-x-4">
                        <button
                            onClick={() => setActiveView('verify')}
                            className={`flex-1 py-4 rounded-xl font-bold transition-all border ${activeView === 'verify' ? 'bg-force-blue text-black border-force-blue' : 'bg-white/5 text-white/50 border-white/10 hover:border-white/20'}`}
                        >
                            Verify Hash
                        </button>
                        <button
                            onClick={() => setActiveView('register')}
                            className={`flex-1 py-4 rounded-xl font-bold transition-all border ${activeView === 'register' ? 'bg-force-blue text-black border-force-blue' : 'bg-white/5 text-white/50 border-white/10 hover:border-white/20'}`}
                        >
                            Register Original
                        </button>
                    </div>

                    <AnimatePresence mode="wait">
                        {activeView === 'verify' ? (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="glass-panel p-12">
                                <div className="flex justify-center mb-8">
                                    <div className="w-20 h-20 bg-force-blue/10 rounded-full flex items-center justify-center border-2 border-force-blue shadow-blue-glow">
                                        <ShieldCheck className="text-force-blue" size={40} />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-black text-center mb-12">AUTHENTICITY VERIFICATION</h3>
                                <div className="relative mb-6">
                                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Paste SHA-256 Hash or Transaction ID"
                                        className="w-full bg-force-black border border-white/10 rounded-xl py-4 pl-12 pr-4 font-mono text-sm focus:outline-none focus:border-force-blue transition-colors"
                                    />
                                </div>
                                <button className="btn-primary w-full py-4 text-sm tracking-widest uppercase">Query Blockchain</button>
                                <div className="mt-8 pt-8 border-t border-white/5 text-center">
                                    <div className="text-white/30 text-xs">Supported Networks</div>
                                    <div className="flex justify-center space-x-6 mt-4 opacity-50 grayscale hover:grayscale-0 transition-all">
                                        <div className="text-xs font-black uppercase flex items-center space-x-1">
                                            <Layers size={14} /> <span>Polygon</span>
                                        </div>
                                        <div className="text-xs font-black uppercase flex items-center space-x-1">
                                            <Database size={14} /> <span>Ethereum</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="glass-panel p-12">
                                <div className="flex justify-center mb-8">
                                    <div className="w-20 h-20 bg-force-gold/10 rounded-full flex items-center justify-center border-2 border-force-gold shadow-gold-glow">
                                        <Layers className="text-force-gold" size={40} />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-black text-center mb-12">CONTENT ANCHORING</h3>
                                <div className="aspect-[16/6] border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center mb-8 group cursor-pointer hover:bg-white/5 transition-all">
                                    <ArrowDown size={32} className="text-white/20 group-hover:text-force-gold transition-colors mb-4" />
                                    <span className="text-sm font-bold text-white/30">Drop master file to generate signature</span>
                                </div>
                                <button className="btn-secondary w-full py-4 text-sm tracking-widest uppercase font-black hover:bg-force-gold hover:text-black border-force-gold text-force-gold">Initialize Transaction</button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="space-y-6">
                    <div className="glass-panel p-8">
                        <h3 className="text-xl font-bold mb-8 flex justify-between items-center">
                            <span>Recent Records</span>
                            <Cpu size={18} className="text-white/20" />
                        </h3>
                        <div className="space-y-4">
                            {records.map((record, i) => <RecordItem key={i} record={record} />)}
                        </div>
                        <button className="w-full mt-6 py-4 rounded-xl border border-white/10 text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-all">
                            <ExternalLink size={14} className="inline mr-2" />
                            Open Explorer
                        </button>
                    </div>

                    <div className="glass-panel p-8 bg-gradient-to-br from-force-blue/5 to-transparent border-force-blue/10">
                        <h4 className="font-bold text-sm mb-4">Why Blockchain?</h4>
                        <p className="text-xs text-white/40 leading-relaxed">
                            By hashing original content onto a public ledger, we create a chronological 'Source of Truth'. Any subsequent deepfake will fail to match the immutable hash, providing undeniable proof of manipulation.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Blockchain;
