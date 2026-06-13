import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../components/ui/Toast';
import { 
  ArrowLeft, 
  Calendar, 
  MousePointerClick, 
  Clock, 
  Globe, 
  Laptop, 
  Compass, 
  ChevronRight,
  TrendingUp,
  MapPin,
  Share2
} from 'lucide-react';
import Button from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '../components/ui/Table';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const CHART_COLORS = ['#6366f1', '#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

const AnalyticsDetails = () => {
  const { urlId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(`/analytics/${urlId}`);
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load link analytics details');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  }, [urlId, toast, navigate]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <div className="w-10 h-10 border-4 border-brand-indigo border-t-transparent rounded-full animate-spin"></div>
        <p className="text-dark-400 text-sm tracking-wider font-semibold">RETRIEVING VISIT ANALYTICS...</p>
      </div>
    );
  }

  if (!data) return null;

  const { url, summary, charts, recentVisits } = data;

  const getBaseRedirectUrl = () => {
    return process.env.NODE_ENV === 'production' 
      ? 'https://linkpulse.vercel.app' 
      : 'http://localhost:5000';
  };

  const fullShortUrl = `${getBaseRedirectUrl()}/${url.shortCode}`;

  // Custom tooltips to fit dark mode aesthetics
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-dark-800 border border-dark-700/90 p-3 rounded-lg shadow-xl text-xs font-semibold">
          <p className="text-dark-400">{label}</p>
          <p className="text-white mt-1">Clicks: <span className="text-brand-cyan font-bold">{payload[0].value}</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Navigation Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-dark-400 font-bold uppercase tracking-widest">
            <Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-dark-300">Analytics Detail</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-1.5 rounded-lg border border-dark-700 hover:bg-dark-800 transition-colors text-dark-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            Analytics Insights
          </h1>
        </div>

        {/* Public stats navigation shortcut */}
        <Link to={`/stats/${url.shortCode}`} target="_blank" rel="noopener noreferrer">
          <Button variant="secondary" className="gap-2">
            <Share2 className="w-4 h-4 text-brand-cyan" />
            Public Statistics Page
          </Button>
        </Link>
      </div>

      {/* Target URL Reference Card */}
      <Card className="bg-dark-900/40 border border-dark-700/60 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 overflow-hidden">
          <span className="text-[10px] text-brand-indigo font-bold uppercase tracking-wider block">Short URL Link</span>
          <a
            href={fullShortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg font-bold text-white hover:text-brand-indigo transition-colors truncate block"
          >
            {fullShortUrl}
          </a>
          <span className="text-xs text-dark-400 truncate block font-medium">
            Destination: <span className="text-dark-300 select-all">{url.originalUrl}</span>
          </span>
        </div>
        
        <div className="text-xs text-dark-400 font-semibold border-l-0 md:border-l border-dark-700/60 pl-0 md:pl-6 pt-2 md:pt-0 flex flex-col gap-1 flex-shrink-0">
          <span>Created: {new Date(url.createdAt).toLocaleString()}</span>
          <span>Expiry: {url.expiryDate ? new Date(url.expiryDate).toLocaleDateString() : 'Never'}</span>
        </div>
      </Card>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-dark-900/40 border border-dark-700/60 p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-brand-indigo/15 border border-brand-indigo/20 flex items-center justify-center text-brand-indigo">
            <MousePointerClick className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-dark-400 uppercase tracking-widest block leading-none">Total Clicks</span>
            <span className="text-2xl font-bold text-white block mt-1">{summary.totalClicks}</span>
          </div>
        </Card>

        <Card className="bg-dark-900/40 border border-dark-700/60 p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-brand-cyan/15 border border-brand-cyan/20 flex items-center justify-center text-brand-cyan">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-dark-400 uppercase tracking-widest block leading-none">Last Visit</span>
            <span className="text-sm font-bold text-white block mt-1.5 truncate max-w-[140px]">
              {summary.lastVisit ? new Date(summary.lastVisit).toLocaleDateString() : 'Never'}
            </span>
          </div>
        </Card>

        <Card className="bg-dark-900/40 border border-dark-700/60 p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-brand-violet/15 border border-brand-violet/20 flex items-center justify-center text-brand-violet">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-dark-400 uppercase tracking-widest block leading-none">Active Days</span>
            <span className="text-2xl font-bold text-white block mt-1">{summary.activeDays}</span>
          </div>
        </Card>

        <Card className="bg-dark-900/40 border border-dark-700/60 p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-brand-pink/15 border border-brand-pink/20 flex items-center justify-center text-brand-pink">
            <Laptop className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-dark-400 uppercase tracking-widest block leading-none">Top Device</span>
            <span className="text-2xl font-bold text-white block mt-1 capitalize">{summary.topDevice}</span>
          </div>
        </Card>
      </div>

      {/* Analytics charts segment */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Click trends (line chart) */}
        <Card className="bg-dark-900/40 border border-dark-700/60 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="w-4 h-4 text-brand-indigo" />
              Daily Click Trends (Last 7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={charts.dailyTrends}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                  <XAxis
                    dataKey="date"
                    stroke="#4b5563"
                    fontSize={11}
                    tickFormatter={(val) => {
                      const parts = val.split('-');
                      return `${parts[1]}/${parts[2]}`; // mm/dd format
                    }}
                  />
                  <YAxis stroke="#4b5563" fontSize={11} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="clicks"
                    stroke="#6366f1"
                    strokeWidth={3}
                    dot={{ fill: '#6366f1', stroke: '#030712', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Device Distribution (Pie Chart) */}
        <Card className="bg-dark-900/40 border border-dark-700/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Laptop className="w-4 h-4 text-brand-cyan" />
              Device Category Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            {charts.devices.length === 0 ? (
              <div className="h-[260px] flex items-center justify-center text-xs text-dark-500 font-semibold uppercase tracking-wider">
                No visitor data recorded
              </div>
            ) : (
              <div className="h-[260px] w-full flex flex-col justify-between items-center">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={charts.devices}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {charts.devices.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                {/* Custom Legend */}
                <div className="flex gap-4 text-xs font-bold uppercase tracking-wider justify-center">
                  {charts.devices.map((entry, index) => (
                    <div key={entry.name} className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }} />
                      <span className="text-dark-300">{entry.name}</span>
                      <span className="text-white">({entry.value})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Browser distribution (Bar Chart) */}
        <Card className="bg-dark-900/40 border border-dark-700/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Compass className="w-4 h-4 text-brand-violet" />
              Browser Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            {charts.browsers.length === 0 ? (
              <div className="h-[240px] flex items-center justify-center text-xs text-dark-500 font-semibold uppercase tracking-wider">
                No visitor data recorded
              </div>
            ) : (
              <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={charts.browsers} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                    <XAxis dataKey="name" stroke="#4b5563" fontSize={10} />
                    <YAxis stroke="#4b5563" fontSize={11} allowDecimals={false} />
                    <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                    <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]}>
                      {charts.browsers.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[(index + 1) % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Referrer stats */}
        <Card className="bg-dark-900/40 border border-dark-700/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Share2 className="w-4 h-4 text-brand-pink" />
              Top Referring Domains
            </CardTitle>
          </CardHeader>
          <CardContent>
            {charts.referrers.length === 0 ? (
              <div className="h-[240px] flex items-center justify-center text-xs text-dark-500 font-semibold uppercase tracking-wider">
                No referrers logged
              </div>
            ) : (
              <div className="space-y-3 h-[240px] overflow-y-auto pr-1">
                {charts.referrers.sort((a,b) => b.value - a.value).map((ref, idx) => (
                  <div key={idx} className="flex justify-between items-center py-1.5 border-b border-dark-800 last:border-0 text-xs">
                    <span className="text-dark-300 font-semibold truncate max-w-[180px]">{ref.name}</span>
                    <span className="text-white font-bold bg-dark-800 px-2 py-0.5 rounded border border-dark-700">{ref.value} clicks</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Geolocation Distribution (Bar Chart) */}
        <Card className="bg-dark-900/40 border border-dark-700/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <MapPin className="w-4 h-4 text-brand-success" />
              Top Visitor Geographies
            </CardTitle>
          </CardHeader>
          <CardContent>
            {charts.countries.length === 0 ? (
              <div className="h-[240px] flex items-center justify-center text-xs text-dark-500 font-semibold uppercase tracking-wider">
                No visitor data recorded
              </div>
            ) : (
              <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={charts.countries.slice(0, 5)} layout="vertical" margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" horizontal={false} />
                    <XAxis type="number" stroke="#4b5563" fontSize={11} allowDecimals={false} />
                    <YAxis dataKey="name" type="category" stroke="#4b5563" fontSize={11} />
                    <Tooltip cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                    <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Visits Log Table */}
      <Card className="bg-dark-900/40 border border-dark-700/60">
        <CardHeader>
          <CardTitle className="text-lg">Recent Visit Logs (Last 20 hits)</CardTitle>
        </CardHeader>
        <CardContent>
          {recentVisits.length === 0 ? (
            <div className="text-center py-12 text-xs text-dark-500 font-semibold uppercase tracking-wider">
              No individual visits logged yet.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Geographics</TableHead>
                  <TableHead>Browser</TableHead>
                  <TableHead>OS</TableHead>
                  <TableHead>Device</TableHead>
                  <TableHead>Referrer</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentVisits.map((v) => (
                  <TableRow key={v._id}>
                    <TableCell className="text-xs font-semibold text-dark-300">
                      {new Date(v.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-xs text-dark-400 select-all font-mono">
                      {v.ipAddress}
                    </TableCell>
                    <TableCell className="text-xs font-semibold text-dark-100 flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5 text-brand-success" />
                      {v.city}, {v.country}
                    </TableCell>
                    <TableCell className="text-xs font-medium text-dark-300">
                      {v.browser}
                    </TableCell>
                    <TableCell className="text-xs font-medium text-dark-300">
                      {v.operatingSystem}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-dark-800 border border-dark-700 text-dark-300">
                        {v.deviceType}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-dark-400 max-w-[120px] truncate">
                      {v.referrer}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDetails;
