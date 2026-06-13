import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Link2, 
  MousePointerClick, 
  Calendar, 
  Clock, 
  Download, 
  Globe,
  Compass
} from 'lucide-react';
import Button from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';

const PublicStats = () => {
  const { shortCode } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPublicStats = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      // Chop off '/api' if request hits base stats URL
      const baseApiUrl = apiUrl.replace(/\/api$/, '');
      const response = await axios.get(`${baseApiUrl}/stats/${shortCode}`);
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (err) {
      console.error(err);
      setError('Short URL statistics not found or link has been deleted.');
    } finally {
      setLoading(false);
    }
  }, [shortCode]);

  useEffect(() => {
    fetchPublicStats();
  }, [fetchPublicStats]);

  const downloadQR = () => {
    if (!data || !data.qrCode) return;
    const link = document.createElement('a');
    link.href = data.qrCode;
    link.download = `qr_${shortCode}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getBaseRedirectUrl = () => {
    return process.env.NODE_ENV === 'production' 
      ? 'https://linkpulse.vercel.app' 
      : 'http://localhost:5000';
  };

  const fullShortUrl = `${getBaseRedirectUrl()}/${shortCode}`;

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex flex-col justify-center items-center gap-4">
        <div className="w-10 h-10 border-4 border-brand-indigo border-t-transparent rounded-full animate-spin"></div>
        <p className="text-dark-400 text-xs tracking-wider font-semibold">RETRIEVING PUBLIC STATISTICS...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark-950 bg-mesh-grid text-dark-100 flex items-center justify-center p-6">
        <Card className="max-w-md w-full text-center border-brand-danger/20 p-8">
          <Globe className="w-16 h-16 text-brand-danger mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white">Metrics Unavailable</h2>
          <p className="text-dark-400 text-sm mt-2">{error}</p>
          <div className="mt-6">
            <Link to="/">
              <Button variant="outline" className="w-full">Return Home</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950 bg-mesh-grid text-dark-100 py-16 px-6 flex flex-col justify-center items-center relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-brand-indigo/5 blur-[100px] pointer-events-none" />

      <div className="max-w-xl w-full relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-brand-indigo to-brand-cyan flex items-center justify-center text-white">
              <Link2 className="w-5 h-5 rotate-45" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">
              Link<span className="text-brand-cyan">Pulse</span>
            </span>
          </Link>
          <span className="text-xs text-dark-400 mt-1.5 uppercase font-semibold tracking-wider">
            Public Traffic Statistics
          </span>
        </div>

        {/* Short Link Target Info */}
        <Card className="bg-dark-900/60 backdrop-blur-md border border-dark-700/60 p-6">
          <div className="space-y-1 overflow-hidden">
            <span className="text-[10px] text-brand-indigo font-bold uppercase tracking-wider block">Short URL Link</span>
            <h2 className="text-lg font-bold text-white truncate block">{fullShortUrl}</h2>
            <p className="text-xs text-dark-400 truncate max-w-md block mt-1">
              Redirect Destination: <span className="text-dark-300 font-medium select-all">{data.originalUrl}</span>
            </p>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-dark-900/60 backdrop-blur-md border border-dark-700/60 p-4 text-center">
            <div className="w-8 h-8 rounded-lg bg-brand-indigo/15 flex items-center justify-center text-brand-indigo mx-auto mb-2">
              <MousePointerClick className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-dark-400 uppercase tracking-wider block">Clicks</span>
            <span className="text-lg font-bold text-white block mt-1">{data.totalClicks}</span>
          </Card>

          <Card className="bg-dark-900/60 backdrop-blur-md border border-dark-700/60 p-4 text-center">
            <div className="w-8 h-8 rounded-lg bg-brand-cyan/15 flex items-center justify-center text-brand-cyan mx-auto mb-2">
              <Calendar className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-dark-400 uppercase tracking-wider block">Created</span>
            <span className="text-xs font-bold text-white block mt-2">
              {new Date(data.createdAt).toLocaleDateString()}
            </span>
          </Card>

          <Card className="bg-dark-900/60 backdrop-blur-md border border-dark-700/60 p-4 text-center">
            <div className="w-8 h-8 rounded-lg bg-brand-violet/15 flex items-center justify-center text-brand-violet mx-auto mb-2">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-dark-400 uppercase tracking-wider block">Last Visit</span>
            <span className="text-xs font-bold text-white block mt-2 truncate">
              {data.lastVisitedTime ? new Date(data.lastVisitedTime).toLocaleDateString() : 'Never'}
            </span>
          </Card>
        </div>

        {/* QR Code Segment */}
        <Card className="bg-dark-900/60 backdrop-blur-md border border-dark-700/60 p-6 flex flex-col items-center">
          <span className="text-xs font-bold text-white uppercase tracking-wider mb-4">Print / Download QR Code</span>
          <div className="p-3 bg-white rounded-xl max-w-[180px] w-full border border-dark-700/20 mb-4">
            {data.qrCode && (
              <img
                src={data.qrCode}
                alt="Short url QR Code"
                className="w-full h-auto aspect-square object-contain"
              />
            )}
          </div>
          <Button variant="cyan" size="sm" className="w-full gap-2 shadow-neon-cyan" onClick={downloadQR}>
            <Download className="w-3.5 h-3.5 font-bold" />
            Download QR Code (PNG)
          </Button>
        </Card>

        {/* Home navigation link */}
        <div className="text-center">
          <Link to="/" className="text-xs text-dark-400 hover:text-white transition-colors underline decoration-dark-700 hover:decoration-white">
            Need a URL Shortener? Start using LinkPulse today
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PublicStats;
