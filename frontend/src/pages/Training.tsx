import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, Zap, Brain, Trophy, Play, AlertTriangle, CheckCircle, Share2, RefreshCcw } from 'lucide-react';

const ChallengeCard = ({ onGuess }: any) => {
    const [selected] = useState<number | null>(null);

    return (
        <div className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
                {[0, 1].map((idx) => (
                    <div
                        key={idx}
                        className={`glass-panel aspect-video relative overflow-hidden group border-2 transition-all ${selected === idx ? 'border-force-blue bg-force-blue/5' : 'border-white/10 hover:border-white/30'}`}
                    >
                        <div className="absolute inset-0 bg-black flex items-center justify-center">
                            <Play size={48} className="text-white/20 group-hover:text-force-blue group-hover:scale-110 transition-all" />
                        </div>
                        <div className="absolute top-4 left-4 px-3 py-1 rounded bg-black/60 backdrop-blur-md text-[10px] font-black uppercase tracking-widest border border-white/10">
                            Sample {idx === 0 ? 'A' : 'B'}
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex flex-col items-center">
                <h3 className="text-2xl font-black mb-8">WHICH ONE IS THE <span className="text-force-blue">FORCE</span> (REAL)?</h3>
                <div className="flex space-x-6">
                    <button
                        onClick={() => onGuess(0)}
                        className="w-24 h-24 rounded-full border-2 border-white/20 flex items-center justify-center text-2xl font-black hover:border-force-blue hover:text-force-blue transition-all active:scale-95"
                    >
                        A
                    </button>
                    <button
                        onClick={() => onGuess(1)}
                        className="w-24 h-24 rounded-full border-2 border-white/20 flex items-center justify-center text-2xl font-black hover:border-force-blue hover:text-force-blue transition-all active:scale-95"
                    >
                        B
                    </button>
                </div>
            </div>
        </div>
    );
};

const Training = () => {
    const [gameState, setGameState] = useState<'intro' | 'playing' | 'result'>('intro');
    const [, setScore] = useState(0);
    const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);

    const startNewChallenge = () => {
        setGameState('playing');
        setLastCorrect(null);
    };

    const handleGuess = (idx: number) => {
        const isCorrect = idx === 0; // Simulation: A is always real
        setLastCorrect(isCorrect);
        if (isCorrect) setScore(s => s + 100);
        setGameState('result');
    };

    return (
        <div className="container mx-auto px-6 py-12">
            <div className="flex justify-between items-center mb-16">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-force-blue/10 rounded-xl flex items-center justify-center">
                        <Gamepad2 className="text-force-blue" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-display font-black">TRAINING GROUNDS</h1>
                        <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Sharpen your biological detection</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-sm font-bold text-white/40 uppercase tracking-widest">Global Rank</div>
                    <div className="text-2xl font-black text-force-blue">#1,245</div>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {gameState === 'intro' && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} key="intro" className="max-w-2xl mx-auto text-center py-20">
                        <Brain className="mx-auto mb-8 text-white/20" size={80} />
                        <h2 className="text-5xl font-display font-black mb-8 leading-tight">YOU ARE THE <br /> <span className="text-force-blue">FIRST LINE OF DEFENSE</span></h2>
                        <p className="text-white/50 mb-12">
                            Deepfakes are getting better. We need your eyes and ears to train as well. Spot the real content, learn the signs, and earn your place on the Jedi Council.
                        </p>
                        <button onClick={startNewChallenge} className="btn-primary py-4 px-12 group">
                            <span className="flex items-center space-x-2">
                                <span>Enter Training Mode</span>
                                <Zap size={18} className="group-hover:animate-bounce" />
                            </span>
                        </button>
                    </motion.div>
                )}

                {gameState === 'playing' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key="playing">
                        <ChallengeCard onGuess={handleGuess} />
                    </motion.div>
                )}

                {gameState === 'result' && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} key="result" className="max-w-lg mx-auto text-center py-20">
                        <div className="mb-12">
                            {lastCorrect ? (
                                <div className="flex flex-col items-center">
                                    <div className="w-20 h-20 bg-force-green/20 rounded-full flex items-center justify-center mb-6 border-2 border-force-green">
                                        <CheckCircle size={40} className="text-force-green" />
                                    </div>
                                    <h3 className="text-4xl font-display font-black text-force-green mb-2">MASTERFULLY DONE</h3>
                                    <p className="text-white/50 italic">"Sample A was indeed the real footage. You spotted the authentic blood flow patterns."</p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center">
                                    <div className="w-20 h-20 bg-force-red/20 rounded-full flex items-center justify-center mb-6 border-2 border-force-red">
                                        <AlertTriangle size={40} className="text-force-red" />
                                    </div>
                                    <h3 className="text-4xl font-display font-black text-force-red mb-2">TRICKED BY THE DARK SIDE</h3>
                                    <p className="text-white/50 italic">"You chose the deepfake. Notice the slight jitter in the lip-sync during the second sentence."</p>
                                </div>
                            )}
                        </div>

                        <div className="glass-panel p-8 mb-8">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-left">
                                    <div className="text-[10px] font-black uppercase text-white/30 mb-1">Score Earned</div>
                                    <div className="text-2xl font-black text-white">+{lastCorrect ? '100' : '0'} XP</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] font-black uppercase text-white/30 mb-1">Current Streak</div>
                                    <div className="text-2xl font-black text-force-blue">3 Fires</div>
                                </div>
                            </div>
                        </div>

                        <div className="flex space-x-4">
                            <button onClick={startNewChallenge} className="btn-primary flex-1 py-4 flex items-center justify-center space-x-2">
                                <RefreshCcw size={18} />
                                <span>Next Challenge</span>
                            </button>
                            <button className="glass-panel px-8 py-4 flex items-center space-x-2 font-bold hover:bg-white/5">
                                <Share2 size={18} />
                                <span>Share IQ</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="mt-20 glass-panel p-8">
                <h3 className="text-lg font-bold mb-8 flex items-center space-x-2">
                    <Trophy size={18} className="text-force-gold" />
                    <span>Leaderboard</span>
                </h3>
                <div className="space-y-4">
                    {[
                        { rank: 1, name: 'Anakin S.', score: 12500, avatar: 'A' },
                        { rank: 2, name: 'Obi-Wan K.', score: 11200, avatar: 'O' },
                        { rank: 3, name: 'Ahsoka T.', score: 9800, avatar: 'A' },
                    ].map((user) => (
                        <div key={user.rank} className="flex justify-between items-center p-3 rounded-xl hover:bg-white/5 transition-all">
                            <div className="flex items-center space-x-4">
                                <span className="text-sm font-black text-white/20 w-4">#{user.rank}</span>
                                <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center font-bold text-xs">{user.avatar}</div>
                                <span className="font-bold text-sm">{user.name}</span>
                            </div>
                            <div className="text-sm font-mono text-force-blue font-bold">{user.score} XP</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Training;
