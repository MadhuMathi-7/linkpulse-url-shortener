import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
import { Card } from '../components/ui/Card';

const ExpiredPage = () => {
  return (
    <div className="min-h-screen bg-dark-950 bg-mesh-grid text-dark-100 flex items-center justify-center p-6 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-brand-danger/5 blur-[100px] pointer-events-none" />

      <Card className="max-w-md w-full text-center border-brand-danger/25 p-8 relative z-10 shadow-2xl bg-dark-900/60 backdrop-blur-md">
        <div className="w-16 h-16 rounded-2xl bg-brand-danger/10 border border-brand-danger/20 flex items-center justify-center text-brand-danger mx-auto mb-6 shadow-lg shadow-brand-danger/5">
          <Clock className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          Short Link Expired
        </h1>
        <p className="text-dark-400 text-sm mt-3 leading-relaxed">
          The short URL you are trying to visit has reached its designated lifespan or click quota limit and has expired.
        </p>

        <div className="mt-8 space-y-3">
          <Link to="/">
            <Button variant="cyan" className="w-full gap-2 shadow-neon-cyan">
              Return to Homepage
              <ArrowRight className="w-4 h-4 text-dark-950 font-bold" />
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default ExpiredPage;
