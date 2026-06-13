import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { 
  Link2, 
  BarChart3, 
  QrCode, 
  FileSpreadsheet, 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  CheckCircle2 
} from 'lucide-react';
import Button from '../components/ui/Button';
import { Card } from '../components/ui/Card';

const LandingPage = () => {
  const { user } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  const features = [
    {
      title: 'Lightning Redirections',
      description: 'Redirect users instantly via our global server architecture using ultra-fast caching redirects.',
      icon: Zap,
      color: 'text-brand-cyan bg-brand-cyan/10'
    },
    {
      title: 'Advanced Analytics',
      description: 'Track clicks, devices, popular browsers, country distributions, and daily trends permanently.',
      icon: BarChart3,
      color: 'text-brand-indigo bg-brand-indigo/10'
    },
    {
      title: 'QR Code Generation',
      description: 'Download high-quality QR codes instantly for every shortened link to print or publish.',
      icon: QrCode,
      color: 'text-brand-violet bg-brand-violet/10'
    },
    {
      title: 'Bulk URL Shortening',
      description: 'Upload CSV spreadsheet lists, process multiple targets, and download results in one click.',
      icon: FileSpreadsheet,
      color: 'text-brand-pink bg-brand-pink/10'
    },
    {
      title: 'Custom Aliases & Expiry',
      description: 'Secure custom domains, branded aliases, and specify precise expiry bounds for promotions.',
      icon: Link2,
      color: 'text-brand-warning bg-brand-warning/10'
    },
    {
      title: 'SaaS Grade Security',
      description: 'Safeguard your endpoints with JWT tokens, password hashing, and NoSQL injection security.',
      icon: ShieldCheck,
      color: 'text-brand-success bg-brand-success/10'
    }
  ];

  const steps = [
    { number: '01', title: 'Paste Destination Link', desc: 'Paste your long destination web address in the shortening dashboard input.' },
    { number: '02', title: 'Generate Custom Alias', desc: 'Select an optional custom alias (e.g. /black-friday) and set an expiry date if needed.' },
    { number: '03', title: 'Track Usage Growth', desc: 'Distribute your link and observe real-time visitor geographic, agent, and OS analytics.' }
  ];

  return (
    <div className="min-h-screen bg-dark-950 text-dark-100 overflow-x-hidden">
      {/* Top Navbar */}
      <header className="border-b border-dark-700/50 bg-dark-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-brand-indigo to-brand-cyan flex items-center justify-center text-white font-bold">
              <Link2 className="w-5 h-5 rotate-45" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">
              Link<span className="text-brand-cyan font-semibold">Pulse</span>
            </span>
          </Link>

          <nav className="flex items-center gap-4">
            {user ? (
              <Link to="/dashboard">
                <Button variant="primary" size="sm" className="shadow-neon-indigo">
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-sm text-dark-400 hover:text-white transition-colors px-2">
                  Login
                </Link>
                <Link to="/signup">
                  <Button variant="primary" size="sm" className="shadow-neon-indigo">
                    Sign Up Free
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-6 md:pt-32 md:pb-36 bg-mesh-grid">
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-brand-indigo/10 blur-[120px] animate-glow pointer-events-none z-0" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] rounded-full bg-brand-cyan/5 blur-[100px] pointer-events-none z-0" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-indigo/10 border border-brand-indigo/20 text-brand-indigo text-xs font-semibold uppercase tracking-wider mb-6"
          >
            <Zap className="w-3.5 h-3.5 text-brand-cyan fill-brand-cyan/20 animate-bounce" />
            Empowering Modern Marketing Teams
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1]"
          >
            Shorten. Track.{' '}
            <span className="bg-gradient-to-r from-brand-indigo via-brand-violet to-brand-cyan bg-clip-text text-transparent">
              Analyze.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-dark-400 mt-6 max-w-2xl mx-auto font-medium"
          >
            LinkPulse is the complete enterprise-ready URL management tool. Optimize your connections, download instant QR codes, and examine real-time click timelines.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link to={user ? '/dashboard' : '/signup'}>
              <Button variant="cyan" size="lg" className="w-52 shadow-neon-cyan hover:scale-105 transition-transform duration-200">
                Get Started Free
                <ArrowRight className="w-4 h-4 text-dark-950 font-bold" />
              </Button>
            </Link>
            <Link to="#features">
              <Button variant="outline" size="lg" className="w-52">
                Explore Features
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6 border-t border-dark-700/30 bg-dark-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Packed with Growth Features
            </h2>
            <p className="text-dark-400 mt-3 max-w-lg mx-auto text-sm">
              LinkPulse goes beyond standard redirection. Get access to detailed analytics logs and utility generators.
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feat, index) => {
              const Icon = feat.icon;
              return (
                <motion.div key={index} variants={itemVariants}>
                  <Card className="h-full border border-dark-700/60 bg-dark-900/40 hover:border-brand-indigo/30 transition-all duration-300 hover:shadow-lg group">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-200 ${feat.color}`}>
                      <Icon className="w-6 h-6 text-inherit" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{feat.title}</h3>
                    <p className="text-dark-400 text-sm leading-relaxed">{feat.description}</p>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 border-t border-dark-700/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">How LinkPulse Works</h2>
            <p className="text-dark-400 mt-2 text-sm">Scale your shortening in three simple steps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {steps.map((step, idx) => (
              <div key={idx} className="relative flex flex-col items-center text-center p-6 bg-dark-900/20 border border-dark-700/30 rounded-2xl">
                <span className="text-6xl font-extrabold text-brand-indigo/20 leading-none select-none mb-4">
                  {step.number}
                </span>
                <h4 className="text-lg font-bold text-white mb-2">{step.title}</h4>
                <p className="text-dark-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 border-t border-dark-700/30 bg-dark-900/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Validated by Developers</h2>
            <p className="text-dark-400 mt-2 text-sm">See how users scale their analytics details.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-dark-900/40 border border-dark-700/60 p-6 flex flex-col justify-between">
              <p className="text-dark-100 text-sm italic leading-relaxed">
                "LinkPulse completely replaced our expensive Bitly subscription. The bulk CSV tool processed over 500 links instantly and without lag, and the Recharts maps are incredibly clean!"
              </p>
              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-dark-700/30">
                <div className="w-8 h-8 rounded-full bg-brand-cyan/20 text-brand-cyan font-bold flex items-center justify-center text-xs">SM</div>
                <div>
                  <h5 className="text-xs font-bold text-white">Sarah Mercer</h5>
                  <span className="text-[10px] text-dark-400 font-semibold uppercase tracking-wider">VP of Marketing</span>
                </div>
              </div>
            </Card>

            <Card className="bg-dark-900/40 border border-dark-700/60 p-6 flex flex-col justify-between">
              <p className="text-dark-100 text-sm italic leading-relaxed">
                "Having public stats pages (/stats/:code) is amazing. We share statistics charts with our sponsors directly without giving them backend credentials. Excellent SaaS platform design."
              </p>
              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-dark-700/30">
                <div className="w-8 h-8 rounded-full bg-brand-indigo/20 text-brand-indigo font-bold flex items-center justify-center text-xs">JD</div>
                <div>
                  <h5 className="text-xs font-bold text-white">James Dolan</h5>
                  <span className="text-[10px] text-dark-400 font-semibold uppercase tracking-wider">Senior Frontend Engineer</span>
                </div>
              </div>
            </Card>

            <Card className="bg-dark-900/40 border border-dark-700/60 p-6 flex flex-col justify-between">
              <p className="text-dark-100 text-sm italic leading-relaxed">
                "The background redirections are blazing fast because visit analytics are written asynchronously. That is clean coding right there. The QR Code downloader is an awesome touch!"
              </p>
              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-dark-700/30">
                <div className="w-8 h-8 rounded-full bg-brand-violet/20 text-brand-violet font-bold flex items-center justify-center text-xs">RK</div>
                <div>
                  <h5 className="text-xs font-bold text-white">Rajiv Kumar</h5>
                  <span className="text-[10px] text-dark-400 font-semibold uppercase tracking-wider">Growth Lead</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="py-20 px-6 border-t border-dark-700/30 bg-gradient-to-b from-dark-950 to-dark-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-6">
            Get Pulse-Quickening Link Metrics
          </h2>
          <p className="text-dark-400 text-base max-w-lg mx-auto mb-8 font-medium">
            Shorten, configure expiry limits, print QR codes, and examine details from a single, dark-themed SaaS control board.
          </p>
          <Link to={user ? '/dashboard' : '/signup'}>
            <Button variant="primary" size="lg" className="w-56 shadow-neon-indigo">
              Start Shortening Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer copyright */}
      <footer className="border-t border-dark-700/40 bg-dark-950 py-8 text-center text-xs text-dark-600">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} LinkPulse. All rights reserved.</p>
          <p className="font-semibold text-brand-indigo/70">
            This project is a part of a hackathon run by <a href="https://katomaran.com" target="_blank" rel="noopener noreferrer" className="hover:text-brand-cyan transition-colors underline">https://katomaran.com</a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
