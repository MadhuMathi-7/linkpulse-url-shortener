import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../components/ui/Toast';
import { 
  Link2, 
  Copy, 
  BarChart3, 
  Download, 
  Trash2, 
  Edit2, 
  Search, 
  Plus, 
  QrCode, 
  Upload, 
  Calendar, 
  Globe, 
  Clock, 
  MousePointerClick, 
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  FileSpreadsheet
} from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Card, CardContent } from '../components/ui/Card';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '../components/ui/Table';
import Dialog from '../components/ui/Dialog';

const Dashboard = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalLinks: 0,
    totalClicks: 0,
    activeLinks: 0,
    expiredLinks: 0
  });

  // Query Params
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // Single URL shorten inputs
  const [originalUrl, setOriginalUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [shortenLoading, setShortenLoading] = useState(false);

  // Edit Link Modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingUrl, setEditingUrl] = useState(null);
  const [editOriginalUrl, setEditOriginalUrl] = useState('');
  const [editExpiryDate, setEditExpiryDate] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  // Delete Link Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingUrlId, setDeletingUrlId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // QR Code Preview Modal
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrCodeData, setQrCodeData] = useState({ code: '', original: '', short: '' });

  // Bulk Upload Modal
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [bulkFile, setBulkFile] = useState(null);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkResults, setBulkResults] = useState(null);

  // Fetch lists
  const fetchUrls = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/urls', {
        params: {
          page,
          search,
          status,
          sortBy,
          sortOrder,
          limit: 8
        }
      });
      if (response.data.success) {
        setUrls(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
        setStats(response.data.stats);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load links dashboard data');
    } finally {
      setLoading(false);
    }
  }, [page, search, status, sortBy, sortOrder, toast]);

  useEffect(() => {
    fetchUrls();
  }, [fetchUrls]);

  // Handle single shorten submit
  const handleShorten = async (e) => {
    e.preventDefault();
    if (!originalUrl) {
      toast.warning('Please enter a destination URL');
      return;
    }

    setShortenLoading(true);
    try {
      const payload = { originalUrl };
      if (customAlias) payload.customAlias = customAlias;
      if (expiryDate) payload.expiryDate = new Date(expiryDate).toISOString();

      const response = await api.post('/urls', payload);
      if (response.data.success) {
        toast.success('URL shortened successfully!');
        setOriginalUrl('');
        setCustomAlias('');
        setExpiryDate('');
        fetchUrls();
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Error shortening URL');
    } finally {
      setShortenLoading(false);
    }
  };

  // Copy helper
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied link to clipboard!');
  };

  // QR Downloader
  const downloadQR = (base64, code) => {
    const link = document.createElement('a');
    link.href = base64;
    link.download = `qr_${code}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('QR Code download started');
  };

  // Edit submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      const response = await api.put(`/urls/${editingUrl._id}`, {
        originalUrl: editOriginalUrl,
        expiryDate: editExpiryDate ? new Date(editExpiryDate).toISOString() : null
      });

      if (response.data.success) {
        toast.success('URL updated successfully');
        setEditModalOpen(false);
        fetchUrls();
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to update URL');
    } finally {
      setEditLoading(false);
    }
  };

  // Delete submit
  const handleDeleteSubmit = async () => {
    setDeleteLoading(true);
    try {
      const response = await api.delete(`/urls/${deletingUrlId}`);
      if (response.data.success) {
        toast.success('URL deleted successfully');
        setDeleteModalOpen(false);
        fetchUrls();
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete URL');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Parse CSV client-side
  const handleCSVUpload = async (e) => {
    e.preventDefault();
    if (!bulkFile) {
      toast.warning('Please select a CSV file first');
      return;
    }

    setBulkLoading(true);
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const text = event.target.result;
        const lines = text.split(/\r?\n/);
        
        if (lines.length < 2) {
          throw new Error('CSV must contain a header and at least one data row.');
        }

        // Clean headers: remove quotes and spaces
        const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
        
        const urlIdx = headers.indexOf('originalUrl');
        const aliasIdx = headers.indexOf('customAlias');
        const expiryIdx = headers.indexOf('expiryDate');

        if (urlIdx === -1) {
          throw new Error('CSV must contain an "originalUrl" header column.');
        }

        const parsedUrls = [];
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;

          const cols = line.split(',').map(c => c.trim().replace(/^["']|["']$/g, ''));
          parsedUrls.push({
            originalUrl: cols[urlIdx] || '',
            customAlias: aliasIdx !== -1 ? cols[aliasIdx] : '',
            expiryDate: expiryIdx !== -1 ? cols[expiryIdx] : '',
          });
        }

        if (parsedUrls.length === 0) {
          throw new Error('No valid URL rows found in the CSV.');
        }

        // Submit to API
        const response = await api.post('/urls/bulk', { urls: parsedUrls });
        if (response.data.success) {
          toast.success('Bulk shortening finished!');
          setBulkResults(response.data);
          fetchUrls();
        }
      } catch (err) {
        console.error(err);
        toast.error(err.message || 'Error parsing CSV upload');
      } finally {
        setBulkLoading(false);
      }
    };

    reader.readAsText(bulkFile);
  };

  // Download Bulk Results
  const downloadBulkResults = () => {
    if (!bulkResults || !bulkResults.results) return;
    
    let csv = 'originalUrl,shortUrl,status,error\n';
    bulkResults.results.forEach((row) => {
      const orig = `"${row.originalUrl.replace(/"/g, '""')}"`;
      const short = row.shortUrl ? `"${row.shortUrl}"` : '""';
      const status = `"${row.status}"`;
      const err = row.error ? `"${row.error.replace(/"/g, '""')}"` : '""';
      csv += `${orig},${short},${status},${err}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'bulk_shortened_results.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Bulk results download started');
  };

  const getBaseRedirectUrl = () => {
    return process.env.NODE_ENV === 'production' 
      ? 'https://linkpulse.vercel.app' 
      : 'http://localhost:5000';
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Dashboard
          </h1>
          <p className="text-dark-400 text-sm mt-1">
            Manage your links, generate QR codes, and examine visit details.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={() => {
              setBulkFile(null);
              setBulkResults(null);
              setBulkModalOpen(true);
            }}
            className="gap-2"
          >
            <Upload className="w-4 h-4 text-brand-cyan" />
            Bulk CSV Shorten
          </Button>
          <Button
            variant="outline"
            onClick={fetchUrls}
            size="icon"
            className="hover:rotate-180 transition-transform duration-300"
          >
            <RefreshCw className="w-4 h-4 text-dark-400" />
          </Button>
        </div>
      </div>

      {/* Metrics Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-dark-900/40 border border-dark-700/60 p-4 flex items-center gap-4 relative overflow-hidden group">
          <div className="w-10 h-10 rounded-xl bg-brand-indigo/15 border border-brand-indigo/20 flex items-center justify-center text-brand-indigo">
            <Link2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-dark-400 uppercase tracking-wider block leading-none">Total Links</span>
            <span className="text-2xl font-bold text-white block mt-1">{stats.totalLinks}</span>
          </div>
        </Card>

        <Card className="bg-dark-900/40 border border-dark-700/60 p-4 flex items-center gap-4 relative overflow-hidden group">
          <div className="w-10 h-10 rounded-xl bg-brand-cyan/15 border border-brand-cyan/20 flex items-center justify-center text-brand-cyan">
            <MousePointerClick className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-dark-400 uppercase tracking-wider block leading-none">Total Clicks</span>
            <span className="text-2xl font-bold text-white block mt-1">{stats.totalClicks}</span>
          </div>
        </Card>

        <Card className="bg-dark-900/40 border border-dark-700/60 p-4 flex items-center gap-4 relative overflow-hidden group">
          <div className="w-10 h-10 rounded-xl bg-brand-success/15 border border-brand-success/20 flex items-center justify-center text-brand-success">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-dark-400 uppercase tracking-wider block leading-none">Active Links</span>
            <span className="text-2xl font-bold text-white block mt-1">{stats.activeLinks}</span>
          </div>
        </Card>

        <Card className="bg-dark-900/40 border border-dark-700/60 p-4 flex items-center gap-4 relative overflow-hidden group">
          <div className="w-10 h-10 rounded-xl bg-brand-danger/15 border border-brand-danger/20 flex items-center justify-center text-brand-danger">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-dark-400 uppercase tracking-wider block leading-none">Expired Links</span>
            <span className="text-2xl font-bold text-white block mt-1">{stats.expiredLinks}</span>
          </div>
        </Card>
      </div>

      {/* Main Form Box */}
      <Card className="bg-dark-900/40 border border-dark-700/60">
        <CardContent className="p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-brand-indigo" />
            Create Short URL
          </h3>
          <form onSubmit={handleShorten} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            <div className="md:col-span-5">
              <Input
                label="Destination URL"
                placeholder="https://example.com/very-long-target-link"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
              />
            </div>
            <div className="md:col-span-3">
              <Input
                label="Custom Alias (Optional)"
                placeholder="promo-alias"
                value={customAlias}
                onChange={(e) => setCustomAlias(e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <Input
                type="date"
                label="Expiry Date (Optional)"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <Button
                type="submit"
                variant="primary"
                isLoading={shortenLoading}
                className="w-full h-[42px] shadow-neon-indigo"
              >
                Shorten Link
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* URL Listings section */}
      <Card className="bg-dark-900/40 border border-dark-700/60 overflow-hidden">
        <CardContent className="p-6">
          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row items-center gap-4 justify-between mb-6">
            {/* Search */}
            <div className="relative w-full md:max-w-xs">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-600 pointer-events-none">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Search links..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-dark-950/80 border border-dark-700/80 rounded-xl pl-10 pr-4 py-2 text-sm text-dark-100 placeholder:text-dark-600 focus:outline-none focus:border-brand-indigo/60 transition-colors"
              />
            </div>

            {/* Filters & Sorters */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
                className="bg-dark-950/80 border border-dark-700/80 rounded-xl px-3 py-2 text-xs font-semibold text-dark-300 focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active Only</option>
                <option value="expired">Expired Only</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setPage(1);
                }}
                className="bg-dark-950/80 border border-dark-700/80 rounded-xl px-3 py-2 text-xs font-semibold text-dark-300 focus:outline-none"
              >
                <option value="createdAt">Date Created</option>
                <option value="totalClicks">Clicks Count</option>
                <option value="expiryDate">Expiry Date</option>
              </select>

              <select
                value={sortOrder}
                onChange={(e) => {
                  setSortOrder(e.target.value);
                  setPage(1);
                }}
                className="bg-dark-950/80 border border-dark-700/80 rounded-xl px-3 py-2 text-xs font-semibold text-dark-300 focus:outline-none"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>

          {/* Links Table */}
          {loading ? (
            <div className="flex flex-col items-center py-20 gap-3">
              <div className="w-8 h-8 border-2 border-brand-indigo border-t-transparent rounded-full animate-spin"></div>
              <p className="text-dark-400 text-xs tracking-wider">RETRIEVING SHORT LINKS...</p>
            </div>
          ) : urls.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-dark-700/40 rounded-xl bg-dark-900/10">
              <Link2 className="w-12 h-12 text-dark-600 mx-auto mb-4" />
              <h4 className="text-white font-bold text-base">No shortened links found</h4>
              <p className="text-dark-400 text-xs mt-1">Shorten your first destination link or upload a CSV file above.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Destination Link</TableHead>
                    <TableHead>Short URL</TableHead>
                    <TableHead>Date Created</TableHead>
                    <TableHead className="text-center">Clicks</TableHead>
                    <TableHead>Expiry</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {urls.map((url) => {
                    const fullShortUrl = `${getBaseRedirectUrl()}/${url.shortCode}`;
                    const isExpired = url.expiryDate && new Date(url.expiryDate) < new Date();

                    return (
                      <TableRow key={url._id}>
                        {/* Destination URL */}
                        <TableCell className="max-w-xs font-medium">
                          <div className="truncate text-dark-100 hover:text-brand-indigo transition-colors">
                            <a href={url.originalUrl} target="_blank" rel="noopener noreferrer">
                              {url.originalUrl}
                            </a>
                          </div>
                        </TableCell>

                        {/* Short URL */}
                        <TableCell>
                          <div className="flex items-center gap-2 text-brand-cyan font-semibold">
                            <span className="truncate">{fullShortUrl}</span>
                            <button
                              onClick={() => copyToClipboard(fullShortUrl)}
                              className="text-dark-400 hover:text-brand-cyan transition-colors"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </TableCell>

                        {/* Created Date */}
                        <TableCell className="text-xs text-dark-400 font-semibold">
                          {new Date(url.createdAt).toLocaleDateString()}
                        </TableCell>

                        {/* Clicks */}
                        <TableCell className="text-center font-bold text-white">
                          {url.totalClicks}
                        </TableCell>

                        {/* Expiry */}
                        <TableCell className="text-xs text-dark-400 font-medium">
                          {url.expiryDate 
                            ? new Date(url.expiryDate).toLocaleDateString()
                            : 'No Expiry'
                          }
                        </TableCell>

                        {/* Status badge */}
                        <TableCell>
                          {isExpired ? (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-danger/10 text-brand-danger border border-brand-danger/20">
                              Expired
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-success/10 text-brand-success border border-brand-success/20">
                              Active
                            </span>
                          )}
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => navigate(`/analytics/${url._id}`)}
                              className="h-8 w-8 hover:text-brand-indigo"
                              title="View Analytics"
                            >
                              <BarChart3 className="w-4 h-4" />
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setQrCodeData({
                                  code: url.shortCode,
                                  original: url.originalUrl,
                                  short: fullShortUrl,
                                  image: url.qrCode
                                });
                                setQrModalOpen(true);
                              }}
                              className="h-8 w-8 hover:text-brand-cyan"
                              title="Download QR"
                            >
                              <QrCode className="w-4 h-4" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setEditingUrl(url);
                                setEditOriginalUrl(url.originalUrl);
                                setEditExpiryDate(
                                  url.expiryDate 
                                    ? new Date(url.expiryDate).toISOString().split('T')[0]
                                    : ''
                                );
                                setEditModalOpen(true);
                              }}
                              className="h-8 w-8 hover:text-white"
                              title="Edit URL"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setDeletingUrlId(url._id);
                                setDeleteModalOpen(true);
                              }}
                              className="h-8 w-8 hover:text-brand-danger"
                              title="Delete URL"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t border-dark-700/40">
                  <span className="text-xs text-dark-400 font-semibold uppercase tracking-wider">
                    Page {page} of {totalPages}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                      disabled={page === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Prev
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={page === totalPages}
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit URL Modal */}
      <Dialog
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Link Settings"
        description="Update your destination redirect path and expiry schedule."
      >
        <form onSubmit={handleEditSubmit} className="space-y-4 pt-2">
          <Input
            label="Original URL"
            value={editOriginalUrl}
            onChange={(e) => setEditOriginalUrl(e.target.value)}
          />
          <Input
            type="date"
            label="Expiry Date"
            value={editExpiryDate}
            onChange={(e) => setEditExpiryDate(e.target.value)}
          />
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={editLoading}>
              Save Updates
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Deletion"
        description="This action cannot be undone. All visitor analytics records for this link will be wiped permanently."
      >
        <div className="pt-2 flex flex-col gap-4">
          <div className="flex items-center gap-3 p-3 bg-brand-danger/10 border border-brand-danger/20 rounded-xl text-brand-danger">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <p className="text-xs font-semibold">
              Warning: Wiping this link will cascade delete all its visit data.
            </p>
          </div>
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Keep Link
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteSubmit}
              isLoading={deleteLoading}
            >
              Wipe Link
            </Button>
          </div>
        </div>
      </Dialog>

      {/* QR Code Preview & Download Modal */}
      <Dialog
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        title={`QR Code for ${qrCodeData.code}`}
        description="Scan this QR code with any mobile device to trigger the redirection sequence."
      >
        <div className="flex flex-col items-center gap-6 py-4">
          <div className="p-4 bg-white rounded-2xl shadow-inner border border-dark-700/20 max-w-[240px] w-full">
            {qrCodeData.image && (
              <img
                src={qrCodeData.image}
                alt={`QR code for ${qrCodeData.code}`}
                className="w-full h-auto aspect-square object-contain"
              />
            )}
          </div>
          <div className="w-full text-center space-y-1">
            <p className="text-xs font-semibold text-dark-400 truncate uppercase tracking-widest leading-none">
              Redirect Destination
            </p>
            <p className="text-sm font-bold text-white truncate max-w-sm mx-auto">
              {qrCodeData.original}
            </p>
          </div>
          <Button
            variant="cyan"
            className="w-full gap-2 shadow-neon-cyan"
            onClick={() => downloadQR(qrCodeData.image, qrCodeData.code)}
          >
            <Download className="w-4 h-4 font-bold" />
            Download QR Code (PNG)
          </Button>
        </div>
      </Dialog>

      {/* Bulk Upload Modal */}
      <Dialog
        isOpen={bulkModalOpen}
        onClose={() => setBulkModalOpen(false)}
        title="Bulk Shortening via CSV"
        description="Upload a CSV spreadsheet matching column structures to generate multiple short URLs."
      >
        <form onSubmit={handleCSVUpload} className="space-y-4 pt-2">
          {/* Instructions Box */}
          <div className="p-4 bg-dark-900 border border-dark-700 rounded-xl space-y-2.5">
            <span className="text-xs font-bold text-brand-cyan tracking-wider uppercase flex items-center gap-1.5">
              <FileSpreadsheet className="w-4 h-4" />
              Required CSV Schema Format
            </span>
            <code className="block bg-dark-950 p-2.5 rounded-lg text-xs text-brand-indigo overflow-x-auto whitespace-nowrap">
              originalUrl,customAlias,expiryDate
            </code>
            <ul className="text-[11px] text-dark-400 space-y-1 list-disc pl-4">
              <li>Columns must match headers exactly (case-sensitive)</li>
              <li>`customAlias` and `expiryDate` are optional per row</li>
              <li>`expiryDate` must follow ISO date standards (YYYY-MM-DD)</li>
              <li>Rows containing invalid URL structures will be automatically skipped</li>
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-dark-400 uppercase tracking-wider">Select CSV File</span>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setBulkFile(e.target.files[0])}
              className="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-2.5 text-xs text-dark-400 focus:outline-none"
            />
          </div>

          {bulkResults && (
            <div className="mt-4 p-4 border border-dark-700 rounded-xl bg-dark-900 space-y-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">Shortening Report Summary</span>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 bg-dark-950 border border-dark-700 rounded-lg">
                  <span className="text-dark-400 font-semibold block uppercase text-[10px]">Total</span>
                  <span className="text-lg font-bold text-white block mt-0.5">{bulkResults.summary.total}</span>
                </div>
                <div className="p-2 bg-brand-success/10 border border-brand-success/20 rounded-lg">
                  <span className="text-brand-success font-semibold block uppercase text-[10px]">Success</span>
                  <span className="text-lg font-bold text-brand-success block mt-0.5">{bulkResults.summary.success}</span>
                </div>
                <div className="p-2 bg-brand-danger/10 border border-brand-danger/20 rounded-lg">
                  <span className="text-brand-danger font-semibold block uppercase text-[10px]">Failures</span>
                  <span className="text-lg font-bold text-brand-danger block mt-0.5">{bulkResults.summary.failure}</span>
                </div>
              </div>

              <div className="max-h-[140px] overflow-y-auto border border-dark-700 rounded-lg bg-dark-950 text-xs p-2 space-y-1">
                {bulkResults.results.map((row, idx) => (
                  <div key={idx} className="flex justify-between items-center gap-4 py-1 border-b border-dark-800 last:border-0">
                    <span className="truncate text-dark-300 font-medium max-w-[200px]">{row.originalUrl}</span>
                    {row.status === 'success' ? (
                      <span className="text-brand-success font-bold text-[10px] uppercase">Success: {row.shortCode}</span>
                    ) : (
                      <span className="text-brand-danger font-semibold text-[10px] truncate max-w-[140px]">{row.error}</span>
                    )}
                  </div>
                ))}
              </div>

              <Button
                variant="cyan"
                size="sm"
                className="w-full gap-1.5"
                onClick={downloadBulkResults}
              >
                <Download className="w-3.5 h-3.5 text-dark-950 font-bold" />
                Download Generated Results CSV
              </Button>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setBulkModalOpen(false)}>
              Close
            </Button>
            {!bulkResults && (
              <Button type="submit" variant="primary" isLoading={bulkLoading}>
                Generate URLs
              </Button>
            )}
          </div>
        </form>
      </Dialog>
    </div>
  );
};

export default Dashboard;
