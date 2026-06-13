import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import { Card } from '../components/ui/Card';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-dark-950 bg-mesh-grid text-dark-100 flex items-center justify-center p-6 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-brand-warning/5 blur-[100px] pointer-events-none" />

      <Card className="max-w-md w-full text-center border-brand-warning/20 p-8 relative z-10 shadow-2xl bg-dark-900/60 backdrop-blur-md">
        <div className="w-16 h-16 rounded-2xl bg-brand-warning/10 border border-brand-warning/20 flex items-center justify-center text-brand-warning mx-auto mb-6">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          Page Not Found
        </h1>
        <p className="text-dark-400 text-sm mt-3 leading-relaxed">
          The link you followed is invalid, has been deleted, or the address was entered incorrectly.
        </p>

        <div className="mt-8">
          <Link to="/">
            <Button variant="primary" className="w-full">
              Back to Home
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default NotFound;
