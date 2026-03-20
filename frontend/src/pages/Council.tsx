import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Scale, Cpu, UserCheck, Share2, Download, Code, ExternalLink, Shield, AlertCircle, Loader2 } from 'lucide-react';
import api, { videoApi } from '../services/api';
import toast from 'react-hot-toast';

const JournalistView = ({ data, onDownload }: any) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
        <div className={`glass-panel p-12 text-center border-white/10 ${data.ensemble_result.verdict === 'FAKE' ? 'bg-force-red/[0.05] border-force-red/20' : 'bg-force-green/[0.05] border-force-green/20'}`}>
            <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-bold mb-6 ${data.ensemble_result.verdict === 'FAKE' ? 'bg-force-red/10 text-force-red' : 'bg-force-green/10 text-force-green'}`}>
                <span>VERDICT: {data.ensemble_result.verdict}</span>
            </div>
            <h2 className="text-4xl font-display font-black mb-4 uppercase">
                {data.ensemble_result.verdict === 'FAKE' ? 'MANIPULATION DETECTED' : 'CLEAR CONTENT'}
            </h2>
            <p className="text-white/60 max-w-xl mx-auto mb-8">
                {data.ensemble_result.verdict === 'FAKE' 
                    ? "Our system has high confidence that this video has been synthetically altered. Most newsrooms are advised to avoid broadcasting without further verification."
                    : "The four forensic forces indicate no significant signs of synthetic manipulation. Content is likely authentic."}
            </p>
            <div className="flex justify-center space-x-4">
                <button className="btn-primary py-2 px-6 text-sm flex items-center space-x-2">
                    <Share2 size={16} />
                    <span>Share Alert</span>
                </button>
                <button onClick={onDownload} className="btn-secondary py-2 px-6 text-sm flex items-center space-x-2">
                    <Download size={16} />
                    <span>Press Kit</span>
                </button>
            </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
            <div className="glass-panel p-8">
                <h3 className="font-bold mb-4 flex items-center space-x-2">
                    <FileText className="text-force-blue" />
                    <span>Evidence Summary</span>
                </h3>
                <ul className="space-y-4 text-sm text-white/50">
                    <li>• AI Probability: {(data.ensemble_result.final_score).toFixed(1)}%</li>
                    <li>• Visual Force: {data.visual_analysis.score}% certainty</li>
                    <li>• Audio Sync: {data.audio_analysis.score}% anomaly</li>
                </ul>
            </div>
            <div className="glass-panel p-8">
                <h3 className="font-bold mb-4 flex items-center space-x-2">
                    <ExternalLink className="text-force-blue" />
                    <span>Metadata Origin</span>
                </h3>
                <p className="text-sm text-white/50 mb-4 italic">File Name: {data.visual_analysis.details.method || 'General Analysis'}</p>
                <div className="aspect-video bg-white/5 rounded-lg border border-white/10 flex flex-col items-center justify-center space-y-2">
                    <span className="text-xs font-mono opacity-20">[{data.ensemble_result.verdict} DETECTED]</span>
                    <span className="text-[10px] text-white/30 uppercase">ID: {data.ensemble_result.id}</span>
                </div>
            </div>
        </div>
    </motion.div>
);

const CourtView = ({ data, onDownload }: any) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
        <div className="glass-panel p-8 grid md:grid-cols-3 gap-12">
            <div className="md:col-span-2">
                <h3 className="text-2xl font-black mb-6 uppercase tracking-tighter">FORENSIC EVIDENCE LOG</h3>
                <div className="space-y-4 font-mono text-xs">
                    {[
                        { event: 'AI Neural Classifier', score: data.visual_analysis.score, status: data.visual_analysis.score > 50 ? 'FAIL' : 'PASS' },
                        { event: 'Audio Spectral Check', score: data.audio_analysis.score, status: data.audio_analysis.score > 50 ? 'FAIL' : 'PASS' },
                        { event: 'Biometric Heartbeat', score: data.biometric_analysis.score, status: data.biometric_analysis.score > 50 ? 'FAIL' : 'PASS' },
                        { event: 'Metadata Integrity', score: data.metadata_analysis.score, status: data.metadata_analysis.score > 50 ? 'FAIL' : 'PASS' },
                    ].map((log, i) => (
                        <div key={i} className="flex justify-between p-3 bg-white/5 rounded border border-white/5">
                            <span className="text-white/40">[{i+1}]</span>
                            <span className="text-white/80">{log.event}</span>
                            <span className="text-white/40">{Math.round(log.score)}%</span>
                            <span className={log.status === 'FAIL' ? 'text-force-red' : 'text-force-green'}>{log.status}</span>
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
                        <span className="text-[10px] text-white/40 text-center leading-tight">SHA-256 Hash Anchored on Polygon Blockchain</span>
                    </div>
                </div>
                <button onClick={onDownload} className="btn-primary w-full py-3 text-[10px] font-bold uppercase tracking-[0.2em] shadow-blue-glow">Generate Admissibility Doc</button>
            </div>
        </div>
    </motion.div>
);

const PlatformView = ({ data }: any) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="glass-panel p-8">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold flex items-center space-x-2">
                    <Code className="text-force-green" />
                    <span>API Response Stream</span>
                </h3>
                <div className="text-[10px] font-mono text-white/30">v1.2 // Production</div>
            </div>
            <div className="bg-force-black rounded-xl p-8 border border-white/5 font-mono text-sm overflow-x-auto">
                <pre className="text-emerald-500">
                    {JSON.stringify({
                        id: `VF-${data.ensemble_result.id}`,
                        verdict: data.ensemble_result.verdict,
                        confidence: data.ensemble_result.final_score / 100,
                        forces: {
                            visual: data.visual_analysis.score / 100,
                            audio: data.audio_analysis.score / 100,
                            biometric: data.biometric_analysis.score / 100,
                            metadata: data.metadata_analysis.score / 100
                        },
                        reasons: data.ensemble_result.details.reasons || ["Analysis complete"]
                    }, null, 2)}
                </pre>
            </div>
            <div className="mt-8 grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <h4 className="text-xs font-bold uppercase mb-2">Endpoint Method</h4>
                    <div className="text-force-blue font-mono">POST /api/v1/analyze/dossier</div>
                </div>
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <h4 className="text-xs font-bold uppercase mb-2">Auth Required</h4>
                    <div className="text-force-gold font-mono">Bearer AUTH_TOKEN</div>
                </div>
            </div>
        </div>
    </motion.div>
);

const CitizenView = ({ data }: any) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex flex-col items-center justify-center py-12">
            <div className="w-full max-w-sm glass-panel p-8 relative">
                <div className="absolute -top-12 left-1/2 -translate-x-1/2">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${data.ensemble_result.verdict === 'FAKE' ? 'bg-force-red text-white' : 'bg-force-blue text-black'}`}>
                        <Shield />
                    </div>
                </div>
                <h3 className="text-xl font-bold text-center mt-4 mb-2">VeriForce Extension</h3>
                <p className="text-sm text-center text-white/40 mb-8 lowercase tracking-widest">Active Protection</p>

                <div className={`p-4 rounded-lg mb-6 border ${data.ensemble_result.verdict === 'FAKE' ? 'bg-force-red/10 border-force-red/20' : 'bg-force-green/10 border-force-green/20'}`}>
                    <div className="flex items-center space-x-3 mb-2">
                        {data.ensemble_result.verdict === 'FAKE' ? <AlertCircle size={16} className="text-force-red" /> : <Shield size={16} className="text-force-green" />}
                        <span className={`text-xs font-bold uppercase ${data.ensemble_result.verdict === 'FAKE' ? 'text-force-red' : 'text-force-green'}`}>
                            {data.ensemble_result.verdict === 'FAKE' ? 'Fake Content Alert' : 'Content Verified'}
                        </span>
                    </div>
                    <p className="text-xs text-white/60 leading-relaxed uppercase tracking-tighter">
                        {data.ensemble_result.verdict === 'FAKE' 
                            ? "This video has been flagged as synthetic. Viewer discretion is advised."
                            : "No synthetic signatures detected. This content appears human-origin."}
                    </p>
                </div>

                <div className="space-y-3">
                    <button className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold transition-colors">Forensic Breakdown</button>
                    <button className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold transition-colors">Send to Council</button>
                </div>
            </div>
            <p className="mt-12 text-center text-white/40 text-sm max-w-xs uppercase tracking-widest font-mono text-[8px]">
                Real-time browser defense active.
            </p>
        </div>
    </motion.div>
);

const Council = () => {
    const [activeTab, setActiveTab] = useState('journalist');
    const [videoId, setVideoId] = useState<number | null>(null);
    const [videoData, setVideoData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchLatestVideoData = async () => {
        try {
            // Fetch list of videos
            const res = await api.get('videos/');
            if (res.data && res.data.length > 0) {
                // Get the latest one that is completed
                const completed = res.data.filter((v: any) => v.status === 'COMPLETED').sort((a: any, b: any) => b.id - a.id);
                if (completed.length > 0) {
                    const latestId = completed[0].id;
                    setVideoId(latestId);
                    const resultsRes = await videoApi.results(latestId);
                    setVideoData(resultsRes.data);
                }
            }
        } catch (e) {
            console.error('Failed to fetch data', e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownloadDossier = async () => {
        if (!videoId) return;
        try {
            const res = await videoApi.exportDossier(videoId);
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `veriforce_dossier_${videoId}.json`);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
            toast.success('Forensic Case File generated and downloaded.');
        } catch (e) {
            toast.error('Failed to generate export.');
        }
    };

    useEffect(() => {
        fetchLatestVideoData();
    }, []);

    const tabs = [
        { id: 'journalist', name: 'Journalist', icon: FileText },
        { id: 'court', name: 'Legal/Court', icon: Scale },
        { id: 'platform', name: 'Platform API', icon: Cpu },
        { id: 'citizen', name: 'Citizen', icon: UserCheck },
    ];

    if (isLoading) return (
        <div className="flex h-[80vh] items-center justify-center">
            <div className="flex flex-col items-center space-y-4">
                <Loader2 className="animate-spin text-force-blue" size={48} />
                <span className="text-xs font-mono tracking-[0.4em] uppercase opacity-40">Consulting the Council...</span>
            </div>
        </div>
    );

    if (!videoData) return (
        <div className="flex h-[80vh] items-center justify-center p-12 text-center">
            <div className="glass-panel p-12 max-w-lg cursor-pointer" onClick={() => window.location.href = '/detector'}>
                <AlertCircle className="text-force-blue mx-auto mb-6" size={48} />
                <h3 className="text-2xl font-black mb-4 uppercase">No Cases Available</h3>
                <p className="text-white/40 mb-8">You must analyze a video in the Detector before the Council can pass judgment.</p>
                <button className="btn-primary py-2 px-8">Go to Detector</button>
            </div>
        </div>
    );

    return (
        <div className="container mx-auto px-6 py-12">
            <div className="flex flex-col items-center mb-16">
                <h1 className="text-4xl md:text-5xl font-display font-black mb-4">THE JEDI COUNCIL</h1>
                <p className="text-white/50 lowercase tracking-widest font-mono text-xs">Four perspectives on the same verdict.</p>
                <div className="mt-4 px-4 py-1 rounded-full border border-white/5 bg-white/[0.02] text-[10px] font-mono opacity-40">
                    CASE ID: VF-{videoId} // SOURCE: {videoData.visual_analysis.details.method || 'ENSEMBLE'}
                </div>
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
                    {activeTab === 'journalist' && <JournalistView key="journalist" data={videoData} onDownload={handleDownloadDossier} />}
                    {activeTab === 'court' && <CourtView key="court" data={videoData} onDownload={handleDownloadDossier} />}
                    {activeTab === 'platform' && <PlatformView key="platform" data={videoData} />}
                    {activeTab === 'citizen' && <CitizenView key="citizen" data={videoData} />}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Council;
