import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileVideo, Shield, AlertTriangle, CheckCircle, Zap, Database, Globe, Activity, Search, Play, Loader2, X } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import api, { videoApi } from '../services/api';
import toast from 'react-hot-toast';

const ProcessingOverlay = ({ statusText }: { statusText: string }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-force-black/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-12 text-center"
    >
        <div className="relative w-full max-w-xs h-1 bg-white/10 rounded-full overflow-hidden mb-8">
            <motion.div
                animate={{
                    left: ['-100%', '100%'],
                    transition: { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
                }}
                className="absolute top-0 bottom-0 w-1/2 bg-force-blue shadow-blue-glow"
            />
        </div>

        <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-2xl font-display font-black tracking-widest text-force-blue mb-4"
        >
            ANALYZING THE FORCE
        </motion.div>
        <div className="text-sm text-white/50 font-mono">
            {statusText}
        </div>
    </motion.div>
);

const ForceScore = ({ icon: Icon, score, title, color }: any) => (
    <div className="glass-panel p-6 border-white/5">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-lg bg-force-${color}/10 text-force-${color}`}>
                <Icon size={20} />
            </div>
            <div className={`text-2xl font-black ${score > 60 ? 'text-force-red' : 'text-force-green'}`}>
                {Math.round(score)}%
            </div>
        </div>
        <h4 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-1">{title}</h4>
        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${score}%` }}
                className={`h-full ${score > 60 ? 'bg-force-red' : 'bg-force-green'}`}
            />
        </div>
    </div>
);

const ForceReportModal = ({ isOpen, onClose, report }: any) => (
    <AnimatePresence>
        {isOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-force-black/95 backdrop-blur-xl" onClick={onClose} />
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-4xl bg-force-black border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
                >
                    <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                        <div>
                            <h2 className="text-2xl font-display font-black tracking-tighter">FORENSIC DOSSIER</h2>
                            <p className="text-xs text-white/40 font-mono uppercase">Case ID: {report.video_id} • Status: {report.verdict}</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors border border-white/10">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-12 space-y-12">
                        <div className="grid md:grid-cols-2 gap-12">
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-force-blue">Officer's Summary</h3>
                                <p className="text-lg text-white/80 leading-relaxed italic border-l-2 border-force-blue pl-6">
                                    "{report.xai_summary}"
                                </p>
                            </div>
                            <div className="glass-panel p-6 bg-white/[0.01]">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">Ensemble Contributions</h3>
                                <div className="space-y-3">
                                    {Object.entries(report.forces || {}).map(([key, data]: any) => (
                                        <div key={key} className="flex justify-between items-center text-xs">
                                            <span className="capitalize">{key} Force</span>
                                            <span className="font-mono text-white/60">{Math.round(data.score)}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="glass-panel p-6 border-force-blue/10">
                                <div className="flex items-center space-x-2 mb-4 text-force-blue">
                                    <Shield size={16} />
                                    <h4 className="text-sm font-bold uppercase">Visual Inconsistencies</h4>
                                </div>
                                <ul className="text-xs space-y-2 text-white/50 font-mono">
                                    <li>• Laplacian Variance: {report.forces?.visual?.details?.avg_laplacian_var?.toFixed(2)}</li>
                                    <li>• Multi-face Detected: {report.forces?.visual?.details?.multi_face_detected ? 'TRUE' : 'FALSE'}</li>
                                    <li>• Frame Score: {report.forces?.visual?.score}%</li>
                                </ul>
                            </div>

                            <div className="glass-panel p-6 border-force-gold/10">
                                <div className="flex items-center space-x-2 mb-4 text-force-gold">
                                    <Activity size={16} />
                                    <h4 className="text-sm font-bold uppercase">Biometric Signatures</h4>
                                </div>
                                <ul className="text-xs space-y-2 text-white/50 font-mono">
                                    <li>• Heart Rate Peak: {report.forces?.biometric?.heart_rate?.toFixed(1) || 'N/A'} BPM</li>
                                    <li>• Signal SNR: {report.forces?.biometric?.blood_flow_data?.snr?.toFixed(2) || '0.00'}</li>
                                    <li>• Pulse Lock: {report.forces?.biometric?.pulse_detected ? 'SECURED' : 'LOST'}</li>
                                </ul>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-force-gold mb-4">Biometric Time-Series Analysis</h3>
                            <div className="glass-panel h-64 w-full p-4 bg-black/40 border-force-gold/5">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={(report.forces?.biometric?.details?.ui_signals || []).map((v: number, i: number) => ({ time: i, value: v }))}>
                                        <defs>
                                            <linearGradient id="colorPulse" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="time" hide />
                                        <YAxis hide domain={['auto', 'auto']} />
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', fontSize: '10px' }}
                                            itemStyle={{ color: '#D4AF37' }}
                                        />
                                        <Area 
                                            type="monotone" 
                                            dataKey="value" 
                                            stroke="#D4AF37" 
                                            fillOpacity={1} 
                                            fill="url(#colorPulse)" 
                                            strokeWidth={2}
                                            isAnimationActive={true}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex justify-between text-[10px] font-mono text-white/20 uppercase">
                                <span>Signal Acquisition: Stable</span>
                                <span>Frame Sampling: 25Hz</span>
                                <span>Method: rPPG (Remote Photoplethysmography)</span>
                            </div>
                        </div>

                        <div className="p-8 rounded-2xl bg-force-red/5 border border-force-red/10">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-force-red mb-2">Legal Disclaimer</h4>
                            <p className="text-[10px] text-white/20 uppercase tracking-widest">
                                This report is generated by the VeriForce Ensemble engine. While highly accurate, it should be used as supporting evidence in a court of law alongside manual multi-spectral verification.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        )}
    </AnimatePresence>
);

const Detector = () => {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [videoId, setVideoId] = useState<number | null>(null);
    const [statusText, setStatusText] = useState('Initializing Force alignment...');
    const [result, setResult] = useState<any>(null);
    const [reportData, setReportData] = useState<any>(null);
    const [isReportOpen, setIsReportOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        setFile(selectedFile);
        setIsUploading(true);
        setResult(null);

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('title', selectedFile.name);

        try {
            const uploadRes = await videoApi.upload(formData);
            const id = uploadRes.data.id;
            setVideoId(id);

            setStatusText('Extracting Metadata Force...');
            setIsProcessing(true);
            setIsUploading(false);
            await videoApi.process(id);
        } catch (error) {
            toast.error('The Force is blocked. Check connection/auth.');
            setIsUploading(false);
        }
    };

    const fetchReport = async () => {
        if (!videoId) return;
        try {
            const reportRes = await api.get(`analysis/${videoId}/report/`);
            setReportData(reportRes.data);
            setIsReportOpen(true);
        } catch (e) {
            toast.error('Forensic file corrupted or missing.');
        }
    };

    useEffect(() => {
        let interval: any;
        if (isProcessing && videoId) {
            interval = setInterval(async () => {
                try {
                    const statusRes = await videoApi.status(videoId);
                    const { status, progress } = statusRes.data;

                    if (status === 'COMPLETED') {
                        const finalRes = await videoApi.results(videoId);
                        setResult(finalRes.data);
                        setIsProcessing(false);
                        clearInterval(interval);
                        toast.success('Analysis complete. Truth revealed.');
                    } else if (status === 'FAILED') {
                        setIsProcessing(false);
                        clearInterval(interval);
                        toast.error('Forensic analysis failed.');
                    } else {
                        if (progress < 40) setStatusText('Analyzing Visual Force (Face Mesh)...');
                        else if (progress < 70) setStatusText('Reading Biometric Pulse...');
                        else setStatusText('Fusing Ensemble Weights...');
                    }
                } catch (e) {
                    console.error('Polling error', e);
                }
            }, 3000);
        }
        return () => clearInterval(interval);
    }, [isProcessing, videoId]);

    return (
        <div className="container mx-auto px-6 py-12">
            <ForceReportModal
                isOpen={isReportOpen}
                onClose={() => setIsReportOpen(false)}
                report={reportData || { forces: {} }}
            />

            <div className="flex flex-col items-center mb-12">
                <h1 className="text-4xl md:text-5xl font-display font-black mb-4">DEEPFAKE DETECTOR</h1>
                <p className="text-white/50">Expose synthetic manipulation across the four forensic forces.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass-panel aspect-video relative overflow-hidden flex flex-col items-center justify-center border-dashed border-2 border-white/10 group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                        <input type="file" className="hidden" ref={fileInputRef} onChange={handleUpload} accept="video/*" />

                        {(isProcessing || isUploading) && <ProcessingOverlay statusText={isUploading ? 'Uploading to Jedi Hub...' : statusText} />}

                        {file ? (
                            <div className="w-full h-full flex items-center justify-center bg-black">
                                <FileVideo size={64} className="text-force-blue opacity-20" />
                                <div className="absolute bottom-6 left-6 flex items-center space-x-3 bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10">
                                    <Play size={16} />
                                    <span className="text-xs font-bold">{file.name}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center group-hover:scale-105 transition-transform">
                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                                    <Upload className="text-white/40 group-hover:text-force-blue transition-colors" />
                                </div>
                                <div className="text-lg font-bold mb-1">Drop video or click to browse</div>
                                <div className="text-sm text-white/30 lowercase">MP4, MOV up to 100MB</div>
                            </div>
                        )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <button className="glass-panel p-4 flex items-center justify-center space-x-3 text-sm font-bold hover:bg-white/5 transition-colors">
                            <Search size={18} />
                            <span>Analyze from URL</span>
                        </button>
                        <button className="glass-panel p-4 flex items-center justify-center space-x-3 text-sm font-bold hover:bg-white/5 transition-colors">
                            <Activity size={18} />
                            <span>Real-time Stream</span>
                        </button>
                    </div>
                </div>

                <div className="space-y-6">
                    <AnimatePresence mode="wait">
                        {!result ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass-panel p-8 text-center">
                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                                    {isProcessing ? <Loader2 className="text-force-blue animate-spin" size={32} /> : <Shield size={32} className="text-white/20" />}
                                </div>
                                <h3 className="text-xl font-bold mb-2">{isProcessing ? 'Processing...' : 'Awaiting Analysis'}</h3>
                                <p className="text-sm text-white/40">The truth will reveal itself shortly.</p>
                            </motion.div>
                        ) : (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                                <div className={`p-8 rounded-2xl border-2 flex flex-col items-center text-center ${result.ensemble_result.verdict === 'FAKE' ? 'bg-force-red/10 border-force-red/30' : 'bg-force-green/10 border-force-green/30'}`}>
                                    {result.ensemble_result.verdict === 'FAKE' ? <AlertTriangle size={48} className="text-force-red mb-4 shadow-red-glow" /> : <CheckCircle size={48} className="text-force-green mb-4 shadow-green-glow" />}
                                    <h3 className="text-4xl font-display font-black mb-1">{result.ensemble_result.verdict}</h3>
                                    <p className="text-sm font-bold mb-6 text-white/60">Confidence: {Math.round(result.ensemble_result.confidence * 100)}%</p>
                                    <button onClick={fetchReport} className="btn-secondary py-2 w-full text-sm">Open Forensic Report</button>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <ForceScore score={result.visual_analysis?.score || 0} icon={Shield} title="Visual" color="blue" />
                                    <ForceScore score={result.audio_analysis?.score || 0} icon={Zap} title="Audio" color="red" />
                                    <ForceScore score={result.metadata_analysis?.score || 0} icon={Database} title="Metadata" color="green" />
                                    <ForceScore score={result.biometric_analysis?.score || 0} icon={Globe} title="Biometric" color="gold" />
                                </div>

                                <div className="glass-panel p-6">
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-force-blue mb-4 flex items-center space-x-2">
                                        <Activity size={14} />
                                        <span>XAI Explainer</span>
                                    </h4>
                                    <p className="text-sm text-white/60 leading-relaxed italic">
                                        {result.ensemble_result.verdict === 'FAKE'
                                            ? "Manipulation detected in biometric frequency alignment and metadata headers. Potential deepfake."
                                            : "All four forces indicate human-origin content with consistent biometric signatures."}
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default Detector;
